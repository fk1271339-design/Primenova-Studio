package com.primenova.studio.service;

import com.primenova.studio.exception.CustomException;
import com.primenova.studio.model.ChatSession;
import com.primenova.studio.model.Feedback;
import com.primenova.studio.repository.ChatSessionRepository;
import com.primenova.studio.repository.FeedbackRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

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

    public Feedback submitFeedback(String userId, String messageId, String type) {
        Feedback feedback = new Feedback(userId, messageId, type);
        return feedbackRepository.save(feedback);
    }
}
