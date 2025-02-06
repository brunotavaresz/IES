package com.beachcontrol.api.service;

import com.beachcontrol.api.exception.ResourceNotFoundException;
import com.beachcontrol.api.model.User.User;
import com.beachcontrol.api.repository.UserRepository;
import com.beachcontrol.api.model.User.Beachgoer;
import com.beachcontrol.api.controller.UserApiController;
import com.beachcontrol.api.model.User.Admin;
import com.beachcontrol.api.model.User.Report;
import com.beachcontrol.api.model.User.Lifeguard;

import java.util.ArrayList;
import java.util.Date;

import com.mongodb.client.result.UpdateResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private BeachService beachService;

    public void addFavorite(String id, String beachId) {
        // First, check if the beach exists
        if (!beachService.existsById(beachId)) {
            throw new ResourceNotFoundException("Beach not found");
        }

        // Verify the user is a Beachgoer
        if (!isBeachgoer(id)) {
            throw new ResourceNotFoundException("User not found");
        }

        // Use MongoDB's update operation to add to favorites
        Query query = new Query(Criteria.where("_id").is(id));
        Update update = new Update().addToSet("Favorites", beachId);

        UpdateResult result = mongoTemplate.updateFirst(
                query,
                update,
                Beachgoer.class
        );

        if (result.getModifiedCount() == 0) {
            // This could happen if the user is already a Beachgoer but the update failed
            throw new RuntimeException("Failed to add beach to favorites");
        }
    }

    public Admin getAdmin() {
        List<User> users = userRepository.findByRole("ADMIN");
        if (users.size() > 0) {
            return (Admin) users.get(0);
        }
        return null;
    }

    public List<String> getFavorites(String id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent() && userOptional.get() instanceof Beachgoer) {
            Beachgoer beachgoer = (Beachgoer) userOptional.get();
            return beachgoer.getFavorites();
        }
        return null;
    }

    public void removeFavorite(String id, String beachId) {
        // Verify beach exists
        if (!beachService.existsById(beachId)) {
            throw new ResourceNotFoundException("Beach not found");
        }

        // Verify user is a Beachgoer
        if (!isBeachgoer(id)) {
            throw new ResourceNotFoundException("User not found or not a Beachgoer");
        }

        // Create query to find user by ID
        Query query = new Query(Criteria.where("_id").is(id));

        // Create update operation to remove beach from favorites
        Update update = new Update().pull("Favorites", beachId);

        // Perform the update
        UpdateResult result = mongoTemplate.updateFirst(
                query,
                update,
                Beachgoer.class
        );

        // Check if update was successful
        if (result.getModifiedCount() == 0) {
            throw new RuntimeException("Failed to remove beach from favorites");
        }
    }

    public boolean existsById(String id) {
        return userRepository.existsById(id);
    }

    public void addReport(Report report) {
        // Verifique se o campo 'beachName' está preenchido corretamente
        if (report.getBeachName() == null || report.getBeachName().isEmpty()) {
            throw new IllegalArgumentException("Beach name is required");
        }
    
        // Define the query to locate the Admin document by its ID
        String adminId = getAdmin().getUserid();
        Query query = new Query(Criteria.where("_id").is(adminId));
    
        // Define the update operation to add a report to the reports array
        Update update = new Update().push("reports", report);
    
        // Execute the update operation
        mongoTemplate.updateFirst(query, update, User.class);
    
        logger.info("Report added to admin with ID: {}", adminId);
    }
    

    public List<Report> getReports() {
        Admin admin = getAdmin();
        return admin.getReports();
    }

    public void removeReport(String reportId) {
        // Define the query to locate the Admin document by its ID
        String adminId = getAdmin().getUserid();
        Query query = new Query(Criteria.where("_id").is(adminId));
    
        // Define the update operation to remove a report from the reports array
        Update update = new Update().pull("reports", new Query(Criteria.where("reportId").is(reportId)));
    
        // Execute the update operation to remove the report from the array
        mongoTemplate.updateFirst(query, update, User.class);
    
        logger.info("Report with ID: {} removed from admin with ID: {}", reportId, adminId);
    }
    
    public void updateUser(String id, User user) {
        userRepository.save(user);
    }

    public String getAssignedBeach(String id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent() && userOptional.get() instanceof Beachgoer) {
            return ((Lifeguard) userOptional.get()).getAssigned_beach();
        }
        return null;
    }

    public void setAssignedBeach(String id, String beachId) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent() && userOptional.get() instanceof Lifeguard) {
            Query query = new Query(Criteria.where("_id").is(id));

            // If beachId is "0", clear the assign_beach array
            if (beachId.equals("0")) {
                Update update = new Update().set("assign_beach", new ArrayList<>());
                mongoTemplate.updateFirst(query, update, User.class);
                return;
            }

            // Verify if the beach exists
            if (!beachService.existsById(beachId)) {
                throw new ResourceNotFoundException("Beach not found");
            }

            // Clear existing assigned beaches before assigning a new one
            Update clearUpdate = new Update().set("assign_beach", new ArrayList<>());
            mongoTemplate.updateFirst(query, clearUpdate, User.class);

            // Assign the new beach
            Update assignUpdate = new Update().push("assign_beach", beachId);
            mongoTemplate.updateFirst(query, assignUpdate, User.class);
        }
    }


    public boolean existsReport(String id) {
        Admin admin = getAdmin();
        return admin.getReports().stream().anyMatch(report -> report.getReportId().equals(id));
    }

    public boolean isLifeguard(String id) {
        Optional<User> userOptional = userRepository.findById(id);
        return userOptional.isPresent() && userOptional.get().getRole().equals("LIFEGUARD");
    }

    public boolean isAdmin(String id) {
        Optional<User> userOptional = userRepository.findById(id);
        return userOptional.isPresent() && userOptional.get().getRole().equals("ADMIN");
    }

    public boolean isBeachgoer(String id) {
        Optional<User> userOptional = userRepository.findById(id);
        return userOptional.isPresent() && userOptional.get() instanceof Beachgoer;
    }

    public List<User> getLifeguards() {
        return userRepository.findByRole("Lifeguard");
    }

    public List<User> getBeachgoers() {
        return userRepository.findByRole("Beachgoer");
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}