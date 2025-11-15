"use server"

import { deleteSession, setSession } from "@/_lib/session";
import { UserType } from "@/_types/user";
import axios from "axios";
import { redirect } from "next/navigation"; 

const API_URL = "http://localhost:3001";

export const loginAction = async(formData: FormData) => {

    const email = formData.get("email");
    const password = formData.get("password");

    
  if (typeof email !== "string" || typeof password !== "string") {
    // early validation
    throw new Error("Email and password must be provided");
  }

    try{
        const response = await axios.get (`${API_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
        const user: UserType = response.data[0];
       if (!user || user.password !== formData.get("password")) {
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