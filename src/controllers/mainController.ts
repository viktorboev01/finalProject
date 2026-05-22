import { Elysia, t } from "elysia";

import { 
    Employee,
    User,
    DbResponse
} from "../db/repositories";

import { 
    getAllEmployees,
    empinfo,
    saveEmployee,
    deleteEmployee,
    registerUser,
    getUser
} from "../services/mainService";

type DataResponse = {
    message: string;
    data: unknown;
};

type InfoResponse = {
    "query string": Record<string, string | undefined>;
};

type SearchResponse = {
    searchTerm: string | undefined;
    page: string;
    limit: string;
};

type UserPostResponse = {
    userId: string;
    page: string | undefined;
    status: string | undefined;
};

type NotAuth = {
    message: string
}

const CookieSchema = {
    cookie: t.Object({
        session: t.Optional(
            t.String()
        )
    })
}

const port: number = 3000;

const app: Elysia = new Elysia();

app.get("/users", (): Employee[] => {
    const data: Employee[] = getAllEmployees();
    return data;
});

app.get("/users/:id", ({ params }): Employee | NotAuth => {
    
    const id: string = params.id;
    const emp = empinfo(id);
    return emp;
});

app.delete("/users/:id", ({ params, cookie: {session}, set }): DataResponse | NotAuth => {
    const sessionValue: string | undefined = session.value
    if (sessionValue === undefined || sessionValue === "") {
        set.status = 401
        return {message: "Not found profile or no privileges"}
    }

    const id: string = params.id;
    deleteEmployee(id);
    return { message: "User deleted", data: {id}}
},
CookieSchema);

app.post("/data", (context): DataResponse => {
    const body: Employee = context.body as Employee;
    saveEmployee(body)
    return { message: "User created", data: body };
},
CookieSchema);

app.post("/users", ({ body, cookie: {session}, set }): DataResponse | NotAuth => {
    const sessionValue: string | undefined = session.value
    if (sessionValue === undefined || sessionValue === "") {
        set.status = 401
        return {message: "Not found profile"}
    }

    const userBody: Employee = body as Employee;
    saveEmployee(userBody)
    return { message: "User created", data: userBody };
},
CookieSchema);

app.get("/info", (context): InfoResponse => {
    const query: Record<string, string | undefined> = context.query;
    return { "query string": query };
});

app.get("/search", ({ query }): SearchResponse => {
    const q: string | undefined = query.q;
    const page: string = query.page ?? "1";
    const limit: string = query.limit ?? "10";
    return { searchTerm: q, page: page, limit: limit };
});

app.get("/user/:id/post", ({ params, query }): UserPostResponse => {
    const id: string = params.id;
    const page: string | undefined = query.page;
    const status: string | undefined = query.status;
    return { userId: id, page: page, status: status };
});

app.post("/register/:id", ({ body, params }) => {
    const user: User = body as User;
    const resp: DbResponse = registerUser(params.id, user)

    if (resp.success) {
        return {message: "Registered successfully"}
    }

    return {message: resp.error}
    
})

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

app.post("/logout", ({cookie: {session}}) => {
        session.remove();
        return {message: "Logged out"}
    },
    CookieSchema
)

app.listen(port);

const hostname: string | undefined = app.server?.hostname;
const serverPort: number | undefined = app.server?.port;

console.log(`Server running at ${hostname}:${serverPort}`);