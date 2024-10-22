import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { validateCredential } from "../utils/validation";
import { createUserSession, getUserId } from "~/.server/session";

export const meta: MetaFunction = () => [{ title: "Login" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("login loader.......");
  const userId = await getUserId(request);
  //console.log(userId);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  //console.log("action.......");
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const remember = formData.get("remember");
  const redirectTo = String(formData.get("redirectTo")) || "/";

  const { code, message, user } = await validateCredential(email, password);
  //console.log(code);

  if (code !== 0) {
    // throw new Response is diff from json(), new Response does NOT render UI, goes to ErrorBoundary directly
    //throw new Response(JSON.stringify(message), { status: 400, statusText: "Error" });
    return json(message, { status: 400, statusText: "Error" });
  }

  //return redirect("/");
  return createUserSession({
    request,
    userId: user?.id,
    remember: remember === "on" ? true : false,
    redirectTo,
  });
};

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  // console.log("actionData");
  // console.log(actionData);

  return (
    <div className="flex h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                type="email"
                id="email"
                required
                name="email"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.email ? (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData?.email}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            ></label>
            <div>
              <input
                type="password"
                id="password"
                required
                name="password"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.password ? (
                <div className="pt-1 text-red-700" id="password-error">
                  {actionData.password}
                </div>
              ) : null}
            </div>
          </div>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Log in
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: "/join",
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
