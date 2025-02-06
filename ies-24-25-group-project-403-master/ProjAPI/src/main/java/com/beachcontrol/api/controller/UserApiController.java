package com.beachcontrol.api.controller;

import java.util.*;

import com.beachcontrol.api.jwt.JwtUtil;
import com.beachcontrol.api.model.Auth.AuthRequest;
import com.beachcontrol.api.model.Auth.AuthResponse;
import com.beachcontrol.api.model.Beach.Beach;
import com.beachcontrol.api.model.User.*;
import com.beachcontrol.api.repository.BeachRepository;
import com.beachcontrol.api.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import com.beachcontrol.api.service.BeachService;
import com.beachcontrol.api.exception.InvalidParameterException;
import com.beachcontrol.api.exception.ResourceNotFoundException;
import com.beachcontrol.api.exception.Response;
import com.beachcontrol.api.repository.UserRepository;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/apiV1")
@Tag(name = "User Controller", description = "Controller for user operations")
@RestController
@CrossOrigin(origins = "*")
public class UserApiController {
    @Autowired
    private UserService userService;
    @Autowired
    private BeachService beachService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private static final Logger logger = LoggerFactory.getLogger(UserApiController.class);
    @Autowired
    private BeachRepository beachRepository;

    public UserApiController() {
    }

    @Operation(summary = "Get user by email or id")
    @GetMapping("/users")
    public ResponseEntity<Response<List<User>>> getUser(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String id) {
        try {
            // If both parameters are null, return all users
            if (email == null && id == null) {
                List<User> users = userService.getAllUsers();
                if (users.isEmpty()) {
                    throw new ResourceNotFoundException("No users found");
                }
                return ResponseEntity.ok(new Response<>(HttpStatus.OK, "Users found", users));
            }

            // If both parameters are provided, throw an error
            if (email != null && id != null) {
                throw new InvalidParameterException("Provide either email or id, not both");
            }

            // Fetch user by email or id
            User user;
            if (email != null) {
                user = userService.getUserByEmail(email);
                if (user == null) {
                    throw new ResourceNotFoundException("User not found with email: " + email);
                }
            } else {
                user = userService.getUserById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
            }

            return ResponseEntity.ok(new Response<>(HttpStatus.OK, "User found", List.of(user)));

        } catch (ResourceNotFoundException | InvalidParameterException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving user", e);
        }
    }

    @Operation(summary = "Get all users")
    @GetMapping("/users/all")
    public ResponseEntity<Response<List<User>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        Response<List<User>> response = new Response<>(HttpStatus.OK, "Users found", users);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Login a user")
    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authenticationRequest) {
        try {

            User user = userService.getUserByEmail(authenticationRequest.getEmail());

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse(null, "Invalid email or password"));
            }

            if (!passwordEncoder.matches(authenticationRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse(null, "Invalid email or password"));
            }

            String jwt = jwtUtil.generateToken(user.getEmail(), user.getRole()); // Gerar o token JWT usando o email

            return ResponseEntity.ok(new AuthResponse(jwt, null)); // Retorna o token JWT
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, "Invalid email or password: " + e.getMessage()));
        }
    }




    @Operation(summary = "Get user's favorites list")
    @GetMapping("/users/favorites/{id}")
    public List<String> getFavoriteList(@PathVariable String id) {
        if (userService.isBeachgoer(id)) {
            return userService.getFavorites(id);
        } else {
            throw new ResourceNotFoundException("User not found");
        }
    }

    // TODO: so o user pode adicionar praias aos seus favoritos
    @Operation(summary = "Add a beach to a user's favorites list")
    @PutMapping("/users/favorites/add/{id}")
    public ResponseEntity<Response<?>> addFavoriteBeach(@PathVariable String id, @Valid @RequestBody String beachId) {
        if (!beachService.existsById(beachId)) {
            throw new ResourceNotFoundException("Beach not found");
        }
        if (userService.isBeachgoer(id)) {
            userService.addFavorite(id, beachId);
            Response<?> response = new Response<>(HttpStatus.CREATED, "Beach added to favorites", null);
            return ResponseEntity.ok(response);
        } else {
            throw new ResourceNotFoundException("User not found");
        }
    }

    @Operation(summary = "Remove a beach from a user's favorites list")
    @DeleteMapping("/users/favorites/remove/{id}")
    public ResponseEntity<Response<?>> removeFavoriteBeach(@PathVariable String id, @RequestBody String beachId) {
        if (!beachService.existsById(beachId)) {
            throw new ResourceNotFoundException("Beach not found");
        }
        if (userService.isBeachgoer(id)) {
            userService.removeFavorite(id, beachId);
            Response<?> response = new Response<>(HttpStatus.ACCEPTED, "Beach removed from favorites", null);
            return ResponseEntity.ok(response);
        } else {
            throw new ResourceNotFoundException("User not found");
        }
    }

    @Operation(summary = "Add a report wth userID")
    @PutMapping("/users/addReport")
    public ResponseEntity<Response<?>> addReport(@Valid @RequestBody Report report) {
        report.setReportId(UUID.randomUUID().toString());
        userService.addReport(report);
        Response<?> response = new Response<>(HttpStatus.CREATED, "Report added", null);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Remove a report", security = {
            @SecurityRequirement(name = "bearer-jwt", scopes = {"admin"}),
    })
    @DeleteMapping("/admin/removeReport")
    public ResponseEntity<Response<?>> removeReport(@RequestBody Map<String, String> request) {
        String reportId = request.get("reportId");

        // Log apenas com o reportId
        logger.info(reportId);  // Agora apenas o valor do reportId serÃ¡ registrado no log.

        if (!userService.existsReport(reportId)) {
            throw new ResourceNotFoundException("Report not found");
        }

        userService.removeReport(reportId);
        Response<?> response = new Response<>(HttpStatus.ACCEPTED, "Report removed", null);
        return ResponseEntity.ok(response);
    }


    @Operation(summary = "Get all reports", security = {
            @SecurityRequirement(name = "bearer-jwt", scopes = {"admin"}),
    })
    // DONE: so o admin pode ver os reports
    @GetMapping("/admin/getReports")
    public ResponseEntity<Response<List<Report>>> getReports() {
        List<Report> reports = userService.getReports();
        Response<List<Report>> response = new Response<>(HttpStatus.OK, "Reports found", reports);
        return ResponseEntity.ok(response);

    }

    @Operation(summary = "Register a user")
    @PostMapping("/auth/register")
        public ResponseEntity<AuthResponse> register(@Valid @RequestBody User user, @RequestParam(required = false) String selectedBeach) {
        try {
            // Check if email already exists
            if (userRepository.findByEmail(user.getEmail()) != null) {
                throw new InvalidParameterException("Email already in use");
            }

            logger.error("Received user: " + user);
            logger.error("Received selectedBeach from RequestParam: " + selectedBeach);


            // Assign default role if none is provided
            if (user.getRole() == null) {
                user.setRole("beachgoer");
            }

            // Encrypt password
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser;

            // Save user based on their role
            switch (user.getRole()) {
                case "beachgoer":
                    Beachgoer beachgoer = new Beachgoer(user.getName(), user.getEmail(), user.getPassword(), user.getRole(), null);
                    savedUser = userRepository.save(beachgoer);
                    break;
                case "lifeguard":
                    logger.error("Creating a lifeguard");
                    Lifeguard lifeguard = new Lifeguard(user.getName(), user.getEmail(), user.getPassword(), user.getRole(), null);
                    // verify if the beach is not null and exists by id
                    if (selectedBeach != null) {
                        Beach beach = beachRepository.findById(selectedBeach).orElseThrow(() -> new ResourceNotFoundException("Beach not found"));
                        logger.error("Beach found:" + beach.getName());
                        lifeguard.setAssigned_beach(selectedBeach);
                    }
                    savedUser = userRepository.save(lifeguard);
                    break;
                case "admin":
                    Admin admin = new Admin(user.getName(), user.getEmail(), user.getPassword(), user.getRole(), null);
                    savedUser = userRepository.save(admin);
                    break;
                default:
                    throw new InvalidParameterException("Invalid role");
            }



            // Generate JWT for the newly created user
            String jwt = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole());

            // Return a successful response with JWT
            return ResponseEntity.ok(new AuthResponse(jwt, null));
        } catch (Exception e) {
            // Handle exceptions and return an error response
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(null, "Registration failed: " + e.getMessage()));
        }
    }



    @Operation(summary = "Get all lifeguards", security = {
            @SecurityRequirement(name = "bearer-jwt", scopes = {"admin"}),
    })
    // DONE: so o admin pode ver os lifeguards
    @GetMapping("/admin/lifeguards")
    public ResponseEntity<Response<List<Lifeguard>>> getLifeguards() {
        List<User> users = userService.getUsersByRole("LIFEGUARD");
        List<Lifeguard> lifeguards = (List<Lifeguard>) (List<?>) users;
        Response<List<Lifeguard>> response = new Response<>(HttpStatus.OK, "Lifeguards found", lifeguards);
        return ResponseEntity.ok(response);

    }

    @Operation(summary = "Edit the assigned beach to a lifeguard", security = {
            @SecurityRequirement(name = "bearer-jwt", scopes = {"admin"}),
    })
    @PutMapping("/admin/{lifeguardId}/editAssignedBeach/{beachId}")
    public ResponseEntity<Response<?>> editAssignedBeach(
            @PathVariable String lifeguardId,
            @PathVariable String beachId) {



        User user = userRepository.findById(lifeguardId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!Objects.equals(beachId, "0")){Beach beach = beachRepository.findById(beachId).orElseThrow(() -> new ResourceNotFoundException("Beach not found"));}


        userService.setAssignedBeach(lifeguardId, beachId);

        Response<?> response = new Response<>(HttpStatus.ACCEPTED, "Assigned beach updated", null);
        return ResponseEntity.ok(response);
    }

}