import React from "react";
import Link from "next/link";
import Logout from "./Logout";
import { getSession } from "@/_lib/session";

const Navbar = async () => {
    const session = await getSession(); // Placeholder for session management logic
    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-blue-600">
                    Contact Manager
                </Link>

                <div className="flex items-center space-x-4">
                    {session ? (
                        <>
                            <Link href="/contact" className="hover:text-blue-600 mr-8">
                                Contacts
                            </Link>
                            <Logout />
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-blue-600">
                                Login
                            </Link>
                            <Link href="/register" className="hover:text-blue-600">
                                Register
                            </Link> 
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
