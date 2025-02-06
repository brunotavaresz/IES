package com.beachcontrol.api.config;
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    // Configuração para o envio de mensagens para o RabbitMQ de Ativação/Desativação de Sensores
    public static final String QUEUE = "sensor-control";
    public static final String EXCHANGE = "sensor-control-exchange";
    public static final String ROUTING_KEY = "sensor-control-routing";

    // Configuração para o receber mensagens para o RabbitMQ de Dados da praia
    public static final String QUEUE_BEACH = "BeachControl";
    public static final String EXCHANGE_BEACH = "BeachControl-data-exchange";
    public static final String ROUTING_KEY_BEACH = "BeachControl-data-routing";

    @Bean
    public Queue queue() {
        return new Queue(QUEUE, true); // Durable queue
    }

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(EXCHANGE);
    }

    @Bean
    public Binding binding(Queue queue, DirectExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY);
    }

    @Bean
    public Queue queueBeach() {
        return new Queue(QUEUE_BEACH, true); // Durable queue
    }

    @Bean
    public DirectExchange exchangeBeach() {
        return new DirectExchange(EXCHANGE_BEACH);
    }

    @Bean
    public Binding bindingBeach(Queue queueBeach, DirectExchange exchangeBeach) {
        return BindingBuilder.bind(queueBeach).to(exchangeBeach).with(ROUTING_KEY_BEACH);
    }

}

