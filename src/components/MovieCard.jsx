import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Chip,
  Fade,
} from '@mui/material';
import { getGenreName } from '../utils/constants';
import { useState } from 'react';

const MovieCard = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#2a2a2a',
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'scale(1.1)',
          zIndex: 2,
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardMedia
        component="img"
        height="200"
        image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        sx={{ 
          objectFit: 'cover',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
          }
        }}
        loading="lazy"
      />
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
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

      <Fade in={isHovered}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}
        >
          <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
            {movie.title}
          </Typography>
          <Typography variant="body1" sx={{ color: '#cccccc', mb: 2 }}>
            {movie.overview}
          </Typography>
          <Box sx={{ mt: 'auto' }}>
            <Typography variant="subtitle1" sx={{ color: 'white', mb: 1 }}>
              Release Date: {new Date(movie.release_date).toLocaleDateString()}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'white', mb: 1 }}>
              Popularity: {movie.popularity.toFixed(1)}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {movie.genre_ids?.map((genreId) => (
                <Chip
                  key={genreId}
                  label={getGenreName(genreId)}
                  size="small"
                  sx={{ bgcolor: '#ff0000', color: 'white' }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Fade>
    </Card>
  );
};

export default MovieCard; 