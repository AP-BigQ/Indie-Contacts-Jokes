import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";
import { requireUserId } from "~/.server/session";
import { getContact, updateContact } from "~/models/contact.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId");
  const userId = await requireUserId(request);
  const contact = await getContact({ userId, id: params.contactId });

  if (!contact) {
    throw new Response("Not found", {
      status: 404,
    });
  }

  return json({ contact });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const userId = await requireUserId(request);
  const form = await request.formData();
  const updates = Object.fromEntries(form);
  await updateContact({ id: params.contactId, updates });
  return redirect(`/contacts/${params.contactId}`);

  //console.log("action hre...")
  return null;
};

export default function EditPage() {
  const { contact } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  return (
    <Form key={contact.id} method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          type="text"
          name="first"
          defaultValue={contact.first}
          placeholder="First"
        />
        <input
          type="text"
          name="last"
          defaultValue={contact.first}
          placeholder="Last"
        />
      </p>
      <label>
        <span>X</span>
        <input
          type="text"
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="@jack"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          defaultValue={contact.contactNotes}
          name="contactNotes"
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </p>
    </Form>
  );
}
