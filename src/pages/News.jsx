import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using NewsAPI for entertainment news
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=entertainment&language=en&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`
        );
        const data = await response.json();
        setNews(data.articles);
      } catch (err) {
        setError('Failed to fetch news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0a', py: 4 }}>
      <Container maxWidth="xl">
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
          RECCO NEWS
        </Typography>

        <Typography
          variant="h4"
          component="h2"
          sx={{
            color: '#ffffff',
            fontFamily: '"Montserrat", sans-serif',
            textAlign: 'center',
            mb: 6,
            fontSize: { xs: '1.5rem', md: '2rem' },
            letterSpacing: '0.1em',
            fontWeight: 300,
            opacity: 0.9,
          }}
        >
          Latest Entertainment News
        </Typography>

        <Grid container spacing={4}>
          {news.map((article, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'}
                  alt={article.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip
                      icon={<TrendingUpIcon />}
                      label="Entertainment"
                      sx={{
                        bgcolor: 'rgba(135, 206, 235, 0.2)',
                        color: '#87CEEB',
                        '& .MuiChip-icon': {
                          color: '#87CEEB',
                        },
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, color: '#ffffff', opacity: 0.7 }}>
                      <AccessTimeIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                      <Typography variant="caption">
                        {formatDate(article.publishedAt)}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      color: '#ffffff',
                      fontFamily: '"Playfair Display", serif',
                      mb: 2,
                      fontSize: '1.2rem',
                      fontWeight: 600,
                    }}
                  >
                    {article.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#ffffff',
                      opacity: 0.8,
                      fontFamily: '"Montserrat", sans-serif',
                    }}
                  >
                    {article.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#87CEEB',
                      fontFamily: '"Montserrat", sans-serif',
                      '&:hover': {
                        color: '#ffffff',
                      },
                    }}
                  >
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default News; 