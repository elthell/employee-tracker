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
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "example",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

// once connected start questions
db.connect((err) => {
  if (err) throw err;
  questions();
});

// questions
async function questions() {
  const answer = await inquirer.prompt({
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
  });
  console.log(answer);
  // use answer to trigger mysql query function
  if (answer === "View All Departments") {
    viewDepartments();
  } else if (answer === "View All Roles") {
    viewRoles();
  } else if (answer === "View All Employees") {
    viewEmployees();
  } else if (answer === "Add A Department") {
    addDepartment();
  } else if (answer === "Add A Role") {
    addRole();
  } else if (answer === "Add An Employee") {
    addEmployee();
  } else if (answer === "Update An Employee's Role") {
    updateEmployee();
  } else {
    console.log("Uh oh! Something went wrong.");
  }
}

// ======================================== Functions ========================================= //

// =========== View ========== //
// View All Departments //
function viewDepartments() {
  const sql = "SELECT department.name AS Departments FROM department;";

  db.query(sql, (err, rows) => {
    if (err) throw err
    console.log(rows)
    questions();
  });
};
// View All Roles //
function viewRoles() {
  const sql ="SELECT role.title, role.salary, department.name AS Department FROM role JOIN department on department.id = role.department_id ORDER BY department;"

  db.query(sql, (err, rows) => {
    if (err) throw err
    console.log(rows)
    questions();
  });
};
// View All Employees //
function viewEmployees() {
  const sql = "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name AS department FROM employee JOIN role on role.id = employee.role_id JOIN department on department.id = role.department_id ORDER BY department;"

  db.query(sql, (err, rows) => {
    if (err) throw err
    console.log(rows)
    questions();
  });
};

// =========== Add ========== //


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
