package com.primenova.studio.service;

import com.primenova.studio.dto.*;
import com.primenova.studio.exception.CustomException;
import com.primenova.studio.model.User;
import com.primenova.studio.model.UserSession;
import com.primenova.studio.repository.UserRepository;
import com.primenova.studio.repository.UserSessionRepository;
import com.primenova.studio.security.JwtTokenProvider;
import com.primenova.studio.util.IpUtils;
import com.primenova.studio.util.UserAgentParser;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final UserSessionRepository userSessionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;
    private final GeoLocationService geoLocationService;

    @Value("${app.verificationTokenExpiryHours:24}")
    private long verificationTokenExpiryHours;

    @Value("${app.emailResendCooldownSeconds:60}")
    private long emailResendCooldownSeconds;

    public AuthService(UserRepository userRepository,
                       UserSessionRepository userSessionRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       EmailService emailService,
                       GeoLocationService geoLocationService) {
        this.userRepository = userRepository;
        this.userSessionRepository = userSessionRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.emailService = emailService;
        this.geoLocationService = geoLocationService;
    }

    public AuthResponse signup(SignupRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim() : null;
        if (userRepository.existsByEmail(email)) {
            throw new CustomException("Email is already registered. Please login.", HttpStatus.CONFLICT);
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(
            request.getFullName().trim(),
            email,
            "CREDENTIALS",
            hashedPassword,
            "USER"
        );
        if (request.getPhone() != null) user.setPhone(request.getPhone());

        // Generate email verification token with an explicit expiry
        LocalDateTime now = LocalDateTime.now();
        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiresAt(now.plusHours(verificationTokenExpiryHours));
        user.setVerificationEmailSentAt(now);
        user.setVerified(false);
        user.setLastLogin(now);

        userRepository.save(user);

        // Email is best-effort and async — a slow/unconfigured SMTP server must
        // never block (or fail) the signup response.
        sendVerificationEmailAsync(email, user.getFullName(), verificationToken);
        log.info("User signed up email={} id={}", email, user.getId());

        // Return AuthResponse with empty tokens since user must verify email first
        return new AuthResponse(null, null, UserResponse.fromUser(user));
    }

    public AuthResponse login(LoginRequest request, HttpServletRequest servletRequest) {
        String email = request.getEmail() != null ? request.getEmail().trim() : null;
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if ("BLOCKED".equals(user.getStatus())) {
            throw new CustomException("Your account has been suspended. Contact support.", HttpStatus.FORBIDDEN);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new CustomException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        // Email Verification Check
        if (!user.isVerified()) {
            handleUnverifiedLogin(user);
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Audit session with parsed User-Agent details + real IP geolocation
        String ua = servletRequest.getHeader("User-Agent");
        String clientIp = IpUtils.extractClientIp(servletRequest);
        UserSession session = new UserSession(user.getId(), user.getEmail(), "MANUAL", clientIp, ua);
        session.setBrowser(UserAgentParser.parseBrowser(ua));
        session.setOperatingSystem(UserAgentParser.parseOS(ua));
        session.setDevice(UserAgentParser.parseDevice(ua));
        session.setCountry(geoLocationService.resolveCountry(clientIp));
        userSessionRepository.save(session);
        log.info("User logged in email={} id={}", user.getEmail(), user.getId());

        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());

        return new AuthResponse(accessToken, refreshToken, UserResponse.fromUser(user));
    }

    /**
     * Unverified-user login path. Sends the verification email at most once per
     * cooldown window and only regenerates the token when it is missing or
     * expired — never spams, never leaks a 200 with tokens.
     */
    private void handleUnverifiedLogin(User user) {
        LocalDateTime now = LocalDateTime.now();

        boolean resendAllowed = user.getVerificationEmailSentAt() == null
                || !user.getVerificationEmailSentAt().plusSeconds(emailResendCooldownSeconds).isAfter(now);
        boolean tokenUsable = user.getVerificationToken() != null
                && (user.getVerificationTokenExpiresAt() == null
                    || user.getVerificationTokenExpiresAt().isAfter(now));

        if (!resendAllowed) {
            log.info("Verification email resend blocked by cooldown for email={}", user.getEmail());
            throw new CustomException(
                    "Please verify your email. A verification email was sent recently — check your inbox, or request a new link in about a minute.",
                    HttpStatus.UNAUTHORIZED);
        }

        if (!tokenUsable) {
            user.setVerificationToken(UUID.randomUUID().toString());
            user.setVerificationTokenExpiresAt(now.plusHours(verificationTokenExpiryHours));
            log.info("Generated new verification token for email={} (previous was missing/expired)", user.getEmail());
        }
        user.setVerificationEmailSentAt(now);
        userRepository.save(user);

        sendVerificationEmailAsync(user.getEmail(), user.getFullName(), user.getVerificationToken());
        throw new CustomException(
                "Please verify your email. A new verification link has been sent to your inbox.",
                HttpStatus.UNAUTHORIZED);
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        if (token == null || !tokenProvider.validateToken(token) || !tokenProvider.isRefreshToken(token)) {
            throw new CustomException("Invalid or expired refresh token", HttpStatus.UNAUTHORIZED);
        }

        String userId = tokenProvider.getUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));

        String newAccessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(newAccessToken, token, UserResponse.fromUser(user));
    }

    /**
     * Verifies a user's email address. Idempotent: a user who is already
     * verified (e.g. duplicate click on the same link, or double-tap before the
     * page reloads) gets a friendly success message instead of an error.
     * The token is intentionally kept on the record so repeated clicks can be
     * recognized; expiry is still enforced.
     */
    public Map<String, String> verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new CustomException("Invalid or expired verification token", HttpStatus.BAD_REQUEST));

        if (user.isVerified()) {
            log.info("Duplicate verification attempt for already-verified email={}", user.getEmail());
            return Map.of("message", "Email already verified. You can now log in.");
        }

        if (user.getVerificationTokenExpiresAt() != null
                && user.getVerificationTokenExpiresAt().isBefore(LocalDateTime.now())) {
            log.info("Verification token expired for email={}", user.getEmail());
            throw new CustomException(
                    "Verification link has expired. Please log in to request a new link.",
                    HttpStatus.BAD_REQUEST);
        }

        user.setVerified(true);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        log.info("Email verified for email={}", user.getEmail());
        return Map.of("message", "Email verified successfully! You can now log in.");
    }

    /**
     * Requests a password reset link. Always returns the same success response
     * whether or not the account exists (prevents account enumeration), applies
     * a resend cooldown, and only regenerates the token when required.
     */
    public void forgotPassword(String email) {
        String trimmed = email != null ? email.trim() : null;
        User user = userRepository.findByEmail(trimmed).orElse(null);
        if (user == null) {
            // Deliberately identical response — do not reveal whether the email exists.
            log.warn("Password reset requested for unknown email={}", trimmed);
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        if (user.getResetPasswordEmailSentAt() != null
                && user.getResetPasswordEmailSentAt().plusSeconds(emailResendCooldownSeconds).isAfter(now)) {
            log.info("Password reset resend blocked by cooldown for email={}", trimmed);
            return;
        }

        boolean tokenUsable = user.getResetPasswordToken() != null
                && user.getResetPasswordTokenExpiresAt() != null
                && user.getResetPasswordTokenExpiresAt().isAfter(now);
        if (!tokenUsable) {
            user.setResetPasswordToken(UUID.randomUUID().toString());
            user.setResetPasswordTokenExpiresAt(now.plusHours(1));
        }
        user.setResetPasswordEmailSentAt(now);
        userRepository.save(user);

        sendResetEmailAsync(trimmed, user.getFullName(), user.getResetPasswordToken());
        log.info("Password reset email sent for email={}", trimmed);
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new CustomException("Invalid or expired password reset link", HttpStatus.BAD_REQUEST));

        if (user.getResetPasswordTokenExpiresAt() == null
                || user.getResetPasswordTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new CustomException("Password reset link has expired", HttpStatus.BAD_REQUEST);
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiresAt(null);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        log.info("Password reset completed for email={}", user.getEmail());
    }

    // ─── Async email dispatch ──────────────────────────────────
    // Background pool threads carry a null/system thread-context classloader.
    // Inside the packaged fat jar, jakarta.mail loads its providers via
    // ServiceLoader — without the app classloader this fails on JDK 21 fat jars.

    private void sendVerificationEmailAsync(String email, String fullName, String token) {
        CompletableFuture.runAsync(() -> {
            Thread.currentThread().setContextClassLoader(EmailService.class.getClassLoader());
            emailService.sendVerificationEmail(email, fullName, token);
        });
    }

    private void sendResetEmailAsync(String email, String fullName, String token) {
        CompletableFuture.runAsync(() -> {
            Thread.currentThread().setContextClassLoader(EmailService.class.getClassLoader());
            emailService.sendResetPasswordEmail(email, fullName, token);
        });
    }
}
