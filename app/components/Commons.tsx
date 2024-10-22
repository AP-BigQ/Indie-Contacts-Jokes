import { Form, Link } from "@remix-run/react";
import type { FunctionComponent } from "react";

import { User } from "@prisma/client";

export const Header: FunctionComponent<{
  section: string;
  user: Pick<User, "email">;
}> = ({ section, user }) => {
  return (
    <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
      <div>
        <h1 className="text-3xl font-bold">
          <Link to=".">{section}</Link>
        </h1>
      </div>

      <div>
        <h3 className="text-3l font-bold">
          <Link to="/">{user.email}</Link>
        </h3>
      </div>

      <div>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </div>
    </header>
  );
};
