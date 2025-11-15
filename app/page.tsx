import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import Footer from "./_components/Footer";



export async function GetSession() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("session")?.value;

  if (sessionValue) {
    redirect("/contact");
  }
}


export default async function Home() {
  
  await GetSession();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col grow ">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-20 bg-white">
        <h1 className="text-4xl font-bold mb-4">Manage Your Contacts Effortlessly</h1>
        <p className="text-lg text-gray-600 mb-8">
          A simple, powerful contact manager to organize, track and grow your network.
        </p>
        <div className="space-x-4">
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
            Login
          </a>
          <a href="/register" className="px-6 py-3 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 cursor-pointer">
            Register
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Add & Organize Contacts</h3>
          <p className="text-gray-600">Group, tag, search and manage contacts in just a few clicks.</p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Search & Filter Instantly</h3>
          <p className="text-gray-600">Find any contact in seconds using fast search and filters.</p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Secure & Private Data</h3>
          <p className="text-gray-600">Your contacts stay safe with secure storage and access control.</p>
        </div>
      </section>

    </main>
    
  );
}

