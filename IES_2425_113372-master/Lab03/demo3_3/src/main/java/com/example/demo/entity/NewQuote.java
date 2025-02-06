package com.example.demo.entity;

public class NewQuote {
    private String quotetext;
    private long movie_id;

    public NewQuote(String quotetext, long movie_id) {
        this.quotetext = quotetext;
        this.movie_id = movie_id;
    }

    public String getQuotetext() {
        return quotetext;
    }

    public long getMovie_id() {
        return movie_id;
    }
}
