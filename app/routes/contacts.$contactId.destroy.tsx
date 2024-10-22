import { ActionFunctionArgs, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { requireUserId } from "~/.server/session";
import { deleteContact } from "~/models/contact.server";

export const loader = () => {
  return redirect("/contacts");
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contact id");
  const userId = await requireUserId(request);
  await deleteContact({ userId, id: params.contactId });
  return redirect("/contacts");
};
