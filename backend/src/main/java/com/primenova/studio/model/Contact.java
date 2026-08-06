package com.primenova.studio.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

/**
 * Contact inquiry document stored in MongoDB (collection: contacts).
 * Every visitor submission is captured along with metadata (IP, browser, OS)
 * and moves through a status lifecycle: NEW -> READ -> REPLIED -> CLOSED.
 */
@Document(collection = "contacts")
public class Contact {

    public static final String STATUS_NEW = "NEW";
    public static final String STATUS_READ = "READ";
    public static final String STATUS_REPLIED = "REPLIED";
    public static final String STATUS_CLOSED = "CLOSED";

    @Id
    private String id;
    private String fullName;
    private String email;
    private String phone;
    private String company;
    private String projectType;
    private String budget;
    private String subject;
    private String message;

    // Metadata captured automatically on submission
    private String ipAddress;
    private String browser;
    private String operatingSystem;
    private String device;
    private String country; // null until geolocation is enabled

    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Contact() {}

    public Contact(String fullName, String email, String phone, String company,
                   String projectType, String budget, String subject, String message) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.company = company;
        this.projectType = projectType;
        this.budget = budget;
        this.subject = subject;
        this.message = message;
        this.status = STATUS_NEW;
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    /** Call whenever a contact is modified so updatedAt stays fresh. */
    public void markUpdated() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getProjectType() { return projectType; }
    public void setProjectType(String projectType) { this.projectType = projectType; }

    public String getBudget() { return budget; }
    public void setBudget(String budget) { this.budget = budget; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getBrowser() { return browser; }
    public void setBrowser(String browser) { this.browser = browser; }

    public String getOperatingSystem() { return operatingSystem; }
    public void setOperatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; }

    public String getDevice() { return device; }
    public void setDevice(String device) { this.device = device; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
