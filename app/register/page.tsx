import React from "react";
import RegisterForm from "../_components/Registerform";
import Link from "next/link";


const Register = () => {
    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md min-h-screen">
            <RegisterForm />
              <p className="mt-4 text-center"> Have an accout? <Link href="/login" className="text-blue-600 hover:underline"> Login</Link></p>
        </div>
    );
};

export default Register;