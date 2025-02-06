package com.beachcontrol.api.model.Sensor;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import com.beachcontrol.api.model.Beach.PolutantType;
import com.fasterxml.jackson.annotation.JsonCreator;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

@Document(collection = "Sensor")
public class Sensor {

    @Id
    @Field(value = "_id", targetType = FieldType.STRING)
    private String sensorId;

    @NotNull(message = "Sensor type is required")
    private SensorType type;

    @NotNull(message = "Sensor value is required")
    @DecimalMin(value = "-1000.0", message = "Sensor value must be greater than -1000")
    @DecimalMax(value = "1000.0", message = "Sensor value must be less than 1000")
    private Double value;

    @Valid
    @NotNull(message = "Sensor state is required")
    private SensorStatus state;

    private String direction;

    private List<PolutantType> pType = List.of(PolutantType.values());

    private Double[] polutants = { 0.0, 0.0, 0.0, 0.0 };

    @NotBlank(message = "Beach ID is required")
    @Pattern(regexp = "^[a-zA-Z0-9-]+$", message = "Beach ID must contain only letters, numbers and hyphens")
    private String beachId;

    @JsonCreator
    public Sensor() {
    }

    public Sensor(String sensorId, SensorType type, Double value, SensorStatus state, String beachId) {
        super();
        this.sensorId = sensorId;
        this.type = type;
        this.value = value;
        this.state = state;
        this.beachId = beachId;
    }

    // Custom validation for sensor value based on type
    @AssertTrue(message = "Sensor value is out of range for the specified sensor type")
    private boolean isValidSensorValue() {
        if (type == null || value == null) {
            return true; // Let @NotNull handle this
        }

        switch (type) {
            case TEMPERATURE:
                return value >= -50.0 && value <= 50.0;
            case WATER_TEMPERATURE:
                return value >= -5.0 && value <= 40.0;
            case HUMIDITY:
                return value >= 0.0 && value <= 100.0;
            case CLOUD_COVERAGE:
                return value >= 0.0 && value <= 100.0;
            case UV_INDEX:
                return value >= 0.0 && value <= 12.0;
            case WIND:
                return value >= 0.0 && value <= 200.0;
            case PRECIPITATION:
                return value >= 0.0 && value <= 1000.0;
            case POLUTANT:
                return value >= 0.0; // No upper limit, but must be positive
            case WAVE_HEIGHT:
                return value >= 0.0 && value <= 30.0;
            case TIDE_HEIGHT:
                return value >= -5.0 && value <= 15.0;
            default:
                return true;
        }
    }

    // Getters and setters...

    public String getSensorId() {
        return this.sensorId;
    }

    public void setSensorId(String sensorId) {
        this.sensorId = sensorId;
    }

    public SensorType getType() {
        return this.type;
    }

    public void setType(SensorType type) {
        this.type = type;
    }

    public Double getValue() {
        return this.value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public SensorStatus getState() {
        return this.state;
    }

    public void setState(SensorStatus state) {
        this.state = state;
    }

    public String getBeachId() {
        return this.beachId;
    }

    public void setBeachId(String beachId) {
        this.beachId = beachId;
    }

    public String getDirection() {
        return this.direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public List<PolutantType> getPolutantType() {
        return this.pType;
    }

    public void setPolutantType(List<PolutantType> pType) {
        this.pType = pType;
    }

    public Double[] getPolutats() {
        return this.polutants;
    }

    public void setPolutats(Double[] polutants) {
        this.polutants = polutants;
    }

    @Override
    public String toString() {
        return "Sensor{" +
                "sensorId='" + sensorId + '\'' +
                ", type='" + type + '\'' +
                ", value=" + value +
                ", state=" + state +
                ", beachId=" + beachId +
                '}';
    }
}
