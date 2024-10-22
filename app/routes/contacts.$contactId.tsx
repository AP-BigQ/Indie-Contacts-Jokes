import type { FunctionComponent } from "react";
import { json, redirect } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { User, Contact } from "@prisma/client";
import { getContact } from "~/models/contact.server";
import { requireUserId } from "~/.server/session";

import defaultAvatar from "/favicon.ico?url";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.contactId, " Missing param contactId");
  const userId = await requireUserId(request);
  const contact = await getContact({ id: params.contactId, userId });
  if (!contact) {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  return json({ contact });
};

export default function Contact() {
  const { contact } = useLoaderData<typeof loader>();
  //console.log(contact);

  return (
    <div id="contact">
      <div>
        <img
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar || defaultAvatar}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <div>
              {contact.last} {contact.first}
            </div>
          ) : (
            <em>No Name</em>
          )}
          <Favorite contact={contact} />
        </h1>

        {contact?.twitter ? (
          <p>
            <a href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        ) : null}
        {contact?.contactNotes ? <p>{contact.contactNotes}</p> : null}

        <div>
          <Form
            action="edit"
            //method="post" //causing trouble!
            onSubmit={(event) => {
              console.log("editing....");
            }}
          >
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
              type="submit"
            >
              Edit
            </button>
          </Form>
          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const res = confirm(
                "Please confirm you want to delete this record.",
              );
              if (!res) {
                event.preventDefault();
              } else {
                console.log("Deleteing....");
              }
            }}
          >
            <button
              className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
              type="submit"
            >
              Delete
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  contact: Pick<Contact, "favorite">;
}> = ({ contact }) => {
  const fetcher = useFetcher();
  //const favorite = contact.favorite;
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <div>
      <fetcher.Form method="post">
        <button name="favorite" value={favorite ? "false" : "true"}>
          {favorite ? "★" : "☆"}
        </button>
      </fetcher.Form>
    </div>
  );
};
