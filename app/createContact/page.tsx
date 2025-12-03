"use client";

import React, { useState } from "react";
import { saveContactsAction } from "../actions/saveContactToDB";

export default function CreateContact() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md min-h-screen">
      <form
        // Use Server Action as the form's action directly
        action={async (formData: FormData) => {
          try {
            setError(null); // reset error on submit
            await saveContactsAction(formData);
            // redirect handled server-side in the action
          } catch (err: any) {
            console.error("Error saving contact:", err);
            setError(err.message || "Failed to save contact");
            
          }
        }}
        className="space-y-4"
      >
        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter your full name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            placeholder="Enter your phone number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-4 cursor-pointer"
        >
          Add Contact
        </button>
      </form>
    </div>
  );
}



