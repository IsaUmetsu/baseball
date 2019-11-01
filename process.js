"use strict"

const axios = require('axios')
const fs = require('fs')
const moment = require('moment')

const {
  VISITOR_TEAM, HOME_TEAM, TOP,
  BOTTOM, dataType_URL, dataType_JSON
} = require('./constants')

const {
  orderOverview, orderDetails, gameInfo,
  gameScoreInfo, player, pitchInfo, RInfo, TRInfo
} = require('./model')
const { checkAndCreateDir } = require('./func')
const logger = require('./logger')

const raw = true

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
 * @param {string} gameNo
 */
const getData = async (pitch_count, dateString, gameNo) => {
  // specify for read json and get from biglobe
  if (dateString == "" || gameNo == "") {
    dateString = '20190329'
    gameNo = '06'
  }

  // return value
  let tgt_data;
  const pathFile = await checkAndCreateDir(dateString, gameNo).then(rst => rst).catch(err => { throw err })

  // read from json file
  if (dataType == dataType_JSON) {
    // ./data フォルダから取得
    tgt_data = require(`${pathFile}/${pitch_count}.json`)
  // execute get from biglobe page
  } else if (dataType == dataType_URL) {
    const url = `https://baseball.news.biglobe.ne.jp/npb/html5/json/${dateString}${gameNo}/${pitch_count}.json`
    const { data } = await axios.get(url).then(rst => rst).catch(e => { throw e })
    tgt_data = data
    // save as json 
    fs.writeFile(
      `${pathFile}/${pitch_count}.json`,
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
 * @param {string} gameNo
 */
const saveData = async (pitch_count, dateStr, gameNo) => {
  await getData(pitch_count, dateStr, gameNo)
    .then(async data => {
      if (data === undefined) return
      // get info
      const { GI, TO, SI, St, PI, RI, TR } = data

      // get order info
      const {
        H: { T: homeTm, O: homeOdr },
        V: { T: visitorTm, O: visitorOdr }
      } = TO

      // 1. GI
      // insert order_overview of game
      const { id: orderId } = await insertOrderOverview(GI, visitorTm.split(',')[1], homeTm.split(',')[1])
        .then(id => id)
        .catch(err => { throw err })

      // 2. TO
      await insertOrderDetail(orderId, homeOdr, pitch_count, HOME_TEAM)
      logger.info(`finished save data of home team.    date: [${dateStr}], gameNo: [${gameNo}] pitch: [${pitch_count}]`)

      await insertOrderDetail(orderId, visitorOdr, pitch_count, VISITOR_TEAM)
      logger.info(`finished save data of visitor team. date: [${dateStr}], gameNo: [${gameNo}] pitch: [${pitch_count}]`)
      // update player data
      await insertPlayer(homeOdr.concat(visitorOdr))

      // 3. St
      // 試合情報保存
      const gameInfoId = await saveGameInfo(St, GI, orderId, pitch_count)
        .then(rst => rst)
        .catch(err => { throw err })
      // 4. SI
      await saveGameScoreInfo(SI, gameInfoId, orderId)
      // 5. PI
      await savePitchInfo(PI, gameInfoId, orderId)
      // 6. RI
      await saveRI(RI, gameInfoId, orderId)
      // 7. TR
      await saveTR(TR, gameInfoId, orderId)
    })
    .catch(e => { throw e })
}



/** ------------------------- Save `SI` ------------------------- */
/**
 * ゲームスコア 表裏保存
 * @param {number} game_info_id
 * @param {object} SI
 * @param {number} orderId
 */
const saveGameScoreInfo = async(SI, game_info_id, orderId) => {

  let topRecord = await doSaveGameScoreInfoTopBottom(game_info_id, SI, TOP, "V", orderId)
                    .then(rst => rst)
                    .catch(err => { throw err })

  let bottomRecord = await doSaveGameScoreInfoTopBottom(game_info_id, SI, BOTTOM, "H", orderId)
                    .then(rst => rst)
                    .catch(err => { throw err })
}

/**
 * 表・裏ごとのゲームスコア保存
 * 
 * @param {number} game_info_id
 * @param {object} SI
 * @param {number} top_bottom
 * @param {string} homeVisitor
 * @param {number} order_overview_id
 */
const doSaveGameScoreInfoTopBottom = async(game_info_id, SI, top_bottom, homeVisitor, order_overview_id) => {
  let record = await gameScoreInfo
    .findOne({ where: { game_info_id, order_overview_id, top_bottom }, raw })
    .then(rst => rst)
    .catch(err => { throw err })

  if (! record) {
    const HV_SI = SI[homeVisitor]
    const total = HV_SI["R"].split(",")[0]

    const insertGameScoreInfo = { game_info_id, order_overview_id, top_bottom, total }

    if (HV_SI["S"]) {
      // 2回以上は配列でくる
      if (Array.isArray(HV_SI["S"])) {
        HV_SI["S"].map(inningInfo => {
          let [inning, score] = inningInfo.split(",")
          insertGameScoreInfo["inning_" + inning] = score
        })
      // 1回までは文字列でくる
      } else {
        let [inning, score] = HV_SI["S"].split(",")
        insertGameScoreInfo["inning_" + inning] = score
      }
    }

    record = await gameScoreInfo
      .create(insertGameScoreInfo)
      .then(rst => rst)
      .catch(err => { throw err })
  }
}
/** ------------------------- /Save `SI` ------------------------- */

/** ------------------------- Save `PI` ------------------------- */
const savePitchInfo = async(PI, game_info_id, order_overview_id) => {

  let pitchRecord = await pitchInfo
    .findOne({ where: { game_info_id, order_overview_id }, raw })
    .then(rst => rst)
    .catch(err => err)

  if (! pitchRecord) {  
    const total_batter_count = PI["N"]
    let batterResult = PI["B"]
    let insertPitchInfo = { game_info_id, order_overview_id }
    if (batterResult) {
      // 2球目以降の場合、最終投球の内容を取得
      if (Array.isArray(batterResult)) {
        batterResult = batterResult[batterResult.length - 1]
      }
      let batterResultArray = batterResult.split(",")

      insertPitchInfo = {
        game_info_id,
        order_overview_id,
        batter_pitch_count: batterResultArray[0],
        col_1: batterResultArray[1],
        col_2: batterResultArray[2],
        col_3: batterResultArray[3],
        col_4: batterResultArray[4],
        col_5: batterResultArray[5],
        speed: batterResultArray[6],
        col_7: batterResultArray[7],
        col_8: batterResultArray[8],
        col_9: batterResultArray[9],
        total_batter_count
      }
    }

    pitchRecord = await pitchInfo
      .create(insertPitchInfo)
      .then(rst => rst)
      .catch(err => err)
  }
}
/** ------------------------- /Save `PI` ------------------------- */

/** ------------------------- Save `RI` ------------------------- */
/**
 * 
 * @param {object} RI
 * @param {number} game_info_id
 * @param {number} order_overview_id
 */
const saveRI = async(RI, game_info_id, order_overview_id) => {

  let RIRecord = await RInfo
    .findOne({ where: { game_info_id, order_overview_id }, raw })
    .then(rst => rst)
    .catch(err => { throw err })

  if (! RIRecord) {
    let insertRInfo = { game_info_id, order_overview_id }

    if (RI["R"]) {
      let partR = RI["R"].split(",")
      // merge part of `R`
      Object.assign(insertRInfo, {
        col_1: partR[0],
        col_2: partR[1],
        col_3: partR[2],
        col_4: partR[3],
        col_5: partR[4],
        col_6: partR[5],
        col_7: partR[6],
        col_8: partR[7],
        col_9: partR[8],
      })
    }

    if (RI["S"]) {
      let partS = RI["S"]
      if (Array.isArray(partS)) {
        partS.map((S, idx) => {
          insertRInfo[`s_col_${idx + 1}`] = S
        })
      } else {
        Object.assign(insertRInfo, {
          s_col_1: partS
        })
      }
    }

    if (RI["O"]) {
      let partO = RI["O"]
      if (Array.isArray(partO)) {
        partO.map((O, idx) => {
          insertRInfo[`o_col_${idx + 1}`] = O
        })
      } else {
        Object.assign(insertRInfo, {
          o_col_1: partO
        })
      }
    }

    if (RI["Ps"]) {
        RI["Ps"].split(",").map((Ps, idx) => {
          insertRInfo[`ps_col_${idx + 1}`] = Ps
        })
    }

    RIRecord = await RInfo
      .create(insertRInfo)
      .then(rst => rst)
      .catch(err => { throw err })
  }
}
/** ------------------------- /Save `RI` ------------------------- */

/** ------------------------- Save `TR` ------------------------- */
const saveTR = async(TR, game_info_id, order_overview_id) => {
  let TrRecord = await TRInfo
    .findOne({ where: { game_info_id, order_overview_id }, raw })
    .then(rst => rst)
    .catch(err => { throw err })

  if (! TrRecord) {
    let TrArray = TR.split(",")

    TrRecord = await TRInfo
      .create({
        game_info_id,
        order_overview_id,
        col_1: TrArray[0],
        col_2: TrArray[1],
        col_3: TrArray[2],
        col_4: TrArray[3],
        col_5: TrArray[4],
        col_6: TrArray[5],
      })
      .then(rst => rst)
      .catch(err => { throw err })
  }
}
/** ------------------------- /Save `TR` ------------------------- */

/**
 * 
 */
const getDataAndSave = async () => {
  let stopped = false

  while(1) {
    if (day.isSameOrAfter(seasonStart) && day.isSameOrBefore(seasonEnd)) {
      // define game date
      const dateStr = day.format('YYYYMMDD');
      for (let gameNo = 1; gameNo <= 6; gameNo++) {
        // reset flag
        stopped = false;
        // define game no
        const tgt_gameNo = "0" + gameNo;
        // define pitch count
        for (let cnt = 1; cnt <= 500; cnt++) {
          await saveData(cnt, dateStr, tgt_gameNo)
            .then(rst => rst)
            .catch(err => {
              stopped = true;
              console.log(`----- finished: date: [${dateStr}], gameNo: [${tgt_gameNo}] -----`)
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
const insertOrderOverview = async (GI, visitor_team, home_team) => {
  const GIArray = GI.split(",")

  const dateString = GIArray[0].slice(0, -2)
  const game_no = GIArray[0].slice(-2)
  // select
  let target_record = await orderOverview
    .findOne({ where: { date: dateString, visitor_team, home_team }, raw })
    .then(rst => rst)
    .catch(err => { throw err })
  // if not exist, create new record
  if (! target_record) {
    target_record = await orderOverview
      .create({
        date: dateString, visitor_team, home_team, game_no,
        col_1: GIArray[1],
        col_2: GIArray[2],
        col_3: GIArray[3],
      })
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


/** ------------------------- Save `St` ------------------------- */
/**
 * 球場・対戦投手打者・塁情報
 * 
 * @param {object} St
 * @param {object} GI
 * @param {number} order_overview_id
 * @param {number} pitch_count
 */
const saveGameInfo = async (St, GI, order_overview_id, pitch_count) => {
  let gameInfoRecord = await gameInfo
    .findOne({ where: { order_overview_id, pitch_count } })
    .then(rst => rst)
    .catch(err => { throw err })

  if (! gameInfoRecord) {
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
      20: "next_3b_go",
      22: "game_datetime"
    }
    // json の `St` キーのカンマ区切り文字列を配列に分割
    const arrSt = St.split(',')
    // 試合時間を追加
    arrSt.push(GI.split(",")[4])

    const insertGameInfo = { order_overview_id, pitch_count }
    await arrSt.map((elemSt, idx) => {
      const key_name = gameInfoColumns[idx] ? gameInfoColumns[idx] : "unkcol_" + idx
      insertGameInfo[key_name] = elemSt
    })
  
    gameInfoRecord = await gameInfo
      .create(insertGameInfo)
      .then(rst => rst)
      .catch(err => { throw err })
  }

  return gameInfoRecord.id
}
/** ------------------------- /Save `St` ------------------------- */
