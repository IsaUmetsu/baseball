"use strict"

const axios = require('axios')
const fs = require('fs')
const moment = require('moment')

const {
  ORDER_PITCHER, POSITIONS, POSITIONS_NAME,
  VISITOR_TEAM, HOME_TEAM,
  TOP_BOTTOM, FIRST_BASE, SECOND_BASE, THIRD_BASE,
  dataType_URL, dataType_JSON
} = require('./constants')
const { P, RF, D, PH, PR } = POSITIONS

const { db, orderOverview, orderDetails, gameInfo, player } = require('./model')
const { judgePlayerChange, getGameInfoWhenChange } = require('./query')
const { checkAndCreateDir } = require('./func')
const logger = require('./logger')

const raw = true
const { SELECT: type } = db.QueryTypes

// define sleep function
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

// execute params
const dataType = dataType_JSON
const requireGetAndSaveData = true

const day = moment('2019-03-29');
const seasonStart = moment('2019-03-29');
const seasonEnd = moment('2019-03-29');

/**
 * １球ごとの試合データ取得、jsonファイル保存
 * @param {string} pitch_count 
 * @param {string} dateStr
 * @param {string} game_no
 */
const getData = async (pitch_count, dateString, game_no) => {
  // specify for read json and get from biglobe
  if (dateString == "" || game_no == "") {
    dateString = '20190329'
    game_no = '06'
  }

  // return value
  let tgt_data;
  const path_file = await checkAndCreateDir(dateString, game_no).then(rst => rst).catch(err => { throw err })

  // read from json file
  if (dataType == dataType_JSON) {
    // ./data フォルダから取得
    tgt_data = require(`${path_file}/${pitch_count}.json`)
  // execute get from biglobe page
  } else if (dataType == dataType_URL) {
    const url = `https://baseball.news.biglobe.ne.jp/npb/html5/json/${dateString}${game_no}/${pitch_count}.json`
    const { data } = await axios.get(url).then(rst => rst).catch(e => { throw e })
    tgt_data = data
    // save as json 
    fs.writeFile(
      `${path_file}/${pitch_count}.json`,
      JSON.stringify(data, null, '  '),
      (err) => { if (err) logger.error(err) }
    )
  }

  return tgt_data
}

/**
 * DB保存実行処理
 * @param {string} pitch_count
 * @param {string} dateStr
 * @param {string} game_no
 */
const saveData = async (pitch_count, dateStr, game_no) => {
  await getData(pitch_count, dateStr, game_no)
    .then(async data => {
      if (data === undefined) return
      // get info
      const { GI, TO, SI, St, PI, RI, TR } = data
      // create `date` of game
      const dateString = GI.split(",")[0].slice(0, -2)
      // get order info
      const {
        H: { T: home_tm, O: home_odr },
        V: { T: visitor_tm, O: visitor_odr }
      } = TO
      // insert order_overview of game
      const { id: order_id } = await insertOrderOverview(dateString, visitor_tm.split(',')[1], home_tm.split(',')[1])
        .then(id => id)
        .catch(err => { throw err })

      await insertOrderDetail(order_id, home_odr, pitch_count, HOME_TEAM)
      logger.info(`finished save data of home team.    date: [${dateStr}], game_no: [${game_no}] pitch: [${pitch_count}]`)
      await insertOrderDetail(order_id, visitor_odr, pitch_count, VISITOR_TEAM)
      logger.info(`finished save data of visitor team. date: [${dateStr}], game_no: [${game_no}] pitch: [${pitch_count}]`)
      // update player data
      await insertPlayer(home_odr.concat(visitor_odr))
      // 試合情報保存
      await saveGameInfo(St, order_id, pitch_count)
        .then(rst => rst)
        .catch(err => { throw err })
    })
    .catch(e => { throw e })
}

/**
 * 
 */
const getDataAndSave = async () => {
  let stopped = false

  while(1) {
    if (day.isSameOrAfter(seasonStart) && day.isSameOrBefore(seasonEnd)) {
      // define game date
      const dateStr = day.format('YYYYMMDD');
      for (let game_no = 1; game_no <= 6; game_no++) {
        // reset flag
        stopped = false;
        // define game no
        const tgt_game_no = "0" + game_no;
        // define pitch count
        for (let cnt = 1; cnt <= 500; cnt++) {
          await saveData(cnt, dateStr, tgt_game_no)
            .then(rst => rst)
            .catch(err => {
              stopped = true;
              console.log(`----- finished: date: [${dateStr}], game_no: [${tgt_game_no}] -----`)
              throw err
            })
          // sleep 0.5 sec
          sleep(500);
          // break loop
          if (stopped) break
        }
      }
      day.add(1, 'days');
    } else {
      break;
    }
  }
}

// Execute
(async () => {
  // when require data
  if (requireGetAndSaveData) {
    await getDataAndSave()
      .then(rst => rst)
      .catch(err => {
        console.log(err)
      })
  }
})()

/**
 * オーダー概要テーブルINSERT
 * @param {*} date 
 * @param {*} team 
 * @return id of a new record
 */
const insertOrderOverview = async (dateString, visitor_team, home_team) => {
  // select
  let target_record = await orderOverview
    .findOne({ where: { date: dateString, visitor_team, home_team }, raw })
    .then(rst => rst)
    .catch(err => { throw err })
  // if not exist, create new record
  if (! target_record) {
    target_record = await orderOverview
      .create({ date: dateString, visitor_team, home_team })
      .then(rsl => rsl)
      .catch(err => { throw err })
  }
  // return published id
  return target_record
}

/**
 * オーダー詳細テーブルINSERT
 * @param {*} order_overview_id 
 * @param {*} data 
 * @param {*} pitch_count
 */
const insertOrderDetail = async (order_overview_id, data, pitch_count, top_bottom) => {
  // select
  const records = await orderDetails
    .findAll({ where: { order_overview_id, top_bottom, pitch_count } })
    .then(rst => rst)
    .catch(err => { throw err })
  // if not exist, create new records
  if (! records.length) {
    const insert_data = []
    data.map(d => {
      const split_d = d.split(',')
  
      insert_data.push({
        order_overview_id,
        top_bottom,
        pitch_count,
        batting_order : Number(split_d[0]),
        player        : Number(split_d[1]),
        pos           : Number(split_d[2]),
        profile_number: Number(split_d[3]),
        player_name   : String(split_d[4])
      })
    })
    // do bulk insert
    await orderDetails.bulkCreate(insert_data).then(rst => rst).catch(err => { throw err })
  }
}

/**
 * 選手情報更新
 */
const insertPlayer = async data => {
  const player_data = []
  await data.map(d => {
    const split_d = d.split(',')

    player_data.push({
      id            : Number(split_d[1]),
      profile_number: Number(split_d[3]),
      name          : String(split_d[4])
    })
  })

  await player
    .bulkCreate(player_data, { updateOnDuplicate: ['profile_name', 'name', 'updated_at'] })
    .then(rst => rst)
    .catch(err => { throw err })
}

/**
 * 
 */
const saveGameInfo = async (St, order_overview_id, pitch_count) => {
  const record = await gameInfo
    .findOne({ where: { order_overview_id, pitch_count } })
    .then(rst => rst)
    .catch(err => { throw err })

  if (! record) {
    const gameInfoColumns = {
      0: "location",
      1: "ining",
      2: "top_bottom",
      3: "pitcher",
      6: "batter",
      8: "strike",
      9: "ball",
      10: "out",
      14: "on_all_base",
      15: "runner_1b",
      16: "next_1b_go",
      17: "runner_2b",
      18: "next_2b_go",
      19: "runner_3b",
      20: "next_3b_go"
    }
    // json の `St` キーのカンマ区切り文字列を配列に分割
    const arrSt = St.split(',')

    const insertGameInfo = { order_overview_id, pitch_count }
    await arrSt.map((elemSt, idx) => {
      const key_name = gameInfoColumns[idx] ? gameInfoColumns[idx] : "unkcol_" + idx
      insertGameInfo[key_name] = elemSt
    })
  
    await gameInfo
      .create(insertGameInfo)
      .then(rst => rst)
      .catch(err => { throw err })
  }
}

