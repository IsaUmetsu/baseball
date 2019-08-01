'use strict'

const axios = require('axios')
const log4js = require('log4js')
const fs = require('fs')

log4js.configure({
  appenders: { system: { type: 'file', filename: 'system.log' }},
  categories: { default: { appenders: ['system'], level: 'debug' } }
})
const logger = log4js.getLogger()

const { db, orderOverview, orderDetails } = require('./model')

const ORDER_PITCHER = 10
const POSITIONS = {
  P: 1, C: 2, "1B": 3, "2B": 4, "3B": 5,
  SS: 6, LF: 7, CF: 8, RF: 9, D: 10,
  PH: 11, PR: 12
}
const POSITIONS_NAME = {
  1: "ピッチャー", 2: "キャッチャー", 3: "ファースト", 4: "セカンド", 5: "サード",
  6: "ショート", 7: "レフト", 8: "センター", 9: "ライト", 10: "指名打者"
}

/**
 * １球ごとの試合データ取得、jsonファイル保存
 * @param {*} pitch_count 
 */
const getData = async pitch_count => {
  const date_string = '20190710'
  const game_no = '06'

  // const url = `https://baseball.news.biglobe.ne.jp/npb/html5/json/${date_string}${game_no}/${pitch_count}.json`
  // const { data } = await axios.get(url)
  // fs.writeFile(
  //   `./data/${date_string}${game_no}_${pitch_count}.json`,
  //   JSON.stringify(data, null, '  '),
  //   (err) => { if (err) logger.error(err) }
  // )
  const data = require(`./data/${date_string}${game_no}_${pitch_count}`)

  return data
}

/**
 * DB保存実行処理
 * @param {*} pitch_count 
 */
const save_data = async pitch_count => {
  await getData(pitch_count)
    .then(async data => {
      if (data === undefined) return
      // get info
      const { GI, TO, SI, St, PI, RI, TR } = data
      // create `date` of game
      const date_string = GI.split(",")[0].slice(0, -2)
      // get order info
      const {
        H: { T: home_tm, O: home_odr },
        V: { T: visitor_tm, O: visitor_odr }
      } = TO
      // insert order_overview of home
      const home_tm_order_id = await insert_order_overview(date_string, home_tm.split(',')[1])
        .then(id => id)
        .catch(err => { console.log(err) })
      // insert order_overview of visitor
      const visitor_tm_order_id = await insert_order_overview(date_string, visitor_tm.split(',')[1])
        .then(id => id)
        .catch(err => { console.log(err) })

      await insert_order_detail(home_tm_order_id, home_odr, pitch_count)
      logger.info(`finished save data of home team. pitch: [${pitch_count}]`)
      await insert_order_detail(visitor_tm_order_id, visitor_odr, pitch_count)
      logger.info(`finished save data of visitor team. pitch: [${pitch_count}]`)
      // 選手交代判定
      check_player_change(pitch_count, home_tm_order_id)
      check_player_change(pitch_count, visitor_tm_order_id)
    })
    .catch(e => { console.log(e) })
}

(async () => {
  for (let cnt = 150; cnt <= 325 ; cnt++) {
     await save_data(cnt)
      .then(rst => rst)
      .catch(err => { throw err })
  }
})()


/**
 * オーダー概要テーブルINSERT
 * @param {*} date 
 * @param {*} team 
 * @return id of a new record
 */
const insert_order_overview = async (date_string, team) => {
  // select
  let target_record = await orderOverview
    .findOne({ where: { date: date_string, team }, raw: true})
    .then(rst => rst)
    .catch(err => { throw err })
  // if not exist, create new record
  if (! target_record) {
    target_record = await orderOverview
      .create({ date: date_string, team })
      .then(rsl => rsl)
      .catch(err => { throw err })
  }
  // return published id
  return target_record.id
}

/**
 * オーダー詳細テーブルINSERT
 * @param {*} order_overview_id 
 * @param {*} data 
 * @param {*} pitch_count
 */
const insert_order_detail = async (order_overview_id, data, pitch_count) => {
  // select
  const records = await orderDetails
    .findAll({ where: { order_overview_id, pitch_count } })
    .then(rst => rst)
    .catch(err => { throw err })
  // if not exist, create new records
  if (! records.length) {
    const insert_data = []
    data.map(d => {
      const split_d = d.split(',')
  
      insert_data.push({
        order_overview_id,
        pitch_count,
        batting_order : Number(split_d[0]),
        player_id     : Number(split_d[1]),
        pos_id        : Number(split_d[2]),
        profile_number: Number(split_d[3]),
        player_name   : String(split_d[4])
      })
    })
    // do bulk insert
    await orderDetails.bulkCreate(insert_data).then(rst => rst).catch(err => { throw err })
  }
}

/**
 * 
 * @param {*} now_pitch_count 
 * @param {*} order_overview_id 
 */
const check_player_change = async (now_pitch_count, order_overview_id) => {
  // 1球目は処理終了
  if (now_pitch_count == 1) return
  // 2球目以降
  const records = await db.query(`
    SELECT
      *
    FROM
    (
        -- 選手交代前の前
      SELECT
        *
      FROM
      (
        (
                SELECT
                    batting_order AS before_batting_order,
                    player_id AS before_player_id,
                    pos_id AS before_pos_id,
                    profile_number AS before_profile_number,
                    player_name AS before_player_name
                FROM
                    baseball.order_detail
                WHERE
                    order_overview_id = ${order_overview_id} AND pitch_count = ${now_pitch_count - 1}
            ) AS A
            LEFT OUTER JOIN
                (
                    SELECT
                        batting_order AS after_batting_order,
                        player_id AS after_player_id,
                        pos_id AS after_pos_id,
                        profile_number AS after_profile_number,
                        player_name AS after_player_name
                    FROM
                        baseball.order_detail
                    WHERE
                        order_overview_id = ${order_overview_id} AND pitch_count = ${now_pitch_count}
                ) AS B
            ON  A.before_player_id = B.after_player_id AND
                A.before_pos_id = B.after_pos_id
      )
      UNION
        -- 選手交代前の後
      SELECT
        *
      FROM
      (
        (
                SELECT
                    batting_order AS before_batting_order,
                    player_id AS before_player_id,
                    pos_id AS before_pos_id,
                    profile_number AS before_profile_number,
                    player_name AS before_player_name
                FROM
                    baseball.order_detail
                WHERE
                    order_overview_id = ${order_overview_id} AND pitch_count = ${now_pitch_count - 1}
            ) AS A
            RIGHT OUTER JOIN
        (
                SELECT
                    batting_order AS after_batting_order,
                    player_id AS after_player_id,
                    pos_id AS after_pos_id,
                    profile_number AS after_profile_number,
                    player_name AS after_player_name
                FROM
                    baseball.order_detail
                WHERE
                    order_overview_id = ${order_overview_id} AND pitch_count = ${now_pitch_count}
            ) AS B
            ON  A.before_player_id = B.after_player_id AND
                A.before_pos_id = B.after_pos_id
      )
    ) AS C
    WHERE
      before_batting_order IS NULL OR
        after_player_id IS NULL
    `, { type: db.QueryTypes.SELECT })
    .then(rst => rst)
    .catch(err => { throw err })
  // 選手交代がある場合
  if (records.length) {
    for (let idx = 0; idx < records.length; idx++) {
      const record = records[idx]
      const { before_batting_order, before_player_id, before_pos_id, before_profile_number, before_player_name } = record
      // 交代後の情報はスキップ
      if (! before_batting_order) continue
      // 交代後について、同じ打順の選手情報を取得
      const record_after = records.filter(r => r.after_batting_order == before_batting_order)[0]
      const { after_batting_order, after_player_id, after_pos_id, after_profile_number, after_player_name } = record_after

      let changed_position = ""
      let changed_content = ""
      if (before_batting_order == ORDER_PITCHER && before_pos_id == POSITIONS.P) {
        changed_position = "投手交代"
        changed_content = `${before_player_name}(${before_profile_number}) → ${after_player_name}(${after_profile_number})`
      } else if (after_pos_id == POSITIONS.PH) {
        changed_position = "代打"
        changed_content = `${before_player_name}(${before_profile_number}) → ${after_player_name}(${after_profile_number})`
      } else if (after_pos_id == POSITIONS.PR) {
        changed_position = "代走"
        changed_content = `${before_player_name}(${before_profile_number}) → ${after_player_name}(${after_profile_number})`
      // 代打・代走から、そのまま守備に就く場合
      } else if (before_pos_id !== after_pos_id && before_player_id == after_player_id) {
        changed_position = "守備交代"
        changed_content = `${before_player_name}(${before_profile_number}) → ${POSITIONS_NAME[after_pos_id]}`
      // チームが守備の際、同一ポジションで交代する場合
      } else if (before_pos_id == after_pos_id && before_player_id !== after_player_id) {
        changed_position = "守備交代"
        changed_content = `${POSITIONS_NAME[before_pos_id]} ${before_player_name}(${before_profile_number}) → ${after_player_name}(${after_profile_number})`
      // チームが守備の際、異なるポジションで交代する場合
      } else {
        changed_position = "守備交代"
        changed_content = `${POSITIONS_NAME[before_pos_id]} ${before_player_name}(${before_profile_number}) → ${POSITIONS_NAME[after_pos_id]} ${after_player_name}(${after_profile_number})`
      }
      console.log(`${changed_position}: ${changed_content}`)
    }
  }
}