import { useCallback, useEffect, useState } from "react";
import type { PokemonListItem, PokemonListResponse } from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";
const PAGE_SIZE = 50;

export const SPRITE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

function extractIdFromUrl(url: string): number {
  const segments = url.replace(/\/$/, "").split("/");
  return Number(segments[segments.length - 1]);
}

async function fetchPokemonList(
  offset: number,
  limit: number
): Promise<{ pokemon: PokemonListItem[]; hasMore: boolean }> {
  const res = await fetch(
    `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`
  );
  if (!res.ok) throw new Error("Failed to fetch Pokémon list");

  const data: PokemonListResponse = await res.json();

  const pokemon: PokemonListItem[] = data.results.map((p) => ({
    id: extractIdFromUrl(p.url),
    name: p.name,
  }));

  return { pokemon, hasMore: data.next !== null };
}

export function usePokemonList() {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!hasMore && offset > 0) return;
    try {
      const result = await fetchPokemonList(offset, PAGE_SIZE);
      setPokemon((prev) => [...prev, ...result.pokemon]);
      setHasMore(result.hasMore);
    } finally {
      setLoading(false);
    }
  }, [offset, hasMore]);

  useEffect(() => {
    load();
  }, [load]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setOffset((prev) => prev + PAGE_SIZE);
      setLoading(true);
    }
  };

  return { pokemon, loading, loadMore };
}
