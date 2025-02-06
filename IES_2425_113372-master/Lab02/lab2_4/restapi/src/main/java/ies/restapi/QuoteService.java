package ies.restapi;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.stereotype.Service;

@Service
public class QuoteService {
    private final List<Quote> quotes = new ArrayList<>();
    private final Random random = new Random();

    public QuoteService() {
        quotes.add(new Quote("1", "May the Force be with you.", "Star Wars"));
        quotes.add(new Quote("2", "I’ll be back.", "Terminator"));
        quotes.add(new Quote("3", "The truth is out there.", "The X-Files"));
        // Adicione mais citações conforme necessário
    }

    public Quote getRandomQuote() {
        return quotes.get(random.nextInt(quotes.size()));
    }

    public List<Quote> getQuotesByShow(String show) {
        List<Quote> result = new ArrayList<>();
        for (Quote quote : quotes) {
            if (quote.getShow().equalsIgnoreCase(show)) {
                result.add(quote);
            }
        }
        return result;
    }

    public List<String> getShows() {
        return quotes.stream().map(Quote::getShow).distinct().toList();
    }
}
