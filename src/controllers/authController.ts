import { Elysia, t } from "elysia"
import { User, AuthResponse } from "../models/user";

import {
    createUser,
    getUser
} from "../services/memberService"

const CookieSchema = {
    cookie: t.Object({
        session: t.Optional(
            t.String()
        )
    })
}

const port: number = 3000;
const app: Elysia = new Elysia();

app.post("/login", ({ body, cookie: {session} }) => {
        const user: User = body as User;
        const fetchedUser: User = getUser(user) as User

        if (fetchedUser === null) {
            return {message: "Failed to login"}
        }

        session.value = fetchedUser.username;
        session.httpOnly = true;
        session.path = "/";

        return {message: "Logged in"}
    },
    CookieSchema
)

app.post("/register", ({ body, params }) => {
    const user: User = body as User;
    const resp: AuthResponse = createUser(user)

    if (resp.success) {
        return {message: "Registered successfully"}
    }

    return {message: resp.error}
    
})

app.post("/logout", ({cookie: {session}}) => {
        session.remove();
        return {message: "Logged out"}
    },
    CookieSchema
)

app.listen(port);