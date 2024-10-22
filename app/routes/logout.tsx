import { redirect } from "@remix-run/react";

import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { logout } from "~/.server/session";

export const loader = async () => redirect("/");

export const action = async ({ request }: ActionFunctionArgs) =>
  logout(request);
