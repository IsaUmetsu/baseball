"use strict";

const { team } = require("yargs").alias("t", "team").argv;
const { TEAM_INITIAL } = require("../constants");
const { isValid } = require('../tweet/util');

if (!isValid(team, TEAM_INITIAL, "team")) process.exit();

const { db } = require("../model");
const { getStartingMenberSpecifyOrder } = require("../query");
const { createListByPlayer } = require("../func");

const { SELECT: type } = db.QueryTypes;

// define sleep function
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
const logger = require("../logger");

/**
 * Execute
 */
(async () => {
  const rstByPly = {};

  // get order
  for (let order_no = 1; order_no <= 9; order_no++) {
    const records = await db
      .query(getStartingMenberSpecifyOrder(team, order_no), { type })
      .then(rst => rst)
      .catch(err => {
        console.log(err);
      });

    console.log(`----- Order No: [${order_no}] -----`);
    records.map(({ count, player_name }) => {
      console.log(`${count} ${player_name}`);
      createListByPlayer(rstByPly, order_no, count, player_name);
    });
    console.log(``);
  }

  console.log(rstByPly);
})();
