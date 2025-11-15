import { getSession } from "@/_lib/session";
import { UserType } from "@/_types/user";
import axios from "axios";

export const saveContactToDB = async(formData: FormData) :Promise<void> => {
    const API_URL = "http://localhost:3001";
    const session =  await getSession();
    if (!session) {
        throw new Error("User not authenticated");
    }
    const user = session as UserType;
    const userId = user.id;
            
        // Example: extract data from formData
        const name = formData.get("name");
        const email = formData.get("email");
        const phone = formData.get("phone");

        if (!name || !email || !phone) {
            throw new Error("Missing contact data");
        }
        // Here you would typically interact with your database to save the contact
       
    try{
        await axios.post(`${API_URL}/contacts`, {
            name: name,
            email: email,
            userId: userId,
            phone: phone
        });
        console.log(`Contact saved for user ${userId}: ${name}, ${email}, ${phone}`);
       
    } catch (error) {
        const err = error as any;
        console.error("saveContactToDB error detail:", err.response?.data ?? error);
        throw new Error("Contact not Saved");
        
}
}