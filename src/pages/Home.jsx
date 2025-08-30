import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
  Skeleton,
} from '@mui/material';
import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../config';

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

function Home() {
  const navigate = useNavigate();
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [trendingRes, topRatedRes] = await Promise.all([
          axios.get(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`),
          axios.get(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`)
        ]);

        setTrendingMovies(trendingRes.data.results.slice(0, 6));
        setTopRatedMovies(topRatedRes.data.results.slice(0, 6));
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const getGenreName = (genreId) => {
    return genreMap[genreId] || 'Unknown';
  };

  const MovieCardSkeleton = () => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#2a2a2a' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Skeleton variant="rectangular" width={60} height={24} />
        </Box>
      </CardContent>
    </Card>
  );

  const MovieCard = ({ movie }) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#2a2a2a',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        sx={{ objectFit: 'cover' }}
        loading="lazy"
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" sx={{ color: 'white', mb: 1 }}>
          {movie.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={movie.vote_average / 2} precision={0.5} readOnly sx={{ color: '#ff0000' }} />
          <Typography variant="body2" sx={{ ml: 1, color: 'white' }}>
            ({movie.vote_average.toFixed(1)})
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {movie.genre_ids?.slice(0, 3).map((genreId) => (
            <Chip
              key={genreId}
              label={getGenreName(genreId)}
              size="small"
              sx={{ bgcolor: '#ff0000', color: 'white' }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0a' }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#0a0a0a',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.85) 100%)',
              backdropFilter: 'blur(5px)',
            }
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '3.5rem', md: '5rem' },
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(45deg, #ffffff, #87CEEB)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              What's the Mood?
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                color: '#cccccc',
                fontFamily: '"Poppins", sans-serif',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              }}
            >
              Discover your next favorite movie
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/search')}
              sx={{
                bgcolor: '#87CEEB',
                color: '#000000',
                '&:hover': {
                  bgcolor: '#5f9ea0',
                  transform: 'scale(1.05)',
                },
                fontFamily: '"Poppins", sans-serif',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                transition: 'all 0.3s ease-in-out',
              }}
            >
              Start Exploring
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Movie Sections */}
      <Container maxWidth="xl" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'white', mb: 4 }}>
              Trending Now
            </Typography>
            <Grid container spacing={3}>
              {loading ? (
                Array(6).fill().map((_, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <MovieCardSkeleton />
                  </Grid>
                ))
              ) : error ? (
                <Grid item xs={12}>
                  <Typography color="error" align="center">{error}</Typography>
                </Grid>
              ) : (
                trendingMovies.map((movie) => (
                  <Grid item key={movie.id} xs={12} sm={6} md={4}>
                    <MovieCard movie={movie} />
                  </Grid>
                ))
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'white', mb: 4 }}>
              Top Rated
            </Typography>
            <Grid container spacing={3}>
              {loading ? (
                Array(6).fill().map((_, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <MovieCardSkeleton />
                  </Grid>
                ))
              ) : error ? (
                <Grid item xs={12}>
                  <Typography color="error" align="center">{error}</Typography>
                </Grid>
              ) : (
                topRatedMovies.map((movie) => (
                  <Grid item key={movie.id} xs={12} sm={6} md={4}>
                    <MovieCard movie={movie} />
                  </Grid>
                ))
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home; 