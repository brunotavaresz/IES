package com.beachcontrol.api.model.User;

import com.beachcontrol.api.model.Beach.Warning;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

public class Lifeguard extends User {

    @NotBlank(message = "Assigned beach is required")
    @Pattern(regexp = "^[a-zA-Z0-9-]+$", message = "Invalid beach ID format")
    @Field("assign_beach")
    private String Assigned_beach;

    public Lifeguard() {
        super();
    }

    public Lifeguard(String name, String email, String password, String role, String Assigned_beach) {
        super(name, email, password, "LIFEGUARD"); // Force role to be LIFEGUARD
        this.Assigned_beach = Assigned_beach;
    }
    

    public String getAssigned_beach() {
        return this.Assigned_beach;
    }

    public void setAssigned_beach(String Assigned_beach) {
        this.Assigned_beach = Assigned_beach;
    }

}