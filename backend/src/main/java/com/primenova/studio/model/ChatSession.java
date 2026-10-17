package com.primenova.studio.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Document(collection = "chat_history")
public class ChatSession {
    @Id
    private String id;
    private String userId; // Reference to User ID
    private String title;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<MessageItem> messages = new ArrayList<>();

    // ─── Nova AI Memory Snapshot ──────────────────────────────
    // Persists the AI's conversation context so it can be restored
    // on next session load (user doesn't have to repeat themselves)
    private String novaUserName;
    private String novaProjectType;
    private String novaIndustry;
    private String novaBudget;
    private String novaTimeline;
    private String novaProductType;
    private String novaPreferredTech;
    private List<String> novaExtractedFeatures = new ArrayList<>();
    private List<String> novaDiscussedServices = new ArrayList<>();
    private String novaConversationStage;
    private String novaPreferredLanguage;
    private Map<String, String> novaDecisions = new HashMap<>();

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

    // ─── Nova Memory Getters & Setters ───────────────────────
    public String getNovaUserName() { return novaUserName; }
    public void setNovaUserName(String novaUserName) { this.novaUserName = novaUserName; }

    public String getNovaProjectType() { return novaProjectType; }
    public void setNovaProjectType(String novaProjectType) { this.novaProjectType = novaProjectType; }

    public String getNovaIndustry() { return novaIndustry; }
    public void setNovaIndustry(String novaIndustry) { this.novaIndustry = novaIndustry; }

    public String getNovaBudget() { return novaBudget; }
    public void setNovaBudget(String novaBudget) { this.novaBudget = novaBudget; }

    public String getNovaTimeline() { return novaTimeline; }
    public void setNovaTimeline(String novaTimeline) { this.novaTimeline = novaTimeline; }

    public String getNovaProductType() { return novaProductType; }
    public void setNovaProductType(String novaProductType) { this.novaProductType = novaProductType; }

    public String getNovaPreferredTech() { return novaPreferredTech; }
    public void setNovaPreferredTech(String novaPreferredTech) { this.novaPreferredTech = novaPreferredTech; }

    public List<String> getNovaExtractedFeatures() { return novaExtractedFeatures; }
    public void setNovaExtractedFeatures(List<String> novaExtractedFeatures) { this.novaExtractedFeatures = novaExtractedFeatures; }

    public List<String> getNovaDiscussedServices() { return novaDiscussedServices; }
    public void setNovaDiscussedServices(List<String> novaDiscussedServices) { this.novaDiscussedServices = novaDiscussedServices; }

    public String getNovaConversationStage() { return novaConversationStage; }
    public void setNovaConversationStage(String novaConversationStage) { this.novaConversationStage = novaConversationStage; }

    public String getNovaPreferredLanguage() { return novaPreferredLanguage; }
    public void setNovaPreferredLanguage(String novaPreferredLanguage) { this.novaPreferredLanguage = novaPreferredLanguage; }

    public Map<String, String> getNovaDecisions() { return novaDecisions; }
    public void setNovaDecisions(Map<String, String> novaDecisions) { this.novaDecisions = novaDecisions; }
}
