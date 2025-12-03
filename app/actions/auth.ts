"use server"

import { deleteSession, setSession } from "@/_lib/session";
import { redirect } from "next/navigation"; 
import { prisma } from "@/_lib/prisma";
import bcrypt from "bcryptjs";

const prismaC = prisma;

export const loginAction = async(formData: FormData) => {

    const email = formData.get("email");
    const password = formData.get("password");

    
  if (typeof email !== "string" || typeof password !== "string") {
    // early validation
    throw new Error("Email and password must be provided");
  }

    try{
        const user = await prismaC.user.findUnique({ where: { email } });

       if (!user) {
            throw new Error("Invalid credentials");
        }

          const valid = await bcrypt.compare(password, user.password);
          if (!valid) {
            throw new Error("Invalid credentials");
        }
       // Set session cookie
        await setSession({name: user.name, email: user.email, id: user.id});
    } catch (err) {
        console.error("loginAction error:", err);
        throw new Error("Failed to login");
}
redirect ("/contact");
};

export const logoutAction = async() => {

    // Placeholder for logout logic
    await deleteSession();
    redirect ("/login");
};