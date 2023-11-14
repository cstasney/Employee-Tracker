// dependencies
const inquirer = require('inquirer')
const express = require('express')
const sequelize = require('./config/connection');
const figlet = require("figlet");
const chalk = require('chalk');

console.log(chalk.blue(figlet.textSync("Employee Tracker")));
console.log(`                                                          ` + chalk.greenBright.bold('Created By: Chris Stasney'));


const startApp = () => {
    inquirer.createPromptModule([])
}


startApp();

