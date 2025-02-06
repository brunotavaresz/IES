package com.example.demo.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "quotes")
public class Quote {

    private long quote_id;
    private String quotetext;

    private Movie movie;

    public Quote() {
    }

    public Quote(String quotetext, Movie movie) {
        this.quotetext = quotetext;
        this.movie = movie;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public long getQuote_id() {
        return quote_id;
    }

    public void setQuote_id(long quote_id) {
        this.quote_id = quote_id;
    }

    @Column(name = "quotetext", nullable = false)
    public String getQuotetext() {
        return quotetext;
    }

    public void setQuotetext(String quotetext) {
        this.quotetext = quotetext;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "movie_id", nullable = false)
    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    @Override
    public String toString() {
        return "Quote{quotetext=" + quotetext + ", movie=" + movie.getTitle() + "}";
    }
}
