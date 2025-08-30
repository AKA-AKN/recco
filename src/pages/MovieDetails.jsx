import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Rating,
  Chip,
  Button,
  Paper,
  Divider,
  Skeleton,
  Backdrop,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Collapse,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../config';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [watchProviders, setWatchProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [expandedReview, setExpandedReview] = useState(null);
  const [openTrailer, setOpenTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [movieResponse, creditsResponse, reviewsResponse, providersResponse, videosResponse] = await Promise.all([
          axios.get(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`),
          axios.get(`${TMDB_BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}`),
          axios.get(`${TMDB_BASE_URL}/movie/${id}/reviews?api_key=${TMDB_API_KEY}`),
          axios.get(`${TMDB_BASE_URL}/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`),
          axios.get(`${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}`)
        ]);
        
        setMovie(movieResponse.data);
        setCredits(creditsResponse.data);
        setReviews(reviewsResponse.data.results);
        setWatchProviders(providersResponse.data.results.US);
        
        // Get trailer key
        const trailers = videosResponse.data.results.filter(video => video.type === "Trailer");
        if (trailers.length > 0) {
          setTrailerKey(trailers[0].key);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleExpandReview = (reviewId) => {
    setExpandedReview(expandedReview === reviewId ? null : reviewId);
  };

  // Enhanced Recommendo Score calculation with streaming availability
  const calculateRecommendoScore = () => {
    if (!movie) return 0;
    
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

  const isTrending = movie?.vote_count > 1000;
  const recommendoScore = calculateRecommendoScore();

  const WatchProviderCard = ({ provider, type, price }) => (
    <Paper 
      sx={{ 
        p: 2,
        bgcolor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
        }
      }}
    >
      <img
        src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
        alt={provider.provider_name}
        style={{ width: 40, height: 40, borderRadius: 4 }}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" sx={{ color: 'white' }}>
          {provider.provider_name}
        </Typography>
        <Typography variant="caption" sx={{ color: '#cccccc' }}>
          {type === 'flatrate' ? 'Streaming' : type === 'rent' ? 'Rent' : 'Buy'}
        </Typography>
      </Box>
      {price && (
        <Typography variant="subtitle2" sx={{ color: '#ff0000' }}>
          ${price}
        </Typography>
      )}
    </Paper>
  );

  if (loading) {
    return (
      <Backdrop
        sx={{ 
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'rgba(0, 0, 0, 0.8)',
        }}
        open={loading}
      >
        <CircularProgress sx={{ color: '#ff0000' }} />
      </Backdrop>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography color="error" variant="h5">{error}</Typography>
      </Container>
    );
  }

  if (!movie) {
    return null;
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: '#1a1a1a',
        backgroundImage: `linear-gradient(45deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 100%), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Button 
          onClick={() => navigate(-1)}
          sx={{ 
            mb: 4, 
            color: 'white',
            '&:hover': { color: '#ff0000' }
          }}
        >
          ← Back to Search
        </Button>

        <Grid container spacing={4}>
          {/* Movie Poster */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3}
              sx={{ 
                overflow: 'hidden',
                bgcolor: 'rgba(42, 42, 42, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                cursor: 'pointer',
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
              onClick={() => setOpenTrailer(true)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '100%', height: 'auto' }}
              />
            </Paper>
          </Grid>

          {/* Movie Info */}
          <Grid item xs={12} md={8}>
            <Paper 
              sx={{ 
                p: 4,
                bgcolor: 'rgba(42, 42, 42, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  sx={{ 
                    color: 'white',
                    fontFamily: '"Playfair Display", serif',
                  }}
                >
                  {movie?.title}
                </Typography>
                {isTrending && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      bgcolor: 'rgba(255, 0, 0, 0.9)',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      backdropFilter: 'blur(5px)',
                    }}
                  >
                    <TrendingUpIcon sx={{ color: 'white' }} />
                    <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold' }}>
                      TRENDING
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating 
                    value={movie?.vote_average / 2} 
                    precision={0.5} 
                    readOnly 
                    sx={{ color: '#ff0000' }} 
                  />
                  <Typography variant="body1" sx={{ ml: 1, color: 'white' }}>
                    ({movie?.vote_average.toFixed(1)})
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    bgcolor: 'rgba(255, 0, 0, 0.9)',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    backdropFilter: 'blur(5px)',
                  }}
                >
                  <StarIcon sx={{ color: 'white' }} />
                  <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold' }}>
                    Recommendo Score: {recommendoScore}%
                  </Typography>
                </Box>
              </Box>

              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#cccccc',
                  fontFamily: '"Montserrat", sans-serif',
                  mb: 2,
                }}
              >
                {new Date(movie.release_date).toLocaleDateString()}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {movie.genres.map((genre) => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                    sx={{ 
                      bgcolor: 'rgba(255, 0, 0, 0.8)',
                      color: 'white',
                    }}
                  />
                ))}
              </Box>

              <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTab-root': {
                      color: 'white',
                      '&.Mui-selected': {
                        color: '#ff0000',
                      },
                    },
                  }}
                >
                  <Tab label="Plot" />
                  <Tab label="Cast" />
                  <Tab label="Crew" />
                  <Tab label="Reviews" />
                  <Tab label="Where to Watch" />
                  <Tab label="Details" />
                </Tabs>
              </Box>

              <Box sx={{ mt: 2 }}>
                {tabValue === 0 && (
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#ff0000',
                        fontFamily: '"Playfair Display", serif',
                        mb: 2,
                      }}
                    >
                      Overview
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'white',
                        fontFamily: '"Poppins", sans-serif',
                        mb: 3,
                        lineHeight: 1.8,
                      }}
                    >
                      {movie.overview}
                    </Typography>

                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#ff0000',
                        fontFamily: '"Playfair Display", serif',
                        mb: 2,
                      }}
                    >
                      Tagline
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'white',
                        fontFamily: '"Poppins", sans-serif',
                        mb: 3,
                        fontStyle: 'italic',
                      }}
                    >
                      {movie.tagline || 'No tagline available'}
                    </Typography>

                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#ff0000',
                        fontFamily: '"Playfair Display", serif',
                        mb: 2,
                      }}
                    >
                      Production Companies
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {movie.production_companies.map((company) => (
                        <Chip
                          key={company.id}
                          label={company.name}
                          sx={{ 
                            bgcolor: 'rgba(255, 0, 0, 0.8)',
                            color: 'white',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {tabValue === 1 && (
                  <Grid container spacing={2}>
                    {credits?.cast.slice(0, 6).map((person) => (
                      <Grid item xs={6} sm={4} key={person.id}>
                        <Paper 
                          sx={{ 
                            p: 2,
                            bgcolor: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(5px)',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={`https://image.tmdb.org/t/p/w92${person.profile_path}`}
                              alt={person.name}
                              sx={{ mr: 1 }}
                            />
                            <Box>
                              <Typography variant="subtitle2" sx={{ color: 'white' }}>
                                {person.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#cccccc' }}>
                                {person.character}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {tabValue === 2 && (
                  <Grid container spacing={2}>
                    {credits?.crew.slice(0, 6).map((person) => (
                      <Grid item xs={6} sm={4} key={person.id}>
                        <Paper 
                          sx={{ 
                            p: 2,
                            bgcolor: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(5px)',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={`https://image.tmdb.org/t/p/w92${person.profile_path}`}
                              alt={person.name}
                              sx={{ mr: 1 }}
                            />
                            <Box>
                              <Typography variant="subtitle2" sx={{ color: 'white' }}>
                                {person.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#cccccc' }}>
                                {person.job}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {tabValue === 3 && (
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#ff0000',
                        fontFamily: '"Playfair Display", serif',
                        mb: 2,
                      }}
                    >
                      User Reviews
                    </Typography>
                    {reviews.length === 0 ? (
                      <Typography color="white" align="center">
                        No reviews available yet.
                      </Typography>
                    ) : (
                      reviews.map((review) => (
                        <Card 
                          key={review.id}
                          sx={{ 
                            mb: 2,
                            bgcolor: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(5px)',
                          }}
                        >
                          <CardHeader
                            avatar={
                              <Avatar 
                                src={`https://www.gravatar.com/avatar/${review.author_details.avatar_path}`}
                                alt={review.author}
                              />
                            }
                            title={
                              <Typography variant="subtitle1" sx={{ color: 'white' }}>
                                {review.author}
                              </Typography>
                            }
                            subheader={
                              <Typography variant="caption" sx={{ color: '#cccccc' }}>
                                {new Date(review.created_at).toLocaleDateString()}
                              </Typography>
                            }
                            action={
                              <IconButton 
                                onClick={() => handleExpandReview(review.id)}
                                sx={{ color: 'white' }}
                              >
                                <ExpandMoreIcon 
                                  sx={{ 
                                    transform: expandedReview === review.id ? 'rotate(180deg)' : 'none',
                                    transition: 'transform 0.3s'
                                  }} 
                                />
                              </IconButton>
                            }
                          />
                          <Collapse in={expandedReview === review.id}>
                            <CardContent>
                              <Rating 
                                value={review.author_details.rating / 2} 
                                precision={0.5} 
                                readOnly 
                                sx={{ color: '#ff0000', mb: 1 }} 
                              />
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: 'white',
                                  fontFamily: '"Poppins", sans-serif',
                                }}
                              >
                                {review.content}
                              </Typography>
                            </CardContent>
                          </Collapse>
                        </Card>
                      ))
                    )}
                  </Box>
                )}

                {tabValue === 4 && (
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#ff0000',
                        fontFamily: '"Playfair Display", serif',
                        mb: 2,
                      }}
                    >
                      Where to Watch
                    </Typography>
                    
                    {watchProviders ? (
                      <>
                        {watchProviders.flatrate && watchProviders.flatrate.length > 0 && (
                          <Box sx={{ mb: 3 }}>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                color: 'white',
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <PlayArrowIcon sx={{ color: '#ff0000' }} />
                              Streaming Services
                            </Typography>
                            <Grid container spacing={2}>
                              {watchProviders.flatrate.map((provider) => (
                                <Grid item xs={12} sm={6} md={4} key={provider.provider_id}>
                                  <WatchProviderCard provider={provider} type="flatrate" />
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}

                        {watchProviders.rent && watchProviders.rent.length > 0 && (
                          <Box sx={{ mb: 3 }}>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                color: 'white',
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <ShoppingCartIcon sx={{ color: '#ff0000' }} />
                              Rent
                            </Typography>
                            <Grid container spacing={2}>
                              {watchProviders.rent.map((provider) => (
                                <Grid item xs={12} sm={6} md={4} key={provider.provider_id}>
                                  <WatchProviderCard 
                                    provider={provider} 
                                    type="rent" 
                                    price={provider.price}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}

                        {watchProviders.buy && watchProviders.buy.length > 0 && (
                          <Box>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                color: 'white',
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <ShoppingCartIcon sx={{ color: '#ff0000' }} />
                              Buy
                            </Typography>
                            <Grid container spacing={2}>
                              {watchProviders.buy.map((provider) => (
                                <Grid item xs={12} sm={6} md={4} key={provider.provider_id}>
                                  <WatchProviderCard 
                                    provider={provider} 
                                    type="buy" 
                                    price={provider.price}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}

                        {!watchProviders.flatrate?.length && 
                         !watchProviders.rent?.length && 
                         !watchProviders.buy?.length && (
                          <Typography color="white" align="center">
                            This movie is not currently available on any streaming platforms.
                          </Typography>
                        )}
                      </>
                    ) : (
                      <Typography color="white" align="center">
                        Loading availability information...
                      </Typography>
                    )}
                  </Box>
                )}

                {tabValue === 5 && (
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Budget"
                        secondary={`$${movie.budget.toLocaleString()}`}
                        primaryTypographyProps={{ sx: { color: 'white' } }}
                        secondaryTypographyProps={{ sx: { color: '#cccccc' } }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Revenue"
                        secondary={`$${movie.revenue.toLocaleString()}`}
                        primaryTypographyProps={{ sx: { color: 'white' } }}
                        secondaryTypographyProps={{ sx: { color: '#cccccc' } }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Runtime"
                        secondary={`${movie.runtime} minutes`}
                        primaryTypographyProps={{ sx: { color: 'white' } }}
                        secondaryTypographyProps={{ sx: { color: '#cccccc' } }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Status"
                        secondary={movie.status}
                        primaryTypographyProps={{ sx: { color: 'white' } }}
                        secondaryTypographyProps={{ sx: { color: '#cccccc' } }}
                      />
                    </ListItem>
                  </List>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

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
          {movie?.title} - Trailer
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
    </Box>
  );
}

export default MovieDetails; 