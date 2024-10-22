import type { MetaFunction } from "@remix-run/node";
import { Form, json, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { useState, useEffect } from "react";
import { useCurrentUser } from "~/utils/currentUser";

import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const ds = url.searchParams.get("ds");

  return json({ ds });
};
export default function Index() {
  const user = useCurrentUser();
  const { ds } = useLoaderData<typeof loader>();
  const [dataSrc, setDataSrc] = useState(ds || "ORM");
  const submit = useSubmit();

  useEffect(() => {
    setDataSrc(ds || "ORM");
  }, [ds]);

  return (
    <div className=" w-full">
      <main className="relative min-h-screen bg-white sm:flex sm:items-center justify-center">
        <div className=" max-w-screen">
          <div className="mx-auto mt-10 max-w-screen ">
            {user ? (
              <div className="flex h-full min-h-screen flex-col">
                <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
                  <h1 className="text-3xl font-bold">
                    <Link to=".">Welcome.....</Link>
                  </h1>
                  <p>{"  "}</p>
                  <p>{user.email}</p>
                  <Form action="/logout" method="post">
                    <button
                      type="submit"
                      className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
                    >
                      Logout
                    </button>
                  </Form>
                </header>

                <ul>
                  <li className="flex items-center justify-center">
                    <Link
                      to="/notes"
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                    >
                      View Notes
                    </Link>
                  </li>
                  <li className="flex items-center justify-center">
                    <Link
                      to={`/contacts?ds=${dataSrc}`}
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                    >
                      View Contacts
                    </Link>
                    <Form
                      method="get"
                      onChange={(e) => {
                        submit(e.currentTarget);
                      }}
                    >
                      <select
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        name="ds"
                        id="ds"
                        value={dataSrc}
                        onChange={(e) => setDataSrc(e.currentTarget.value)}
                      >
                        <option value="ORM">Prisma</option>
                        <option value="Records">Records</option>
                      </select>
                    </Form>
                  </li>
                  <li>
                    <Link
                      to="/posts"
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                    >
                      View Posts
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/jokes"
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                    >
                      View Jokes
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                <Link
                  to="/join"
                  className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
        <div></div>

        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <footer className="mt-6 flex flex-wrap justify-bottom gap-8">
            {getFooterImages().map((foot) => (
              <a
                key={foot.href}
                href={foot.href}
                className="flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0"
              >
                <img src={foot.src} alt={foot.alt} className="object-contain" />
              </a>
            ))}
          </footer>
        </div>
      </main>
    </div>
  );
}

function getFooterImages() {
  return [
    {
      src: "https://user-images.githubusercontent.com/1500684/157764397-ccd8ea10-b8aa-4772-a99b-35de937319e1.svg",
      alt: "Fly.io",
      href: "https://fly.io",
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157764395-137ec949-382c-43bd-a3c0-0cb8cb22e22d.svg",
      alt: "SQLite",
      href: "https://sqlite.org",
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157764484-ad64a21a-d7fb-47e3-8669-ec046da20c1f.svg",
      alt: "Prisma",
      href: "https://prisma.io",
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157764276-a516a239-e377-4a20-b44a-0ac7b65c8c14.svg",
      alt: "Tailwind",
      href: "https://tailwindcss.com",
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157764454-48ac8c71-a2a9-4b5e-b19c-edef8b8953d6.svg",
      alt: "Cypress",
      href: "https://www.cypress.io",
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157772386-75444196-0604-4340-af28-53b236faa182.svg",
      alt: "MSW",
      href: "https://mswjs.io",
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157772447-00fccdce-9d12-46a3-8bb4-fac612cdc949.svg",
      alt: "Vitest",
      href: "https://vitest.dev",
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png",
      alt: "Testing Library",
      href: "https://testing-library.com",
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg",
      alt: "Prettier",
      href: "https://prettier.io",
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg",
      alt: "ESLint",
      href: "https://eslint.org",
    },
    {
      src: "https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg",
      alt: "TypeScript",
      href: "https://typescriptlang.org",
    },
  ];
}
