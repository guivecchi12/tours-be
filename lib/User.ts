import { Document } from "mongoose"

type Roles = "user" | "guide" | "lead-guide" | "admin"

export interface UserInterface {
    _id: string,
    name: string,
    email: string,
    password?: string,
    role?: Roles,
    photo?: string,
    active?: boolean
}

export interface UserCreation extends Document{
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string | undefined,
    role?: Roles,
    photo?: string,
    active?: boolean
}