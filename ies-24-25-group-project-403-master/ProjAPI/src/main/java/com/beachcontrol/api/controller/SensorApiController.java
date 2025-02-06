package com.beachcontrol.api.controller;

import com.beachcontrol.api.service.BeachService;
import com.beachcontrol.api.service.RabbitMQSender;
import com.beachcontrol.api.service.SensorService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import com.beachcontrol.api.model.Sensor.SensorType;
import com.beachcontrol.api.model.Sensor.Sensor;
import com.beachcontrol.api.exception.ResourceNotFoundException;
import com.beachcontrol.api.exception.InvalidParameterException;
import com.beachcontrol.api.exception.ResorceConflitException;
import com.beachcontrol.api.exception.Response;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Sensor Controller", description = "Controller for sensor operations")
@RequestMapping("/apiV1")
@RestController
@CrossOrigin(origins = "*")
public class SensorApiController {

    @Autowired
    private SensorService sensorService;
    @Autowired
    private BeachService beachService;
    @Autowired
    private static final Logger logger = LoggerFactory.getLogger(SensorApiController.class);
    @Autowired
    private RabbitMQSender rabbitMQSender;

    public SensorApiController() {
    }

    @Operation(summary = "Get sensors with optional filters")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved sensors"),
            @ApiResponse(responseCode = "404", description = "Beach or sensor type not found"),
            @ApiResponse(responseCode = "400", description = "Invalid parameters provided")
    })
    @GetMapping("/sensors")
    public ResponseEntity<Response<List<Sensor>>> getSensors(
            @RequestParam(required = false) String id,
            @RequestParam(required = false) String beachId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean available) {
        try {
            // Validate parameters
            if (beachId != null && !beachService.getBeachById(beachId).isPresent()) {
                throw new ResourceNotFoundException("Beach not found with id: " + beachId);
            }

            SensorType sensorType = null;
            if (type != null) {
                try {
                    sensorType = SensorType.valueOf(type.toUpperCase());
                } catch (IllegalArgumentException e) {
                    throw new InvalidParameterException("Invalid sensor type: " + type);
                }
            }

            // Get sensors based on filters
            List<Sensor> sensors;

            if (id != null) {
                Sensor sensor = sensorService.getSensorById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Sensor not found with id: " + id));
                Response<List<Sensor>> response = new Response<List<Sensor>>(HttpStatus.OK, "Sensor found",
                        List.of(sensor));
                return ResponseEntity.ok(response);
            }

            if (beachId != null && type != null && available != null) {
                final SensorType finalSensorType = sensorType;
                sensors = sensorService.getAllSensors();
                sensors.removeIf(
                        sensor -> !sensor.getBeachId().equals(beachId) || !sensor.getType().equals(finalSensorType)
                                || sensor.getState().getState() != true);
            } else if (beachId != null && type != null) {
                final SensorType finalSensorType = sensorType;
                sensors = sensorService.getSensorsByBeachId(beachId);
                sensors.removeIf(sensor -> !sensor.getType().equals(finalSensorType));
            } else if (type != null && available != null) {
                sensors = sensorService.getSensorsByType(sensorType);
                sensors.removeIf(sensor -> sensor.getState().getState() != available);
            } else if (available != null && beachId != null) {
                sensors = available ? sensorService.getAvaliableSensors() : sensorService.getNotAvailableSensors();
                sensors.removeIf(sensor -> !sensor.getBeachId().equals(beachId));
            } else if (beachId != null) {
                sensors = sensorService.getSensorsByBeachId(beachId);
            } else if (type != null) {
                sensors = sensorService.getSensorsByType(sensorType);

            } else if (available != null) {
                sensors = available ? sensorService.getAvaliableSensors() : sensorService.getNotAvailableSensors();
            }

            else {
                sensors = sensorService.getAllSensors();
            }
            Response<List<Sensor>> response = new Response<List<Sensor>>(HttpStatus.OK, "Sensors found", sensors);
            return ResponseEntity.ok(response);

        } catch (ResourceNotFoundException | InvalidParameterException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving sensors", e);
        }
    }

    @Operation(summary = "Create a sensor", security = {
            @SecurityRequirement(name = "bearer-jwt", scopes = { "admin" }),
    })
    @PostMapping("/admin/sensor/create")
    public ResponseEntity<Response<Sensor>> createSensor(@Valid @RequestBody Sensor sensor) {
        // Verificar se já existe um sensor do mesmo tipo na mesma praia
        if (sensorService.getSensorsByBeachId(sensor.getBeachId()).stream()
                .anyMatch(s -> s.getType().equals(sensor.getType()))) {
            throw new ResorceConflitException("Sensor with the same type already exists in the same beach");
        }

        // Criar o sensor
        logger.info("Creating sensor: " + sensor);
        Sensor createdSensor = sensorService.createSensor(sensor);
        if (createdSensor.getState().getState() == true) {
            rabbitMQSender.sendMessage(createdSensor.getSensorId(), "start", createdSensor.getType().toString());
        }
        // Retornar os dados do sensor criado na resposta
        Response<Sensor> response = new Response<>(HttpStatus.CREATED, "Sensor created", createdSensor);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Update a sensor", security = {
            @SecurityRequirement(name = "bearer-jwt", scopes = { "admin" }),
    })
    @PutMapping("/admin/sensor/update/{id}")
    public ResponseEntity<Response<?>> updateSensor(@PathVariable String id, @Valid @RequestBody Sensor sensor) {
        if (sensorService.getSensorById(id).isEmpty())
            throw new ResourceNotFoundException("Sensor not found");
        sensorService.updateSensor(id, sensor);
        return ResponseEntity.ok(new Response<>(HttpStatus.OK, "Sensor updated", null));
    }

    @Operation(summary = "Delete a sensor", security = {
            @SecurityRequirement(name = "bearer-jwt", scopes = { "admin" }),
    })
    @DeleteMapping("/admin/sensor/delete/{id}")
    public ResponseEntity<Response<?>> deleteSensor(@PathVariable String id) {
        if (sensorService.getSensorById(id).isEmpty())
            throw new ResourceNotFoundException("Sensor not found");

        rabbitMQSender.sendMessage(id, "stop", sensorService.getSensorById(id).get().getType().toString());
        sensorService.deleteSensor(id);
        Response<?> response = new Response<>(HttpStatus.OK, "Sensor deleted", null);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Update a sensor's status", security = {
            @SecurityRequirement(name = "bearer-jwt", scopes = { "admin" }),
    })
    @PutMapping("/admin/sensor/update-status/{id}")
    public ResponseEntity<Response<?>> updateSensorStatus(@PathVariable String id, @RequestBody Sensor sensor) {
        if (sensorService.getSensorById(id).isEmpty())
            throw new ResourceNotFoundException("Sensor not found");

        // Verifica se o novo status é válido
        if (sensor.getState() == null || sensor.getState().getState() == null) {
            throw new InvalidParameterException("Invalid status value.");
        }
        // Enviar mensagem para o RabbitMQ
        Sensor sensorToSave = sensorService.getSensorById(id).get();
        if (sensorToSave.getState().getState() == false) {
            rabbitMQSender.sendMessage(sensorToSave.getSensorId(), "start", sensorToSave.getType().toString());
        } else {
            rabbitMQSender.sendMessage(sensorToSave.getSensorId(), "stop", sensorToSave.getType().toString());
        }
        sensorService.updateSensorStatus(id, sensor.getState().getState());
        return ResponseEntity.ok(new Response<>(HttpStatus.OK, "Sensor status updated", null));
    }
}
