"use strict"

const axios = require('axios')
const fs = require('fs')
const moment = require('moment')

const {
  ORDER_PITCHER, POSITIONS, POSITIONS_NAME,
  VISITOR_TEAM, HOME_TEAM,
  TOP_BOTTOM, FIRST_BASE, SECOND_BASE, THIRD_BASE,
  dataType_URL, dataType_JSON
} = require('../constants')
const { P, RF, D, PH, PR } = POSITIONS

const { db, orderOverview } = require('../model')
const { judgePlayerChange, getGameInfoWhenChange } = require('../query')
const { checkAndCreateDir } = require('../func')
const logger = require('../logger')

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
  const path_file = await checkAndCreateDir("./data", dateString, game_no).then(rst => rst).catch(err => { throw err })

  // read from json file
  if (dataType == dataType_JSON) {
    // process.js より1階層上にあるので、1つ下の階層を指定
    tgt_data = require(`.${path_file}/${pitch_count}.json`)
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
  await getData(pitch_count, dateStr, game_no).then(async data => {
      if (data === undefined) return
      // get info
      const { GI, TO, SI } = data
      // create `date` of game
      const dateString = GI.split(",")[0].slice(0, -2)
      // get order info
      const {
        H: { T: home_tm },
        V: { T: visitor_tm }
      } = TO
      // insert order_overview of game
      const { id: order_id } = await insertOrderOverview(
          dateString,
          visitor_tm.split(',')[1],
          home_tm.split(',')[1]
        )
        .then(id => id)
        .catch(err => { throw err })

      // 得点計算
      const { H: { R: h_score }, V: { R: v_score } } = SI
      // create score
      const visitorTeamScore = `${visitor_tm.split(',')[0].slice(0, 1)}${v_score.split(',')[0]}`
      const homeTeamScore = `${h_score.split(',')[0]}${home_tm.split(',')[0].slice(0, 1)}`
      // create score
      const game_score = `${visitorTeamScore} - ${homeTeamScore}`
      // 選手交代判定
      checkPlayerChange(pitch_count, order_id, HOME_TEAM, home_tm.split(',')[0], game_score)
      checkPlayerChange(pitch_count, order_id, VISITOR_TEAM, visitor_tm.split(',')[0], game_score)
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
 * 
 * @param {*} now_pitch_count 
 * @param {*} order_overview_id 
 */
const checkPlayerChange = async (now_pitch_count, order_overview_id, top_bottom, team_name, game_score) => {
  // 1球目は処理終了
  if (now_pitch_count == 1) return
  // 2球目以降
  const records = await db.query(judgePlayerChange(order_overview_id, now_pitch_count, top_bottom), { type })
    .then(rst => rst)
    .catch(err => { throw err })
  // 選手交代がある場合
  if (records.length) {
    for (let idx = 0; idx < records.length; idx++) {
      const record = records[idx]
      const { before_pitch_count, before_batting_order, before_player, before_pos, before_profile_number, before_player_name } = record
      // 交代後の情報はスキップ
      if (! before_batting_order) continue
      // 交代後について、同じ打順の選手情報を取得
      const record_after = records.filter(r => r.after_batting_order == before_batting_order)[0]
      const { after_pitch_count, after_batting_order, after_player, after_pos, after_profile_number, after_player_name } = record_after

      // 交代時のゲーム情報を取得
      const game_info = await db.query(getGameInfoWhenChange(order_overview_id, before_pitch_count, after_pitch_count), { type })
        .then(rst => rst)
        .catch(err => { throw err })
      // create game conditions
      let isPR = after_pos == PR, changed_base = "", changed_base_no = 0 // 代走起用であるか、代走のためにランナー情報を書き換えたかを保持
      
      let {
        ining, top_bottom, pitcher, p_pn, batter, b_pn,
        strike, ball, out, runner_1b, runner_1b_pn,
        runner_2b, runner_2b_pn, runner_3b, runner_3b_pn
      } = game_info[1] // 0: 変更前情報, 1: 変更後情報

      // 代走起用で、各ベースのランナーが起用後の選手の場合、起用前の選手に一時的に置換（変更走者情報、変更塁情報も同時に変更）
      if (isPR) {
        if (runner_1b == after_player_name) {
          runner_1b = `${before_player_name}(${before_profile_number})`
          changed_base = "一塁走者"
          changed_base_no = FIRST_BASE
        }
        if (runner_2b == after_player_name) {
          runner_2b = `${before_player_name}(${before_profile_number})`
          changed_base = "二塁走者"
          changed_base_no = SECOND_BASE
        }
        if (runner_3b == after_player_name) {
          runner_3b = `${before_player_name}(${before_profile_number})`
          changed_base = "三塁走者"
          changed_base_no = THIRD_BASE
        }
      }
      // 選手起用が代走の場合、既に選手が入れ替わった状態であるため、意図的に選手起用を元に戻す
      if (runner_1b && changed_base_no != FIRST_BASE) runner_1b = `${runner_1b}(${runner_1b_pn})`
      if (runner_2b && changed_base_no != SECOND_BASE) runner_2b = `${runner_2b}(${runner_2b_pn})`
      if (runner_3b && changed_base_no != THIRD_BASE) runner_3b = `${runner_3b}(${runner_3b_pn})`

      // 試合情報(1) イニング
      const ining_string = `${ining}回${TOP_BOTTOM[top_bottom]}`
      // 試合情報(2) アウトカウント
      const out_string = `${out > 0 ? out == 1 ? '一' : "二" : '無'}死`
      let on_base_info = "", runner_info = ""
      if (runner_1b && runner_2b && runner_3b) { on_base_info = "満" }
      else {
        if (runner_1b) { on_base_info += "一"; runner_info += `一塁走者：${runner_1b}、` }
        if (runner_2b) { on_base_info += "二"; runner_info += `二塁走者：${runner_2b}、` }
        if (runner_3b) { on_base_info += "三"; runner_info += `三塁走者：${runner_3b}、` }
      }
      on_base_info ? on_base_info += "塁" : on_base_info = "走者なし"
      if (runner_info) runner_info = `(${runner_info.slice(0, -1)})` 
      // 試合情報(3) 走者情報
      const runner_string = `${on_base_info} ${runner_info}`

      let changed_position = ""
      let changed_content = ""
      let changed = true
      let opponent = ""
      // パリーグの投手変更の場合
      if (before_batting_order == ORDER_PITCHER && before_pos == P) {
        changed_position = "投手"
        opponent = `対戦打者：${batter}(${b_pn})`
        changed_content = `${before_player_name}(${before_profile_number}) → ${after_player_name}(${after_profile_number})`
      // 代打
      } else if (after_pos == PH) {
        changed_position = "代打"
        opponent = `対戦投手：${pitcher}(${p_pn})`
        changed_content = `${before_player_name}(${before_profile_number}) → ${after_player_name}(${after_profile_number})`
      // 代走
      } else if (isPR) {
        changed_position = "代走"
        changed_content = `${changed_base} ${before_player_name}(${before_profile_number}) → ${after_player_name}(${after_profile_number})`
      // 代打・代走から、そのまま守備に就く場合
      } else if (fromPHPRtoField(before_pos, after_pos, before_player, after_player)) {
        changed_position = "守備"
        changed = false
        changed_content = `${before_player_name}(${before_profile_number}) → ${POSITIONS_NAME[after_pos]}`
      // チームが守備の際、同一ポジションで交代する場合
      } else if (changePlayerSamePosition(before_pos, after_pos, before_player, after_player)) {
        changed_position = after_pos == P ? "投手" : "守備"
        if (after_pos == P) opponent = `対戦打者：${batter}(${b_pn})`
        // output_position = 
        changed_content = `${after_pos == P ? '' : `${POSITIONS_NAME[before_pos]} `}${before_player_name}(${before_profile_number}) → ${after_player_name}(${after_profile_number})`
      // チームが守備の際、同じ選手の守備位置が変わる場合（守備位置の数字が1〜9）
      } else if (changePositionSamePlayer(before_pos, after_pos, before_player, after_player)) {
        changed_position = after_pos == P ? "投手" : "守備"
        if (after_pos == P) opponent = `対戦打者：${batter}(${b_pn})`
        changed = false
        changed_content = `${before_player_name}(${before_profile_number}) ${POSITIONS_NAME[before_pos]} → ${POSITIONS_NAME[after_pos]}`
      // チームが守備の際、異なるポジションで交代する場合
      } else {
        changed_position = after_pos == P ? "投手" : "守備"
        if (after_pos == P) opponent = `対戦打者：${batter}(${b_pn})`
        changed_content = `${POSITIONS_NAME[before_pos]} ${before_player_name}(${before_profile_number}) → ${POSITIONS_NAME[after_pos]} ${after_player_name}(${after_profile_number})`
      }
      console.log(`${ining_string} ${out_string}${runner_string}`)
      console.log(`${game_score} ${opponent}`)
      console.log(`   【${team_name}】${ changed ? "選手交代" : "守備変更" }`)
      console.log(`   ${changed_position}: ${changed_content}`)
    }
  }
}

/**
 * 
 */
const fromPHPRtoField = (before_pos, after_pos, before_player, after_player) => (
  (before_pos == POSITIONS_NAME[PH] || before_pos == POSITIONS_NAME[PR]) && // 代打 or 代走
  (after_pos >= POSITIONS_NAME[P] && after_pos <= POSITIONS_NAME[RF])      && // 9つの守備位置のいずれか
  before_player == after_player // 選手が同じ
)

/**
 * 
 */
const changePlayerSamePosition = (before_pos, after_pos, before_player, after_player) => (
  before_pos == after_pos &&     // 同一ポジション
  before_player !== after_player // 異なる選手
)

/**
 * 
 */
const changePositionSamePlayer = (before_pos, after_pos, before_player, after_player) => (
  before_pos !== after_pos &&   // 異なるポジション
  before_player == after_player // 同一選手
)

