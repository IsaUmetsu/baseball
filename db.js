const Sequelize = require("sequelize");
const db = new Sequelize({
  database: "baseball",
  dialect: "mysql",
  timezone: "Asia/Tokyo",
  logging: false,
  host: "localhost",
  username: "root",
  // password: "root"
  password: "",
  // logging: true
})

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.log('Unable to connect to the database.')
  })

module.exports = db;
