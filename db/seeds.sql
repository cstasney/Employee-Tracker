INSERT INTO department(department_name)
VALUES ("Microbiology"), ("Wet Chemistry"), ("Metals"), ("Volatiles");

INSERT INTO role(title, salary, department_id)
VALUES("Analyst", 40000, 3), ("Lead Analyst", 45000, 3), ("Department Manager", 100000, 3);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES("Chris", "Stasney", 2, 3), ("Kevin", "Chen", 1, 3), ("Hazel", "Aranda", 3, NULL);