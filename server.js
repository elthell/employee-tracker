// set up
const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to database
const db = mysql.createPool(
  {
    host: "localhost",
    user: "root",
    password: "example",
    database: "employees_db",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  },
  console.log(`Connected to the employees_db database.`)
);

// once connected start questions
db.getConnection((err) => {
  if (err) throw err;
  userChoice();
});

const choice = [
  {
    type: "list",
    message: "Please select an option below.",
    name: "listOption",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "Add A Department",
      "Add A Role",
      "Add An Employee",
      "Update An Employee's Role",
    ],
  },
];

// questions
async function userChoice() {
  await inquirer.prompt(choice).then((answer) => {
    let userAnswer = answer.listOption;
    console.log(userAnswer);
    // use answer to trigger mysql query function
    if (userAnswer === "View All Departments") {
      viewDepartments();
    } else if (userAnswer === "View All Roles") {
      viewRoles();
    } else if (userAnswer === "View All Employees") {
      viewEmployees();
    } else if (userAnswer === "Add A Department") {
      addDepartment();
    } else if (userAnswer === "Add A Role") {
      addRole();
      // } else if (userAnswer === "Add An Employee") {
      //   addEmployee();
      // } else if (userAnswer === "Update An Employee's Role") {
      //   updateEmployee();
    } else {
      console.log("Uh oh! Something went wrong.");
    }
  });
}

// ======================================== Functions ========================================= //

// =========== View ========== //

// View All Departments //
const viewDepartments = () => {
  const sql = "SELECT department.name AS Departments FROM department;";

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.log(rows);
    userChoice();
  });
};
// View All Roles //
const viewRoles = () => {
  const sql =
    "SELECT role.title, role.salary, department.name AS Department FROM role JOIN department on department.id = role.department_id ORDER BY department;";

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.log(rows);
    userChoice();
  });
};
// View All Employees //
const viewEmployees = () => {
  const sql =
    "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name AS department FROM employee JOIN role on role.id = employee.role_id JOIN department on department.id = role.department_id ORDER BY department;";

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.log(rows);
    userChoice();
  });
};

// =========== ==== ========== //

// =========== Add ========== //

// Add A Department //
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message:
          "Please enter the name of the department you would like to add.",
      },
    ])
    .then((answer) => {
      db.query(
        "INSERT INTO department SET ? ",
        {
          name: answer.name,
        },
        (err) => {
          if (err) throw err;
          console.log(answer);
          viewDepartments();
        }
      );
    });
};
// Add A Role //
const addRole = () => {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "Please enter the role's title",
      },
      {
        name: "salary",
        type: "input",
        message: "Please enter the role's salary",
      },
    ])
    .then((answer) => {
      db.query(
        "INSERT INTO role SET ? ",
        {
          title: answer.title,
          salary: answer.salary,
        },
        (err) => {
          if (err) throw err;
          console.log(answer);
          viewRoles();
        }
      );
    });
};

// =========== === ========== //

// =========== Update ========== //

// ======================================== ========= ========================================= //

// default response
app.use((req, res) => {
  res.status(404).end();
});
// listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
