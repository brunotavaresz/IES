package com.movies.demo.repository;

import com.movies.demo.model.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.domain.Pageable;

public interface QuoteRepository extends JpaRepository<Quote, Long> {
    Quote findByQuote(String quote);

    List<Quote> findByCharacter(String character);

    List<Quote> findAllByOrderByQuoteIdDesc(Pageable pageable);

}
