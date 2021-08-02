const express = require("express");
const app = express();
const render = require("express-render");
const port = 3000;
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Database Config

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud",
});

//Database Connection

connection.connect(function (err) {
  if (!!err) console.log("database error!");
  else console.log("database connected");
});

//Show all users on homepage

app.get("/", (req, res) => {
    let sql = 'SELECT * FROM users';
    let query = connection.query(sql, (err, rows) => {
        if (err)
            throw err;
        res.render("show", {
          users: rows,
          title: 'Our Users',
        });
    });
});

//Adding new user
app.get("/add", (req, res) => {
  res.render("form", {
    title: "Add new user.",
    instructions: "Please fill up this form carefully!",
  });
});

//Posting new users on database
app.post("/add", (req, res) => {
  let data = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
  };
  console.log(data);
  let sql = "INSERT INTO users SET ?";
  let query = connection.query(sql, data, (err, result) => {
    if (err) throw err;
    console.log(result);
  });
  res.redirect("/");
});
//Editing existing user
//set user information on edit form
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  let sql = `SELECT * FROM users WHERE id = ${id}`;
  let query = connection.query(sql, (err, result) => {
    if (err)
      throw err;
    res.render('edit', {
      title: `Edit ${result[0].firstName}'s information`,
      user: result[0],
    });
  });
});
//update user on database
app.post("/update/", (req, res) => {
  let sql =
    "UPDATE users SET firstName ='" +
    req.body.firstName +
    "', lastName = '" +
    req.body.lastName +
    "', email = '" +
    req.body.email +
    "', phone = '" +
    req.body.phone +
    "' WHERE id =" +
    req.body.id;
  let query = connection.query(sql, (err, result) => {
    if (err)
      throw err;
    res.redirect('/');
  });
});

//Deleting an user
app.get('/delete/:id', (req, res) => {
  let id = req.params.id;
  let sql = `DELETE FROM users WHERE id = ${id}`;
  let query = connection.query(sql, (err, result) => {
    if (err)
      throw error;
    console.log(`Deleted ${id}`);
    res.redirect('/');
  });
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
