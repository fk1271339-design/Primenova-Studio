package com.primenova.studio.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "chat_history")
public class ChatSession {
    @Id
    private String id;
    private String userId; // Reference to User ID
    private String title;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<MessageItem> messages = new ArrayList<>();

    public static class MessageItem {
        private String sender; // "user" or "ai"
        private String text;
        private LocalDateTime timestamp;

        public MessageItem() {}

        public MessageItem(String sender, String text) {
            this.sender = sender;
            this.text = text;
            this.timestamp = LocalDateTime.now();
        }

        // Getters & Setters
        public String getSender() { return sender; }
        public void setSender(String sender) { this.sender = sender; }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }

        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }

    public ChatSession() {}

    public ChatSession(String userId, String title) {
        this.userId = userId;
        this.title = title;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<MessageItem> getMessages() { return messages; }
    public void setMessages(List<MessageItem> messages) { this.messages = messages; }
}
