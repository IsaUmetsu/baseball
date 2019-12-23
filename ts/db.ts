import { Sequelize, QueryTypes } from "sequelize";
import * as yargs from "yargs";

const { debug } = yargs.options({
  debug: { type: 'count', alias: 'd' }
}).argv;

const isMac: boolean = process.cwd() == "/";
const dbinfo = isMac ? {
  host: "localhost",
  username: "root",
  password: "",
} : {
  host: "192.168.26.184",
  username: "baseball",
  password: "dUC$N4N6KJ(2",
}

const db = new Sequelize({
  ...dbinfo,
  database: "baseball",
  dialect: "mysql",
  timezone: "Asia/Tokyo",
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
