import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/.server/session";
import { getNotes } from "~/models/note.server";
import { useCurrentUser } from "~/utils/currentUser";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const notes = await getNotes(userId);

  //for testing GlobalLoading
  await new Promise((resolve) => setTimeout(resolve, 2000));
  //console.log(notes);
  return json({ notes });
};

export default function NotesPage() {
  const user = useCurrentUser();
  const data = useLoaderData<typeof loader>();
  //console.log(data);

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Notes</Link>
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

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Note
          </Link>

          <hr />
          {data.notes.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {data.notes.map((note) => (
                <li key={note.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={note.id}
                  >
                    📝 {note.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
