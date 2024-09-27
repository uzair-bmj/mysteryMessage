import { z } from "zod"

export const userNameValidation = z
    .string()
    .min(3, "Username must be at least 2 characters")
    .max(3, "Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")


export const signupSchema = z.object({
    userName: userNameValidation,
    email: z.string().email({message: "Invalid Email Address"}),
    password: z.string().min(8, {message: "Password must contain at least 8 characters"})
})