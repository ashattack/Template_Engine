const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const validate = require("validator");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { ENGINE_METHOD_RSA } = require("constants");
const { create } = require("domain");
var array = []
var managerInfo;
var engineerCount;
var internCount;
var employeeList;
var internList;

function appMenu() {
    createManager();
}

function createManager() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'managerName',
            message: 'What is your managers Name?'
            

        },
        {
            type: 'input',
            name: 'managerId',
            message: 'What is your managers id?'

        },
        {
            type: 'input',
            name: 'managerEmail',
            message: 'What is your managers email?',
            validate: (email) => {
                if (validate.isEmail(email)) {
                    return true
                } else {
                    return 'Please enter an email'
                }


            }

        },
        {
            type: 'input',
            name: 'managerOfficeNumber',
            message: 'What is your managers office number?',
            validate: (number) => {
                if (isNaN(number)) {
                    return "Please enter a number"
                } else {
                    return true;
                }

            }
        },
        {
            type: 'list',
            name: 'managerEmployee',
            message: 'Do you want to add more employees?',
            choices: ['yes', 'no']

        }


    ]).then(answers => {
        managerInfo = new Manager(answers.managerName, answers.managerId, answers.managerEmail, answers.managerOfficeNumber)
        console.log(managerInfo);
        array.push(managerInfo)
        if (answers.managerEmployee == 'yes') {
            createEmployee();
        } else {
            createHTML();
        }
        //createTeam(); will ask user what type of worker they want to build
    })
}


function createEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employeeName',
            message: 'What is your employee name?'

        },
        {
            type: 'input',
            name: 'employeeId',
            message: 'What is your employee id?'

        },
        {
            type: 'input',
            name: 'employeeEmail',
            message: 'What is your employee email?',
            validate: (email) => {
                if (validate.isEmail(email)) {
                    return true
                } else {
                    return 'Please enter an email'
                }

            }
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is your employees role?',
            choices: ['intern', 'engineer']

        },
        {
            type: 'input',
            name: 'internSchool',
            message: 'What is your school?',
            when: (responses) => {
                if (responses.role == "intern") {
                    return true;
                }
            }

        },
        {
            type: 'input',
            name: 'engineerGit',
            message: 'What is your github?',
            when: (responses) => {
                if (responses.role == "engineer") {
                    return true;
                }
            }

        },
        {
            type: 'list',
            name: 'managerEmployee',
            message: 'Do you want to add more employees?',
            choices: ['yes', 'no']

        }
    ]).then(answers => {
        if (answers.role == 'engineer') {
            engineerInfo = new Engineer(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.engineerGit)
            array.push(engineerInfo)
        } else {
            internInfo = new Intern(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.internSchool)
            array.push(internInfo)
        }

        console.log(managerInfo);
        if (answers.managerEmployee == 'yes') {
            createEmployee();
        } else {
            createHTML();
        }
    })
}

function createHTML() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }
    //create the file html
    fs.writeFileSync(outputPath, render(array), function (err) {
        if (err) throw err;
    });
}


appMenu();



// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
