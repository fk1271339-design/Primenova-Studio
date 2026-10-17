package com.primenova.studio.service;

import com.primenova.studio.exception.CustomException;
import com.primenova.studio.model.ChatSession;
import com.primenova.studio.model.Feedback;
import com.primenova.studio.repository.ChatSessionRepository;
import com.primenova.studio.repository.FeedbackRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final FeedbackRepository feedbackRepository;

    public ChatService(ChatSessionRepository chatSessionRepository,
                       FeedbackRepository feedbackRepository) {
        this.chatSessionRepository = chatSessionRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public List<ChatSession> getUserSessions(String userId) {
        return chatSessionRepository.findByUserId(userId);
    }

    public ChatSession createSession(String userId, String title) {
        ChatSession session = new ChatSession(userId, title != null ? title : "New Conversation");
        return chatSessionRepository.save(session);
    }

    public ChatSession addMessageToSession(String userId, String sessionId, String sender, String text) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new CustomException("Chat session not found", HttpStatus.NOT_FOUND));

        if (!session.getUserId().equals(userId)) {
            throw new CustomException("Unauthorized access to chat session", HttpStatus.FORBIDDEN);
        }

        session.getMessages().add(new ChatSession.MessageItem(sender, text));
        session.setUpdatedAt(LocalDateTime.now());
        return chatSessionRepository.save(session);
    }

    // ─── Nova Memory Persistence ─────────────────────────────

    /**
     * Saves the Nova AI memory snapshot into the chat session.
     * Called by frontend whenever conversation context changes.
     */
    @SuppressWarnings("unchecked")
    public ChatSession saveNovaMemory(String userId, String sessionId, Map<String, Object> memorySnapshot) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new CustomException("Chat session not found", HttpStatus.NOT_FOUND));

        if (!session.getUserId().equals(userId)) {
            throw new CustomException("Unauthorized", HttpStatus.FORBIDDEN);
        }

        // Map frontend NovaMemory fields → ChatSession fields
        if (memorySnapshot.containsKey("userName"))
            session.setNovaUserName((String) memorySnapshot.get("userName"));
        if (memorySnapshot.containsKey("projectType"))
            session.setNovaProjectType((String) memorySnapshot.get("projectType"));
        if (memorySnapshot.containsKey("industry"))
            session.setNovaIndustry((String) memorySnapshot.get("industry"));
        if (memorySnapshot.containsKey("budget"))
            session.setNovaBudget((String) memorySnapshot.get("budget"));
        if (memorySnapshot.containsKey("timeline"))
            session.setNovaTimeline((String) memorySnapshot.get("timeline"));
        if (memorySnapshot.containsKey("productType"))
            session.setNovaProductType((String) memorySnapshot.get("productType"));
        if (memorySnapshot.containsKey("preferredTech"))
            session.setNovaPreferredTech((String) memorySnapshot.get("preferredTech"));
        if (memorySnapshot.containsKey("extractedFeatures"))
            session.setNovaExtractedFeatures((List<String>) memorySnapshot.get("extractedFeatures"));
        if (memorySnapshot.containsKey("discussedServices"))
            session.setNovaDiscussedServices((List<String>) memorySnapshot.get("discussedServices"));
        if (memorySnapshot.containsKey("conversationStage"))
            session.setNovaConversationStage((String) memorySnapshot.get("conversationStage"));
        if (memorySnapshot.containsKey("preferredLanguage"))
            session.setNovaPreferredLanguage((String) memorySnapshot.get("preferredLanguage"));
        if (memorySnapshot.containsKey("decisions"))
            session.setNovaDecisions((Map<String, String>) memorySnapshot.get("decisions"));

        session.setUpdatedAt(LocalDateTime.now());
        return chatSessionRepository.save(session);
    }

    /**
     * Returns the Nova memory snapshot from the user's most recent session.
     * Frontend uses this to restore conversation context on load.
     */
    public Map<String, Object> getLatestNovaMemory(String userId) {
        List<ChatSession> sessions = chatSessionRepository.findByUserId(userId);

        // Find most recently updated session
        Optional<ChatSession> latestOpt = sessions.stream()
                .filter(s -> s.getUpdatedAt() != null)
                .max((a, b) -> a.getUpdatedAt().compareTo(b.getUpdatedAt()));

        Map<String, Object> result = new HashMap<>();
        if (latestOpt.isPresent()) {
            ChatSession session = latestOpt.get();
            result.put("sessionId", session.getId());
            result.put("userName", session.getNovaUserName());
            result.put("projectType", session.getNovaProjectType());
            result.put("industry", session.getNovaIndustry());
            result.put("budget", session.getNovaBudget());
            result.put("timeline", session.getNovaTimeline());
            result.put("productType", session.getNovaProductType());
            result.put("preferredTech", session.getNovaPreferredTech());
            result.put("extractedFeatures", session.getNovaExtractedFeatures());
            result.put("discussedServices", session.getNovaDiscussedServices());
            result.put("conversationStage", session.getNovaConversationStage());
            result.put("preferredLanguage", session.getNovaPreferredLanguage());
            result.put("decisions", session.getNovaDecisions());
        }
        return result;
    }

    /**
     * Gets the most recent active session for a user, or creates one if none exists.
     * Ensures the frontend always has a valid session to write to.
     */
    public ChatSession ensureActiveSession(String userId) {
        List<ChatSession> sessions = chatSessionRepository.findByUserId(userId);

        return sessions.stream()
                .filter(s -> s.getUpdatedAt() != null)
                .max((a, b) -> a.getUpdatedAt().compareTo(b.getUpdatedAt()))
                .orElseGet(() -> {
                    ChatSession newSession = new ChatSession(userId, "AI Consultation");
                    return chatSessionRepository.save(newSession);
                });
    }

    public Feedback submitFeedback(String userId, String messageId, String type) {
        Feedback feedback = new Feedback(userId, messageId, type);
        return feedbackRepository.save(feedback);
    }
}
