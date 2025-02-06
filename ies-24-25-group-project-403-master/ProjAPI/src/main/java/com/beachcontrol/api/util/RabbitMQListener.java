package com.beachcontrol.api.util;

import java.io.IOException;
import java.time.Instant;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import com.beachcontrol.api.config.RabbitMQConfig;
import com.beachcontrol.api.model.Beach.PolutantType;
import com.beachcontrol.api.model.Sensor.Sensor;
import com.beachcontrol.api.model.Sensor.SensorType;
import com.beachcontrol.api.service.SensorService;

@Component
public class RabbitMQListener {

    @Autowired
    private SensorService sensorService;
    private static final Logger logger = LoggerFactory.getLogger(RabbitMQListener.class);

    @Autowired
    private SensorWebSocketHandler webSocketHandler;

    // Create a single Gson instance with proper configuration
    private final Gson gson = new GsonBuilder()
            .registerTypeAdapter(Instant.class, new InstantTypeAdapter()) // Use the custom TypeAdapter
            .create();

    @RabbitListener(queues = RabbitMQConfig.QUEUE_BEACH)
    public void handleBeachMetricDataMessage(String message) {
        try {
            DTOSensorControl sensorData = gson.fromJson(message, DTOSensorControl.class);
            Optional<Sensor> sensor = sensorService.getSensorById(sensorData.getId());
            logger.info("Received message: {}", sensorData);

            if (sensor.isPresent()) {
                Sensor updatedSensor = sensor.get();
                if (sensorData.getDirection() != null) {
                    updatedSensor.setDirection(sensorData.getDirection());
                }
                if (sensorData.getPType() != null && sensorData.getValue() != null) {
                    int i = updatedSensor.getPolutantType().indexOf(sensorData.getPType());
                    Double[] polutants = updatedSensor.getPolutats();
                    polutants[i] = sensorData.getValue();
                    updatedSensor.setPolutats(polutants);
                    updatedSensor.getState().setLastChecked(sensorData.getTimestamp());
                    sensorService.updateSensor(updatedSensor);
                } else {
                    updatedSensor.setValue(sensorData.getValue());
                    updatedSensor.getState().setLastChecked(sensorData.getTimestamp());
                    String update = sensorService.updateSensor(updatedSensor);
                    webSocketHandler.broadcastSensorUpdate(
                            updatedSensor.getBeachId(),
                            updatedSensor.getType(),
                            updatedSensor.getValue());
                }
            }
        } catch (Exception e) {
            logger.error("Error processing message: " + e.getMessage());
        }
    }
}

// Add this custom TypeAdapter for Instant
class InstantTypeAdapter extends TypeAdapter<Instant> {
    @Override
    public void write(JsonWriter out, Instant value) throws IOException {
        out.value(value != null ? value.toString() : null);
    }

    @Override
    public Instant read(JsonReader in) throws IOException {
        String dateStr = in.nextString();
        return dateStr != null ? Instant.parse(dateStr) : null;
    }
}

class DTOSensorControl {
    private String id;
    private Double value;
    private SensorType type;
    private Instant timestamp;
    private String direction;
    private PolutantType pType;

    public DTOSensorControl(String id, Double value, SensorType type, String timestamp) {
        this.id = id;
        this.value = value;
        this.type = type;
        this.timestamp = Instant.parse(timestamp);
    }

    public DTOSensorControl(String id, Double value, SensorType type, String timestamp, String direction) {
        this.id = id;
        this.value = value;
        this.type = type;
        this.timestamp = Instant.parse(timestamp);
        this.direction = direction;
    }

    public DTOSensorControl(String id, Double value, SensorType type, String timestamp, PolutantType pType) {
        this.id = id;
        this.value = value;
        this.type = type;
        this.timestamp = Instant.parse(timestamp);
        this.pType = pType;
    }

    public DTOSensorControl() {
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Double getValue() {
        return this.value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public SensorType getType() {
        return this.type;
    }

    public void setType(SensorType type) {
        this.type = type;
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getDirection() {
        return this.direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public PolutantType getPType() {
        return this.pType;
    }

    public void setPType(PolutantType pType) {
        this.pType = pType;
    }

    @Override
    public String toString() {
        return "{" +
                " id='" + getId() + "'" +
                ", value='" + getValue() + "'" +
                ", type='" + getType() + "'" +
                ", timestamp='" + getTimestamp() + "'" +
                ", direction='" + getDirection() + "'" +
                ", pType='" + getPType() + "'" +
                "}";
    }

}