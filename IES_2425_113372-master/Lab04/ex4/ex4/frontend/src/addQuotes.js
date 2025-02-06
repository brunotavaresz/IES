import axios from 'axios';
import { useState } from 'react';


const AddQuote = ({ movies, selectedMovieId, setSelectedMovieId }) => {
    const [quote, setQuote] = useState('');
    const [character, setCharacter] = useState('');
    const [genre, setGenre] = useState('');

    const addQuote = async (e) => {
        e.preventDefault();
        if (!selectedMovieId) {
            console.error('Movie not selected');
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8080/quotes/save/${selectedMovieId}`, {
                quote: quote,
                character: character,
                genre: genre,
            });
            console.log('Quote added:', response.data);
            setQuote('');
            setGenre('');
            setCharacter('');
        } catch (error) {
            console.error('Error:', error);
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
