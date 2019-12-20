const { debug } = require("yargs")
  .count("debug")
  .alias("d", "debug").argv;

const Sequelize = require("sequelize");
const db = new Sequelize({
  database: "baseball",
  dialect: "mysql",
  timezone: "Asia/Tokyo",
  host: "localhost",
  username: "root",
  // password: "root"
  password: "",
  logging: Boolean(debug)
});

db.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.log("Unable to connect to the database.");
  });

module.exports = db;
