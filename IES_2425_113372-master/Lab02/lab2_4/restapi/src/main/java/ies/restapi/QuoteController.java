package ies.restapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class QuoteController {

    @Autowired
    private QuoteService quoteService;

    @GetMapping("/quote")
    public Quote getRandomQuote() {
        return quoteService.getRandomQuote();
    }

    @GetMapping("/shows")
    public List<String> getShows() {
        return quoteService.getShows();
    }

    @GetMapping("/quotes")
    public List<Quote> getQuotesByShow(@RequestParam String show) {
        return quoteService.getQuotesByShow(show);
    }
}
