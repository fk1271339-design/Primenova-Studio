package com.primenova.studio.repository;

import com.primenova.studio.model.Contact;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ContactRepository extends MongoRepository<Contact, String> {
    List<Contact> findAllByOrderByCreatedAtDesc();

    /** Most recent submission matching the same sender + message (idempotency guard). */
    Optional<Contact> findFirstByEmailAndMessageOrderByCreatedAtDesc(String email, String message);
}
