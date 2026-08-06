package com.primenova.studio.service;

import com.primenova.studio.model.Contact;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd MMM yyyy");
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("hh:mm a");

    private final JavaMailSender mailSender;

    @Value("${app.adminEmail:hello@primenova.studio}")
    private String adminEmail;

    @Value("${app.frontendUrl:http://localhost:8080}")
    private String frontendUrl;

    @Value("${app.mailFrom:placeholder@gmail.com}")
    private String mailFrom;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String recipientEmail, String name, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(recipientEmail);
            helper.setFrom(mailFrom);
            helper.setReplyTo(adminEmail);
            helper.setSubject("Welcome to PrimeNova Studio 🚀 - Verify Email");
            
            String verifyUrl = frontendUrl + "/verify-email?token=" + token;
            String htmlContent = 
                "<div style=\"background-color:#09090b; padding:45px 30px; font-family:sans-serif; text-align:center; color:#ffffff; max-width:480px; margin:0 auto; border-radius:20px; border:1px solid rgba(255,255,255,0.06);\">\n" +
                "  <div style=\"display:inline-flex; align-items:center; gap:8px; margin-bottom:24px;\">\n" +
                "    <span style=\"width:10px; height:10px; border-radius:50%; background:linear-gradient(to right, #fbbf24, #ec4899); display:inline-block;\"></span>\n" +
                "    <span style=\"font-size:12px; font-weight:bold; letter-spacing:0.15em; color:#ffffff;\">PRIMENOVA</span>\n" +
                "  </div>\n" +
                "  <h2 style=\"color:#ffffff; font-size:22px; font-weight:bold; margin-bottom:8px; letter-spacing:-0.025em;\">Welcome to PrimeNova Studio 🚀</h2>\n" +
                "  <p style=\"color:#a1a1aa; font-size:13px; line-height:1.6; margin-bottom:28px;\">Hello " + escapeHtml(name) + ", please verify your email to unlock your premium account features.</p>\n" +
                "  <a href=\"" + verifyUrl + "\" style=\"display:inline-block; background:linear-gradient(to right, #f59e0b, #fbbf24, #ec4899); color:#000000; padding:12px 30px; border-radius:10px; font-weight:bold; font-size:13px; text-decoration:none; box-shadow:0 4px 20px rgba(245,158,11,0.25); transition: all 0.3s ease;\">Verify Email</a>\n" +
                "  <p style=\"color:#52525b; font-size:11px; margin-top:35px; line-height:1.5;\">If you did not request this account creation, please ignore this email safely.</p>\n" +
                "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Could not send verification email to {}: {}", recipientEmail, e.getMessage());
        }
    }

    public void sendResetPasswordEmail(String recipientEmail, String name, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(recipientEmail);
            helper.setFrom(mailFrom);
            helper.setReplyTo(adminEmail);
            helper.setSubject("Reset Your Password - PrimeNova Studio 🔑");
            
            String resetUrl = frontendUrl + "/reset-password?token=" + token;
            String htmlContent = 
                "<div style=\"background-color:#09090b; padding:45px 30px; font-family:sans-serif; text-align:center; color:#ffffff; max-width:480px; margin:0 auto; border-radius:20px; border:1px solid rgba(255,255,255,0.06);\">\n" +
                "  <div style=\"display:inline-flex; align-items:center; gap:8px; margin-bottom:24px;\">\n" +
                "    <span style=\"width:10px; height:10px; border-radius:50%; background:linear-gradient(to right, #fbbf24, #ec4899); display:inline-block;\"></span>\n" +
                "    <span style=\"font-size:12px; font-weight:bold; letter-spacing:0.15em; color:#ffffff;\">PRIMENOVA</span>\n" +
                "  </div>\n" +
                "  <h2 style=\"color:#ffffff; font-size:22px; font-weight:bold; margin-bottom:8px; letter-spacing:-0.025em;\">Reset Password Request 🔑</h2>\n" +
                "  <p style=\"color:#a1a1aa; font-size:13px; line-height:1.6; margin-bottom:28px;\">Hello " + escapeHtml(name) + ", you requested a password reset. Click the link below to enter a new password (valid for 1 hour).</p>\n" +
                "  <a href=\"" + resetUrl + "\" style=\"display:inline-block; background:linear-gradient(to right, #f59e0b, #fbbf24, #ec4899); color:#000000; padding:12px 30px; border-radius:10px; font-weight:bold; font-size:13px; text-decoration:none; box-shadow:0 4px 20px rgba(245,158,11,0.25); transition: all 0.3s ease;\">Reset Password</a>\n" +
                "  <p style=\"color:#52525b; font-size:11px; margin-top:35px; line-height:1.5;\">If you did not request a password reset, please ignore this email safely.</p>\n" +
                "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Could not send password reset email to {}: {}", recipientEmail, e.getMessage());
        }
    }

    /**
     * Sends the admin a rich HTML notification every time a contact inquiry is
     * saved. Dark luxury theme, full inquiry details, visitor metadata
     * (browser / OS / IP), and a CTA straight to the admin dashboard.
     */
    public void sendContactNotificationToAdmin(Contact contact) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(adminEmail);
            helper.setFrom(mailFrom);
            helper.setSubject("📩 New Contact Inquiry - PrimeNova Studio");

            String dashboardUrl = frontendUrl + "/admin/dashboard";

            String htmlContent =
                "<div style=\"background-color:#09090b; padding:45px 30px; font-family:Arial, Helvetica, sans-serif; text-align:center; color:#ffffff; max-width:540px; margin:0 auto; border-radius:20px; border:1px solid rgba(255,255,255,0.06);\">\n" +
                brandHeader() +
                "  <div style=\"display:inline-block; margin-top:18px; padding:5px 14px; border-radius:999px; background:rgba(245,158,11,0.12); border:1px solid rgba(245,158,11,0.28); color:#fbbf24; font-size:10px; font-weight:bold; letter-spacing:0.14em;\">🔔 NEW INQUIRY RECEIVED</div>\n" +
                "  <h2 style=\"color:#ffffff; font-size:24px; font-weight:bold; margin:16px 0 6px; letter-spacing:-0.02em;\">A visitor wants to work with you</h2>\n" +
                "  <p style=\"color:#a1a1aa; font-size:13px; line-height:1.6; margin:0 0 24px;\"><strong style=\"color:#ffffff;\">" + escapeHtml(contact.getFullName()) + "</strong> submitted a new project inquiry.</p>\n" +
                detailCard(
                    "INQUIRY DETAILS",
                    detailRow("Name", contact.getFullName(), true) +
                    detailRow("Email", contact.getEmail(), false) +
                    detailRow("Phone", contact.getPhone(), false) +
                    detailRow("Company", contact.getCompany(), false) +
                    detailRow("Project Type", contact.getProjectType(), false) +
                    detailRow("Budget", contact.getBudget(), false) +
                    detailRow("Subject", contact.getSubject(), false)
                ) +
                "  <div style=\"background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:18px; text-align:left; margin-bottom:16px;\">\n" +
                "    <div style=\"font-size:10px; font-weight:bold; letter-spacing:0.14em; color:#fbbf24; margin-bottom:10px;\">MESSAGE</div>\n" +
                "    <div style=\"color:#e4e4e7; font-size:13px; line-height:1.7; white-space:pre-wrap;\">" + escapeHtml(contact.getMessage()) + "</div>\n" +
                "  </div>\n" +
                detailCard(
                    "VISITOR METADATA",
                    detailRow("Browser", contact.getBrowser(), true) +
                    detailRow("Operating System", contact.getOperatingSystem(), false) +
                    detailRow("Device", contact.getDevice(), false) +
                    detailRow("Country", contact.getCountry(), false) +
                    detailRow("IP Address", contact.getIpAddress(), false) +
                    detailRow("Date", contact.getCreatedAt() != null ? contact.getCreatedAt().format(DATE_FORMAT) : null, false) +
                    detailRow("Time", contact.getCreatedAt() != null ? contact.getCreatedAt().format(TIME_FORMAT) : null, false)
                ) +
                "  <a href=\"" + dashboardUrl + "\" style=\"display:inline-block; background:linear-gradient(to right, #f59e0b, #fbbf24, #ec4899); color:#000000; padding:14px 38px; border-radius:12px; font-weight:bold; font-size:13px; text-decoration:none; box-shadow:0 6px 24px rgba(245,158,11,0.28);\">Open Admin Dashboard</a>\n" +
                brandFooter() +
                "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Admin notification email sent for contact inquiry from {}", contact.getEmail());
        } catch (Exception e) {
            log.warn("Could not send admin email notification: {}", e.getMessage());
        }
    }

    /**
     * Sends the visitor an immediate acknowledgment after their inquiry is
     * saved: thanks them, promises a 24h response, and echoes back their
     * submission. Uses the same brand shell as the admin notification.
     */
    public void sendAutoReplyEmail(Contact contact) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(contact.getEmail());
            helper.setFrom(mailFrom);
            helper.setReplyTo(adminEmail);
            helper.setSubject("Thank you for contacting PrimeNova Studio 🚀");

            String htmlContent =
                "<div style=\"background-color:#09090b; padding:45px 30px; font-family:Arial, Helvetica, sans-serif; text-align:center; color:#ffffff; max-width:540px; margin:0 auto; border-radius:20px; border:1px solid rgba(255,255,255,0.06);\">\n" +
                brandHeader() +
                "  <div style=\"display:inline-block; margin-top:18px; padding:5px 14px; border-radius:999px; background:rgba(52,211,153,0.12); border:1px solid rgba(52,211,153,0.28); color:#34d399; font-size:10px; font-weight:bold; letter-spacing:0.14em;\">✅ INQUIRY RECEIVED</div>\n" +
                "  <h2 style=\"color:#ffffff; font-size:24px; font-weight:bold; margin:16px 0 8px; letter-spacing:-0.02em;\">Thank you for contacting PrimeNova Studio 🚀</h2>\n" +
                "  <p style=\"color:#a1a1aa; font-size:13px; line-height:1.7; margin:0 0 6px; text-align:left;\">Hello " + escapeHtml(contact.getFullName()) + ",</p>\n" +
                "  <p style=\"color:#a1a1aa; font-size:13px; line-height:1.7; margin:0 0 6px; text-align:left;\">We have successfully received your inquiry. Our team will carefully review your project requirements.</p>\n" +
                "  <p style=\"color:#a1a1aa; font-size:13px; line-height:1.7; margin:0 0 24px; text-align:left;\">You can expect a response within <strong style=\"color:#ffffff;\">24 hours</strong>.</p>\n" +
                detailCard(
                    "YOUR SUBMISSION",
                    detailRow("Name", contact.getFullName(), true) +
                    detailRow("Company", contact.getCompany(), false) +
                    detailRow("Project Type", contact.getProjectType(), false) +
                    detailRow("Budget", contact.getBudget(), false) +
                    detailRow("Message", contact.getMessage(), false)
                ) +
                "  <p style=\"color:#e4e4e7; font-size:13px; line-height:1.7; margin:0 0 6px; text-align:left;\">Thank you for choosing PrimeNova Studio. We look forward to building something great together.</p>\n" +
                "  <p style=\"color:#a1a1aa; font-size:13px; line-height:1.7; margin:0 0 16px; text-align:left;\">Regards,</p>\n" +
                signatureBlock() +
                socialLinks() +
                brandFooter() +
                "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Auto-reply email sent to {}", contact.getEmail());
        } catch (Exception e) {
            log.warn("Could not send auto-reply email to {}: {}", contact.getEmail(), e.getMessage());
        }
    }

    // ─── HTML template helpers ───────────────────────────────────

    private String brandHeader() {
        return
            "  <div style=\"display:inline-flex; align-items:center; gap:8px; margin-bottom:6px;\">\n" +
            "    <span style=\"width:10px; height:10px; border-radius:50%; background:linear-gradient(to right, #fbbf24, #ec4899); display:inline-block;\"></span>\n" +
            "    <span style=\"font-size:13px; font-weight:bold; letter-spacing:0.18em; color:#ffffff;\">PRIMENOVA</span>\n" +
            "    <span style=\"font-size:13px; font-weight:bold; letter-spacing:0.18em; color:#a1a1aa;\">STUDIO</span>\n" +
            "  </div>\n";
    }

    private String detailCard(String title, String rows) {
        return
            "  <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:16px; overflow:hidden; text-align:left; margin-bottom:16px;\">\n" +
            "    <tr><td style=\"padding:14px 18px; font-size:10px; font-weight:bold; letter-spacing:0.14em; color:#fbbf24;\">" + escapeHtml(title) + "</td></tr>\n" +
            rows +
            "  </table>\n";
    }

    private String detailRow(String label, String value, boolean first) {
        String border = first ? "" : "border-top:1px solid rgba(255,255,255,0.05);";
        // Escape first, then preserve newlines for multi-line values (e.g. message)
        String safeValue = (value != null && !value.isBlank()) ? escapeHtml(value).replace("\n", "<br/>") : "—";
        return
            "    <tr>\n" +
            "      <td style=\"padding:10px 18px; " + border + "\">\n" +
            "        <div style=\"font-size:10px; font-weight:bold; letter-spacing:0.1em; color:#8b8b93; margin-bottom:3px;\">" + escapeHtml(label) + "</div>\n" +
            "        <div style=\"color:#e4e4e7; font-size:13px; font-weight:600; word-break:break-word;\">" + safeValue + "</div>\n" +
            "      </td>\n" +
            "    </tr>\n";
    }

    private String signatureBlock() {
        return
            "  <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:0 0 24px;\">\n" +
            "    <tr>\n" +
            "      <td style=\"padding:0 14px 0 0;\">\n" +
            "        <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\">\n" +
            "          <tr><td style=\"width:44px; height:44px; border-radius:50%; background:linear-gradient(to right, #f59e0b, #ec4899); color:#000000; font-size:16px; font-weight:bold; text-align:center; vertical-align:middle;\">F</td></tr>\n" +
            "        </table>\n" +
            "      </td>\n" +
            "      <td style=\"padding:0; text-align:left;\">\n" +
            "        <div style=\"color:#ffffff; font-size:13px; font-weight:bold;\">Faiz</div>\n" +
            "        <div style=\"color:#a1a1aa; font-size:11px; line-height:1.5;\">Founder<br/>PrimeNova Studio</div>\n" +
            "      </td>\n" +
            "    </tr>\n" +
            "  </table>\n";
    }

    private String socialLinks() {
        return
            "  <div style=\"margin-bottom:24px;\">\n" +
            "    <div style=\"font-size:10px; font-weight:bold; letter-spacing:0.14em; color:#8b8b93; margin-bottom:10px;\">FOLLOW US</div>\n" +
            "    <a href=\"https://github.com\" style=\"display:inline-block; padding:8px 16px; margin:0 4px 6px 0; border:1px solid rgba(255,255,255,0.12); border-radius:999px; color:#e4e4e7; font-size:11px; font-weight:bold; text-decoration:none; background:rgba(255,255,255,0.03);\">GitHub</a>\n" +
            "    <a href=\"https://linkedin.com\" style=\"display:inline-block; padding:8px 16px; margin:0 4px 6px 0; border:1px solid rgba(255,255,255,0.12); border-radius:999px; color:#e4e4e7; font-size:11px; font-weight:bold; text-decoration:none; background:rgba(255,255,255,0.03);\">LinkedIn</a>\n" +
            "    <a href=\"https://twitter.com\" style=\"display:inline-block; padding:8px 16px; margin:0 4px 6px 0; border:1px solid rgba(255,255,255,0.12); border-radius:999px; color:#e4e4e7; font-size:11px; font-weight:bold; text-decoration:none; background:rgba(255,255,255,0.03);\">Twitter / X</a>\n" +
            "    <a href=\"https://instagram.com\" style=\"display:inline-block; padding:8px 16px; margin:0 4px 6px 0; border:1px solid rgba(255,255,255,0.12); border-radius:999px; color:#e4e4e7; font-size:11px; font-weight:bold; text-decoration:none; background:rgba(255,255,255,0.03);\">Instagram</a>\n" +
            "  </div>\n";
    }

    private String brandFooter() {
        String siteLabel = frontendUrl.replaceFirst("^https?://", "").replaceFirst("/+$", "");
        return
            "  <div style=\"margin-top:34px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.06);\">\n" +
            "    <p style=\"color:#71717a; font-size:11px; line-height:1.7; margin:0 0 4px;\"><a href=\"" + frontendUrl + "\" style=\"color:#fbbf24; text-decoration:none;\">" + escapeHtml(siteLabel) + "</a> · hello@primenova.studio</p>\n" +
            "    <p style=\"color:#52525b; font-size:10px; line-height:1.6; margin:0;\">© " + Year.now().getValue() + " PrimeNova Studio. All rights reserved.</p>\n" +
            "  </div>\n";
    }

    /**
     * Escapes user-supplied values before interpolation into HTML templates.
     * Defense-in-depth on top of server-side sanitization — prevents broken
     * markup and HTML injection even if a value slips through.
     */
    private String escapeHtml(String input) {
        if (input == null) return "";
        return input
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#39;");
    }
}
