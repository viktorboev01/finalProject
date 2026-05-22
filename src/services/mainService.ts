import { 
    Employee, 
    User,
    Role,
    DbResponse, 
    getAllEmployeesRep,
    registerUserRep,
    getUserRep,
    getUserRoleRep,
    saveEmployeeRep,
    empInfoRep,
    deleteEmployeeRep
} from "../db/repositories";

export function getAllEmployees(): Employee[] {
    return getAllEmployeesRep();
}

export function registerUser(id: string, user: User): DbResponse {
    return registerUserRep(id, user)
}

export function getUser(user: User): User {
    return getUserRep(user)
}

export function getUserRole(username: string): Role {
    return getUserRoleRep(username)
}

export function saveEmployee(emp: Employee) {
    saveEmployeeRep(emp)
}

export function empinfo(id: string | number): Employee {
    return empInfoRep(id);
}

export function deleteEmployee(id: string | number) {
    deleteEmployeeRep(id)
}