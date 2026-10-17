package com.primenova.studio.controller;

import com.primenova.studio.model.ChatSession;
import com.primenova.studio.model.Feedback;
import com.primenova.studio.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<ChatSession>> getUserSessions(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(chatService.getUserSessions(userId));
    }

    @PostMapping("/sessions")
    public ResponseEntity<ChatSession> createSession(Authentication authentication,
                                                     @RequestBody(required = false) Map<String, String> body) {
        String userId = (String) authentication.getPrincipal();
        String title = body != null ? body.get("title") : "New Chat";
        return ResponseEntity.ok(chatService.createSession(userId, title));
    }

    @PostMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<ChatSession> addMessage(Authentication authentication,
                                                   @PathVariable String sessionId,
                                                   @RequestBody Map<String, String> body) {
        String userId = (String) authentication.getPrincipal();
        String sender = body.get("sender");
        String text = body.get("text");
        return ResponseEntity.ok(chatService.addMessageToSession(userId, sessionId, sender, text));
    }

    // ─── Nova Memory Endpoints ────────────────────────────────

    /**
     * Save Nova AI memory snapshot for a session.
     * Called by frontend whenever memory changes (debounced).
     */
    @PutMapping("/sessions/{sessionId}/nova-memory")
    public ResponseEntity<ChatSession> saveNovaMemory(
            Authentication authentication,
            @PathVariable String sessionId,
            @RequestBody Map<String, Object> memorySnapshot) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(chatService.saveNovaMemory(userId, sessionId, memorySnapshot));
    }

    /**
     * Get Nova memory for the most recent session of this user.
     * Called on app load to restore context.
     */
    @GetMapping("/sessions/latest/nova-memory")
    public ResponseEntity<Map<String, Object>> getLatestNovaMemory(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(chatService.getLatestNovaMemory(userId));
    }

    /**
     * Get or create the active session for this user.
     * Ensures a session always exists.
     */
    @PostMapping("/sessions/ensure-active")
    public ResponseEntity<ChatSession> ensureActiveSession(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(chatService.ensureActiveSession(userId));
    }

    @PostMapping("/feedback")
    public ResponseEntity<Feedback> submitFeedback(Authentication authentication,
                                                   @RequestBody Map<String, String> body) {
        String userId = (String) authentication.getPrincipal();
        String messageId = body.get("messageId");
        String type = body.get("type");
        return ResponseEntity.ok(chatService.submitFeedback(userId, messageId, type));
    }
}
