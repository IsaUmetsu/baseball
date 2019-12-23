"use strict";

const { team } = require("yargs").alias("t", "team").argv;
const { TEAM_INITIAL } = require("../constants");
const { isValid } = require("../tweet/util");

if (!isValid(team, TEAM_INITIAL, "team")) process.exit();

const { db } = require("../model");
const { getFullParticipationTable } = require("../query");
const { createListByPlayer } = require("../func");

const { SELECT: type } = db.QueryTypes;

(async () => {
  const rstByPly = {};

  // get order
  for (let order_no = 1; order_no <= 9; order_no++) {
    const records = await db
      .query(getFullParticipationTable(team, order_no), { type })
      .then(rst => rst)
      .catch(err => {
        console.log(err);
      });

    console.log(`----- Order No: [${order_no}] -----`);
    let total_count = 0;
    records.map(({ count, starting_cnt, player_name }) => {
      console.log(`${player_name} ${count} (${starting_cnt})`);
      total_count += count;

      createListByPlayer(rstByPly, order_no, count, player_name);
    });
    console.log(``);
    console.log(`total: ${total_count}試合`);
    console.log(``);
  }

  // 合計情報取得
  const records = await db
    .query(getFullParticipationTable(team, ""), { type })
    .then(rst => rst)
    .catch(err => {
      console.log(err);
    });

  console.log(`----- Total -----`);
  records.map(({ count, starting_cnt, player_name }) => {
    console.log(`${player_name} ${count} (${starting_cnt})`);
  });
})();
