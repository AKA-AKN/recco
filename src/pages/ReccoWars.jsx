import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../config';

function ReccoWars() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&page=1`
        );
        setMovies(response.data.results.slice(0, 8));
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: '#1a1a1a',
        position: 'relative',
        py: 4,
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%)',
            zIndex: 1,
          }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://image.tmdb.org/t/p/original/1E5baAaEse26fej7uHcjOgEE2t2.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
          }}
        />
      </Box>

      <Container maxWidth="xl">
        <Typography
          variant="h3"
          component="h1"
          sx={{
            color: '#ff0000',
            fontFamily: '"Righteous", cursive',
            textAlign: 'center',
            mb: 6,
            textShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
          }}
        >
          RECCOWARS
        </Typography>

        <Grid container spacing={4}>
          {movies.map((movie) => (
            <Grid item key={movie.id} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  bgcolor: 'rgba(42, 42, 42, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 0, 0, 0.3)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="400"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      color: 'white',
                      fontFamily: '"Playfair Display", serif',
                      mb: 1,
                    }}
                  >
                    {movie.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#cccccc',
                      fontFamily: '"Poppins", sans-serif',
                    }}
                  >
                    {new Date(movie.release_date).getFullYear()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#ff0000',
              color: 'white',
              fontFamily: '"Righteous", cursive',
              fontSize: '1.2rem',
              padding: '12px 24px',
              '&:hover': {
                bgcolor: '#ff3333',
                transform: 'scale(1.05)',
                boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
              }
            }}
          >
            Start Battle
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ReccoWars; 