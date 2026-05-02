const API_KEY = "80accd0c";

export const fetchMovies = async (search: string) => {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(search)}`
    );

    const data = await res.json();

    if (!res.ok || data.Response === "False") {
      return [];
    }

    return data.Search || [];
  } catch (error) {
    console.error("Fetch movies failed:", error);
    return [];
  }
};
export const fetchMovieDetail = async (imdbID: string) => {
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`
  );
  const data = await res.json();
  return data;
};

