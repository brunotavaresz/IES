package com.movies.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.movies.demo.repository.MovieRepository;
import com.movies.demo.repository.QuoteRepository;
import com.movies.demo.model.Movie;
import com.movies.demo.model.Quote;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;


@Service
public class KafkaConsumerService {
    private final Logger logger = LoggerFactory.getLogger(KafkaConsumerService.class);
    private final SimpMessagingTemplate messagingTemplate;
    private final MyService service;

    public KafkaConsumerService(SimpMessagingTemplate messagingTemplate, MyService service) {
        this.messagingTemplate = messagingTemplate;
        this.service = service;
    }

    @KafkaListener(topics = "quotes_topic", groupId = "quotes_group")
    public void consume(String message) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(message);

            // Create and save quote
            Quote quote = new Quote();
            quote.setQuote(jsonNode.get("quote").asText());
            quote.setCharacter(jsonNode.get("character").asText());

            Movie movie = service.getMovieById(jsonNode.get("movieId").asLong());
            quote.setMovie(movie);

            Quote savedQuote = service.saveQuote(quote);

            // Send the saved quote to WebSocket subscribers
            messagingTemplate.convertAndSend("/topic/quotes", savedQuote);

            logger.info(String.format("Quote consumed and broadcasted -> %s", savedQuote));
        } catch (Exception e) {
            logger.error("Error processing quote", e);
        }
    }
}