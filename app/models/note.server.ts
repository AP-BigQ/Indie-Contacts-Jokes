import { prisma } from "~/.server/db";

import type { User, Note } from "@prisma/client";

export async function getNotes(userId: string) {
  //console.log(userId);
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  //console.log(user);
  const notes = await prisma.note.findMany({
    where: { userId },
    select: { id: true, title: true, body: true },
    orderBy: { updatedAt: "desc" },
  });

  return notes;
}

type TypeNote = {
  userId: User["id"];
  title: Note["title"];
  body: Note["body"];
};

export async function createNote({ userId, title, body }: TypeNote) {
  const note = await prisma.note.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return note;
}

export const getNote = async ({
  id,
  userId,
}: Pick<Note, "id"> & { userId: User["id"] }) => {
  return await prisma.note.findUnique({
    where: { id, userId },
    select: { id: true, title: true, body: true },
  });
};

export const deleteNote = async ({
  id,
  userId,
}: Pick<Note, "id"> & { userId: User["id"] }) => {
  return await prisma.note.deleteMany({
    where: { id, userId },
  });
};

export const updateNote = async ({
  id,
  updates,
}: Pick<Note, "id"> & { updates: Record<string, unknown> }) => {
  return await prisma.note.update({
    where: { id },
    data: updates,
  });
};
