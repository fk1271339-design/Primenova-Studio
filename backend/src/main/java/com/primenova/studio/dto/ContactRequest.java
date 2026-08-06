package com.primenova.studio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Incoming visitor contact submission. Validated on the backend before
 * it ever touches the database or the email templates (anti-injection).
 */
public class ContactRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must be at most 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    @Size(max = 150, message = "Email must be at most 150 characters")
    private String email;

    @Pattern(regexp = "^[+0-9()\\-\\s]*$", message = "Phone number contains invalid characters")
    @Size(max = 30, message = "Phone number must be at most 30 characters")
    private String phone;

    @Size(max = 150, message = "Company name must be at most 150 characters")
    private String company;

    @Size(max = 100, message = "Project type must be at most 100 characters")
    private String projectType;

    @Size(max = 100, message = "Budget must be at most 100 characters")
    private String budget;

    @Size(max = 200, message = "Subject must be at most 200 characters")
    private String subject;

    @NotBlank(message = "Message is required")
    @Size(max = 5000, message = "Message must be at most 5000 characters")
    private String message;

    public ContactRequest() {}

    // Getters and Setters
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
}
