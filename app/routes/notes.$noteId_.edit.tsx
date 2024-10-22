import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";
import { requireUserId } from "~/.server/session";
import { getNote, updateNote } from "~/models/note.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "note id not found");
  const note = await getNote({ id: params.noteId, userId });
  if (!note)
    throw new Response("Not Found", {
      status: 404,
    });
  return json({ note });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.noteId, "note id not found");
  const form = await request.formData();
  const updates = Object.fromEntries(form);
  await updateNote({ id: params.noteId, updates });

  return redirect(`/notes/${params.noteId}`);
};

export default function EditNotePage() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form key={data.note.id} method="post">
      <label className="text-2xl font-bold">
        <span>Title: </span>
      </label>
      <br />
      <input
        className="text-2xl"
        type="text"
        defaultValue={data.note.title}
        name="title"
      />
      <hr />
      <label className="text-2xl font-bold">
        <span>Body:</span>
      </label>
      <br />
      <textarea
        className="py-6"
        defaultValue={data.note.body}
        name="body"
        rows={6}
      />

      <hr className="my-4" />

      <div className="flex justify-between">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          type="submit"
        >
          Save
        </button>

        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          type="button"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </Form>
  );
}
