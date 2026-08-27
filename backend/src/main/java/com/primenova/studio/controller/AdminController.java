package com.primenova.studio.controller;

import com.primenova.studio.dto.UserResponse;
import com.primenova.studio.exception.CustomException;
import com.primenova.studio.model.Contact;
import com.primenova.studio.model.Notification;
import com.primenova.studio.model.User;
import com.primenova.studio.model.UserSession;
import com.primenova.studio.repository.ContactRepository;
import com.primenova.studio.repository.NotificationRepository;
import com.primenova.studio.repository.UserRepository;
import com.primenova.studio.repository.UserSessionRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final ContactRepository contactRepository;
    private final UserSessionRepository userSessionRepository;
    private final NotificationRepository notificationRepository;

    public AdminController(UserRepository userRepository,
                           ContactRepository contactRepository,
                           UserSessionRepository userSessionRepository,
                           NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.contactRepository = contactRepository;
        this.userSessionRepository = userSessionRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers(@RequestParam(required = false) String search) {
        List<User> users = userRepository.findAll();
        if (search != null && !search.isBlank()) {
            String lowerSearch = search.toLowerCase();
            users = users.stream()
                    .filter(u -> (u.getFullName() != null && u.getFullName().toLowerCase().contains(lowerSearch)) ||
                                 (u.getEmail() != null && u.getEmail().toLowerCase().contains(lowerSearch)))
                    .collect(Collectors.toList());
        }

        // CRITICAL: Convert to UserResponse to exclude passwordHash!
        List<UserResponse> responses = users.stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<UserResponse> updateUserStatus(@PathVariable String userId, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String newStatus = body.get("status");
        if (newStatus != null) {
            user.setStatus(newStatus);
            userRepository.save(user);
        }
        return ResponseEntity.ok(UserResponse.fromUser(user));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable String userId) {
        userRepository.deleteById(userId);
        List<UserSession> sessions = userSessionRepository.findByUserId(userId);
        userSessionRepository.deleteAll(sessions);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @GetMapping("/contacts")
    public ResponseEntity<Map<String, Object>> getAllContacts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        List<Contact> contacts = contactRepository.findAllByOrderByCreatedAtDesc();

        if (search != null && !search.isBlank()) {
            String s = search.toLowerCase();
            contacts = contacts.stream()
                    .filter(c -> (c.getFullName() != null && c.getFullName().toLowerCase().contains(s))
                              || (c.getEmail() != null && c.getEmail().toLowerCase().contains(s))
                              || (c.getSubject() != null && c.getSubject().toLowerCase().contains(s))
                              || (c.getCompany() != null && c.getCompany().toLowerCase().contains(s)))
                    .collect(Collectors.toList());
        }

        if (status != null && !status.isBlank()) {
            contacts = contacts.stream()
                    .filter(c -> status.equalsIgnoreCase(c.getStatus())
                              || (Contact.STATUS_NEW.equalsIgnoreCase(status) && c.getStatus() == null))
                    .collect(Collectors.toList());
        }

        int safeSize = Math.max(1, size);
        int safePage = Math.max(0, page);
        int totalPages = (int) Math.ceil((double) contacts.size() / safeSize);
        int start = Math.min(safePage * safeSize, contacts.size());
        int end = Math.min(start + safeSize, contacts.size());
        List<Contact> content = contacts.subList(start, end);

        Map<String, Object> response = new HashMap<>();
        response.put("content", content);
        response.put("totalElements", contacts.size());
        response.put("totalPages", totalPages);
        response.put("page", page);
        response.put("size", safeSize);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/contacts/stats")
    public ResponseEntity<Map<String, Object>> getContactStats() {
        List<Contact> contacts = contactRepository.findAll();
        LocalDate today = LocalDate.now();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMessages", contacts.size());
        // Legacy docs (pre-status) count as unread
        stats.put("unreadMessages", contacts.stream()
                .filter(c -> c.getStatus() == null || Contact.STATUS_NEW.equals(c.getStatus())).count());
        stats.put("repliedMessages", contacts.stream()
                .filter(c -> Contact.STATUS_REPLIED.equals(c.getStatus())).count());
        stats.put("todayMessages", contacts.stream()
                .filter(c -> c.getCreatedAt() != null && c.getCreatedAt().toLocalDate().equals(today)).count());
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/contacts/{contactId}/status")
    public ResponseEntity<Contact> updateContactStatus(@PathVariable String contactId,
                                                       @RequestBody Map<String, String> body) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new CustomException("Contact not found", HttpStatus.NOT_FOUND));

        String status = body.get("status");
        boolean valid = Contact.STATUS_NEW.equals(status) || Contact.STATUS_READ.equals(status)
                || Contact.STATUS_REPLIED.equals(status) || Contact.STATUS_CLOSED.equals(status);
        if (!valid) {
            throw new CustomException("Invalid contact status", HttpStatus.BAD_REQUEST);
        }

        contact.setStatus(status);
        contact.markUpdated();
        return ResponseEntity.ok(contactRepository.save(contact));
    }

    @DeleteMapping("/contacts/{contactId}")
    public ResponseEntity<Map<String, String>> deleteContact(@PathVariable String contactId) {
        if (!contactRepository.existsById(contactId)) {
            throw new CustomException("Contact not found", HttpStatus.NOT_FOUND);
        }
        contactRepository.deleteById(contactId);
        return ResponseEntity.ok(Map.of("message", "Contact deleted successfully"));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<UserSession>> getRecentSessions() {
        return ResponseEntity.ok(userSessionRepository.findTop10ByOrderByLoginTimeDesc());
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        List<User> users = userRepository.findAll();
        List<Contact> contacts = contactRepository.findAll();
        List<UserSession> sessions = userSessionRepository.findAll();

        long manualLogins = sessions.stream().filter(s -> "MANUAL".equals(s.getLoginType())).count();
        long googleLogins = sessions.stream().filter(s -> "GOOGLE".equals(s.getLoginType())).count();
        long githubLogins = sessions.stream().filter(s -> "GITHUB".equals(s.getLoginType())).count();
        long googleUsers = users.stream().filter(u -> "GOOGLE".equals(u.getProvider())).count();
        long githubUsers = users.stream().filter(u -> "GITHUB".equals(u.getProvider())).count();
        long credentialsUsers = users.stream().filter(u -> "CREDENTIALS".equals(u.getProvider())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", users.size());
        stats.put("totalContacts", contacts.size());
        stats.put("totalSessions", sessions.size());
        stats.put("manualLogins", manualLogins);
        stats.put("googleLogins", googleLogins);
        stats.put("githubLogins", githubLogins);
        stats.put("googleUsersCount", googleUsers);
        stats.put("githubUsersCount", githubUsers);
        stats.put("credentialsUsersCount", credentialsUsers);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/contacts/export")
    public ResponseEntity<String> exportContactsCsv() {
        List<Contact> contacts = contactRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,FullName,Email,Phone,Company,ProjectType,Budget,Subject,Status,Country,IPAddress,Browser,OperatingSystem,SubmittedAt\n");

        for (Contact c : contacts) {
            csv.append(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
                    c.getId(),
                    c.getFullName() != null ? c.getFullName() : "",
                    c.getEmail() != null ? c.getEmail() : "",
                    c.getPhone() != null ? c.getPhone() : "",
                    c.getCompany() != null ? c.getCompany() : "",
                    c.getProjectType() != null ? c.getProjectType() : "",
                    c.getBudget() != null ? c.getBudget() : "",
                    c.getSubject() != null ? c.getSubject() : "",
                    c.getStatus() != null ? c.getStatus() : "",
                    c.getCountry() != null ? c.getCountry() : "",
                    c.getIpAddress() != null ? c.getIpAddress() : "",
                    c.getBrowser() != null ? c.getBrowser() : "",
                    c.getOperatingSystem() != null ? c.getOperatingSystem() : "",
                    c.getCreatedAt() != null ? c.getCreatedAt().toString() : ""
            ));
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=primenova_contacts.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv.toString());
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getNotifications() {
        List<Notification> notifications = notificationRepository.findAll().stream()
                .sorted((n1, n2) -> {
                    if (n1.getCreatedAt() == null || n2.getCreatedAt() == null) return 0;
                    return n2.getCreatedAt().compareTo(n1.getCreatedAt());
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<Notification> markNotificationRead(@PathVariable String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new CustomException("Notification not found", HttpStatus.NOT_FOUND));
        notification.setRead(true);
        return ResponseEntity.ok(notificationRepository.save(notification));
    }

    @PutMapping("/notifications/read-all")
    public ResponseEntity<Map<String, String>> markAllNotificationsRead() {
        List<Notification> notifications = notificationRepository.findAll();
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    @DeleteMapping("/notifications/{id}")
    public ResponseEntity<Map<String, String>> deleteNotification(@PathVariable String id) {
        if (!notificationRepository.existsById(id)) {
            throw new CustomException("Notification not found", HttpStatus.NOT_FOUND);
        }
        notificationRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Notification deleted"));
    }
}

