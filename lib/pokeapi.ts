import { useEffect, useState } from "react";
import type {
  PokemonListItem,
  PokemonListResponse,
  PokemonDetail,
  PokemonSpecies,
} from "@/types/pokemon";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchPokemonList(offset, PAGE_SIZE)
      .then((result) => {
        if (cancelled) return;
        setPokemon((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newItems = result.pokemon.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newItems];
        });
        setHasMore(result.hasMore);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [offset]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setOffset((prev) => prev + PAGE_SIZE);
    }
  };

  return { pokemon, loading, loadMore };
}

async function fetchPokemonDetail(id: string): Promise<PokemonDetail> {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!res.ok) throw new Error("Failed to fetch Pokémon detail");

  const data = await res.json();

  return {
    id: data.id,
    name: data.name,
    types: data.types.map((t: { type: { name: string } }) => t.type.name),
    height: data.height,
    weight: data.weight,
    stats: data.stats.map(
      (s: { base_stat: number; stat: { name: string } }) => ({
        name: s.stat.name,
        value: s.base_stat,
      })
    ),
    abilities: data.abilities.map(
      (a: { ability: { name: string } }) => a.ability.name
    ),
    artwork:
      data.sprites?.other?.["official-artwork"]?.front_default ?? null,
  };
}

export function usePokemonDetail(id: string) {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchPokemonDetail(id)
      .then((data) => {
        if (!cancelled) setPokemon(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { pokemon, loading, error };
}

async function fetchPokemonSpecies(id: string): Promise<PokemonSpecies> {
  const res = await fetch(`${BASE_URL}/pokemon-species/${id}`);
  if (!res.ok) throw new Error("Failed to fetch Pokémon species data");

  const data = await res.json();

  const englishFlavor = data.flavor_text_entries?.find(
    (e: { language: { name: string } }) => e.language.name === "en"
  );

  const englishGenus = data.genera?.find(
    (g: { language: { name: string } }) => g.language.name === "en"
  );

  return {
    id: data.id,
    name: data.name,
    genus: englishGenus?.genus ?? "Unknown",
    flavorText: (englishFlavor?.flavor_text ?? "")
      .replace(/\f/g, " ")
      .replace(/\n/g, " "),
    generation: data.generation?.name?.replace("generation-", "").toUpperCase() ?? "?",
    habitat: data.habitat?.name ?? null,
    captureRate: data.capture_rate,
    baseHappiness: data.base_happiness ?? 0,
    growthRate: data.growth_rate?.name?.replace(/-/g, " ") ?? "unknown",
    eggGroups: data.egg_groups?.map(
      (g: { name: string }) => g.name.replace(/-/g, " ")
    ) ?? [],
    genderRatio: data.gender_rate,
  };
}

export function usePokemonSpecies(id: string) {
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchPokemonSpecies(id)
      .then((data) => {
        if (!cancelled) setSpecies(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { species, loading, error };
}
