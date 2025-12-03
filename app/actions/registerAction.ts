"use server"
import { prisma } from "@/_lib/prisma";
import { loginAction } from "./auth";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

const prismaC = prisma;

export const registerAction = async(formData: FormData) :Promise<void> => {

    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");

    
  if (typeof email !== "string" || typeof password !== "string" || typeof name !== "string") {
    // early validation
    throw new Error("Name, Email, and password must be provided");
  }

   const hashedPassword = await bcrypt.hash(password, 10);

    try{
      
        await prismaC.user.create({ data: {name, email, password: hashedPassword} });
        console.log("User registered successfully");
       
    } catch (error) {
        const err = error as any;
        console.error("registerAction error detail:", err.response?.data ?? error);
        throw new Error("Failed to register.");
}
 // Automatically log in the user after registration
        await loginAction(formData);

};