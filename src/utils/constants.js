export const genreMap = {
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

export const getGenreName = (genreId) => {
  return genreMap[genreId] || 'Unknown';
};

// Function to calculate cosine similarity between two movies
export const calculateCosineSimilarity = (movie1, movie2) => {
  // Create feature vectors based on movie attributes
  const features1 = [
    movie1.vote_average,
    movie1.popularity,
    ...(movie1.genre_ids || []),
    movie1.release_date ? new Date(movie1.release_date).getFullYear() : 0
  ];

  const features2 = [
    movie2.vote_average,
    movie2.popularity,
    ...(movie2.genre_ids || []),
    movie2.release_date ? new Date(movie2.release_date).getFullYear() : 0
  ];

  // Calculate dot product
  const dotProduct = features1.reduce((sum, val, i) => sum + val * features2[i], 0);

  // Calculate magnitudes
  const magnitude1 = Math.sqrt(features1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(features2.reduce((sum, val) => sum + val * val, 0));

  // Avoid division by zero
  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  return dotProduct / (magnitude1 * magnitude2);
}; 