import type { FunctionComponent } from "react";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useFetcher, useLoaderData } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { User } from "@prisma/client";

import { requireUserId } from "~/.server/session";
import { getJoke } from "~/models/joke.server";



export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.jokeId, " Missing param jokeId");
  const userId = await requireUserId(request);
  const joke = await getJoke({ id: params.jokeId, userId });

  if (!joke) {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  return json({ joke });
};




export default function JokeRoute() {

  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
      <Link to=".">"{data.joke.name}" Permalink</Link>
    </div>
  );
}
