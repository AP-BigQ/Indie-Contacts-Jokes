import type { LinksFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useFetcher, useLoaderData } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { requireUserId } from "~/.server/session";
import { getRandJoke } from "~/models/joke.server";


import stylesUrl from "~/styles/jokes_index.css?url";
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {

  const userId = await requireUserId(request);
  const joke = await getRandJoke(userId);

  if (!joke) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json({ joke });
};



export default function JokesIndexRoute() {
  const {joke} = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{joke.content}</p>
      <Link to={joke.id}>
        "{joke.name}" Permalink
      </Link>
    </div>
  );
}
