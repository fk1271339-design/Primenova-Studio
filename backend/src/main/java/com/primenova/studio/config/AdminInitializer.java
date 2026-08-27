package com.primenova.studio.config;

import com.primenova.studio.model.User;
import com.primenova.studio.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AdminInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.adminEmail:admin@primenova.studio}")
    private String adminEmail;

    public AdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            boolean adminExists = userRepository.findAll().stream()
                    .anyMatch(u -> "ADMIN".equalsIgnoreCase(u.getRole()));

            if (!adminExists) {
                String targetEmail = (adminEmail != null && !adminEmail.isBlank()) ? adminEmail.trim() : "admin@primenova.studio";
                
                // If account exists with this email, upgrade it to ADMIN, otherwise create a new account
                User adminUser = userRepository.findByEmail(targetEmail).orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(targetEmail);
                    newUser.setFullName("PrimeNova Administrator");
                    newUser.setProvider("CREDENTIALS");
                    newUser.setPasswordHash(passwordEncoder.encode("Admin@123456"));
                    newUser.setCreatedAt(LocalDateTime.now());
                    return newUser;
                });

                adminUser.setRole("ADMIN");
                adminUser.setStatus("ACTIVE");
                adminUser.setVerified(true);
                adminUser.setUpdatedAt(LocalDateTime.now());

                userRepository.save(adminUser);
                log.info("✅ Admin account initialized/verified: email={} role=ADMIN", targetEmail);
            }
        } catch (Exception e) {
            log.warn("Could not check/initialize admin account on startup: {}", e.getMessage());
        }
    }
}
