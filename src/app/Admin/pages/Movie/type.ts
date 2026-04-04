// src/app/Admin/pages/Movie/type.ts

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  description?: string;
  releaseDate: string;
  duration: number;
  posterUrl: string;
  trailerUrl?: string;
  banners?: string[];
  genres?: Genre[];
  deletedAt?: string;
}