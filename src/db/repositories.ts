import { Database } from "bun:sqlite";
const employeesDb = new Database("employees.db");

export type Employee = {
    id?: number,
    name: string,
    department: string,
    salary: number,
    city: string
}

export type User = {
    username: string,
    password: string,
    role: string,
    exist: boolean
}

export type DbResponse = {
    success: boolean,
    error?: string
}

export enum Role {
    Admin = "Admin",
    Common = "Common"
}

type RoleWrapper = {
    role: string
}

export function getAllEmployeesRep(): Employee[] {
    const query = employeesDb.prepare("select name, department, city, salary from employees");
    const data = query.all() as Employee[];
    return data;
}

export function registerUserRep(id: string, user: User): DbResponse {
    const queryEmp = employeesDb.prepare(`
        insert into users (username, password, role, empId) values (?, ?, ?, ?)`
    );
    try {
        queryEmp.run(user.username, user.password, user.role, id);
        return {success: true};
    } catch (error) {
        if (error instanceof Error) {
            return {success: false, error: error.message};
        }
        return {success: false, error: 'unknown'};
    };    
}

export function getUserRep(user: User): User {
    const queryEmp = employeesDb.prepare(`
        select * from users where username = ? and password = ?`
    );
    const data = queryEmp.get(user.username, user.password) as User;
    return data
}

export function getUserRoleRep(username: string): Role {
    const queryEmp = employeesDb.prepare(`
        select role from users where username = ?`
    );
    const data = queryEmp.get(username) as RoleWrapper;
    return data.role as Role
}

export function saveEmployeeRep(emp: Employee) {
    const query = employeesDb.prepare("insert into employees (name, department, city, salary) values (?, ?, ?, ?)");
    query.run(emp.name, emp.department, emp.city, emp.salary);
}

export function empInfoRep(id: string | number): Employee {
    const query = employeesDb.prepare("select name, department, city, salary from employees where id = ?");
    const data = query.get(id) as Employee;
    return data;
}

export function deleteEmployeeRep(id: string | number) {
    const query = employeesDb.prepare("delete from employees where id = ?");
    query.run(id);
}