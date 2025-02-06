package com.movies.demo.repository;
import com.movies.demo.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository  extends JpaRepository<Movie, Long> {
    Movie findByTitle(String title);
}
