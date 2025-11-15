import React from "react";
import LoginForm from "../_components/LoginForm";
import Link from "next/link";

const Login = () => {
    return (
        <div className = "max-w-md mx-auto bg-white p-8 rounded-lg shadow-md min-h-screen">
            <LoginForm/>
            <p className="mt-4 text-center">Don't have an accout? <Link href="/register" className="text-blue-600 hover:underline"> Register</Link></p>
        </div>
    )
}

export default Login;