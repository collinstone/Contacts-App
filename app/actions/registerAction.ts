"use server"
import axios from "axios";
import { redirect } from "next/navigation"; 
import { loginAction } from "./auth";

const API_URL = "http://localhost:3001";

export const registerAction = async(formData: FormData) :Promise<void> => {

    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");

    
  if (typeof email !== "string" || typeof password !== "string" || typeof name !== "string") {
    // early validation
    throw new Error("Name, Email, and password must be provided");
  }

    try{
        await axios.post(`${API_URL}/users`, {
            email: email,
            name: name,
            password: password 
        });
        console.log("User registered successfully");
       
    } catch (error) {
        const err = error as any;
        console.error("registerAction error detail:", err.response?.data ?? error);
        throw new Error("Failed to register.");
}
 // Automatically log in the user after registration
        await loginAction(formData);

};