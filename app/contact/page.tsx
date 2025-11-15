// app/contacts/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ContactListClient from "./ContactListClient";

export default async function ContactPage() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("session")?.value;

  if (!sessionValue) {
    redirect("/login");
  }

  let user;
  try {
    user = JSON.parse(sessionValue);
  } catch {
    redirect("/login");
  }

  if (!user?.id || !user?.email) {
    redirect("/login");
  }

  return (
    <div className="w-full sm:w-11/12 md:w-3/4 lg:w-2/3 mx-auto mt-9 min-h-screen">
      <h1 className="text-center text-2xl font-bold text-gray-800">
        Welcome, {user.name}.
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4 md:mb-0">
          Manage your Contacts here.
        </h1>
        <Link href="/createContact">
          <button className="px-5 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition">
            Add contacts
          </button>
        </Link>
      </div>
      
      <ContactListClient userId={user.id}/>

      {/* No Footer here — footer is handled by layout */}
    </div>
  );
}
