package com.primenova.studio.util;

/**
 * Simple User-Agent string parser for extracting browser, OS, and device info.
 * Handles common user agent patterns without external dependencies.
 */
public class UserAgentParser {

    public static String parseBrowser(String userAgent) {
        if (userAgent == null) return "Unknown";
        String ua = userAgent.toLowerCase();
        
        if (ua.contains("edg/") || ua.contains("edge/")) return "Microsoft Edge";
        if (ua.contains("opr/") || ua.contains("opera")) return "Opera";
        if (ua.contains("chrome") && !ua.contains("chromium")) return "Google Chrome";
        if (ua.contains("firefox")) return "Mozilla Firefox";
        if (ua.contains("safari") && !ua.contains("chrome")) return "Safari";
        if (ua.contains("msie") || ua.contains("trident")) return "Internet Explorer";
        return "Unknown Browser";
    }

    public static String parseOS(String userAgent) {
        if (userAgent == null) return "Unknown";
        String ua = userAgent.toLowerCase();
        
        if (ua.contains("windows nt 10")) return "Windows 10/11";
        if (ua.contains("windows nt 6.3")) return "Windows 8.1";
        if (ua.contains("windows nt 6.1")) return "Windows 7";
        if (ua.contains("windows")) return "Windows";
        if (ua.contains("mac os x")) return "macOS";
        if (ua.contains("android")) return "Android";
        if (ua.contains("iphone") || ua.contains("ipad")) return "iOS";
        if (ua.contains("linux")) return "Linux";
        if (ua.contains("cros")) return "Chrome OS";
        return "Unknown OS";
    }

    public static String parseDevice(String userAgent) {
        if (userAgent == null) return "Unknown";
        String ua = userAgent.toLowerCase();
        
        if (ua.contains("iphone")) return "iPhone";
        if (ua.contains("ipad")) return "iPad";
        if (ua.contains("android") && ua.contains("mobile")) return "Android Phone";
        if (ua.contains("android") && !ua.contains("mobile")) return "Android Tablet";
        if (ua.contains("windows") || ua.contains("mac os x") || ua.contains("linux")) return "Desktop";
        return "Unknown Device";
    }
}
