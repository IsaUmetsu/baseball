import { Sequelize, QueryTypes } from "sequelize";
import * as yargs from "yargs";

const { debug } = yargs.options({
  debug: { type: 'count', alias: 'd' }
}).argv;

const db = new Sequelize({
  database: "baseball",
  dialect: "mysql",
  timezone: "Asia/Tokyo",
  host: "localhost",
  username: "root",
  // password: "root"
  password: "",
  logging: Boolean(debug)
})

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.log('Unable to connect to the database.')
  })

export const con = db;
export const SELECT = QueryTypes.SELECT;
