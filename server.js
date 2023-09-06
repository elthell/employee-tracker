// set up
const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const { printTable } = require("console-table-printer");
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
    } else if (userAnswer === "Add An Employee") {
      addEmployee();
    } else if (userAnswer === "Update An Employee's Role") {
      updateEmployee();
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
    printTable(rows);
    userChoice();
  });
};
// View All Roles //
const viewRoles = () => {
  const sql =
    "SELECT role.title, role.salary, department.name AS Department FROM role JOIN department on department.id = role.department_id ORDER BY department;";

  db.query(sql, (err, rows) => {
    if (err) throw err;
    printTable(rows);
    userChoice();
  });
};
// View All Employees //
const viewEmployees = () => {
  const sql =
    "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name AS department FROM employee JOIN role on role.id = employee.role_id JOIN department on department.id = role.department_id ORDER BY department;";

  db.query(sql, (err, rows) => {
    if (err) throw err;
    printTable(rows);
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
      {
        name: "department",
        type: "list",
        message: "Please select the associated department",
        choices: selectDepartment(),
      },
    ])
    .then((answer) => {
      const departmentId = selectDepartment().indexOf(answer.department) + 1;
      db.query(
        "INSERT INTO role SET ? ",
        {
          title: answer.title,
          salary: answer.salary,
          department_id: departmentId,
        },
        (err) => {
          if (err) throw err;
          console.log(answer);
          viewRoles();
        }
      );
    });
};
// Add An Employee //
const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Please enter the employee's first name.",
      },
      {
        name: "lastName",
        type: "input",
        message: "Please enter their last name.",
      },
      {
        name: "role",
        type: "list",
        message: "Please select the employee's role.",
        choices: selectRole(),
      },
      {
        name: "choice",
        type: "list",
        message: "Please select the employee's manager.",
        choices: selectManager(),
      },
    ])
    .then((answer) => {
      const roleId = selectRole().indexOf(answer.role) + 1;
      const managerId = selectManager().indexOf(answer.choice) + 1;
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          manager_id: managerId,
          role_id: roleId,
        },
        (err) => {
          if (err) throw err;
          console.log(answer);
          userChoice();
        }
      );
    });
};

// =========== === ========== //

// =========== Update ========== //

// Update Employee //
const updateEmployee = () => {
  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "Please choose an employee to update.",
        choices: selectEmployee(),
      },
      {
        name: "role",
        type: "list",
        message: "Please choose their new role.",
        choices: selectRole(),
      },
    ])
    .then((answer) => {
      const roleId = selectRole().indexOf(answer.role) + 1;
      connection.query(
        "INSERT INTO employee SET WHERE ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
        },
        {
          role_id: roleId
        }, 
        (err) => {
          if (err) throw err;
          console.log(answer);
          userChoice();
        }
      );
    });
};

// =========== ====== ========== //

// =========== Utils ========== //

// select a department //
const allDepartments = [];
const selectDepartment = () => {
  const sql = "SELECT * FROM department";
  db.query(sql, (err, rows) => {
    if (err) throw err;
    for (var i = 0; i < rows.length; i++) {
      allDepartments.push(rows[i].name);
    }
  });
  return allDepartments;
};
// select a role //
const allRoles = [];
const selectRole = () => {
  const sql = "SELECT * FROM role";
  db.query(sql, (err, rows) => {
    if (err) throw err;
    for (var i = 0; i < rows.length; i++) {
      allRoles.push(rows[i].title);
    }
  });
  return allRoles;
};
// select a manager //
const allManagers = [];
const selectManager = () => {
  const sql =
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL";
  db.query(sql, (err, rows) => {
    if (err) throw err;
    for (var i = 0; i < rows.length; i++) {
      allManagers.push(rows[i].first_name);
    }
  });
  return allManagers;
};
// select an employee //
const allEmployees = [];
const selectEmployee = () => {
  const sql = "SELECT * FROM employees";
  db.query(sql, (err, rows) => {
    if (err) throw err;
    for (var i = 0; i < rows.length; i++) {
      allEmployees.push(rows[i].first_name);
    }
  });
  return allEmployees;
};

// =========== ===== ========== //

// ======================================== ========= ========================================= //

// default response
app.use((req, res) => {
  res.status(404).end();
});
// listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
