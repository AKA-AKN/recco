import { Box } from '@mui/material';
import GenreRecommender from '../components/GenreRecommender';

function GenreExplorer() {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#0a0a0a',
      pt: 8 // Add padding top to account for navbar
    }}>
      <GenreRecommender />
    </Box>
  );
}

export default GenreExplorer; 