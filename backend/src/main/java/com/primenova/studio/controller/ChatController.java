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

    @PostMapping("/feedback")
    public ResponseEntity<Feedback> submitFeedback(Authentication authentication,
                                                   @RequestBody Map<String, String> body) {
        String userId = (String) authentication.getPrincipal();
        String messageId = body.get("messageId");
        String type = body.get("type");
        return ResponseEntity.ok(chatService.submitFeedback(userId, messageId, type));
    }
}
