"use strict"

const { POSITIONS, VISITOR_TEAM, HOME_TEAM } = require('../constants')
const { P, RF, D, PH, PR } = POSITIONS

const { db } = require('../model')
const { getStartingMenberSpecifyOrder, getOverviewIds } = require('../query')
const { createListByPlayer } = require('../func')
const logger = require('../logger')

const { SELECT: type } = db.QueryTypes

// define sleep function
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

(async () => {
  // get overviewIds of top, bottom
  const overviewIdsTop = await db.query(getOverviewIds('H', VISITOR_TEAM), { type }).then(r => r).catch(e => e);
  const overviewIdsBtm = await db.query(getOverviewIds('H', HOME_TEAM), { type }).then(r => r).catch(e => e);
  // create array
  const idsTop = overviewIdsTop.map(({id}) => id);
  const idsBtm = overviewIdsBtm.map(({id}) => id);

  const rstByPly = {}

  // get order
  for (let order_no = 1; order_no <= 9; order_no++) {
    const records = await db.query(getStartingMenberSpecifyOrder('H', order_no, idsTop, idsBtm), { type })
      .then(rst => rst)
      .catch(err => { console.log(err) })

    console.log(`----- Order No: [${order_no}] -----`)
    records.map(({ count, player_name }) => {
      console.log(`${count} ${player_name}`)

      createListByPlayer(rstByPly, order_no, count, player_name)
    })
    console.log(``)
  }

  console.log(rstByPly)
})()