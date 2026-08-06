package com.primenova.studio.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * Serves the built React frontend (copied into classpath:/static/) directly
 * from this Spring Boot server — no separate nginx/Vite server needed.
 *
 * <p>Known static assets (JS/CSS/images) are served as-is; any other route
 * (e.g. /login, /profile, /ai-assistant) falls back to index.html so that
 * client-side (React Router) navigation works even on deep links.
 *
 * <p>API and OAuth2 paths are excluded from the fallback: real /api/** mappings
 * are handled by @RestController first, and unknown API paths should return a
 * 404 (not index.html) so API clients never get HTML back by mistake.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        // API/OAuth paths ko SPA fallback se bahar rakho — unmatched
                        // API routes ko 404 dena chahiye, index.html nahi (Spring 6.1
                        // me registry.excludePathPatterns() nahi hai, isliye yahan guard).
                        String path = resourcePath.startsWith("/") ? resourcePath.substring(1) : resourcePath;
                        if (path.startsWith("api/") || path.startsWith("oauth2/") || path.startsWith("login/oauth2/")) {
                            return null;
                        }
                        // Real file milta hai toh wahi serve karo
                        Resource requestedResource = location.createRelative(resourcePath);
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        // Warna SPA fallback: index.html return karo
                        Resource indexHtml = new ClassPathResource("/static/index.html");
                        return indexHtml.exists() ? indexHtml : null;
                    }
                });
    }
}
