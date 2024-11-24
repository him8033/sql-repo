const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'Mysql@123'
});

let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password()
    ]
}

//      to Show the total no. of users in DataBase

app.get("/", (req, res) => {
    let q = `SELECT COUNT(*) FROM user`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let count = result[0]['COUNT(*)'];
            res.render("home.ejs", { count });
        });
    } catch (err) {
        console.log(err);
        console.log("some Error In DataBase");
    }
})

//      to view all the users in database

app.get("/user", (req, res) => {
    let q = `SELECT * FROM user`;
    try {
        connection.query(q, (err, users) => {
            if (err) throw err;
            res.render("showUser.ejs", { users });
        });
    } catch (err) {
        console.log(err);
        console.log("some Error In DataBase");
    }
})

//      goto the add page for adding new user

app.get("/user/add", (req, res) => {
    res.render("add.ejs")
})

//      add user process through post method

app.post("/user", (req, res) => {
    let { username, email, password } = req.body;
    console.log(username, email, password);
    let id = faker.string.uuid();
    console.log(id);
    let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}')`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.redirect("/user");
        });
    } catch (err) {
        console.log(err);
        console.log("some Error In DataBase");
    }
})

//      goto the edit page for editing the username

app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("edit.ejs", { user });
        });
    } catch (err) {
        console.log(err);
        console.log("some Error In DataBase");
    }
})

//      Update process through patch method

app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    let { username: newUsername, password: formPass } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            if (formPass != user.password) {
                res.send("Invalid Password!");
            } else {
                q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect("/user");
                })
            }
        });
    } catch (err) {
        console.log(err);
        console.log("some Error In DataBase");
    }
})

//      Delete user page 

app.get("/user/:id/delete", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("delete.ejs", { user });
        });
    } catch (err) {
        console.log(err);
        console.log("some Error In DataBase");
    }
})

//      Delete process through delete method

app.delete("/user/:id", (req, res) => {
    let { id } = req.params;
    let { password: formPass } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            if (formPass != user.password) {
                res.send("Invalid Password!");
            } else {
                q2 = `DELETE FROM user WHERE id='${id}'`;
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect("/user");
                })
            }
        });
    } catch (err) {
        console.log(err);
        console.log("some Error In DataBase");
    }
})

app.listen(port, (req, res) => {
    console.log("listning on port: ", port);
})