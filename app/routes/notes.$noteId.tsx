import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  redirect,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { requireUserId } from "~/.server/session";
import { getNote } from "~/models/note.server";

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

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "note id not found");

  const formData = await request.formData();

  return redirect("/notes");
};

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.note.title}</h3>
      <p className="py-6">{data.note.body}</p>
      <hr className="my-4" />

      <div className="flex justify-between">
        <div>
          <Form action="edit" method="get">
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
              name="delete"
              type="submit"
            >
              Edit
            </button>
          </Form>
        </div>
        <div>
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
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
              name="delete"
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

export function ErrorBoundary() {
  const error = useRouteError();
  //console.error(error);
  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }
  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }
  if (error.status === 404) {
    return (
      <div className="rounded bg-red-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400">
        Note for this not found
      </div>
    );
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
