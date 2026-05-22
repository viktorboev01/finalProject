export type User = {
    id?: string,
    username: string,
    password: string
}

export type AuthResponse = {
    success: boolean,
    error?: string
}