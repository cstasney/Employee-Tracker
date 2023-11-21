// dependencies
const inquirer = require('inquirer')
const connection = require('./config/connection');
const figlet = require("figlet");
const chalk = require('chalk');
const validate = ('/validate.validate.js')

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
                department.department_name AS Department,
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

// view all roles
const viewAllRoles = () => {
    let sql = `SELECT role.id,
                role.title, 
                department.department_name AS Department 
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

// view all departments
const viewAllDepartments = () => {
    let sql = `SELECT department.id AS id, 
                department.department_name AS Department FROM department`;
    connection.promise().query(sql).then(([rows]) => {
        let departments = rows;
        console.log(chalk.hex('#F07857').bold(`====================================================================================`));
        console.log(`                              ` + chalk.blue(`Departments:`));
        console.log(chalk.hex('#F07857').bold(`====================================================================================`));
        console.table(departments);
        startApp();
    });
};

// view employees by their departments
const viewEmployeesByDepartment = () => {
    let sql = `SELECT employee.first_name, 
                    employee.last_name, 
                    department.department_name AS Department
                    FROM employee 
                    LEFT JOIN role ON employee.role_id = role.id 
                    LEFT JOIN department ON role.department_id = department.id`;
    connection.promise().query(sql).then(([rows]) => {
        let employeeDepartments = rows;
        console.log(chalk.hex('#F07857').bold(`====================================================================================`));
        console.log(`                              ` + chalk.blue(`Employees by Department:`));
        console.log(chalk.hex('#F07857').bold(`====================================================================================`));
        console.table(employeeDepartments);
        startApp();
    });
};

//View all Departments by Budget
const viewDepartmentBudget = () => {
    const sql = `SELECT department_id AS id, 
                    department.department_name AS department,
                    SUM(salary) AS budget
                    FROM  role  
                    INNER JOIN department ON role.department_id = department.id GROUP BY  role.department_id`;
    connection.promise().query(sql).then(([rows]) => {
        let departmentBudgets = rows;
        console.log(chalk.hex('#F07857').bold(`====================================================================================`));
        console.log(`                              ` + chalk.blue(`Budget by Department:`));
        console.log(chalk.hex('#F07857').bold(`====================================================================================`));
        console.table(departmentBudgets);
        startApp();
    });
};

// Add new employee

const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'fistName',
            message: "What is the employee's first name?",
            validate: addFirstName => {
                if (addFirstName) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: addLastName => {
                if (addLastName) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const crit = [answer.fistName, answer.lastName]
            const roleSql = `SELECT role.id, role.title FROM role`;
            connection.query(roleSql, (error, response) => {
                if (error) throw error;
                const roles = response.map(({ id, title }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's role?",
                        choices: roles
                    }
                ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        crit.push(role);
                        const managerSql = `SELECT * FROM employee`;
                        connection.query(managerSql, (error, response) => {
                            if (error) throw error;
                            const managers = response.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Who is the employee's manager?",
                                    choices: managers
                                }
                            ])
                                .then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    crit.push(manager);
                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`;
                                    connection.query(sql, crit, (error) => {
                                        if (error) throw error;
                                        console.log("New Employee Added!")
                                        viewAllEmployees();
                                    });
                                });
                        });
                    });
            });
        });
};

// Add a New Role
const addRole = () => {
    const sql = 'SELECT * FROM department'
    connection.query(sql, (error, response) => {
        if (error) throw error;
        let deptNamesArray = [];
        response.forEach((department) => { deptNamesArray.push(department.department_name); });
        deptNamesArray.push('Create Department');
        inquirer
            .prompt([
                {
                    name: 'departmentName',
                    type: 'list',
                    message: 'Which department is this new role in?',
                    choices: deptNamesArray
                }
            ])
            .then((answer) => {
                if (answer.departmentName === 'Create Department') {
                    this.addDepartment();
                } else {
                    addRoleResume(answer);
                }
            });

        const addRoleResume = (departmentData) => {
            inquirer
                .prompt([
                    {
                        name: 'newRole',
                        type: 'input',
                        message: 'What is the name of your new role?',
                        validate: validate.validateString
                    },
                    {
                        name: 'salary',
                        type: 'input',
                        message: 'What is the salary of this new role?',
                        validate: validate.validateSalary
                    }
                ])
                .then((answer) => {
                    let createdRole = answer.newRole;
                    let departmentId;

                    response.forEach((department) => {
                        if (departmentData.departmentName === department.department_name) { departmentId = department.id; }
                    });

                    let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                    let crit = [createdRole, answer.salary, departmentId];

                    connection.query(sql, crit, (error) => {
                        if (error) throw error;
                        console.log(chalk.greenBright(`New Role Created!`));
                        viewAllRoles();
                    });
                });
        };
    });
};

//   Add a New Department
const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: 'newDepartment',
                type: 'input',
                message: 'What is the name of your new Department?',
                validate: validate.validateString
            }
        ])
        .then((answer) => {
            let sql = `INSERT INTO department (department_name) VALUES (?)`;
            connection.query(sql, answer.newDepartment, (error, response) => {
                if (error) throw error;
                console.log(``);
                console.log(chalk.greenBright(answer.newDepartment + ` New Department created!`));
                console.log(``);
                viewAllDepartments();
            });
        });
};

// Update Employee Role
const updateEmployeeRole = () => {
    let sql = `SELECT employee.id,
                  employee.first_name,
                  employee.last_name, role.id AS "role_id" FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
    connection.query(sql, (error, response) => {
        if (error) throw error;
        let employeeNamesArray = [];
        response.forEach((employee) => {
            employeeNamesArray.push({
                name: `${employee.first_name} ${employee.last_name}`,
                id: employee.id,
            });
        });
        let sql = `SELECT role.id, role.title FROM role`;
        connection.query(sql, (error, response) => {
            if (error) throw error;
            let rolesArray = [];
            response.forEach((role) => {
                rolesArray.push(role.title);
            });
            inquirer
                .prompt([
                    {
                        name: "chosenEmployee",
                        type: "list",
                        message: "Which employee has changed roles?",
                        choices: employeeNamesArray,
                    },
                    {
                        name: "chosenRole",
                        type: "list",
                        message: "What is the employees new role?",
                        choices: rolesArray,
                    },
                ])
                .then((answer) => {
                    let newTitleId, employeeId;
                    let choice = employeeNamesArray.filter((element) => {
                        return element.name === answer.chosenEmployee;
                    });
                    employeeId = choice[0].id;
                    response.forEach((role) => {
                        if (answer.chosenRole === role.title) {
                            newTitleId = role.id;
                        }
                    });
                    let sqls = `UPDATE employee SET role_id = ? WHERE id = ?`;
                    connection.query(sqls, [newTitleId, employeeId], (error) => {
                        if (error) throw error;
                        console.log(chalk.hex("#F07857").bold('===================================================================================='));
                        console.log(chalk.greenBright('Employee Role Updated'));
                        console.log(chalk.hex("#F07857").bold('===================================================================================='));
                        startApp();
                    });
                });
        });
    });
};

const updateEmployeeManager = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
                    FROM employee`;
    connection.query(sql, (error, response) => {
        let employeeNamesArray = [];
        response.forEach((employee) => { employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`); });

        inquirer
            .prompt([
                {
                    name: 'chosenEmployee',
                    type: 'list',
                    message: 'Which employee has a new manager?',
                    choices: employeeNamesArray
                },
                {
                    name: 'newManager',
                    type: 'list',
                    message: 'Who is their manager?',
                    choices: employeeNamesArray
                }
            ])
            .then((answer) => {
                let employeeId, managerId;
                response.forEach((employee) => {
                    if (
                        answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`
                    ) {
                        employeeId = employee.id;
                    }

                    if (
                        answer.newManager === `${employee.first_name} ${employee.last_name}`
                    ) {
                        managerId = employee.id;
                    }
                });
                if (answer.chosenEmployee === answer.newManager) {
                    console.log(chalk.yellow.bold(`====================================================================================`));
                    console.log(chalk.redBright(`Invalid Manager Selection`));
                    console.log(chalk.yellow.bold(`====================================================================================`));
                    startApp();
                } else {
                    let sql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;

                    connection.query(sql,[managerId, employeeId],
                        (error) => {
                            if (error) throw error;
                            console.log(chalk.hex("#F07857").bold(`====================================================================================`));
                            console.log(chalk.greenBright(`Employee Manager Updated`));
                            console.log(chalk.hex("#F07857").bold(`====================================================================================`));
                            startApp();
                        }
                    );
                }
            });
    });
};

// Delete an employee
const removeEmployee = () => {
    let sql =     `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;

    connection.query(sql, (error, response) => {
      if (error) throw error;
      let employeeNamesArray = [];
      response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

      inquirer
        .prompt([
          {
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee would you like to remove?',
            choices: employeeNamesArray
          }
        ])
        .then((answer) => {
          let employeeId;

          response.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let sql = `DELETE FROM employee WHERE employee.id = ?`;
          connection.query(sql, [employeeId], (error) => {
            if (error) throw error;
            console.log(chalk.hex("#F07857").bold(`====================================================================================`));
            console.log(chalk.redBright(`Employee Removed`));
            console.log(chalk.hex("#F07857").bold(`====================================================================================`));
            viewAllEmployees();
          });
        });
    });
  };

//   delete role
  const removeRole = () => {
    let sql = `SELECT role.id, role.title FROM role`;

    connection.query(sql, (error, response) => {
      if (error) throw error;
      let roleNamesArray = [];
      response.forEach((role) => {roleNamesArray.push(role.title);});

      inquirer
        .prompt([
          {
            name: 'chosenRole',
            type: 'list',
            message: 'Which role would you like to remove?',
            choices: roleNamesArray
          }
        ])
        .then((answer) => {
          let roleId;

          response.forEach((role) => {
            if (answer.chosenRole === role.title) {
              roleId = role.id;
            }
          });

          let sql =   `DELETE FROM role WHERE role.id = ?`;
          connection.query(sql, [roleId], (error) => {
            if (error) throw error;
            console.log(chalk.hex("#F07857").bold(`====================================================================================`));
            console.log(chalk.greenBright(`Role Successfully Removed`));
            console.log(chalk.hex("#F07857").bold(`====================================================================================`));
            viewAllRoles();
          });
        });
    });
  };

startApp();

