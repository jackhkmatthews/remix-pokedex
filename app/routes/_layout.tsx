import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  json,
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useRouteError,
  useSubmit,
} from "@remix-run/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { getPokemonList } from "~/data-fetching";
import { pageToOffset, updateSearchParams } from "~/utils";
import { z } from "zod";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Pokedex" },
    { name: "description", content: "Pokedex built with Remix" },
  ];
};

const PokemonListUrlSchema = z.object({
  limit: z.coerce.number().min(1).max(100),
  page: z.coerce.number().min(1),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const limit = params.get("limit") ? params.get("limit")! : "10";
  const page = params.get("page") ? params.get("page")! : "1";
  const result = PokemonListUrlSchema.safeParse({ limit, page });
  if (!result.success) {
    throw new Response(`Invalid query parameters.`, {
      status: 400,
    });
  }
  const data = await getPokemonList(result.data);
  return json({ data, limit, page });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const limitInputRef = useRef<HTMLSelectElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (limitInputRef.current) {
      limitInputRef.current.value = loaderData.limit || "";
    }
  }, [loaderData.limit]);

  return (
    <div className="font-sans p-4">
      <div className="flex justify-between py-4">
        <Form
          onChange={(event) => {
            submit(event.currentTarget);
          }}
          action={location.pathname}
        >
          <div>
            <label htmlFor="limit">Limit: </label>
            <select
              name="limit"
              id="limit"
              ref={limitInputRef}
              defaultValue={loaderData.limit || "10"}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <input name="page" type="hidden" value={loaderData.page} />
        </Form>
        <div className="flex flex-nowrap gap-4">
          {loaderData.data.previous ? (
            <Link
              to={`${location.pathname}?${updateSearchParams(location.search, {
                page: parseInt(loaderData.page) - 1,
              }).toString()}`}
            >
              <ChevronLeft />
              <span className="sr-only">Previous</span>
            </Link>
          ) : (
            <p className="text-gray-100">
              <ChevronLeft />
            </p>
          )}
          Page: {loaderData.page}
          {loaderData.data.next ? (
            <Link
              to={`${location.pathname}?${updateSearchParams(location.search, {
                page: parseInt(loaderData.page) + 1,
              }).toString()}`}
            >
              <ChevronRight />
              <span className="sr-only">Next</span>
            </Link>
          ) : (
            <p className="text-gray-100">
              <ChevronRight />
            </p>
          )}
        </div>
      </div>
      <ul>
        {loaderData.data.results.map((pokemon, index) => {
          return (
            <li key={pokemon.name}>
              <p>
                {pageToOffset(
                  parseInt(loaderData.page),
                  parseInt(loaderData.limit)
                ) +
                  index +
                  1}
                .{" "}
                <Link
                  preventScrollReset
                  to={`/${encodeURIComponent(pokemon.name)}${location.search}`}
                >
                  {pokemon.name}
                </Link>
              </p>
            </li>
          );
        })}
      </ul>
      <Outlet />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div>
      <h1>
        Oops! A {isRouteErrorResponse(error) ? "server" : "client"} error
        occurred!
      </h1>
      {isRouteErrorResponse(error) && <p>{error.data}</p>}
      {error instanceof Error && <p>{error.message}</p>}
    </div>
  );
}
