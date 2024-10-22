import { json, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { requireUserId } from "~/.server/session";
import { createContact, getContacts } from "~/models/contact.server";
import { useCurrentUser } from "~/utils/currentUser";

import { useEffect, useState } from "react";
import type { ContactUpsert } from "~/models/contact.server";

import type { ActionFunctionArgs, LinksFunction } from "@remix-run/node";

//styling
import appStylesHref from "~/styles/contact.css?url";
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];
//styling

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const contacts = await getContacts(userId, q || "");

  return json({ contacts, q });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  //const newContact = {first:"", last:""} ;
  const newContact = {} as ContactUpsert;
  const contact = await createContact(userId, newContact);
  //return json({ contact });
  return redirect(`/contacts/${contact.id}/edit`);
};

export default function ContactsPage() {
  const user = useCurrentUser();
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [query, setQuery] = useState(q || "");
  const submit = useSubmit();
  const searching =
    navigation.location && new URLSearchParams(navigation.location.search);
  //console.log(searching);
  const searchingState = searching?.has("q");
  //console.log(searchingState);
  useEffect(() => {
    setQuery(q || "");
  }, [q]);

  return (
    <div className="flex w-full h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Contacts</Link>
        </h1>
        {/* <p>{user?.email}</p> */}
        <h3 className="text-3l font-bold">
          <Link to="/">{user?.email}</Link>
        </h3>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex justify-between  p-4 ">
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form
              id="search-form"
              role="search"
              onChange={(e) => {
                const isFirstSearch = q === null;
                submit(e.currentTarget, {
                  replace: !isFirstSearch,
                });
                console.log("submitting....onChange.");
              }}
            >
              <input
                className={searchingState ? "loading" : ""}
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                //defaultValue={q || ""} //seems do not matter if value
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
              />
              <div id="search-spinner" aria-hidden hidden={!searchingState} />
            </Form>

            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <NavLink
                      className={({ isActive, isPending }) =>
                        isActive ? "active" : isPending ? "pending" : ""
                      }
                      to={`/contacts/${contact.id}`}
                    >
                      {contact.first || contact.last ? (
                        <div>
                          {contact.last} {contact.first}
                        </div>
                      ) : (
                        <em>void-{contact.id.slice(-8)}</em>
                      )}{" "}
                      {contact.favorite ? <span> ★ </span> : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                {" "}
                <em>No contacts.</em>{" "}
              </p>
            )}
          </nav>
        </div>

        <div
          id="detail"
          className={
            navigation.state === "loading" && !searchingState ? "loading" : ""
          }
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
