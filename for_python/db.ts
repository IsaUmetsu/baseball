import { Sequelize } from 'sequelize';

const db = new Sequelize({
  host: "localhost",
  username: "root",
  password: "",
  database: "baseball_2020",
  dialect: "mysql",
  timezone: "Asia/Tokyo",
  logging: false
});

db.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.log("Unable to connect to the database.");
    console.log(err);
  });

module.exports = db;
