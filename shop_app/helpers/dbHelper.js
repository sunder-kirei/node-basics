// mongoDB
const { MongoClient } = require("mongodb");
const { CONNECTION_URI } = require("./constants");

const mongoClient = new MongoClient(CONNECTION_URI);

let _client;

const mongoConnect = async () => {
  try {
    const client = await mongoClient.connect();
    _client = client;
    return _client;
  } catch (error) {
    console.log(error);
  }
};

const getDB = () => {
  if (_client) {
    return _client.db();
  }
  throw "Client not found";
};

module.exports.mongoConnect = mongoConnect;
module.exports.getDB = getDB;

// mysql
// const mysql = require("mysql2/promise");

// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "Sunder@2506",
//   database: "shop_db",
// });

// module.exports = db;
