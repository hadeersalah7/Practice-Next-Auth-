"use server";

import { redirect } from "next/navigation";
import { createUser, getUserByEmail } from "../lib/users";
import { hashUserPassword, verifyPassword } from "../lib/hash";
import { createAuthSession, destroySession } from "../lib/auth";

// signup action
export async function signup(prevState, formData: FormData) {
    const emailValue = formData?.get("email");
    const passwordValue = formData?.get("password");

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
        const id = createUser(emailValue as string, hashedPassword);
        await createAuthSession(id)
        redirect("/training")
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
}

// login action
export async function login(prevState, formData: FormData) {
    const emailValue = formData?.get("email");
    const passwordValue = formData?.get("password");

    // let errors: { [key: string]: string } = {};

    const existingUser = getUserByEmail(emailValue as string);
    if (!existingUser) {
        return {
            errors: {
                email: "No user found with the provided email",
            }
        }
    }

    const isValidPassword = verifyPassword(existingUser.password, passwordValue as string);
    if (!isValidPassword) {
        return {
            errors: {
                password: "No such password found for the provided email",
            }
        }
    }
    await createAuthSession(existingUser.id)
    redirect("/training")
}

export async function auth(mode: 'login' | 'signup', prevState, formData: FormData) {
    if (mode === 'login') {
        return login(prevState, formData);
    }
    return signup(prevState, formData);

}

// logout action:
export async function logout() {
    await destroySession()
    redirect("/")
}