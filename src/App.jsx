import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Search from './pages/Search';
import ReccoWars from './pages/ReccoWars';
import OGs from './pages/OGs';
import Premium from './pages/Premium';
import News from './pages/News';
import GenreExplorer from './pages/GenreExplorer';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff0000',
    },
    secondary: {
      main: '#ff4444',
    },
    background: {
      default: '#1a1a1a',
      paper: '#2a2a2a',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ff0000',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#ff4444',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/reccowars" element={<ReccoWars />} />
          <Route path="/ogs" element={<OGs />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/news" element={<News />} />
          <Route path="/genre-explorer" element={<GenreExplorer />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 