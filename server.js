// dependencies
const inquirer = require('inquirer')
const sequelize = require('./config/connection');
const figlet = require("figlet");
const chalk = require('chalk');
const consoleTable = ('console.table')


// startup and terminal prompts for user input
const startApp = () => {
    console.log(chalk.blue(figlet.textSync("Employee Tracker")));
    console.log(`                                                          ` + chalk.greenBright.bold('Created By: Chris Stasney'));


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
                sequelize.end();
            }
        });
};

// View Employees
const viewAllEmployees = () => {
    let sql = `SELECT employee.id,
                employye.first_name,
                employee.last_name,
                role.title, 
                department.department_name AS 'department', 
                role.salary
                FROM employee, role, department 
                WHERE department.id = role.department_id 
                AND role.id = employee.role_id
                ORDER BY employee.id ASC`;
    sequelize.promise().query(sql, (error, response) => {
        if (error) throw error;
        console.log(chalk.blue(`Current Employees`));
        console.table(response);
        startApp()
    });
};

startApp();

