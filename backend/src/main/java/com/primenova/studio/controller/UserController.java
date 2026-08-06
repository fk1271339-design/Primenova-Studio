package com.primenova.studio.controller;

import com.primenova.studio.dto.ProfileUpdateRequest;
import com.primenova.studio.dto.UserResponse;
import com.primenova.studio.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(Authentication authentication,
                                                     @RequestBody ProfileUpdateRequest request) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }

    @DeleteMapping("/account")
    public ResponseEntity<Map<String, String>> deleteAccount(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        userService.deleteAccount(userId);
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<com.primenova.studio.model.UserSession>> getSessions(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(userService.getActiveSessions(userId));
    }

    @PostMapping("/sessions/revoke/{sessionId}")
    public ResponseEntity<Map<String, String>> revokeSession(Authentication authentication, @PathVariable String sessionId) {
        String userId = (String) authentication.getPrincipal();
        userService.revokeSession(userId, sessionId);
        return ResponseEntity.ok(Map.of("message", "Session revoked successfully"));
    }

    @PostMapping("/sessions/revoke-others")
    public ResponseEntity<Map<String, String>> revokeOtherSessions(Authentication authentication, jakarta.servlet.http.HttpServletRequest request) {
        String userId = (String) authentication.getPrincipal();
        String userAgent = request.getHeader("User-Agent");
        String ipAddress = request.getRemoteAddr();
        userService.revokeOtherSessions(userId, userAgent, ipAddress);
        return ResponseEntity.ok(Map.of("message", "Other sessions revoked successfully"));
    }
}
