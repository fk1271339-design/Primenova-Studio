package com.primenova.studio.service;

import com.primenova.studio.dto.ProfileUpdateRequest;
import com.primenova.studio.dto.UserResponse;
import com.primenova.studio.exception.CustomException;
import com.primenova.studio.model.User;
import com.primenova.studio.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import com.primenova.studio.model.UserSession;
import com.primenova.studio.repository.UserSessionRepository;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserSessionRepository userSessionRepository;

    public UserService(UserRepository userRepository, UserSessionRepository userSessionRepository) {
        this.userRepository = userRepository;
        this.userSessionRepository = userSessionRepository;
    }

    public UserResponse getUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
        return UserResponse.fromUser(user);
    }

    public UserResponse updateProfile(String userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAvatar() != null) user.setAvatar(request.getAvatar());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getWebsite() != null) user.setWebsite(request.getWebsite());
        if (request.getCompany() != null) user.setCompany(request.getCompany());
        if (request.getLocation() != null) user.setLocation(request.getLocation());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        return UserResponse.fromUser(user);
    }

    public List<UserSession> getActiveSessions(String userId) {
        return userSessionRepository.findByUserId(userId).stream()
                .filter(UserSession::isActive)
                .sorted((s1, s2) -> s2.getLoginTime().compareTo(s1.getLoginTime()))
                .toList();
    }

    public void revokeSession(String userId, String sessionId) {
        UserSession session = userSessionRepository.findById(sessionId)
                .orElseThrow(() -> new CustomException("Session not found", HttpStatus.NOT_FOUND));
        if (!session.getUserId().equals(userId)) {
            throw new CustomException("Unauthorized to revoke this session", HttpStatus.FORBIDDEN);
        }
        session.setActive(false);
        userSessionRepository.save(session);
    }

    public void revokeOtherSessions(String userId, String userAgent, String ipAddress) {
        List<UserSession> activeSessions = userSessionRepository.findByUserId(userId);
        for (UserSession session : activeSessions) {
            // Check if this session is NOT the current session (matching IP/User-Agent or just keep the newest one active)
            boolean isCurrent = session.isActive() && 
                                ipAddress.equals(session.getIpAddress()) && 
                                userAgent.equals(session.getUserAgent());
            if (!isCurrent) {
                session.setActive(false);
                userSessionRepository.save(session);
            }
        }
    }

    public void deleteAccount(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
        userRepository.delete(user);
        // Also delete sessions
        List<UserSession> sessions = userSessionRepository.findByUserId(userId);
        userSessionRepository.deleteAll(sessions);
    }
}
