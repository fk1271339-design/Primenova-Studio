package com.primenova.studio.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "feedback")
public class Feedback {
    @Id
    private String id;
    private String userId;
    private String messageId;
    private String feedbackType; // "LIKE" or "DISLIKE"
    private String comments;
    private LocalDateTime createdAt;

    public Feedback() {}

    public Feedback(String userId, String messageId, String feedbackType) {
        this.userId = userId;
        this.messageId = messageId;
        this.feedbackType = feedbackType;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getMessageId() { return messageId; }
    public void setMessageId(String messageId) { this.messageId = messageId; }

    public String getFeedbackType() { return feedbackType; }
    public void setFeedbackType(String feedbackType) { this.feedbackType = feedbackType; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
