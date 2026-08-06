package com.primenova.studio.repository;

import com.primenova.studio.model.UserSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface UserSessionRepository extends MongoRepository<UserSession, String> {
    List<UserSession> findByUserId(String userId);
    List<UserSession> findTop10ByOrderByLoginTimeDesc();
}
