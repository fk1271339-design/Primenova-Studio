package com.primenova.studio.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "sessions")
public class UserSession {
    @Id
    private String id;
    private String userId;
    private String email;
    private String loginType; // "MANUAL" or "GOOGLE"
    private String ipAddress;
    private String userAgent;
    private LocalDateTime loginTime;
    
    // Geo & Device tracking fields
    private String browser;
    private String operatingSystem;
    private String device;
    private String country;
    private boolean isActive;

    public UserSession() {}

    public UserSession(String userId, String email, String loginType, String ipAddress, String userAgent) {
        this.userId = userId;
        this.email = email;
        this.loginType = loginType;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.loginTime = LocalDateTime.now();
        this.isActive = true;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLoginType() { return loginType; }
    public void setLoginType(String loginType) { this.loginType = loginType; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public LocalDateTime getLoginTime() { return loginTime; }
    public void setLoginTime(LocalDateTime loginTime) { this.loginTime = loginTime; }

    public String getBrowser() { return browser; }
    public void setBrowser(String browser) { this.browser = browser; }

    public String getOperatingSystem() { return operatingSystem; }
    public void setOperatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; }

    public String getDevice() { return device; }
    public void setDevice(String device) { this.device = device; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
