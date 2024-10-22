import { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useActionData } from "@remix-run/react";
import { requireUserId } from "~/.server/session";
import { validationNoteNew } from "~/utils/validation";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const { code, message, note } = await validationNoteNew(formData, userId);

  if (code !== 0) {
    // throw new Response is diff from json(), new Response does NOT render UI, goes to ErrorBoundary directly
    //throw new Response(JSON.stringify(message), { status: 400, statusText: "Error" });
    return json(message, { status: 400, statusText: "Error" });
  }

  return redirect(`/notes/${note.id}`);
};

export default function NewNotePage() {
  const actionData = useActionData();

  return (
    <Form method="post">
      <div>
        <label htmlFor="title" className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            type="text"
            id="title"
            name="title"
          />
        </label>
      </div>
      <label className="flex w-full flex-col gap-1" htmlFor="body">
        <span>Body: </span>
        <textarea
          className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
          rows={8}
          name="body"
          id="body"
        ></textarea>
      </label>

      <div></div>

      <div className="text-right">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          type="submit"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
