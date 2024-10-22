import { userLogin } from "~/models/user.server";

import type { User } from "@prisma/client";
import { createNote } from "~/models/note.server";

/*
 * return code+message
 * 00--- email 0, password:0
 * 01--- email 0, password: 1
 * 10--- email 1, password: 0
 * 11--- email 1, password: 1
 */
type TypeMessage = {
  email?: string;
  password?: string;

  title?: string;
  body?: string;
};

export async function validateCredential(email: any, password: any) {
  let message = {} as TypeMessage;
  let code = 0 as number;

  if (email.length <= 4 || !email.includes("@")) {
    message["email"] = "Email is invalid";
    code |= 2;
  }
  if (password.length < 7 || password.length === 0) {
    message.password = "Password is required and at least 8 long";
    code |= 1;
  }
  const user = await userLogin(email, password);
  if (user === null) {
    message.email = "Email and/or Password is invalid";
    code |= 4;
  }
  //console.log({code, message});

  return { code, message, user };
}

export async function validationNoteNew(
  formData: FormData,
  userId: User["id"],
) {
  let message = {} as TypeMessage;
  let code = 0 as number;
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  if (title === undefined || title.length === 0) {
    message["title"] = "Title is invalid";
    code |= 2;
  }
  if (body === undefined || body.length === 0) {
    message["body"] = "Body is invalid";
    code |= 1;
  }

  const note = await createNote({ userId, title, body });

  if (note === null) {
    message.title = "invalid";
    code |= 3;
  }
  //console.log({code, message});

  return { code, message, note };
}
