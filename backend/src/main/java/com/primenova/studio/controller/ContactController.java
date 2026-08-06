package com.primenova.studio.controller;

import com.primenova.studio.dto.ContactRequest;
import com.primenova.studio.model.Contact;
import com.primenova.studio.service.ContactService;
import com.primenova.studio.util.IpUtils;
import com.primenova.studio.util.UserAgentParser;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitContact(@Valid @RequestBody ContactRequest request,
                                                             HttpServletRequest httpRequest) {
        String userAgent = httpRequest.getHeader("User-Agent");

        Contact saved = contactService.submitContact(
            request,
            IpUtils.extractClientIp(httpRequest),
            UserAgentParser.parseBrowser(userAgent),
            UserAgentParser.parseOS(userAgent),
            UserAgentParser.parseDevice(userAgent)
        );

        log.info("Contact submission accepted: contactId={}", saved.getId());

        return ResponseEntity.ok(Map.of(
            "message", "Message sent successfully! Our team will respond within 24 hours.",
            "contactId", saved.getId(),
            "status", saved.getStatus()
        ));
    }
}
