package com.primenova.studio.util;

/**
 * Sanitizes user-supplied strings before they are stored in MongoDB or
 * interpolated into email templates. Prevents HTML injection / stored XSS
 * while preserving legitimate newlines, tabs, and carriage returns.
 */
public final class InputSanitizer {

    private InputSanitizer() {}

    /**
     * Strips HTML tags, control characters, and surrounding whitespace.
     * Returns {@code null} if the input is null, blank, or becomes empty
     * after sanitization.
     */
    public static String sanitize(String input) {
        if (input == null) return null;
        // Remove anything that looks like an HTML/script tag
        String cleaned = input.replaceAll("(?s)<[^>]*>", " ");
        // Remove control characters but keep \n, \r, \t
        cleaned = cleaned.replaceAll("[\\p{Cntrl}&&[^\\n\\r\\t]]", "");
        cleaned = cleaned.trim();
        return cleaned.isEmpty() ? null : cleaned;
    }
}
