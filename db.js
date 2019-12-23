const { debug } = require("yargs")
  .count("debug")
  .alias("d", "debug").argv;

const isMac = process.cwd() == "/";
const dbinfo = isMac ? {
  host: "localhost",
  username: "root",
  password: "",
} : {
  host: "192.168.26.184",
  username: "baseball",
  password: "dUC$N4N6KJ(2",
}

const Sequelize = require("sequelize");
const db = new Sequelize({
  ...dbinfo,
  database: "baseball",
  dialect: "mysql",
  timezone: "Asia/Tokyo",
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
