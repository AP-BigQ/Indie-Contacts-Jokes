import { redirect } from "@remix-run/react";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { deleteNote } from "~/models/note.server";
import { requireUserId } from "~/.server/session";
import invariant from "tiny-invariant";

export const loader = async () => {
  return redirect("/notes");
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "note id not found");

  await deleteNote({ id: params.noteId, userId });

  return redirect("/notes");
};
