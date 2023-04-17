const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node_project",
  password: "theusual",
});

module.exports = db;
