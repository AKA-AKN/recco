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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';

const streamingServices = [
  {
    name: 'Netflix',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/200px-Netflix_2015_logo.svg.png',
    price: '$15.99/month',
  },
  {
    name: 'Amazon Prime',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Amazon_Prime_logo.png/200px-Amazon_Prime_logo.png',
    price: '$14.99/month',
  },
  {
    name: 'Disney+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/200px-Disney%2B_logo.svg.png',
    price: '$7.99/month',
  },
  {
    name: 'HBO Max',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/HBO_Max_Logo.svg/200px-HBO_Max_Logo.svg.png',
    price: '$15.99/month',
  },
];

const backgroundMovies = [
  'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg', // Batman
  'https://image.tmdb.org/t/p/original/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', // Avengers
  'https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', // Spider-Man
];

function Premium() {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = () => {
    setOpenDialog(true);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: '#0a0a0a',
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
            background: 'linear-gradient(45deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.85) 100%)',
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
            backgroundImage: `url(${backgroundMovies[currentBgIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
            transition: 'opacity 1.5s ease-in-out',
          }}
        />
      </Box>

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
            background: 'linear-gradient(45deg, #ffffff, #e0e0e0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          RECCO PREMIUM
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
          Access All Streaming Services for Just $10/month
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: '#ffffff',
                  fontFamily: '"Playfair Display", serif',
                  mb: 3,
                  fontSize: '2rem',
                  fontWeight: 600,
                }}
              >
                Premium Benefits
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#ffffff', fontSize: '1.8rem', opacity: 0.9 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Access to All Streaming Services"
                    sx={{ 
                      color: '#ffffff',
                      '& .MuiListItemText-primary': {
                        fontFamily: '"Montserrat", sans-serif',
                        fontSize: '1.1rem',
                        fontWeight: 300,
                        opacity: 0.9,
                      }
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#ffffff', fontSize: '1.8rem', opacity: 0.9 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Ad-Free Experience"
                    sx={{ 
                      color: '#ffffff',
                      '& .MuiListItemText-primary': {
                        fontFamily: '"Montserrat", sans-serif',
                        fontSize: '1.1rem',
                        fontWeight: 300,
                        opacity: 0.9,
                      }
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#ffffff', fontSize: '1.8rem', opacity: 0.9 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Early Access to New Releases"
                    sx={{ 
                      color: '#ffffff',
                      '& .MuiListItemText-primary': {
                        fontFamily: '"Montserrat", sans-serif',
                        fontSize: '1.1rem',
                        fontWeight: 300,
                        opacity: 0.9,
                      }
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#ffffff', fontSize: '1.8rem', opacity: 0.9 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Exclusive Content"
                    sx={{ 
                      color: '#ffffff',
                      '& .MuiListItemText-primary': {
                        fontFamily: '"Montserrat", sans-serif',
                        fontSize: '1.1rem',
                        fontWeight: 300,
                        opacity: 0.9,
                      }
                    }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: '#ffffff',
                  fontFamily: '"Playfair Display", serif',
                  mb: 3,
                  fontSize: '2rem',
                  fontWeight: 600,
                }}
              >
                Available Services
              </Typography>
              <Grid container spacing={2}>
                {streamingServices.map((service) => (
                  <Grid item xs={6} key={service.name}>
                    <Card
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="100"
                        image={service.logo}
                        alt={service.name}
                        sx={{ objectFit: 'contain', p: 2 }}
                      />
                      <CardContent>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#ffffff',
                            textAlign: 'center',
                            fontFamily: '"Montserrat", sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 300,
                            opacity: 0.9,
                          }}
                        >
                          {service.price}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<StarIcon />}
            onClick={handleSubscribe}
            sx={{
              bgcolor: '#ffffff',
              color: '#000000',
              fontFamily: '"Montserrat", sans-serif',
              fontSize: '1.1rem',
              padding: '12px 32px',
              textTransform: 'none',
              letterSpacing: '0.1em',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#f5f5f5',
                transform: 'scale(1.02)',
                boxShadow: '0 4px 20px rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            Subscribe Now for $10/month
          </Button>
        </Box>
      </Container>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0a0a0a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#0a0a0a', 
          color: '#ffffff',
          fontFamily: '"Playfair Display", serif',
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: 600,
        }}>
          Welcome to RECCO PREMIUM!
        </DialogTitle>
        <DialogContent sx={{ 
          bgcolor: '#0a0a0a', 
          color: '#ffffff',
          textAlign: 'center',
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: 300,
          opacity: 0.9,
        }}>
          <Typography>
            Your subscription has been activated. You now have access to all streaming services.
            Enjoy unlimited entertainment for just $10/month!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          bgcolor: '#0a0a0a',
          justifyContent: 'center',
        }}>
          <Button 
            onClick={() => setOpenDialog(false)} 
            sx={{ 
              color: '#ffffff',
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 500,
              '&:hover': {
                color: '#f5f5f5',
              }
            }}
          >
            Start Watching
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Premium; 