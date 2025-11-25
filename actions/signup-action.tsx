"use server";

export async function signup(prevState, formData: FormData) {
    const emailValue = formData.get("email")
    const passwordValue = formData.get("password")

    let errors: { [key: string]: string } = {};
    if (typeof emailValue !== "string" || !emailValue.includes("@")) {
        errors.email = 'Please provide a valid email'
    }
    if (typeof passwordValue !== "string" || passwordValue.trim().length < 8) {
        errors.password = "Password must be 8 characters long"
    }

    if (Object.keys(errors).length > 0) {
        return {
            errors
        }
    }
}