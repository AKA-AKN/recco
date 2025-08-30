import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Box,
  Chip,
  TextField,
  Button,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../config';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import LegendaryDirectors from '../components/LegendaryDirectors';

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

const genreStyles = {
  28: { // Action
    font: '"Bebas Neue", sans-serif',
    color: '#ff4d4d',
    background: 'linear-gradient(45deg, #ff4d4d, #ff8080)',
    image: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg' // Mission Impossible
  },
  35: { // Comedy
    font: '"Comic Neue", cursive',
    color: '#ffcc00',
    background: 'linear-gradient(45deg, #ffcc00, #ffeb99)',
    image: 'https://image.tmdb.org/t/p/original/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg' // Barbie
  },
  27: { // Horror
    font: '"Creepster", cursive',
    color: '#990000',
    background: 'linear-gradient(45deg, #660000, #990000)',
    image: 'https://image.tmdb.org/t/p/original/bWIIWhnaoWx3FTVXv6GkYDv3djL.jpg' // The Nun
  },
  10749: { // Romance
    font: '"Dancing Script", cursive',
    color: '#ff66b2',
    background: 'linear-gradient(45deg, #ff66b2, #ff99cc)',
    image: 'https://image.tmdb.org/t/p/original/4M9ZEZeEZzgwU9SfpKQhbLSHxpw.jpg' // La La Land
  },
  878: { // Science Fiction
    font: '"Orbitron", sans-serif',
    color: '#00ccff',
    background: 'linear-gradient(45deg, #00ccff, #66e6ff)',
    image: 'https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg' // Dune
  },
  18: { // Drama
    font: '"Playfair Display", serif',
    color: '#9966ff',
    background: 'linear-gradient(45deg, #9966ff, #cc99ff)',
    image: 'https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg' // Oppenheimer
  },
  16: { // Animation
    primary: '#32cd32',
    secondary: '#98fb98',
    background: 'linear-gradient(45deg, rgba(50, 205, 50, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)',
    font: '"Quicksand", sans-serif',
    backgroundImage: 'url(https://image.tmdb.org/t/p/original/1E5baAaEse26fej7uHcjOgEE2t2.jpg)',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-animation-movie-clip-of-a-cartoon-scene-42914-large.mp4',
  },
  12: { // Adventure
    primary: '#ffa500',
    secondary: '#ffd700',
    background: 'linear-gradient(45deg, rgba(255, 165, 0, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)',
  },
  80: { // Crime
    primary: '#4b0082',
    secondary: '#800080',
    background: 'linear-gradient(45deg, rgba(75, 0, 130, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)',
  },
  99: { // Documentary
    primary: '#20b2aa',
    secondary: '#48d1cc',
    background: 'linear-gradient(45deg, rgba(32, 178, 170, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)',
  },
  10751: { // Family
    primary: '#ff69b4',
    secondary: '#ffb6c1',
    background: 'linear-gradient(45deg, rgba(255, 105, 180, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)',
  },
  14: { // Fantasy
    primary: '#da70d6',
    secondary: '#dda0dd',
    background: 'linear-gradient(45deg, rgba(218, 112, 214, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)',
  },
  36: { // History
    primary: '#cd853f',
    secondary: '#deb887',
    background: 'linear-gradient(45deg, rgba(205, 133, 63, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)',
  },
  10402: { // Music
    primary: '#ff4500',
    secondary: '#ff6347',
    background: 'linear-gradient(45deg, rgba(255, 69, 0, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)',
  },
  9648: { // Mystery
    primary: '#483d8b',
    secondary: '#6a5acd',
    background: 'linear-gradient(45deg, rgba(72, 61, 139, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)',
  },
  53: { // Thriller
    primary: '#8b0000',
    secondary: '#a52a2a',
    background: 'linear-gradient(45deg, rgba(139, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)',
  },
  10752: { // War
    primary: '#8b4513',
    secondary: '#a0522d',
    background: 'linear-gradient(45deg, rgba(139, 69, 19, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)',
  },
  37: { // Western
    primary: '#d2691e',
    secondary: '#cd853f',
    background: 'linear-gradient(45deg, rgba(210, 105, 30, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)',
  },
};

function Search() {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(genreStyles.all.videoUrl);
  const [backgroundPosters, setBackgroundPosters] = useState([]);
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
  const navigate = useNavigate();

  const currentColors = genreStyles[selectedGenre] || genreStyles.all;

  useEffect(() => {
    const query = searchParams.get('query') || searchParams.get('genre');
    if (query) {
      setSearchQuery(query);
      fetchMovies(query);
    }
  }, [searchParams]);

  useEffect(() => {
    setCurrentVideo(genreStyles[selectedGenre]?.videoUrl || genreStyles.all.videoUrl);
  }, [selectedGenre]);

  useEffect(() => {
    const fetchBackgroundPosters = async () => {
      try {
        const response = await axios.get(
          `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${selectedGenre === 'all' ? '' : selectedGenre}&sort_by=popularity.desc&page=1`
        );
        setBackgroundPosters(response.data.results.slice(0, 10).map(movie => movie.backdrop_path));
        setCurrentPosterIndex(0);
      } catch (error) {
        console.error('Error fetching background posters:', error);
      }
    };

    fetchBackgroundPosters();
  }, [selectedGenre]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPosterIndex((prevIndex) => 
        prevIndex === backgroundPosters.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change poster every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundPosters.length]);

  const fetchMovies = async (query) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      
      setMovies(response.data.results);
      setFilteredMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...movies];

    // Filter by genre
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(movie => 
        movie.genre_ids.includes(parseInt(selectedGenre))
      );
    }

    // Sort movies
    filtered.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.vote_average - a.vote_average;
      } else if (sortBy === 'newest') {
        return new Date(b.release_date) - new Date(a.release_date);
      } else if (sortBy === 'oldest') {
        return new Date(a.release_date) - new Date(b.release_date);
      }
      return 0;
    });

    setFilteredMovies(filtered);
  }, [movies, selectedGenre, sortBy]);

  const getGenreName = (genreId) => {
    return genreMap[genreId] || 'Unknown';
  };

  const getGenreStyle = (genreId) => {
    const style = genreStyles[genreId] || genreStyles.all;
    return {
      primary: style.primary,
      secondary: style.secondary,
      background: style.background,
      fontFamily: style.font,
      textTransform: 'uppercase',
      letterSpacing: '2px',
      textShadow: `0 0 10px ${style.primary}80`,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: style.backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.1,
        zIndex: -1,
        borderRadius: '4px',
      },
    };
  };

  const MovieCard = ({ movie }) => {
    const [openTrailer, setOpenTrailer] = useState(false);
    const [trailerKey, setTrailerKey] = useState(null);
    const [watchProviders, setWatchProviders] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchWatchProviders = async () => {
        try {
          const response = await axios.get(
            `${TMDB_BASE_URL}/movie/${movie.id}/watch/providers?api_key=${TMDB_API_KEY}`
          );
          setWatchProviders(response.data.results.US);
        } catch (error) {
          console.error('Error fetching watch providers:', error);
        }
      };
      fetchWatchProviders();
    }, [movie.id]);

    const isTrending = movie.vote_count > 1000;
    
    // Enhanced Recommendo Score calculation with streaming availability
    const calculateRecommendoScore = () => {
      // TMDB Rating (30% weight)
      const tmdbScore = (movie.vote_average / 10) * 30;
      
      // Vote Count (20% weight)
      const voteScore = Math.min(20, (movie.vote_count / 1000) * 20);
      
      // User Experience (30% weight)
      const userScore = (movie.vote_average / 10) * 30;
      
      // Streaming Availability (20% weight)
      let streamingScore = 0;
      if (watchProviders) {
        if (watchProviders.flatrate?.length > 0) {
          streamingScore = 20; // Available on streaming
        } else if (watchProviders.rent?.length > 0) {
          streamingScore = 10; // Available for rent
        } else if (watchProviders.buy?.length > 0) {
          streamingScore = 5; // Available for purchase
        }
      }
      
      return Math.min(100, Math.round(tmdbScore + voteScore + userScore + streamingScore));
    };

    const recommendoScore = calculateRecommendoScore();

    const handleImageClick = async (e) => {
      e.stopPropagation();
      try {
        const response = await axios.get(
          `${TMDB_BASE_URL}/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}`
        );
        const trailers = response.data.results.filter(video => video.type === "Trailer");
        if (trailers.length > 0) {
          setTrailerKey(trailers[0].key);
          setOpenTrailer(true);
        }
      } catch (error) {
        console.error('Error fetching trailer:', error);
      }
    };

    return (
      <>
        <Card 
          onClick={() => navigate(`/movie/${movie.id}`)}
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: 'rgba(42, 42, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${currentColors.primary}40`,
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            cursor: 'pointer',
            position: 'relative',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: `0 0 20px ${currentColors.primary}80`,
            }
          }}
        >
          {isTrending && (
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: 'rgba(255, 0, 0, 0.9)',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                backdropFilter: 'blur(5px)',
              }}
            >
              <TrendingUpIcon sx={{ color: 'white', fontSize: 16 }} />
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                TRENDING
              </Typography>
            </Box>
          )}
          
          <CardMedia
            component="img"
            height="300"
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            sx={{ 
              objectFit: 'cover',
              cursor: 'pointer',
              position: 'relative',
              '&:hover::after': {
                content: '"Watch Trailer"',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '14px',
              }
            }}
            onClick={handleImageClick}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  color: 'white', 
                  fontFamily: '"Playfair Display", serif',
                  flex: 1,
                  mr: 2,
                }}
              >
                {movie.title}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  bgcolor: 'rgba(255, 0, 0, 0.9)',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  backdropFilter: 'blur(5px)',
                }}
              >
                <StarIcon sx={{ color: 'white', fontSize: 16 }} />
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {recommendoScore}%
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating value={movie.vote_average / 2} precision={0.5} readOnly sx={{ color: currentColors.primary }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  ml: 1, 
                  color: 'white',
                  fontFamily: '"Montserrat", sans-serif',
                }}
              >
                ({movie.vote_average.toFixed(1)})
              </Typography>
            </Box>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#cccccc', 
                mb: 1,
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              {new Date(movie.release_date).toLocaleDateString()}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {movie.genre_ids?.map((genreId) => (
                <Chip
                  key={genreId}
                  label={getGenreName(genreId)}
                  size="small"
                  sx={{ 
                    bgcolor: `${currentColors.primary}cc`,
                    color: 'white',
                    backdropFilter: 'blur(5px)',
                    fontFamily: '"Poppins", sans-serif',
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        <Dialog 
          open={openTrailer} 
          onClose={() => setOpenTrailer(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            bgcolor: '#1a1a1a', 
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {movie.title} - Trailer
            <IconButton 
              onClick={() => setOpenTrailer(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ bgcolor: '#1a1a1a', p: 0 }}>
            {trailerKey && (
              <iframe
                width="100%"
                height="500"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Video/Image */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          overflow: 'hidden',
          bgcolor: '#0a0a0a', // Fallback background color
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.85) 100%)',
            zIndex: 1,
          }
        }}
      >
        {backgroundPosters[currentPosterIndex] && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${TMDB_BASE_URL}/original${backgroundPosters[currentPosterIndex]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.15,
              transition: 'opacity 1.5s ease-in-out',
            }}
          />
        )}
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Search Section */}
        <Box
          sx={{
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              color: '#ffffff',
              fontFamily: '"Playfair Display", serif',
              textAlign: 'center',
              mb: 2,
              fontSize: { xs: '3.5rem', md: '5rem' },
              letterSpacing: '0.05em',
              fontWeight: 700,
              background: 'linear-gradient(45deg, #ffffff, #87CEEB)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            Search Movies
          </Typography>

          <Paper
            sx={{
              p: 2,
              display: 'flex',
              gap: 2,
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              width: '100%',
              maxWidth: 600,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#87CEEB',
                  },
                  '& input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={() => navigate(`/search?query=${encodeURIComponent(searchQuery)}`)}
              sx={{
                bgcolor: '#87CEEB',
                color: '#000000',
                '&:hover': {
                  bgcolor: '#5f9ea0',
                },
              }}
            >
              Search
            </Button>
          </Paper>

          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              sx={{
                color: '#ffffff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#87CEEB',
                },
              }}
            >
              <MenuItem value="all">All Genres</MenuItem>
              {Object.entries(genreMap).map(([id, name]) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Results Section */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#87CEEB' }} />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ py: 4, color: '#ff6b6b' }}>
            {error}
          </Typography>
        ) : (
          <Grid container spacing={4} sx={{ py: 4 }}>
            {filteredMovies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Search; 