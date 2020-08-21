import * as moment from "moment";
import * as fs from "fs";

import { createConnection } from 'typeorm';

import {
  insertGameInfo,
  insertLiveHeader,
  insertLiveBody,
  insertPitchInfo,
  insertAwayTeamInfo,
  insertHomeTeamInfo
} from './db_util';

const logger = require("../logger");

// define sleep function
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

// execute params
const requireGetAndSaveData = true;

const startGameNo = 1;
const endGameNo = 6;
const startSceneCnt = 1;

const day = moment("2020-06-19");
const seasonStart = moment("2020-06-19");
const seasonEnd = moment("2020-06-19");

/**
 * 1シーンごとの試合データ取得、jsonファイル保存
 * @param scene
 * @param dateStr
 * @param gameNo
 */
const getData = async (scene: number, dateString: string, gameNo: string) => {

  const checkDir = async(
    prevPath: string, date_string: string, game_no: string
  ): Promise<string> => {
    const path_date = `${prevPath}/${date_string}`;
    const path_file = `${prevPath}/${date_string}/${game_no}`;

    let path = "";
    // 日付ディレクトリ、ゲーム番号ディレクトリを確認
    if (fs.existsSync(path_date) && fs.existsSync(path_file)) {
      path = `${prevPath}/${date_string}/${game_no}`;
    }
    
    return path;
  }

  // return value
  let tgt_data;
  let prevPath = "/Users/IsamuUmetsu/dev/py_baseball/output";
  const pathFile = await checkDir(prevPath, dateString, gameNo)
    .then(rst => rst)
    .catch(err => {
      throw err;
    });

  // フォルダから取得
  if (pathFile.length > 0) {
    tgt_data = JSON.parse(fs.readFileSync(`${pathFile}/${scene}.json`, 'utf8'))
  }

  return tgt_data;
};

/**
 * DB保存実行処理
 * @param scene
 * @param dateStr
 * @param gameNo
 */
const saveData = async (scene: number, dateStr: string, gameNo: string) => {
  await getData(scene, dateStr, gameNo)
    .then(async data => {
      if (data === undefined) return;

      // get all
      const {
        liveHeader, 
        liveBody,
        pitchInfo,
        homeTeamInfo,
        awayTeamInfo
      } = data;

      const gameInfoId = await insertGameInfo(
        dateStr,
        liveHeader.away.teamInitial,
        liveHeader.home.teamInitial
      )
      
      await insertLiveHeader(gameInfoId, scene, liveHeader);
      await insertLiveBody(gameInfoId, scene, liveBody);
      await insertPitchInfo(gameInfoId, scene, pitchInfo);
      await insertHomeTeamInfo(gameInfoId, scene, homeTeamInfo);
      await insertAwayTeamInfo(gameInfoId, scene, awayTeamInfo);
    })
    .catch(e => {
      throw e;
    });
};

/**
 * 2球連続でボールが取得できなかった場合のみ、取得処理終了
 * (たまに1球だけ取得できない場合があり、その対策)
 */
const getDataAndSave = async () => {
  let noDataCnt = 0;

  while (1) {
    if (day.isSameOrAfter(seasonStart) && day.isSameOrBefore(seasonEnd)) {
      // define game date
      const dateStr = day.format("YYYYMMDD");
      for (let gameNo = startGameNo; gameNo <= endGameNo; gameNo++) {
        // define game no
        const tgt_gameNo = "0" + gameNo;
        // define pitch count
        for (let cnt = startSceneCnt; cnt <= 200; cnt++) {
          await saveData(cnt, dateStr, tgt_gameNo)
            .then(rst => {
              return rst;
            })
            .catch(err => {
              noDataCnt++;
              console.log(err);
              console.log(
                `----- finished: date: [${dateStr}], gameNo: [${tgt_gameNo}] -----`
              );
              // throw err
            });

          // break loop
          if (noDataCnt >= 0) {
            noDataCnt = 0;
            break;
          }
        }
      }
      day.add(1, "days");
    } else {
      break;
    }
  }
};

// Execute
(async () => {
  // when require data
  if (requireGetAndSaveData) {
    await createConnection('default');
    await getDataAndSave()
      .then(rst => rst)
      .catch(err => {
        console.log(err);
      });
  }
})();
