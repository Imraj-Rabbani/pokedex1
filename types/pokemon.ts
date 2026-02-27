export interface PokemonListItem {
  id: number;
  name: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  results: { name: string; url: string }[];
}
