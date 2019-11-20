
"use strict"
/**
 * `process.js`で使用される関数定義
 */
const processFunc = module.exports = {}

const { TOP, BOTTOM } = require('./constants')

const {
  orderOverview, orderDetails, gameInfo,
  gameScoreInfo, player, pitchInfo, RInfo, TRInfo
} = require('./model')

const raw = true

/** ------------------------- Save `SI` ------------------------- */
/**
 * ゲームスコア 表裏保存
 * @param {number} game_info_id
 * @param {object} SI
 * @param {number} orderId
 */
processFunc.saveGameScoreInfo = async(SI, game_info_id, orderId) => {

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
processFunc.savePitchInfo = async(PI, game_info_id, order_overview_id) => {

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
        ball_type_id: batterResultArray[1],
        col_2: batterResultArray[2],
        col_3: batterResultArray[3],
        col_4: batterResultArray[4],
        col_5: batterResultArray[5],
        speed: batterResultArray[6],
        rst_id: batterResultArray[7],
        result: batterResultArray[8],
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
processFunc.saveRI = async(RI, game_info_id, order_overview_id) => {

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
        rst_id: partR[1],
        result: partR[2],
        direction: partR[3],
        col_5: partR[4],
        col_6: partR[5],
        col_7: partR[6],
        col_8: partR[7],
        ball_flow: partR[8],
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
processFunc.saveTR = async(TR, game_info_id, order_overview_id) => {
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
 * オーダー概要テーブルINSERT
 * @param {string} date 
 * @param {string} visitor_team (initial)
 * @param {string} home_team (initial)
 * @return id of a new record
 */
processFunc.insertOrderOverview = async (GI, visitor_team, home_team) => {
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
processFunc.insertOrderDetail = async (order_overview_id, data, pitch_count, top_bottom) => {
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
 * @param {object} visitorOdr
 * @param {object} homeOdr
 * @param {string} visitorTmInitial
 * @param {string} homeTmInitial
 */
processFunc.insertPlayer = async (visitorOdr, homeOdr, visitorTmInitial, homeTmInitial) => {
  const player_data = []
  // about visitor_team
  await visitorOdr.map(d => {
    const split_d = d.split(',')

    player_data.push({
      id             : Number(split_d[1]),
      profile_number : Number(split_d[3]),
      name           : String(split_d[4]),
      team           : visitorTmInitial
    })
  })
  // about home_team
  await homeOdr.map(d => {
    const split_d = d.split(',')

    player_data.push({
      id             : Number(split_d[1]),
      profile_number : Number(split_d[3]),
      name           : String(split_d[4]),
      team           : homeTmInitial
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
processFunc.saveGameInfo = async (St, GI, order_overview_id, pitch_count) => {
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