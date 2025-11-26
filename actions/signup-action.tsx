"use server";

import { redirect } from "next/navigation";
import { createUser } from "../lib/users";
import { hashUserPassword } from "./../lib/hash";

export async function signup(prevState, formData: FormData) {
    const emailValue = formData.get("email");
    const passwordValue = formData.get("password");

    let errors: { [key: string]: string } = {};
    if (typeof emailValue !== "string" || !emailValue.includes("@")) {
        errors.email = "Please provide a valid email";
    }
    if (typeof passwordValue !== "string" || passwordValue.trim().length < 8) {
        errors.password = "Password must be 8 characters long";
    }

    if (Object.keys(errors).length > 0) {
        return {
            errors,
        };
    }
    const hashedPassword = hashUserPassword(passwordValue as string);
    try {
        createUser(emailValue as string, hashedPassword);
    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return {
                errors: {
                    emailValue:
                        "It seems like an account for the chosen email already exists",
                },
            };
        }
        throw error;
    }
    redirect("/training")
}
