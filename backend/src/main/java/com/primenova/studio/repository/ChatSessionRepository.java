package com.primenova.studio.repository;

import com.primenova.studio.model.ChatSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatSessionRepository extends MongoRepository<ChatSession, String> {
    List<ChatSession> findByUserId(String userId);
}
