import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Skeleton,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';
import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../config';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';

const legendaryDirectors = [
  {
    id: 1032,
    name: 'Martin Scorsese',
    image: 'https://image.tmdb.org/t/p/w500/9U9Y5GQuWus3cryiQxKf0RjF0Qw.jpg',
    description: 'Known for his masterpieces like Goodfellas, Taxi Driver, and The Irishman.',
    movies: ['Goodfellas', 'Taxi Driver', 'The Irishman', 'The Wolf of Wall Street'],
  },
  {
    id: 525,
    name: 'Christopher Nolan',
    image: 'https://image.tmdb.org/t/p/w500/4D4YwX5k4h3h3h3h3h3h3h3h3h3h3.jpg',
    description: 'Famous for his mind-bending films like Inception, The Dark Knight, and Interstellar.',
    movies: ['Inception', 'The Dark Knight', 'Interstellar', 'Tenet'],
  },
  {
    id: 1032,
    name: 'Quentin Tarantino',
    image: 'https://image.tmdb.org/t/p/w500/9U9Y5GQuWus3cryiQxKf0RjF0Qw.jpg',
    description: 'Known for his unique style in films like Pulp Fiction, Kill Bill, and Once Upon a Time in Hollywood.',
    movies: ['Pulp Fiction', 'Kill Bill', 'Once Upon a Time in Hollywood', 'Inglourious Basterds'],
  },
  {
    id: 525,
    name: 'Steven Spielberg',
    image: 'https://image.tmdb.org/t/p/w500/4D4YwX5k4h3h3h3h3h3h3h3h3h3h3.jpg',
    description: 'Legendary director of classics like Jaws, E.T., and Schindler\'s List.',
    movies: ['Jaws', 'E.T.', 'Schindler\'s List', 'Jurassic Park'],
  },
  {
    id: 1032,
    name: 'Alfred Hitchcock',
    image: 'https://image.tmdb.org/t/p/w500/9U9Y5GQuWus3cryiQxKf0RjF0Qw.jpg',
    description: 'The Master of Suspense, known for Psycho, Vertigo, and Rear Window.',
    movies: ['Psycho', 'Vertigo', 'Rear Window', 'North by Northwest'],
  },
  {
    id: 525,
    name: 'Stanley Kubrick',
    image: 'https://image.tmdb.org/t/p/w500/4D4YwX5k4h3h3h3h3h3h3h3h3h3h3.jpg',
    description: 'Known for his groundbreaking films like 2001: A Space Odyssey and The Shining.',
    movies: ['2001: A Space Odyssey', 'The Shining', 'A Clockwork Orange', 'Full Metal Jacket'],
  },
];

function LegendaryDirectors() {
  const [selectedDirector, setSelectedDirector] = useState(null);
  const [directorMovies, setDirectorMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDirectorClick = async (director) => {
    setSelectedDirector(director);
    setLoading(true);
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_people=${director.id}&sort_by=popularity.desc`
      );
      setDirectorMovies(response.data.results.slice(0, 4));
    } catch (error) {
      console.error('Error fetching director movies:', error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ py: 4, bgcolor: 'rgba(0, 0, 0, 0.8)' }}>
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          component="h2"
          sx={{
            color: '#ff0000',
            fontFamily: '"Righteous", cursive',
            textAlign: 'center',
            mb: 4,
            textShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
          }}
        >
          THE OGs
        </Typography>
        
        <Grid container spacing={3}>
          {legendaryDirectors.map((director) => (
            <Grid item key={director.id} xs={12} sm={6} md={4}>
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
                onClick={() => handleDirectorClick(director)}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={director.image}
                  alt={director.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      color: 'white',
                      fontFamily: '"Playfair Display", serif',
                      mb: 1,
                    }}
                  >
                    {director.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#cccccc',
                      fontFamily: '"Poppins", sans-serif',
                    }}
                  >
                    {director.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={!!selectedDirector}
          onClose={() => setSelectedDirector(null)}
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
            {selectedDirector?.name}'s Masterpieces
            <IconButton 
              onClick={() => setSelectedDirector(null)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ bgcolor: '#1a1a1a' }}>
            <Grid container spacing={2}>
              {loading ? (
                Array(4).fill().map((_, index) => (
                  <Grid item key={index} xs={12} sm={6}>
                    <Skeleton variant="rectangular" height={200} />
                  </Grid>
                ))
              ) : (
                directorMovies.map((movie) => (
                  <Grid item key={movie.id} xs={12} sm={6}>
                    <Card sx={{ bgcolor: 'rgba(42, 42, 42, 0.8)' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'white',
                            fontFamily: '"Playfair Display", serif',
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
                ))
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ bgcolor: '#1a1a1a' }}>
            <Button onClick={() => setSelectedDirector(null)} sx={{ color: 'white' }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default LegendaryDirectors; 