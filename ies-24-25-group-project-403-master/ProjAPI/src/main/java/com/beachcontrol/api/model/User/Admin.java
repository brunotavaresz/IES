package com.beachcontrol.api.model.User;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class Admin extends User {

    @Valid
    @NotNull(message = "Reports list cannot be null")
    private List<Report> reports = new ArrayList<>();

    public Admin() {
        super();
    }

    public Admin(String name, String email, String password, String role, List<Report> reports) {
        super(name, email, password, "ADMIN"); // Force role to be ADMIN
        this.reports = reports != null ? reports : new ArrayList<>();
    }

    public void addReport(Report report) {
        if (this.reports == null) {
            this.reports = new ArrayList<>();
        }
        this.reports.add(report);
    }

    public List<Report> getReports() {
        return this.reports;
    }

    public void setReports(List<Report> reports) {
        this.reports = reports;
    }
}