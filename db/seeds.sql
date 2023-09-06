USE employees_db;

INSERT INTO department (name)
VALUES ('Operations'), ('Carriers'), ('Customers');

INSERT INTO role (title, salary, department_id)
VALUES ('Portfolio Exec', 90000, 2), ('Operactions Coordinator', 40000, 1), ('Customer Account Specialist', 70000, 3), ('Logistics Lead', 55000, 1), ('Carrier Representative', 60000, 2), ('Customer Account Manager', 100000, 3), ('Manager Operations', 85000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Malaika', 'Morgan', 1, null), ('Stephanie', 'Siminski', 7, null), ('Vivian', 'Li', 6, null), ('Claire', 'Rojas', 2, 2), ('Eddie', 'Rivers', 2, 2), ('Jenson', 'Weeks', 4, 2), ('Ronan', 'Walters', 5, 1), ('Mae', 'Wyatt', 3, 3), ('Umair', 'Shannon', 5, 1);