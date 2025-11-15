"use server";
import { UserType } from "@/_types/user";
import { cookies } from "next/headers";

//set session cookie
export const setSession = async (user: any) => {
    ((await cookies()).set("session", JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 day
        path: "/",
    }));
}
//get session cookie
export const getSession = async (): Promise<UserType | null> => {
    const session = (await cookies()).get("session")?.value;
    if (!session) {
        return null;
    }
    const user = JSON.parse(session) as UserType;
    return user;
};

//delete session cookie
export const deleteSession = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("session");
};