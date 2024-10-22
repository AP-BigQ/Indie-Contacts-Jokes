
import type { LinksFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useFetcher, useLoaderData } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { requireUserId } from "~/.server/session";
import { createJoke, getRandJoke, JokeUpsert } from "~/models/joke.server";


import stylesUrl from "~/styles/jokes_index.css?url";
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {

  return json({  });
}


export const action = async ({ params, request }: ActionFunctionArgs) => {

  const userId = await requireUserId(request);
  const form = await request.formData();

  const content = form.get("content");
  const name = form.get("name");

  if (
    typeof content !== "string" ||
    typeof name !== "string"
  ) {
    throw new Error("Form not submitted correctly.");
  }

  const updates = Object.fromEntries(form) as JokeUpsert;

  const joke = await createJoke( userId, updates );
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  return (
    <div>
      <p>Add your own hilarious joke</p>
      <Form method="post">
        <div>
          <label>
            Name: <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label>
            Content: <textarea name="content" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </Form>
    </div>
  );
}
