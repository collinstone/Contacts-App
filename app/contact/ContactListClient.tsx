"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
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

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get<Contact[]>(
          `http://localhost:3001/contacts?userId=${userId}`
        );
        setData(response.data);
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 m-0">
      {data && data.length > 0 ? (
        data.map((contact) => (
          <div
            key={contact.id}
          >
            <ContactWidget
              fullName={contact.name}
              email={contact.email}
              phone={contact.phone}
              onEdit={() => router.push(`/editform/${contact.id}`)}
              onDelete={async () => {
                try {
                  const response = await axios.delete(
                    `http://localhost:3001/contacts/${contact.id}`
                  );
                  console.log("Deleted successfully", response.data);
                  setData((prev) =>
                    prev?.filter((c) => c.id !== contact.id) ?? null
                  );
                } catch (err: any) {
                  console.error("Failed to delete contact", err);
                  if (err.response) {
                    console.error("Status:", err.response.status);
                    console.error("Data:", err.response.data);
                  } else if (err.request) {
                    console.error("Request:", err.request);
                  } else {
                    console.error("Message:", err.message);
                  }
                }
              }}
            />
          </div>
        ))
      ) : (
        <p className="text-gray-600">No contacts found.</p>
      )}
    </div>
  );
}
