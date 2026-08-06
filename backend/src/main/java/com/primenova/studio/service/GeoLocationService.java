package com.primenova.studio.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Best-effort IP → country resolution using a free, keyless geolocation API
 * (ipwho.is by default — 10k requests/month, no token). Never blocks or fails
 * the caller: any error, timeout, private IP, or disabled config resolves to
 * {@code null}, which callers treat as "unknown". Results are cached per IP
 * for the lifetime of the JVM to stay well inside the free quota.
 *
 * <p>The endpoint is configurable ({@code app.geoApiUrl}) so it can be swapped
 * for ip-api.com or a paid provider without touching callers.</p>
 */
@Service
public class GeoLocationService {

    private static final Logger log = LoggerFactory.getLogger(GeoLocationService.class);

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(2))
            .build();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, String> cache = new ConcurrentHashMap<>();

    @Value("${app.geoApiUrl:https://ipwho.is/}")
    private String geoApiUrl;

    @Value("${app.geoLookupEnabled:true}")
    private boolean lookupEnabled;

    /**
     * Resolves the country name (e.g. "India") for a client IP.
     *
     * @param ip the raw client IP (may be null)
     * @return country name, or {@code null} when unknown / private / disabled
     */
    public String resolveCountry(String ip) {
        if (!lookupEnabled) return null;
        if (ip == null || ip.isBlank()) return null;
        if (isPrivateOrLocal(ip)) return null;
        return cache.computeIfAbsent(ip, this::lookupCountry);
    }

    private String lookupCountry(String ip) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(geoApiUrl + ip))
                    .timeout(Duration.ofSeconds(3))
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JsonNode node = objectMapper.readTree(response.body());
                String country = node.path("country").asText(null);
                if (country != null && !country.isBlank()) {
                    log.debug("Geo lookup OK: {} -> {}", ip, country);
                    return country;
                }
            }
        } catch (Exception e) {
            log.debug("Geo lookup failed for IP {}: {}", ip, e.getMessage());
        }
        return null;
    }

    /** Loopback, private, link-local and multicast ranges — never resolvable anyway. */
    private boolean isPrivateOrLocal(String ip) {
        return "localhost".equalsIgnoreCase(ip)
                || ip.startsWith("127.")
                || ip.startsWith("10.")
                || ip.startsWith("192.168.")
                || ip.startsWith("169.254.")
                || ip.startsWith("0.")
                || ip.startsWith("::")
                || ip.matches("^172\\.(1[6-9]|2\\d|3[01])\\..*");
    }
}
