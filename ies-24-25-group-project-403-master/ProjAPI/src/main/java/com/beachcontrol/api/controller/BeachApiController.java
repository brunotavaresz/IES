package com.beachcontrol.api.controller;

import java.time.Instant;
import java.util.List;

import com.beachcontrol.api.service.BeachService;
import com.beachcontrol.api.model.Beach.Beach;
import com.beachcontrol.api.model.Beach.Flag_Type;
import com.beachcontrol.api.model.Beach.Location;
import com.beachcontrol.api.model.Beach.Warning;
import com.beachcontrol.api.model.User.Lifeguard;
import com.beachcontrol.api.model.User.Report;
import com.beachcontrol.api.service.UserService;
import com.beachcontrol.api.exception.ResourceNotFoundException;
import com.beachcontrol.api.exception.ResorceConflitException;
import com.beachcontrol.api.exception.BeachNotFoundException;
import com.beachcontrol.api.exception.Response;

import io.jsonwebtoken.lang.Collections;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import com.beachcontrol.api.model.Beach.BeachMetric;

import org.apache.commons.lang3.ObjectUtils.Null;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/apiV1")
@Tag(name = "Beach Controller", description = "Controller for beach operations")
@CrossOrigin(origins = "*")
public class BeachApiController {

    @Autowired
    private BeachService beachService;
    @Autowired
    private UserService userService;
    @Autowired
    private static final Logger logger = LoggerFactory.getLogger(UserApiController.class);

    public BeachApiController() {
    }

    @Operation(summary = "Get beaches with optional filters")
    @GetMapping("/beaches")
    public ResponseEntity<Response<List<Beach>>> getBeaches(
            @RequestParam(required = false) @Min(value = 0, message = "ID must be positive") String id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Instant startDate,
            @RequestParam(required = false) Instant endDate) {

        if (id == null && name == null && startDate == null && endDate == null) {
            List<Beach> beaches = beachService.getAllBeaches();
            Response<List<Beach>> response = new Response<>(HttpStatus.OK, "Beaches found", beaches);
            return ResponseEntity.ok(response);
        }

        if (id != null) {
            Instant start = (startDate != null) ? startDate : Instant.EPOCH; // Beginning of time
            Instant end = (endDate != null) ? endDate : Instant.now(); // Up to the current time

            Beach beach = beachService.getBeachMetricsDate(id, start, end);
            if (beach == null) {
                throw new BeachNotFoundException("Beach not found with id: " + id);
            }
            Response<List<Beach>> response = new Response<>(HttpStatus.OK, "Beach found", List.of(beach));
            return ResponseEntity.ok(response);
        }

        if (name != null) {
            List<Beach> beaches = beachService.getBeachByName(name);
            if (beaches.isEmpty()) {
                throw new BeachNotFoundException("Beach not found with name: " + name);
            }
            Response<List<Beach>> response = new Response<>(HttpStatus.OK, "Beach found", beaches);
            return ResponseEntity.ok(response);
        }
        throw new ResourceNotFoundException("No beaches found with the provided parameters");
    }

    @Operation(summary = "Update a beach information", security = {
            @SecurityRequirement(name = "bearer-jwt") })
    // TODO: criar um report com a alteração
    @PutMapping("/admin/beach/{id}")
    public ResponseEntity<Response<?>> updateBeach(@PathVariable String id, @Valid @RequestBody Beach beach) {
        if (!beachService.getBeachById(id).isPresent()) {
            throw new BeachNotFoundException("Beach not found with id: " + id);
        }
        beachService.updateBeach(id, beach);
        Response<?> response = new Response<>(HttpStatus.OK, "Beach updated", null);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete a beach", security = {
            @SecurityRequirement(name = "bearer-jwt") })
    // TODO: criar um report com a alteração
    @DeleteMapping("/admin/beach/{id}")
    public ResponseEntity<Response<?>> deleteBeach(@PathVariable String id) {

        if (!beachService.getBeachById(id).isPresent()) {
            throw new BeachNotFoundException("Beach not found with id: " + id);
        }
        logger.info("Deleting beach with id: " + id);
        beachService.deleteBeach(id);
        Response<?> response = new Response<>(HttpStatus.OK, "Beach deleted", null);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Create a new beach", security = { @SecurityRequirement(name = "bearer-jwt") })
    @PostMapping("/admin/beach/create")
    public ResponseEntity<Response<?>> createBeach(@Valid @RequestBody Beach beach) {
        if (beachService.existsByName(beach.getName())) {
            throw new ResorceConflitException("Beach with the same name already exists");
        }
        beachService.createBeach(beach);
        Response<?> response = new Response<>(HttpStatus.CREATED, "Beach created", null);
        return ResponseEntity.ok(response);
    }

    // TODO: criar um report com a alteração
    // TODO : so o lifeguard da praia pode adicionar um warning
    @Operation(summary = "Add a warning to a beachId", security = {
            @SecurityRequirement(name = "bearer-jwt", scopes = { "lifeguard", "admin" }),
    })
    @PostMapping("/lifeguard/beach/warning/{beachId}")
    public ResponseEntity<Response<?>> addWarning(@PathVariable String beachId, @Valid @RequestBody Warning warning) {
        if (beachService.getBeachById(beachId).isEmpty()) {
            throw new BeachNotFoundException("Beach not found");
        }
        beachService.updateBeachWarning(beachId, warning);

        Response<?> response = new Response<>(HttpStatus.CREATED, "Warning added", null);

        // Return CREATED status instead of OK for POST operations
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // TODO: criar um report com a alteração
    // TODO: lifeguard so pode eliminar reports que ele criou
    @Operation(summary = "Remove a warning", security = {
            @SecurityRequirement(name = "bearer-jwt", scopes = { "lifeguard", "admin" }) })

    @DeleteMapping("/lifeguard/beach/warning/{beachId}")
    public ResponseEntity<Response<?>> removeWarning(@PathVariable String beachId,
            @Valid @RequestBody Warning warning) {
        if (beachService.getBeachById(beachId).isEmpty()) {
            throw new BeachNotFoundException("Beach not found");
        }
        beachService.removeBeachWarning(beachId, warning);
        Response<?> response = new Response<>(HttpStatus.OK, "Warning removed", null);
        return ResponseEntity.ok(response);

    }

    // TODO: criar um report com a alteração
    // TODO: so o lifeguard da praia pode mudar o estado da bandeira
    @Operation(summary = "Set a flag to a beach", security = {
            @SecurityRequirement(name = "bearer-jwt") })

    @PutMapping("/lifeguard/beach/user/{lifeguardId}/flag/{id}")
    public ResponseEntity<Response<?>> setBeachFlag(@PathVariable String id, @PathVariable String lifeguardId,
            @RequestBody Flag_Type flag) {

        if (beachService.getBeachById(id).isEmpty()) {

            throw new BeachNotFoundException("Beach not found");
        }
        // if (!userService.getAssignedBeach(lifeguardId).equals(id)) {
        // throw new ResourceNotFoundException("Lifeguard not assigned to this beach");
        // }
        beachService.setBeachFlag(id, flag);
        Response<?> response = new Response<>(HttpStatus.OK, "Flag updated", null);
        return ResponseEntity.ok(response);
    }

    // TODO: so os sensores tem acesso a isto
    @PutMapping("/beach/metric/{id}")
    public ResponseEntity<Response<?>> updateBeachMetric(@PathVariable String id, @RequestBody BeachMetric metric) {
        if (!beachService.getBeachById(id).isPresent()) {
            throw new ResourceNotFoundException("Beach not found");
        }
        beachService.updateBeachMetric(id, metric);
        Response<?> response = new Response<>(HttpStatus.OK, "Metric updated", null);
        return ResponseEntity.ok(response);
    }

}
