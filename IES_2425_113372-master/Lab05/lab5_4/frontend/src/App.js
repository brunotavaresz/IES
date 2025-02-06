import './App.css';
import AddMovie from './addMovie';
import AddQuotes from './addQuotes';
import LatestQuotes from './latestQuotes';
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from './config';

const movieClient = axios.create({
  baseURL: API_URL + '/movies',
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
      <h1>My app</h1>
      <h3>add Movie</h3>
      <AddMovie refreshMovies={refreshMovies} />
      <h3>add Quote</h3>
      <AddQuotes
        movies={movies}
        selectedMovieId={selectedMovieId}
        setSelectedMovieId={setSelectedMovieId}
      />
      <LatestQuotes />
    </div>
  );
};

export default MovieQuoteApp;