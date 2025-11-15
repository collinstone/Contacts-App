"use client";

import React from "react";
import { updateContactAction } from "../actions/updateAndDelete";

interface EditFormProps {
  contactId: string;
  defaultName: string;
  defaultEmail: string;
  defaultPhone: string;
}

export default function Editform({
  contactId,
  defaultName,
  defaultEmail,
  defaultPhone,
}: EditFormProps) {

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <form action={updateContactAction.bind(null, contactId)} className="space-y-4">
        <input type="hidden" name="id" value={contactId} />

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            defaultValue={defaultName}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
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
            defaultValue={defaultEmail}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
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
            defaultValue={defaultPhone}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-4"
        >
          Edit
        </button>
      </form>
    </div>
  );
}
