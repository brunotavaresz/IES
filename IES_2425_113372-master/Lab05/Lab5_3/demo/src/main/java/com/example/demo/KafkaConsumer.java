package com.example.demo;

import com.example.demo.Message;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaConsumer {

    @KafkaListener(topics = "lab05_113372", groupId = "lab05_group")
    public void listen(Message message) {
        System.out.println("Received Message: nMec=" + message.getnMec() + 
                           ", generatedNumber=" + message.getGeneratedNumber() + 
                           ", type=" + message.getType());
    }
}
