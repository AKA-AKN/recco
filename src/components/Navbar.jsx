import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: 'transparent', 
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Typography
            variant="h4"
            sx={{
              color: '#ff0000',
              fontFamily: '"Righteous", cursive',
              fontSize: '2.5rem',
              '&:hover': {
                color: '#ff3333',
              }
            }}
          >
            RECCO
          </Typography>
        </Link>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link to="/reccowars" style={{ textDecoration: 'none' }}>
            <Button
              sx={{
                color: '#ffffff',
                fontFamily: '"Righteous", cursive',
                fontSize: '1.2rem',
                textTransform: 'none',
                '&:hover': {
                  color: '#ff0000',
                }
              }}
            >
              RECCO<span style={{ color: '#ff0000' }}>WARS</span>
            </Button>
          </Link>

          <Link to="/genre-explorer" style={{ textDecoration: 'none' }}>
            <Button
              sx={{
                color: '#ffffff',
                fontFamily: '"Righteous", cursive',
                fontSize: '1.2rem',
                textTransform: 'none',
                '&:hover': {
                  color: '#ff0000',
                }
              }}
            >
              GENRE EXPLORER
            </Button>
          </Link>

          <Link to="/news" style={{ textDecoration: 'none' }}>
            <Button
              sx={{
                color: '#ffffff',
                fontFamily: '"Righteous", cursive',
                fontSize: '1.2rem',
                textTransform: 'none',
                '&:hover': {
                  color: '#87CEEB',
                }
              }}
            >
              RECCO<span style={{ color: '#87CEEB' }}>NEWS</span>
            </Button>
          </Link>

          <Link to="/ogs" style={{ textDecoration: 'none' }}>
            <Button
              sx={{
                color: '#ffffff',
                fontFamily: '"Righteous", cursive',
                fontSize: '1.2rem',
                textTransform: 'none',
                '&:hover': {
                  color: '#ff0000',
                }
              }}
            >
              THE OGs
            </Button>
          </Link>

          <Link to="/premium" style={{ textDecoration: 'none' }}>
            <Button
              sx={{
                color: '#ffd700',
                fontFamily: '"Righteous", cursive',
                fontSize: '1.2rem',
                textTransform: 'none',
                '&:hover': {
                  color: '#ffeb3b',
                }
              }}
            >
              RECCO PREMIUM
            </Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 