import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  MetaFunction,
  useMatches,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";

//https://dev.to/seasonedcc/add-a-global-progress-indicator-to-your-remix-app-2m52
import { GlobalLoading } from "./components/loadings";

export const meta: MetaFunction = () => {
  return [
    { title: "indie-contacts-jokes" },
    { name: "description", content: "indie-contacts-jokes!" },
  ];
};

// to include tailwind.css?url and below, seems to have working tailwind..
import "./tailwind.css";

import type { LinksFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];
/*   above for tailwind config.. */

import type { LoaderFunctionArgs } from "@remix-run/node";
import { getUser } from "./.server/session";
import { json } from "@remix-run/node";


//data in using useMatches hook
// { id, pathname, data, params, handle }, // root route
// root id is root.
// pay attention to {request} here.... Not a type Request, diff. from session request
export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ user: await getUser(request) });
};

export function Layout({
  children,
  title = "Remix",
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
 <GlobalLoading /> 
        {/* <body > */}
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const matches = useMatches();

  //console.log(matches[0].data);
  return (
    <>
      <Outlet />
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return (
    <div className="rounded bg-red-500 px-4 py-2 text-white ">
      <h1>App Error</h1>
      <pre>{errorMessage}</pre>
    </div>
  );
}
