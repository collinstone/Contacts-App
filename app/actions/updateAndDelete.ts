// app/actions/contactActions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateContactAction(id: string, formData: FormData) {
  "use server";

  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");

  // call your backend API to update
  await fetch(`http://localhost:3001/contacts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, phone }),
  });

  // revalidate the path so the UI updates (if you use Next.js cache)
  revalidatePath(`/contacts`);

  // redirect to contacts list or wherever
  redirect("/contacts");
}
