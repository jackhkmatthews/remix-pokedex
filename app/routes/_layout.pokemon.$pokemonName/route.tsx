import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { X } from "lucide-react";
import { z } from "zod";
import { getPokemonDetail } from "~/data-fetching";
import { Image } from "./image";

const PokemonDetailUrlSchema = z.object({
  pokemonName: z.string(),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const pokemonName = params.pokemonName;
  const result = PokemonDetailUrlSchema.safeParse({ pokemonName });
  if (!result.success) {
    throw new Response(`Invalid params`, {
      status: 400,
    });
  }

  const data = await getPokemonDetail(result.data.pokemonName);
  return json({ data, pokemonName: result.data.pokemonName });
}

export default function PokemonDetailPage() {
  const loaderData = useLoaderData<typeof loader>();
  const location = useLocation();

  return (
    <div className="flex flex-col items-center">
      <Link
        className="text-blue-500 underline"
        preventScrollReset
        to={`/${location.search}`}
      >
        <X />
      </Link>
      <h1 className="capitalize text-3xl w-full text-center p-3">
        {loaderData.data.id}. {loaderData.data.name}
      </h1>
      <Image
        height={200}
        width={200}
        className={"max-w-2xl w-full p-2"}
        src={loaderData.data.sprites.other["official-artwork"].front_default}
        alt={loaderData.data.name}
      />
      <p>Height: {loaderData.data.height}</p>
      <p>Weight: {loaderData.data.weight}</p>
    </div>
  );
}
