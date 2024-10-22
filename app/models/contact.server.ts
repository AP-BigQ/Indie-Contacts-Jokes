import { prisma } from "~/.server/db";

import type { User, Contact } from "@prisma/client";

import { Prisma } from "@prisma/client";

function generateContactQuery(userId: string, searchQuery?: string) {
  const baseQuery: Prisma.ContactWhereInput = {
    userId: userId,
  };

  if (searchQuery) {
    baseQuery.OR = [
      {
        first: {
          contains: searchQuery,
        },
      },
      {
        last: {
          contains: searchQuery,
        },
      },
    ];
  }

  return baseQuery;
}

export async function getContacts(userId: string, searchQuery?: string) {
  const where = generateContactQuery(userId, searchQuery);

  return await prisma.contact.findMany({
    where,
    /*     select: { id: true, first: true, last: true, avatar:true,twitter:true,contactNotes:true, favorite:true }, */
    orderBy: [
      {
        updatedAt: "desc",
      },
      {
        last: "desc",
      },
    ],
  });
}

export type ContactUpsert = {
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  contactNotes?: string;
  favorite?: boolean;
};

export async function createContact(
  userId: User["id"],
  contactInfo: ContactUpsert,
) {
  const contact = await prisma.contact.create({
    data: {
      ...contactInfo,
      userId,
    },
  });
  return contact;
}

export const getContact = async ({
  id,
  userId,
}: Pick<Contact, "id"> & { userId: User["id"] }) => {
  return await prisma.contact.findUnique({
    where: { id, userId },
    /* select: { id: true, first: true, last: true, avatar:true,twitter:true,contactNotes:true, favorite:true }, */
  });
};

export const updateContact = async ({
  id,
  updates,
}: Pick<Contact, "id"> & { updates: ContactUpsert }) => {
  return await prisma.contact.update({
    where: { id },
    data: {
      ...updates,
      id,
    },
  });
};

export const deleteContact = async ({
  id,
  userId,
}: Pick<Contact, "id"> & { userId: User["id"] }) => {
  return await prisma.contact.deleteMany({
    where: { id, userId },
  });
};
