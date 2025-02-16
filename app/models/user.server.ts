import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/.server/db";

export type { User } from "@prisma/client";

export async function userLogin(
  email: User["email"],
  password: Password["hash"],
): Promise<User | null> {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
      notes: true,
      contacts: {
        where: {
          first: "",
        },
      },
    },
  });
  console.log(`logged in user `);
  console.log(userWithPassword?.email);

  if (!userWithPassword || !userWithPassword.password) return null;

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash,
  );
  if (!isValid) return null;

  //destructure
  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function createUser(
  email: User["email"],
  password: Password["hash"],
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}
