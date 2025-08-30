import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  Chip,
  Skeleton,
  Container,
  useTheme,
  IconButton,
  Fade,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../config';
import MovieCard from './MovieCard';
import { calculateCosineSimilarity } from '../utils/constants';

const genreMap = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

function GenreRecommender() {
  const theme = useTheme();
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [allMovies, setAllMovies] = useState([]);
  const [genrePage, setGenrePage] = useState(0);
  const genresPerPage = 5;
  const [transitioning, setTransitioning] = useState(false);

  // Fetch available genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
        );
        setGenres(response.data.genres);
        // Auto-select the first genre
        if (response.data.genres.length > 0) {
          setSelectedGenre(response.data.genres[0].id);
          fetchMoviesByGenre(response.data.genres[0].id);
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
        setError('Failed to load genres');
      }
    };

    fetchGenres();
  }, []);

  // Fetch all movies for similarity calculation
  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const response = await axios.get(
          `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&page=1`
        );
        setAllMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching all movies:', error);
      }
    };

    fetchAllMovies();
  }, []);

  // Fetch movies by genre and apply cosine similarity
  const fetchMoviesByGenre = useCallback(async (genreId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}`
      );
      
      // Get the first movie as reference for similarity calculation
      const referenceMovie = response.data.results[0];
      
      // Calculate similarity scores for all movies
      const moviesWithSimilarity = response.data.results.map(movie => ({
        ...movie,
        similarity: calculateCosineSimilarity(referenceMovie, movie)
      }));

      // Sort movies by similarity score
      const sortedMovies = moviesWithSimilarity.sort((a, b) => b.similarity - a.similarity);
      
      // Take only the first 5 movies
      setMovies(sortedMovies.slice(0, 5));
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Handle genre selection
  const handleGenreSelect = (genreId) => {
    setSelectedGenre(genreId);
    fetchMoviesByGenre(genreId);
  };

  // Handle spacebar press
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space' && selectedGenre) {
        event.preventDefault();
        setPage((prevPage) => prevPage + 1);
        fetchMoviesByGenre(selectedGenre);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedGenre, fetchMoviesByGenre]);

  // Handle genre carousel navigation
  const handlePrevPage = () => {
    if (genrePage > 0) {
      setTransitioning(true);
      setTimeout(() => {
        setGenrePage((prev) => Math.max(0, prev - 1));
        setTransitioning(false);
      }, 300);
    }
  };

  const handleNextPage = () => {
    if (genrePage < genres.length - genresPerPage) {
      setTransitioning(true);
      setTimeout(() => {
        setGenrePage((prev) => Math.min(genres.length - genresPerPage, prev + 1));
        setTransitioning(false);
      }, 300);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'white', mb: 2 }}>
          Genre-Based Recommendations
        </Typography>
        <Typography variant="body1" sx={{ color: '#cccccc', mb: 3 }}>
          Select a genre and press spacebar to refresh recommendations
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          position: 'relative',
          width: '100%',
          px: 12
        }}>
          <IconButton
            onClick={handlePrevPage}
            disabled={genrePage === 0 || transitioning}
            sx={{
              color: 'white',
              position: 'absolute',
              left: 'calc(50% - 300px)',
              zIndex: 2,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: '#ff0000'
              }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          
          <Box sx={{ 
            width: '500px',  // Fixed width for 5 genres
            margin: '0 auto',
            overflow: 'hidden',
            position: 'relative',
            height: '40px'
          }}>
            <Box sx={{ 
              display: 'flex', 
              gap: '8px',
              position: 'absolute',
              transition: 'transform 0.3s ease',
              transform: `translateX(${-genrePage * 108}px)`, // 108px = chip width (100px) + gap (8px)
            }}>
              {genres.map((genre, index) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  onClick={() => handleGenreSelect(genre.id)}
                  sx={{
                    bgcolor: selectedGenre === genre.id ? '#ff0000' : '#2a2a2a',
                    color: 'white',
                    minWidth: '100px',
                    transition: 'all 0.3s ease',
                    opacity: 
                      (index < genrePage || index >= genrePage + genresPerPage)
                      ? 0.5 
                      : 1,
                    '&:hover': {
                      bgcolor: selectedGenre === genre.id ? '#cc0000' : '#3a3a3a',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          <IconButton
            onClick={handleNextPage}
            disabled={genrePage >= genres.length - genresPerPage || transitioning}
            sx={{
              color: 'white',
              position: 'absolute',
              right: 'calc(50% - 300px)',
              zIndex: 2,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: '#ff0000'
              }
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      {selectedGenre && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: 2,
          flexWrap: 'wrap',
          position: 'relative',
          height: '400px'
        }}>
          {loading ? (
            Array(5).fill().map((_, index) => (
              <Skeleton 
                key={index} 
                variant="rectangular" 
                width={200} 
                height={400}
                sx={{ borderRadius: 2 }}
              />
            ))
          ) : error ? (
            <Typography color="error" align="center">{error}</Typography>
          ) : (
            movies.map((movie) => (
              <Box 
                key={movie.id} 
                sx={{ 
                  width: '200px',
                  height: '400px',
                  flexShrink: 0
                }}
              >
                <MovieCard movie={movie} />
              </Box>
            ))
          )}
        </Box>
      )}
    </Container>
  );
}

export default GenreRecommender;