package com.beachcontrol.api.config;

import com.beachcontrol.api.model.User.Admin;
import com.beachcontrol.api.model.User.User;
import com.beachcontrol.api.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Configuration
public class AppConfig {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void createInitialAdmin() {
        // Check if there's already an admin in the system
        Optional<User> existingAdmin = userRepository.findByRole("ADMIN").stream().findFirst();

        if (existingAdmin.isEmpty()) {
            // No admin exists, create one
            User admin = new Admin("Admin User", "admin@example.com", passwordEncoder.encode("adminpassword"),
                    "admin", null);
            userRepository.save(admin);
            System.out.println("First admin created");
        }
    }
}
