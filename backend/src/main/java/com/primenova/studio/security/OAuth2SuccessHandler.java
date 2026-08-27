package com.primenova.studio.security;

import com.primenova.studio.model.User;
import com.primenova.studio.model.UserSession;
import com.primenova.studio.repository.UserRepository;
import com.primenova.studio.repository.UserSessionRepository;
import com.primenova.studio.service.GeoLocationService;
import com.primenova.studio.util.IpUtils;
import com.primenova.studio.util.UserAgentParser;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2SuccessHandler.class);

    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final UserSessionRepository userSessionRepository;
    private final GeoLocationService geoLocationService;

    @Value("${app.frontendUrl}")
    private String frontendUrl;

    public OAuth2SuccessHandler(JwtTokenProvider tokenProvider,
                                UserRepository userRepository,
                                UserSessionRepository userSessionRepository,
                                GeoLocationService geoLocationService) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.userSessionRepository = userSessionRepository;
        this.geoLocationService = geoLocationService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // Registration id se provider pata chalta hai: "google" / "github"
        String registrationId = authentication instanceof OAuth2AuthenticationToken
                ? ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId()
                : "oauth";
        String provider = registrationId != null ? registrationId.toUpperCase() : "OAUTH";

        // ── Common attributes (Google) ──
        String rawEmail = oAuth2User.getAttribute("email");
        String rawName = oAuth2User.getAttribute("name");
        String rawPicture = oAuth2User.getAttribute("picture");

        // ── GitHub-specific fallbacks ──
        if (rawPicture == null) rawPicture = oAuth2User.getAttribute("avatar_url");
        if (rawName == null || rawName.isBlank()) rawName = oAuth2User.getAttribute("login");

        // GitHub email private hone par null aata hai — stable noreply address banao
        if (rawEmail == null || rawEmail.isBlank()) {
            Object idAttr = oAuth2User.getAttribute("id");
            String ghId = idAttr != null ? String.valueOf(idAttr) : "gh";
            String login = oAuth2User.getAttribute("login");
            rawEmail = ghId + "+" + (login != null ? login : "user") + "@users.noreply.github.com";
        }

        final String email = rawEmail;
        final String name = rawName;
        final String picture = rawPicture;
        final boolean[] isNewUser = {false};
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(name != null ? name : email);
            newUser.setAvatar(picture);
            newUser.setProvider(provider);
            newUser.setRole("USER");
            newUser.setStatus("ACTIVE");
            // OAuth provider already proved ownership of this email
            newUser.setVerified(true);
            newUser.setCreatedAt(LocalDateTime.now());
            isNewUser[0] = true;
            return newUser;
        });

        String baseUrl = resolveBaseUrl(request);

        // Suspended accounts must not gain access through OAuth either
        if ("BLOCKED".equals(user.getStatus())) {
            log.warn("Blocked user attempted OAuth login email={}", email);
            getRedirectStrategy().sendRedirect(request, response,
                    UriComponentsBuilder.fromUriString(baseUrl + "/login")
                            .queryParam("error", "account_blocked")
                            .build().toUriString());
            return;
        }

        user.setLastLogin(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        // Existing credentials-account logging in via OAuth: they proved the email
        // belongs to them, so verification is no longer required.
        user.setVerified(true);
        if (picture != null) user.setAvatar(picture);
        userRepository.save(user);
        log.info("OAuth login successful provider={} email={} newUser={}", provider, email, isNewUser[0]);

        // Audit session with parsed User-Agent details + real IP geolocation
        String ua = request.getHeader("User-Agent");
        String clientIp = IpUtils.extractClientIp(request);
        UserSession session = new UserSession(user.getId(), user.getEmail(), provider, clientIp, ua);
        session.setBrowser(UserAgentParser.parseBrowser(ua));
        session.setOperatingSystem(UserAgentParser.parseOS(ua));
        session.setDevice(UserAgentParser.parseDevice(ua));
        session.setCountry(geoLocationService.resolveCountry(clientIp));
        userSessionRepository.save(session);

        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());

        String targetUrl = UriComponentsBuilder.fromUriString(baseUrl + "/auth/google/callback")
                .queryParam("token", accessToken)
                .queryParam("refreshToken", refreshToken)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private String resolveBaseUrl(HttpServletRequest request) {
        // frontendUrl is configured via app.frontendUrl (env: FRONTEND_URL).
        // After the Google redirect chain, Referer/Origin headers come from
        // Google — not the frontend — so header-sniffing is unreliable.
        return (frontendUrl != null && !frontendUrl.isBlank()) ? frontendUrl : "http://localhost:5173";
    }
}
