// dependencies
const inquirer = require('inquirer')
const connection = require('./config/connection');
const figlet = require("figlet");
const chalk = require('chalk');

// startup and terminal prompts for user input
const startApp = () => {    
    console.log(chalk.hex('#F07857').bold(`====================================================================================`));
    console.log(chalk.blue(figlet.textSync("Employee Tracker")));
    console.log(`                                                          ` + chalk.greenBright.bold('Created By: Chris Stasney'));
    console.log(chalk.hex('#F07857').bold(`====================================================================================`));


    inquirer.prompt([
        {
            name: 'choices',
            type: 'list',
            message: 'Select one of the following options:',
            choices: [
                'View All Employees',
                'View All Roles',
                'View All Departments',
                'View All Employees By Department',
                'View Department Budgets',
                'Update Employee Role',
                'Update Employee Manager',
                'Add Employee',
                'Add Role',
                'Add Department',
                'Remove Employee',
                'Remove Role',
                'Remove Department',
                'Exit'
            ]
        }
    ])
        .then((answers) => {
            const { choices } = answers;

            if (choices === 'View All Employees') {
                viewAllEmployees();
            }

            if (choices === 'View All Departments') {
                viewAllDepartments();
            }

            if (choices === 'View All Employees By Department') {
                viewEmployeesByDepartment();
            }

            if (choices === 'Add Employee') {
                addEmployee();
            }

            if (choices === 'Remove Employee') {
                removeEmployee();
            }

            if (choices === 'Update Employee Role') {
                updateEmployeeRole();
            }

            if (choices === 'Update Employee Manager') {
                updateEmployeeManager();
            }

            if (choices === 'View All Roles') {
                viewAllRoles();
            }

            if (choices === 'Add Role') {
                addRole();
            }

            if (choices === 'Remove Role') {
                removeRole();
            }

            if (choices === 'Add Department') {
                addDepartment();
            }

            if (choices === 'View Department Budgets') {
                viewDepartmentBudget();
            }

            if (choices === 'Remove Department') {
                removeDepartment();
            }

            if (choices === 'Exit') {
                connection.end();
            }
        });
};

// View Employees
const viewAllEmployees = () => {
    let sql = `SELECT employee.id,
    employee.first_name,
    employee.last_name,
    role.title,
    department.department_name AS 'department',
    role.salary
    FROM employee, role, department
    WHERE department.id = role.department_id
    AND role.id = employee.role_id
    ORDER BY employee.id ASC`;
    connection.promise().query(sql).then(([rows]) => {
        let employees = rows;    
        console.log(chalk.hex('#F07857').bold(`====================================================================================`));
        console.log(`                              ` + chalk.blue(`Employees:`));
        console.log(chalk.hex('#F07857').bold(`====================================================================================`));
        console.table(employees);
        startApp();
    });
};

const viewAllRoles = () => {
    const sql = `SELECT role.id,
                 role.title, 
                 department.department_name AS department 
                 FROM role
                 INNER JOIN department ON role.department_id = department.id`;
    console.log(chalk.hex('#F07857').bold(`====================================================================================`));
    console.log(`                              ` + chalk.blue(`Roles:`));
    console.log(chalk.hex('#F07857').bold(`====================================================================================`));
    connection.promise().query(sql).then(([rows]) => {
        let roles = rows;
        console.table(roles);
        startApp();
    });
};

const viewAllDepartments = () => {
    const sql =   `SELECT department.id AS id, department.department_name AS department FROM department`; 
    connection.promise().query(sql).then(([rows]) => {
        let departments = rows;    
        console.log(chalk.hex('#F07857').bold(`====================================================================================`));
        console.log(`                              ` + chalk.blue(`Employees by Departments:`));
        console.log(chalk.hex('#F07857').bold(`====================================================================================`));
        console.table(departments);
        startApp();
    });
  };



startApp();

