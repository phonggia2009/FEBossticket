export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  duration: number | null;
  releaseDate: string;
  genres: Genre[];
}