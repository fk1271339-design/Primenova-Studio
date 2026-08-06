package com.primenova.studio.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String fullName;

    // Unique (sparse) so MongoDB enforces one account per email at the DB level,
    // not just via the application's existsByEmail check.
    @Indexed(unique = true, sparse = true)
    private String email;
    private String phone;
    private String avatar;
    private String provider; // "CREDENTIALS", "GOOGLE" or "GITHUB"
    private String passwordHash;
    private String role; // "USER" or "ADMIN"
    private String status; // "ACTIVE" or "BLOCKED"
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;
    private boolean isVerified;

    // Unique (sparse) so lookup by token stays fast and unambiguous.
    @Indexed(unique = true, sparse = true)
    private String verificationToken;
    private LocalDateTime verificationTokenExpiresAt;
    private LocalDateTime verificationEmailSentAt;

    @Indexed(unique = true, sparse = true)
    private String resetPasswordToken;
    private LocalDateTime resetPasswordTokenExpiresAt;
    private LocalDateTime resetPasswordEmailSentAt;
    private String bio;
    private String website;
    private String company;
    private String location;

    public User() {}

    public User(String fullName, String email, String provider, String passwordHash, String role) {
        this.fullName = fullName;
        this.email = email;
        this.provider = provider;
        this.passwordHash = passwordHash;
        this.role = role;
        this.status = "ACTIVE";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isVerified = false;
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

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }

    public String getVerificationToken() { return verificationToken; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }

    public LocalDateTime getVerificationTokenExpiresAt() { return verificationTokenExpiresAt; }
    public void setVerificationTokenExpiresAt(LocalDateTime verificationTokenExpiresAt) { this.verificationTokenExpiresAt = verificationTokenExpiresAt; }

    public LocalDateTime getVerificationEmailSentAt() { return verificationEmailSentAt; }
    public void setVerificationEmailSentAt(LocalDateTime verificationEmailSentAt) { this.verificationEmailSentAt = verificationEmailSentAt; }

    public String getResetPasswordToken() { return resetPasswordToken; }
    public void setResetPasswordToken(String resetPasswordToken) { this.resetPasswordToken = resetPasswordToken; }

    public LocalDateTime getResetPasswordTokenExpiresAt() { return resetPasswordTokenExpiresAt; }
    public void setResetPasswordTokenExpiresAt(LocalDateTime resetPasswordTokenExpiresAt) { this.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt; }

    public LocalDateTime getResetPasswordEmailSentAt() { return resetPasswordEmailSentAt; }
    public void setResetPasswordEmailSentAt(LocalDateTime resetPasswordEmailSentAt) { this.resetPasswordEmailSentAt = resetPasswordEmailSentAt; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
