// app/actions/db_action.ts
"use server";

import { prisma } from "@/_lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { decryptData, encryptData } from "../utils/crypto";
import type { Contact as DbContact } from "@prisma/client";

export interface DecryptedContact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export type FetchedContacts = DecryptedContact[] | null;

export const fetchContactByContactId = async (): Promise<FetchedContacts> => {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("session")?.value;
  if (!sessionValue) {
    redirect("/login");
  }

  let user: any;
  try {
    user = JSON.parse(sessionValue);
  } catch {
    redirect("/login");
  }

  if (!user?.id || !user?.email) {
    redirect("/login");
  }

  const existingUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!existingUser) {
    throw new Error("Authenticated user not found in database");
  }
  const userPassword = existingUser.password as string;

  const contactRows = await prisma.contact.findMany({ where: { userId: user.id } });
  if (!contactRows || contactRows.length === 0) {
    return null;
  }

  const decryptedContacts: DecryptedContact[] = [];
  for (const row of contactRows) {
    const payload = row.payload as unknown;
    if (
      !payload ||
      typeof payload !== "object" ||
      typeof (payload as any).salt !== "string" ||
      typeof (payload as any).iv !== "string" ||
      typeof (payload as any).ct !== "string"
    ) {
      console.warn("Invalid encrypted payload, skipping contact:", row.id);
      continue;
    }
    const { salt, iv, ct } = payload as { salt: string; iv: string; ct: string };
    let decrypted: any;
    try {
      decrypted = await decryptData(userPassword, { salt, iv, ct });
    } catch (err) {
      console.warn("Decryption failed for contact:", row.id, err);
      continue;
    }
    if (
      typeof decrypted.name !== "string" ||
      typeof decrypted.email !== "string" ||
      typeof decrypted.phone !== "string"
    ) {
      console.warn("Decrypted contact has invalid format, skipping:", row.id, decrypted);
      continue;
    }
    decryptedContacts.push({
      id: row.id,
      name: decrypted.name,
      email: decrypted.email,
      phone: decrypted.phone,
    });
  }

  return decryptedContacts;
};


export interface ContactUpdateInput {
  contactId: string;
  name: string;
  email: string;
  phone: string;
}


//...................Contact Update section................................/

export async function updateContact(input: ContactUpdateInput) {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("session")?.value;
  if (!sessionValue) {
    redirect("/login");
  }
  let user: any;
  try {
    user = JSON.parse(sessionValue);
  } catch {
    redirect("/login");
  }
  if (!user?.id) {
    redirect("/login");
  }
  const userId = user.id as string;

  const existing = await prisma.contact.findUnique({
    where: { id: input.contactId },
    select: { userId: true },
  });
  if (!existing) {
    throw new Error("Contact not found");
  }
  if (existing.userId !== userId) {
    throw new Error("Not authorized to edit this contact");
  }

  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new Error("Authenticated user not found");
  }
  const userPassword = existingUser.password as string;

  const encrypted = await encryptData(userPassword, {
    name: input.name,
    email: input.email,
    phone: input.phone,
  });

  const updated: DbContact = await prisma.contact.update({
    where: { id: input.contactId },
    data: { payload: encrypted },
  });

  return updated;
}


export async function deleteContactByContactId(contactId: string): Promise<DbContact> {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("session")?.value;
  if (!sessionValue) {
    redirect("/login");
  }
  let user: any;
  try {
    user = JSON.parse(sessionValue);
  } catch {
    redirect("/login");
  }
  if (!user?.id) {
    redirect("/login");
  }
  const userId = user.id as string;

  const existing = await prisma.contact.findUnique({
    where: { id: contactId },
    select: { userId: true },
  });
  if (!existing) {
    throw new Error("Contact not found");
  }
  if (existing.userId !== userId) {
    throw new Error("Not authorized to delete this contact");
  }

  const deleted = await prisma.contact.delete({ where: { id: contactId } });
  return deleted;
}
