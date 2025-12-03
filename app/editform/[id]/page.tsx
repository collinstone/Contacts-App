// app/_components/EditForm.tsx
"use client";
import { updateContact } from '@/app/actions/db_action';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from "react";

interface EditFormProps {
  contactId: string;
  defaultName: string;
  defaultEmail: string;
  defaultPhone: string;
}


export interface ContactUpdateInput {
  contactId: string;
  name: string;
  email: string;
  phone: string;
}

export default function EditForm({
  defaultName,
  defaultEmail,
  defaultPhone,
}: EditFormProps) {
  const params = useParams<{ id: string }>();
  const userId = params.id;
  
  
  const router = useRouter();

const [name, setName] = useState(defaultName ?? "");
const [email, setEmail] = useState(defaultEmail ?? "");
const [phone, setPhone] = useState(defaultPhone ?? "");


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    
  const input: ContactUpdateInput = {
    contactId: userId,
    name: name,
    email: email,
    phone: phone
  }

    try {
        await updateContact(input)
      } catch (error) {
        console.error("Error editing contact:", error);
        throw error;
  };
  // Navigate back to the contacts list (or wherever)
      router.push("/contact");
}

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Edit Contact</h2>
      {error && (
        <div className="mb-4 text-red-600 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <div className="mt-1">
            <input
              id="name"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
              type="text"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <div className="mt-1">
            <input
              id="phone"
              name="phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              type="tel"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="+234 800 000 0000"
            />
          </div>
        </div>

        <div className="flex items-center justify-between space-x-4">
          <Link href="/contact">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
