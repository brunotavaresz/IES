// package com.example.demo;

// import org.springframework.kafka.annotation.KafkaListener;
// import org.springframework.stereotype.Component;

// @Component
// public class KafkaConsumerListener {

//     @KafkaListener(topics = "${spring.kafka.topic}", groupId = "${spring.kafka.consumer.group-id}")
//     public void listen(String message) {
//         System.out.println("Mensagem recebida: " + message);
//     }
// }
