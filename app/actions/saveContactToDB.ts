'use server';

import { getSession } from "@/_lib/session";
import { UserType } from "@/_types/user";
import { prisma } from "@/_lib/prisma";
import { encryptData, decryptData} from "../utils/crypto";
import { redirect } from "next/navigation";

const prismaC = prisma;

export const saveContactsAction = async (formData: FormData) => {
  // 1. Get the authenticated user session
  console.log(Object.fromEntries(formData.entries()))
  const session = await getSession();
  if (!session) {
    throw new Error(String("User not authenticated"));
  }
  const user = session as UserType;
  const userId = user.id;

  // 2. Retrieve user from database to get password
  const existingUser = await prismaC.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new Error(String("Authenticated user not found in database"));
  }
  const userPassword = existingUser.password;
  if (!userPassword) {
    throw new Error(String("User password not found"));
  }

 // 3. Extract contact data from form
const name = formData.get("name")?.toString() ?? "";
const email = formData.get("email")?.toString() ?? "";
const phone = formData.get("phone")?.toString() ?? "";

if (!name || !email || !phone) {
  throw new Error(String("All fields are required"));
}

const userInfo = {
  name: name,
  email: email,
  phone: phone
};

  // 4. Encrypt the contact data
  let encryptedData: any = null;
  try {
    encryptedData = await encryptData(userPassword, userInfo);
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error(String("Failed to encrypt contact data"));
  }

  if (!encryptedData) {
    throw new Error(String("Encryption returned no data"));
    
  }

  const payload = {
      salt: String(encryptedData.salt),
      iv: String(encryptedData.iv),
      ct: String(encryptedData.ct)
    }
  console.log("Payload to save:", payload);

  // 5. Save encrypted contact to database
  try {
    await prismaC.contact.create({
      data: {
        userId,
        payload // Prisma JSON field
      },
    });
    console.log("Contact saved successfully");
  } catch (error) {
    console.error("Failed to save contact:", error);
    throw new Error(String("Failed to save contact"));
  }

  // 6. Redirect to contact page after successful save
  redirect("/contact");
};
