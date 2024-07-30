import { pageToOffset } from "./utils";

const POKE_API_BASE_URL = "https://pokeapi.co/api/v2";

interface Pokemon {
  name: string;
  url: string;
}

interface PokeAPIPokemonList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

interface Variables {
  limit?: number;
  page?: number;
}

export async function getPokemonList({ limit = 10, page = 1 }: Variables = {}) {
  const offset = pageToOffset(page, limit);
  const searchParams = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });
  const pokeResponse = await fetch(
    `${POKE_API_BASE_URL}/pokemon?${searchParams.toString()}`
  );
  if (!pokeResponse.ok) {
    throw new Response("Failed to fetch Pokemon list data", { status: 500 });
  }
  return (await pokeResponse.json()) as PokeAPIPokemonList;
}

interface PokemonSprites {
  back_default: string;
  back_female: string | null;
  back_shiny: string;
  back_shiny_female: string | null;
  front_default: string;
  front_female: string | null;
  front_shiny: string;
  front_shiny_female: string | null;
  other: {
    dream_world: {
      front_default: string;
      front_female: string | null;
    };
    home: {
      front_default: string;
      front_female: string | null;
      front_shiny: string;
      front_shiny_female: string | null;
    };
    "official-artwork": {
      front_default: string;
      front_shiny: string;
    };
    showdown: {
      back_default: string;
      back_female: string | null;
      back_shiny: string;
      back_shiny_female: string | null;
    };
  };
}

interface Pokemon {
  height: number;
  weight: number;
  id: number;
  name: string;
  order: number;
  sprites: PokemonSprites;
}

export async function getPokemonDetail(pokemonName: string) {
  const pokeResponse = await fetch(
    `${POKE_API_BASE_URL}/pokemon/${encodeURIComponent(pokemonName)}`
  );
  if (!pokeResponse.ok) {
    throw new Response(`Failed to fetch Pokemon data for ${pokemonName}`, {
      status: 500,
    });
  }
  return (await pokeResponse.json()) as Pokemon;
}
