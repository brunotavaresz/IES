import axios from 'axios';
import { useState } from 'react';

const client = axios.create({
    baseURL: 'http://localhost:8080/movies/save',
});

const AddMovie = ({refreshMovies}) => {
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [genre, setGenre] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const addMovie = async (e) => {
        e.preventDefault();
        client
            .post('', {
                title: title,
                genre: genre,
                year: year,
            })
            .then((response) => {
                console.log('Movie added', response.data);
                setSuccessMessage('Movie added successfully!');
                refreshMovies();
            })
            .catch((error) => {
                console.error('Error adding movie', error);
            });
    };

    return (
        <>
            <form onSubmit={addMovie}>
                <label>
                    Title:
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>
                <label>
                    Year:
                    <input
                        type="text"
                        name="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                </label>
                <label>
                    Genre:
                    <input
                        type="text"
                        name="genre"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                    />
                </label>
                <input type="submit" value="Submit" />
            </form>
            {successMessage && <p>{successMessage}</p>}
        </>
    );
};

export default AddMovie;
