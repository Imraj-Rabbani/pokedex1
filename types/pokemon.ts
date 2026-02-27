export interface PokemonListItem {
  id: number;
  name: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  results: { name: string; url: string }[];
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonDetail {
  id: number;
  name: string;
  types: string[];
  height: number;
  weight: number;
  stats: PokemonStat[];
  abilities: string[];
  artwork: string | null;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  genus: string;
  flavorText: string;
  generation: string;
  habitat: string | null;
  captureRate: number;
  baseHappiness: number;
  growthRate: string;
  eggGroups: string[];
  genderRatio: number;
}
