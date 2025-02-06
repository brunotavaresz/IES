import './App.css';
import AddMovie from './addMovie';
import AddQuotes from './addQuotes';
import { useState, useEffect } from 'react';
import axios from 'axios';

const movieClient = axios.create({
  baseURL: 'http://localhost:8080/movies', 
});


const MovieQuoteApp = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState('');

  useEffect(() => {

    const fetchMovies = async () => {
      try {
        const response = await movieClient.get();
        setMovies(response.data);
      } catch (error) {
        console.error('Error', error);
      }
    };

    fetchMovies();
  }, []);

  const refreshMovies = async () => {
    try {
      const response = await movieClient.get();
      setMovies(response.data);
    } catch (error) {
      console.error('Error', error);
    }
  };

  return (
    <div>
      <h1>Movie Quote App</h1>
      <h3>Add Movie</h3>
      <AddMovie refreshMovies={refreshMovies} />
      <h3>Add Quote</h3>
      <AddQuotes
        movies={movies}
        selectedMovieId={selectedMovieId}
        setSelectedMovieId={setSelectedMovieId}
      />
    </div>
  );
};

export default MovieQuoteApp;
