package com.primenova.studio.repository;

import com.primenova.studio.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByIsReadFalseOrderByCreatedAtDesc();
}
