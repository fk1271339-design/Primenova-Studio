package com.primenova.studio.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * OAuth2 login failure handler. Without this, Spring's default behavior on a
 * failed OAuth login (e.g. Google's "401 invalid_client") is a bare error page
 * with almost no debugging information. This handler logs a readable ERROR
 * server-side and redirects the browser back to the frontend login page with a
 * generic error flag (no provider internals are leaked to the client).
 */
@Component
public class OAuth2FailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2FailureHandler.class);

    @Value("${app.frontendUrl}")
    private String frontendUrl;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {
        log.error("OAuth2 login failed for path={} error={}", request.getRequestURI(), exception.getMessage());

        String baseUrl = resolveBaseUrl(request);
        String targetUrl = UriComponentsBuilder.fromUriString(baseUrl + "/login")
                .queryParam("error", "oauth_failed")
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private String resolveBaseUrl(HttpServletRequest request) {
        String referer = request.getHeader("Referer");
        if (referer != null && (referer.contains("localhost:5173") || referer.contains("127.0.0.1:5173"))) {
            return "http://localhost:5173";
        }
        String origin = request.getHeader("Origin");
        if (origin != null && (origin.contains("localhost:5173") || origin.contains("127.0.0.1:5173"))) {
            return "http://localhost:5173";
        }
        return (frontendUrl != null && !frontendUrl.isBlank()) ? frontendUrl : "http://localhost:8080";
    }
}
