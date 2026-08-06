package com.primenova.studio.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.stereotype.Component;

/**
 * Validates that every required secret/credential is actually configured
 * before the application serves traffic.
 *
 * <p>Policy:</p>
 * <ul>
 *   <li><b>JWT secret</b> — must be >= 32 chars and not the dev placeholder.
 *       ERROR in dev, fatal in prod.</li>
 *   <li><b>Google OAuth</b> — must not be the placeholder. The most common
 *       cause of Google's cryptic {@code 401 invalid_client} is placeholder or
 *       mismatched credentials, so this is surfaced loudly at startup.
 *       ERROR in dev, fatal in prod.</li>
 *   <li><b>GitHub OAuth</b> — treated the same. Until real credentials exist
 *       GitHub login is effectively disabled (the app refuses to start in prod
 *       with placeholder credentials instead of failing at GitHub's side).</li>
 *   <li><b>SMTP</b> — best-effort email; missing credentials only produce a
 *       WARN (the app must keep running even when email is broken).</li>
 * </ul>
 *
 * <p>Never logs actual secret values.</p>
 */
@Component
public class ConfigStartupValidator {

    private static final Logger log = LoggerFactory.getLogger(ConfigStartupValidator.class);

    private static final String INSECURE_MARKER = "CHANGE_ME";

    private final Environment environment;

    @Value("${app.jwtSecret:}")
    private String jwtSecret;

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret:}")
    private String googleClientSecret;

    @Value("${spring.security.oauth2.client.registration.github.client-id:}")
    private String githubClientId;

    @Value("${spring.security.oauth2.client.registration.github.client-secret:}")
    private String githubClientSecret;

    @Value("${spring.mail.username:}")
    private String smtpUsername;

    @Value("${spring.mail.password:}")
    private String smtpPassword;

    @Value("${app.frontendUrl:}")
    private String frontendUrl;

    public ConfigStartupValidator(Environment environment) {
        this.environment = environment;
    }

    @PostConstruct
    public void validate() {
        boolean isProd = environment.acceptsProfiles(Profiles.of("prod", "production"));
        boolean fatal = false;

        if (!isStrongSecret(jwtSecret)) {
            log.error("JWT_SECRET is missing, shorter than 32 characters, or still the insecure "
                    + "'CHANGE_ME' placeholder. Set a strong random value in .env "
                    + "(e.g. `openssl rand -hex 64`). Without it, tokens are forgeable.");
            fatal = true;
        }

        if (isPlaceholder(googleClientId) || isPlaceholder(googleClientSecret)) {
            log.error("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are missing or placeholder. "
                    + "Google OAuth will fail with '401 invalid_client'. Create OAuth credentials at "
                    + "https://console.cloud.google.com/apis/credentials and register the exact "
                    + "Authorized redirect URI: {}/login/oauth2/code/google", frontendUrl);
            fatal = true;
        }

        if (isPlaceholder(githubClientId) || isPlaceholder(githubClientSecret)) {
            // Non-fatal by design: GitHub is a secondary provider. The app keeps
            // running (Google/credentials auth still work); GitHub login attempts
            // are rejected cleanly and logged by OAuth2FailureHandler. In prod,
            // either provide real GitHub credentials or remove the registration.
            log.error("GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET are missing or placeholder. "
                    + "GitHub OAuth is DISABLED until real credentials are provided. "
                    + "Create an OAuth App at https://github.com/settings/developers "
                    + "(callback URL: {}/login/oauth2/code/github).", frontendUrl);
        }

        if (isPlaceholder(smtpUsername) || isPlaceholder(smtpPassword)) {
            log.warn("SMTP_USERNAME / SMTP_PASSWORD are missing or placeholder. Transactional emails "
                    + "(verification, password reset, contact notifications) will fail to send. "
                    + "Configure a Gmail app password at https://myaccount.google.com/apppasswords");
        }

        if (fatal && isProd) {
            throw new IllegalStateException(
                    "Startup aborted: required secrets are missing or are insecure placeholders. "
                    + "See the ERROR logs above — configure .env and restart.");
        }

        if (fatal) {
            log.error("Startup continued, but the security issues above MUST be fixed before deployment.");
        } else {
            log.info("Configuration validated. Frontend URL: {}", frontendUrl);
        }
    }

    private boolean isPlaceholder(String value) {
        return value == null || value.isBlank() || value.contains("placeholder") || value.contains(INSECURE_MARKER);
    }

    private boolean isStrongSecret(String value) {
        return value != null && value.length() >= 32 && !value.contains(INSECURE_MARKER) && !value.contains("change-me");
    }
}
