export interface Review {
  sk_movie_review_id: string;
  sk_movie_id: string;
  nome: string;
  nota: number;
  comentario: string;
  created_at: string;
}

export interface ReviewCreateData {
  nome: string;
  nota: number;
  comentario: string;
}

export interface ReviewSummary {
  qtd_avaliacoes_usuarios: number;
  nota_media_usuarios: number | null;
}

export interface Movie {
  sk_movie_id: string;
  id_filme: string;
  titulo: string;
  data_lancamento?: string;
  ano_lancamento?: number;
  duracao_minutos?: number;
  sinopse?: string;
  url_poster?: string;
  url_backdrop?: string;
  diretor?: string;
  genero?: string;
  status_filme?: string;
}

export interface MovieDetail extends Movie {
  reviews_summary?: ReviewSummary | null;
  reviews: Review[];
}

export interface PaginatedMovies {
  items: Movie[];
  total: number;
  page: number;
  size: number;
}

export interface MovieCreateData {
  id_filme: string;
  titulo: string;
  data_lancamento?: string;
  ano_lancamento?: number;
  duracao_minutos?: number;
  sinopse?: string;
  url_poster?: string;
  url_backdrop?: string;
  diretor?: string;
  genero?: string;
  status_filme?: string;
}

export type MovieUpdateData = Partial<MovieCreateData>;
