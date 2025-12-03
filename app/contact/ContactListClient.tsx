"use client";

import React, { useEffect, useState } from "react";
import { fetchContactByContactId, deleteContactByContactId } from "../actions/db_action";
import { ContactWidget } from "../_components/ContactWidget";
import { useRouter } from "next/navigation";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Props {
  userId: string;
}

export default function ContactListClient({ userId }: Props) {
  const router = useRouter();
  const [data, setData] = useState<Contact[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // New state for search query
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetchContactByContactId();

        if (response) {
          setData(response);
        } else {
          setData([]);
        }
      } catch (err: any) {
        console.error("Fetch contacts error:", err);
        setError(err.message || "Failed to fetch contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [userId]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading…</p>;
  }
  if (error) {
    return <p className="text-center text-red-600">Error: {error}</p>;
  }

  // Filter data based on searchQuery
  const filtered = data?.filter((contact) => {
    const q = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(q) ||
      contact.email.toLowerCase().includes(q) ||
      contact.phone.toLowerCase().includes(q)
    );
  }) ?? [];

  return (
    <div>
      {/* Search input + button */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-full md:w-1/3 lg:w-1/4 border p-2 rounded"
        />
        {/* Optionally you can have a button — or just rely on live filter */}
        <button
          onClick={() => { /* optional: do nothing or focus input */ }}
          className="px-4 py-2 bg-blue-500 text-white rounded m-2"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 m-0">
        {filtered.length > 0 ? (
          filtered.map((contact) => (
            <div key={contact.id}>
              <ContactWidget
                fullName={contact.name}
                email={contact.email}
                phone={contact.phone}
                onEdit={() => {
                  router.push(`/editform/${contact.id}`);
                  router.refresh();
                  console.log("Going to edit:", contact.id);
                }}
                onDelete={async () => {
                  try {
                    await deleteContactByContactId(contact.id);
                    setData((prev) =>
                      prev?.filter((c) => c.id !== contact.id) ?? null
                    );
                  } catch (error) {
                    console.error("Error deleting user:", error);
                    throw error;
                  } finally {
                    router.refresh();
                  }
                }}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-600">No contacts found.</p>
        )}
      </div>
    </div>
  );
}
