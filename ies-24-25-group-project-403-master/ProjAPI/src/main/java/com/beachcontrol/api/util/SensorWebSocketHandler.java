package com.beachcontrol.api.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.beachcontrol.api.model.Sensor.SensorType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.HashMap;
import java.util.Map;

@Component
public class SensorWebSocketHandler {
    private static final Logger logger = LoggerFactory.getLogger(SensorWebSocketHandler.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void broadcastSensorUpdate(String beachId, SensorType type, Double value) {
        try {
            Map<String, Object> sensorData = new HashMap<>();
            sensorData.put("type", type);
            sensorData.put("value", value);

            String destination = "/topic/sensors/" + beachId;
            logger.info("Sending update to {} with data: {}", destination, sensorData);

            messagingTemplate.convertAndSend(destination, sensorData);

        } catch (Exception e) {
            logger.error("Error broadcasting sensor update for beach {}: {}", beachId, e.getMessage());
        }
    }
}