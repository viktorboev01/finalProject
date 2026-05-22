import { Database } from "bun:sqlite";

const employeesDb = new Database("employees.db");

employeesDb.run("DROP TABLE IF EXISTS employees");
employeesDb.run('create table employees(' +
    'id integer primary key autoincrement,' + 
    'name char(10), ' + 
    'department char(10),' + 
    'city char(10),' + 
    'salary integer)')

employeesDb.run("DROP TABLE IF EXISTS users");
employeesDb.run(`
    CREATE TABLE users (
        userId   INTEGER PRIMARY KEY AUTOINCREMENT,
        username CHAR(20) unique,
        password CHAR(20) unique,
        role CHAR(20),
        empId    INTEGER,
        CONSTRAINT fk_Employee
            FOREIGN KEY (empId) REFERENCES employees(id)
    )
`)
       
employeesDb.run("insert into employees (name, department, city, salary) values('Peter', 'HR', 'Sofia', 1000)")
employeesDb.run("insert into employees (name, department, city, salary) values('James', 'IT', 'Plovdiv', 500)")
employeesDb.run("insert into employees (name, department, city, salary) values('John', 'HR', 'Sofia', 1200)")
