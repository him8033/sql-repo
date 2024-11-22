const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'Mysql@123'
});

let q = "INSERT INTO user (id,username,email,password) VALUES ?";
let users = [
    ["123", "123_newUser", "newUser@gmail.com", "newUser@123"],
    ["123a", "123_newUsera", "newUsera@gmail.com", "newUsera@123"],
    ["123b", "123_newUserb", "newUserb@gmail.com", "newUserb@123"],
]

try {
    connection.query(q, [users], (err, result) => {
        if (err) throw err;
        console.log(result);
    });
} catch (err) {
    console.log(err);
}

connection.end();

let getRandomUser = () => {
    return {
        id: faker.string.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    }
}

console.log(getRandomUser());