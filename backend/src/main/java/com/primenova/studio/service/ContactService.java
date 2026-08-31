package com.primenova.studio.service;

import com.primenova.studio.dto.ContactRequest;
import com.primenova.studio.exception.CustomException;
import com.primenova.studio.model.Contact;
import com.primenova.studio.model.Notification;
import com.primenova.studio.repository.ContactRepository;
import com.primenova.studio.repository.NotificationRepository;
import com.primenova.studio.util.InputSanitizer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ContactRepository contactRepository;
    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    private final GeoLocationService geoLocationService;

    public ContactService(ContactRepository contactRepository,
                          NotificationRepository notificationRepository,
                          EmailService emailService,
                          GeoLocationService geoLocationService) {
        this.contactRepository = contactRepository;
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
        this.geoLocationService = geoLocationService;
    }

    /**
     * Full submission pipeline: validate -> sanitize -> persist -> notify.
     * Emails are best-effort (never block the visitor response if SMTP fails).
     *
     * @param request      validated DTO from the controller
     * @param ipAddress    resolved client IP
     * @param browser      parsed browser name
     * @param operatingSystem parsed OS name
     * @param device       parsed device type
     */
    public Contact submitContact(ContactRequest request,
                                 String ipAddress,
                                 String browser,
                                 String operatingSystem,
                                 String device) {
        // Sanitize everything before it reaches MongoDB or email templates
        String fullName = InputSanitizer.sanitize(request.getFullName());
        String email = InputSanitizer.sanitize(request.getEmail());
        String message = InputSanitizer.sanitize(request.getMessage());

        if (fullName == null) {
            throw new CustomException("Full name is required", HttpStatus.BAD_REQUEST);
        }
        if (email == null) {
            throw new CustomException("Email is required", HttpStatus.BAD_REQUEST);
        }
        if (message == null) {
            throw new CustomException("Message is required", HttpStatus.BAD_REQUEST);
        }

        // Idempotency guard: an identical submission (same email + message) inside
        // the last 5 minutes is treated as a duplicate (browser refresh re-POST,
        // double-click, network retry). Return the existing record and do NOT
        // re-save / re-notify / re-email, so the customer gets one auto-reply and
        // the admin gets one notification.
        Optional<Contact> recent = contactRepository.findFirstByEmailAndMessageOrderByCreatedAtDesc(email, message);
        if (recent.isPresent() && recent.get().getCreatedAt() != null
                && recent.get().getCreatedAt().isAfter(LocalDateTime.now().minusMinutes(5))) {
            log.info("Duplicate contact submission ignored (email={}, existingId={})", email, recent.get().getId());
            return recent.get();
        }

        Contact contact = new Contact(
            fullName,
            email,
            InputSanitizer.sanitize(request.getPhone()),
            InputSanitizer.sanitize(request.getCompany()),
            InputSanitizer.sanitize(request.getProjectType()),
            InputSanitizer.sanitize(request.getBudget()),
            InputSanitizer.sanitize(request.getSubject()),
            message
        );
        contact.setIpAddress(ipAddress);
        contact.setBrowser(browser);
        contact.setOperatingSystem(operatingSystem);
        contact.setDevice(device);
        contact.setCountry(geoLocationService.resolveCountry(ipAddress));
        contact.setStatus(Contact.STATUS_NEW);

        // Step 2: persist to MongoDB
        Contact saved = contactRepository.save(contact);
        log.info("New contact inquiry saved id={} from {} ({})", saved.getId(), saved.getFullName(), saved.getEmail());

        // Admin notification (upgraded to the full notification model in a later step)
        try {
            Notification notification = new Notification(
                "NEW_CONTACT",
                "New Contact Request",
                saved.getFullName() + " submitted a project inquiry."
            );
            notificationRepository.save(notification);
        } catch (Exception e) {
            log.warn("Failed to persist notification for contact {}: {}", saved.getId(), e.getMessage());
        }

        // Emails dispatch asynchronously so slow email requests never block the visitor's HTTP response.
        // EmailService swallows failures internally, so these tasks are best-effort by design.
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            // Admin email notification — professional HTML template with full inquiry details
            emailService.sendContactNotificationToAdmin(saved);
            // Auto-reply to the visitor — thanks them and promises a 24h response
            emailService.sendAutoReplyEmail(saved);
        });

        return saved;
    }
}
