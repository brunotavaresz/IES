import axios from 'axios';
import { useState } from 'react';
import API_URL from './config';


const AddQuote = ({ movies, selectedMovieId, setSelectedMovieId }) => {
    const [quote, setQuote] = useState('');
    const [character, setCharacter] = useState('');
    const [genre, setGenre] = useState('');

    const addQuote = async (e) => {
        e.preventDefault();
        if (!selectedMovieId) {
            console.error('Movie must be selected');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/quotes/save/${selectedMovieId}`, {
                quote: quote,
                character: character,
                genre: genre,
            });
            console.log('Quote added successfully:', response.data);
            setQuote('');
            setCharacter('');
            setGenre('');
        } catch (error) {
            console.error('Error', error);
        }
    };

    return (
        <form onSubmit={addQuote}>
            <label>
                Quote:
                <input
                    type="text"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                />
            </label>
            <label>
                Character:
                <input
                    type="text"
                    value={character}
                    onChange={(e) => setCharacter(e.target.value)}
                />
            </label>
            <label>
                Movie:
                <select
                    value={selectedMovieId}
                    onChange={(e) => setSelectedMovieId(e.target.value)}
                >
                    <option value="">Select a Movie</option>
                    {movies.map((movie) => (
                        <option key={movie.movieId} value={movie.movieId}>
                            {movie.title}
                        </option>
                    ))}
                </select>
            </label>
            <input type="submit" value="Submit" />
        </form>
    );
};
export default AddQuote;
