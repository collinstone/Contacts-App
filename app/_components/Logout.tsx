"use client";
import React from "react";
import { logoutAction } from "../actions/auth";
import { deleteSession } from "@/_lib/session";
import { useRouter } from "next/navigation";

const Logout = () => {
    const router = useRouter();
    const handleLogOut = async() => {
        try {
            await logoutAction();
            deleteSession();
            //the redirect happens in the server action
            // this client-side redirect is a fallback
            //redirect(/login");
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
        console.log("Logging out...");

    }
    return (
        <div>
            
                <button type="button" className="hover:text-red-600 cursor-pointer" onClick={handleLogOut}>
                    Logout
                </button>
            
        </div>
    );
};

export default Logout;