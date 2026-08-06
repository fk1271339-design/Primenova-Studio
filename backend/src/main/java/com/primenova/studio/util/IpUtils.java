package com.primenova.studio.util;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Resolves the real client IP address. When the app runs behind a reverse
 * proxy (nginx), the socket address is the proxy's — X-Forwarded-For /
 * X-Real-IP carry the true visitor IP.
 */
public final class IpUtils {

    private IpUtils() {}

    public static String extractClientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            // Leftmost entry is the original client
            return forwardedFor.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }
        return request.getRemoteAddr();
    }
}
