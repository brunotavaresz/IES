package com.movies.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.movies.demo.repository.QuoteRepository;
import com.movies.demo.repository.MovieRepository;
import com.movies.demo.model.Movie;
import com.movies.demo.model.Quote;
import java.util.List;
import org.springframework.data.domain.Sort;

@Service
public class MyService {
    @Autowired
    private MovieRepository Repository;

    public Movie saveMovie(Movie movie) {
        return Repository.save(movie);
    }

    public List<Movie> getMovies() {
        return Repository.findAll();
    }

    public Movie getMovieById(long id) {
        return Repository.findById(id).orElse(null);
    }

    public Movie getMovieByTitle(String title) {
        return Repository.findByTitle(title);
    }

    @Autowired
    private QuoteRepository quoteRepository;

    public Quote saveQuote(Quote quote) {
        return quoteRepository.save(quote);
    }

    public List<Quote> getQuotes() {
        return quoteRepository.findAll();
    }

    public Quote getQuoteById(long id) {
        return quoteRepository.findById(id).orElse(null);
    }

    public Quote getQuoteByQuote(String quote) {
        return quoteRepository.findByQuote(quote);
    }

    public List<Quote> getQuotesByCharacter(String character) {
        return quoteRepository.findByCharacter(character);
    }

    public List<Quote> getLatestQuotes(int count) {
        return quoteRepository.findAll(
                PageRequest.of(0, count, Sort.by(Sort.Direction.DESC, "quoteId"))).getContent();
    }

}
