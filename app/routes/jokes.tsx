import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";

import type { ActionFunctionArgs, LinksFunction } from "@remix-run/node";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/.server/session";

import { useCurrentUser } from "~/utils/currentUser";
import { Header } from "~/components/Commons";

import { getJokes } from "~/models/joke.server";

//styling
import globalLargeStylesUrl from "~/styles/jokes_global-large.css?url";
import globalMediumStylesUrl from "~/styles/jokes_global-medium.css?url";
import globalStylesUrl from "~/styles/jokes_global.css?url";
import stylesUrl from "~/styles/jokes.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStylesUrl },
  {
    rel: "stylesheet",
    href: globalMediumStylesUrl,
    media: "print, (min-width: 640px)",
  },
  {
    rel: "stylesheet",
    href: globalLargeStylesUrl,
    media: "screen and (min-width: 1024px)",
  },
  { rel: "stylesheet", href: stylesUrl },
];
//styling

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const jokes = await getJokes(userId);


  return json({jokes});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  return json({});
};

export default function JokesRoute() {
  const user = useCurrentUser();
  const {jokes} = useLoaderData<typeof loader>();

  return (
    <div className="jokes-layout flex justify-between">
      <Header section={"J🤪KES"} user={{ email: user?.email ?? "" }} />

      
      <main className="jokes-main w-3/4 mx-auto ">

      <div className=" flex justify-between ">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul className="block p-4 text-xl text-blue-500">
              {jokes.map(({ id, name }) => (
                <li key={id}>
                  <Link to={id}>{name}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>


          <div className="jokes-outlet mx-auto px-8">
            <Outlet />
          </div>
          </div>

      </main>
    </div>
  );
}
