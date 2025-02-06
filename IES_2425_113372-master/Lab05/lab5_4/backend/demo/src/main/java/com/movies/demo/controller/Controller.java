package com.movies.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import com.movies.demo.service.MyService;
import com.movies.demo.model.Movie;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import com.movies.demo.model.Quote;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
public class Controller {
    @Autowired
    private MyService service;

    @GetMapping("/movies")
    public List<Movie> getMovies() {
        return service.getMovies();
    }

    @GetMapping("/movies/{id}")
    public Movie getMovieById(@PathVariable long id) {
        return service.getMovieById(id);
    }

    @GetMapping("/movies/title/{title}")
    public Movie getMovieByTitle(@PathVariable String title) {
        return service.getMovieByTitle(title);
    }

    @PostMapping("/movies/save")
    public Movie saveMovie(@RequestBody Movie movie) {
        return service.saveMovie(movie);
    }

    @GetMapping("/quotes")
    public List<Quote> getQuotes() {
        return service.getQuotes();
    }

    @GetMapping("/quotes/{id}")
    public Quote getQuoteById(@PathVariable long id) {
        return service.getQuoteById(id);
    }

    @GetMapping("/quotes/quote/{quote}")
    public Quote getQuoteByQuote(@PathVariable String quote) {
        return service.getQuoteByQuote(quote);
    }

    @GetMapping("/quotes/character/{character}")
    public List<Quote> getQuotesByCharacter(@PathVariable String character) {
        return service.getQuotesByCharacter(character);
    }

    @PostMapping("/quotes/save/{movieId}")
    public Quote saveQuote(@RequestBody Quote quote, @PathVariable long movieId) {
        Movie movie = service.getMovieById(movieId); // Get the movie by id
        quote.setMovie(movie); // Set the movie in the quote
        System.out.println(quote.getMovie().getTitle());
        return service.saveQuote(quote);
    }
    
    @GetMapping("/quotes/latest")
    public List<Quote> getLatestQuotes() {
        return service.getLatestQuotes(5); // Get last 5 quotes
    }

}
