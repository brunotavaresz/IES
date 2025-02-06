package com.beachcontrol.api.model.User;

import org.springframework.data.annotation.Id;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.Date;

public class Report {

    private String reportId;

    @NotBlank(message = "User ID is required")
    @Pattern(regexp = "^[a-zA-Z0-9-]+$", message = "Invalid user ID format")
    private String UserID;

    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;

    @NotBlank(message = "Beach name is required")  // Validação para o nome da praia
    @Size(min = 2, max = 100, message = "Beach name must be between 2 and 100 characters")
    private String beachName;  // Novo campo para o nome da praia

    @NotNull(message = "Date is required")
    @PastOrPresent(message = "Date cannot be in the future")
    private Date date;

    public Report() {
    }

    public Report(String userID, String description, Date date, String title, String beachName) {
        this.UserID = userID;
        this.description = description;
        this.title = title;
        this.date = date != null ? date : new Date();
        this.beachName = beachName;
    }

    public String getReportId() {
        return this.reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUserID() {
        return this.UserID;
    }

    public void setUserID(String UserID) {
        this.UserID = UserID;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDate() {
        return this.date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getBeachName() {
        return this.beachName;
    }

    public void setBeachName(String beachName) {
        this.beachName = beachName;
    }
}
