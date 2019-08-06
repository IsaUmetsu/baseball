'use strict'

const axios = require('axios')
const fs = require('fs')

const logger = require('./logger')
const { db, orderOverview, orderDetails, gameInfo, player } = require('./model')
const {
  ORDER_PITCHER, POSITIONS, POSITIONS_NAME,
  VISITOR_TEAM, HOME_TEAM,
  TOP_BOTTOM, FIRST_BASE, SECOND_BASE, THIRD_BASE
} = require('./constants')
const { P, RF, D, PH, PR } = POSITIONS
const { checkPlayerChange, getGameInfoWhenChange } = require('./query')

const raw = true
const { SELECT: type } = db.QueryTypes // decide type as SELECT

/**
 * １球ごとの試合データ取得、jsonファイル保存
 * @param {*} pitch_count 
 */
const getData = async pitch_count => {
  const date_string = '20190801'
  const game_no = '06'
  const path_file = await checkAndCreateDir(date_string, game_no).then(rst => rst).catch(err => { throw err })

  // const url = `https://baseball.news.biglobe.ne.jp/npb/html5/json/${date_string}${game_no}/${pitch_count}.json`
  // const { data } = await axios.get(url).then(rst => rst).catch(e => { throw e })
  // // save as json 
  // fs.writeFile(
  //   `${path_file}/${pitch_count}.json`,
  //   JSON.stringify(data, null, '  '),
  //   (err) => { if (err) logger.error(err) }
  // )

  const data = require(`${path_file}/${pitch_count}.json`)

  return data
}

/**
 * 
 */
const checkAndCreateDir = async (date_string, game_no) => {
  const path_date = `./data/${date_string}`
  const path_file = `./data/${date_string}/${game_no}`
  // 日付ディレクトリがない場合、作成作成
  if (!fs.existsSync(path_date)) { fs.mkdirSync(path_date) }
  // ゲーム番号ディレクトリがない場合、作成
  if (!fs.existsSync(path_file)) { fs.mkdirSync(path_file) }
  return path_file
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
      // insert order_overview of game
      const { id: order_id } = await insert_order_overview(date_string, visitor_tm.split(',')[1], home_tm.split(',')[1])
        .then(id => id)
        .catch(err => { throw err })

      await insert_order_detail(order_id, home_odr, pitch_count, HOME_TEAM)
      logger.info(`finished save data of home team. pitch: [${pitch_count}]`)
      await insert_order_detail(order_id, visitor_odr, pitch_count, VISITOR_TEAM)
      logger.info(`finished save data of visitor team. pitch: [${pitch_count}]`)
      // update player data
      await insert_player(home_odr.concat(visitor_odr))
      // 得点計算
      const { H: { R: h_score }, V: { R: v_score } } = SI
      const game_score = `${visitor_tm.split(',')[0].slice(0, 1)}${v_score.split(',')[0]} - ${h_score.split(',')[0]}${home_tm.split(',')[0].slice(0, 1)}`
      // 選手交代判定
      check_player_change(pitch_count, order_id, HOME_TEAM, home_tm.split(',')[0], game_score)
      check_player_change(pitch_count, order_id, VISITOR_TEAM, visitor_tm.split(',')[0], game_score)
      // 試合情報保存
      await saveGameInfo(St, order_id, pitch_count)
        .then(rst => rst)
        .catch(err => { throw err })
    })
    .catch(e => { throw e })
}

// Execute
(async () => {
  let stopped = false
  for (let cnt = 1; cnt <= 400 ; cnt++) {
     await save_data(cnt)
      .then(rst => rst)
      .catch(err => { stopped = true; console.log("----- finished -----") })
    
    if (stopped) break
  }
})()


/**
 * オーダー概要テーブルINSERT
 * @param {*} date 
 * @param {*} team 
 * @return id of a new record
 */
const insert_order_overview = async (date_string, visitor_team, home_team) => {
  // select
  let target_record = await orderOverview
    .findOne({ where: { date: date_string, visitor_team, home_team }, raw })
    .then(rst => rst)
    .catch(err => { throw err })
  // if not exist, create new record
  if (! target_record) {
    target_record = await orderOverview
      .create({ date: date_string, visitor_team, home_team })
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
const insert_order_detail = async (order_overview_id, data, pitch_count, top_bottom) => {
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
const insert_player = async data => {
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
 * @param {*} now_pitch_count 
 * @param {*} order_overview_id 
 */
const check_player_change = async (now_pitch_count, order_overview_id, top_bottom, team_name, game_score) => {
  // 1球目は処理終了
  if (now_pitch_count == 1) return
  // 2球目以降
  const records = await db.query(checkPlayerChange(order_overview_id, now_pitch_count, top_bottom), { type })
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

