package com.beachcontrol.api.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.beachcontrol.api.config.RabbitMQConfig;

@Service
public class RabbitMQSender {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendMessage(String sensorId, String action, String sensorType) {
        String message = String.format("{\"sensorId\": \"%s\", \"action\": \"%s\", \"type\": \"%s\"}", sensorId,
                action, sensorType);
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.ROUTING_KEY, message);
    }
}
