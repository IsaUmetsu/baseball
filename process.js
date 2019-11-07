"use strict"

const axios = require('axios')
const fs = require('fs')
const moment = require('moment')

const { VISITOR_TEAM, HOME_TEAM, DATA_TYPE_URL, DATA_TYPE_JSON } = require('./constants')

const { checkAndCreateDir } = require('./func')
const {
  insertOrderDetail, insertOrderOverview, insertPlayer, saveGameInfo,
  saveGameScoreInfo, savePitchInfo, saveRI, saveTR
} = require('./process.func')
const logger = require('./logger')

// define sleep function
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

// execute params
const dataType = DATA_TYPE_JSON
const requireGetAndSaveData = true

const day = moment('2019-06-06');
const seasonStart = moment('2019-06-06');
const seasonEnd = moment('2019-06-06');

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
  if (dataType == DATA_TYPE_JSON) {
    // ./data フォルダから取得
    tgt_data = require(`${pathFile}/${pitch_count}.json`)
  // execute get from biglobe page
  } else if (dataType == DATA_TYPE_URL) {
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
      await insertPlayer(visitorOdr, homeOdr, visitorTm.split(',')[1], homeTm.split(',')[1])

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

/**
 * 
 */
const getDataAndSave = async () => {
  let stopped = false

  while(1) {
    if (day.isSameOrAfter(seasonStart) && day.isSameOrBefore(seasonEnd)) {
      // define game date
      const dateStr = day.format('YYYYMMDD');
      for (let gameNo = 4; gameNo <= 4; gameNo++) {
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
              console.log(err)
              console.log(`----- finished: date: [${dateStr}], gameNo: [${tgt_gameNo}] -----`)
              // throw err
            })
          // sleep 0.5 sec
          sleep(500);
          // break loop
          if (stopped && cnt >= 250) { break }
          else { stopped = false }
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
