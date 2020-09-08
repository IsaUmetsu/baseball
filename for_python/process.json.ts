import * as moment from "moment";
import { format } from 'util';
import { createConnection } from 'typeorm';

import {
  insertGameInfo,
  insertLiveHeader,
  insertLiveBody,
  insertPitchInfo,
  insertAwayTeamInfo,
  insertHomeTeamInfo
} from './db_util';

import { OutputJson } from './type/jsonType.d';

import { checkGameDir, getJson, countFiles, checkDateDir } from './fs_util';

let error = false;

const startGameNo = 1;
const endGameNo = 6;
const startSceneCnt = 1;

let targetDay = process.env.D;
if (!targetDay) {
  console.log('D=[保存開始日] の指定がありません。2020/06/19 を指定します。');
  // error = true;
  targetDay = moment("2020-06-19").format("MMDD");
}

let seasonEndArg = process.env.SE;
if (!seasonEndArg) {
  console.log('SE=[保存開始日] の指定がありません。実行日を指定します。');
  // error = true;
  seasonEndArg = moment().format("MMDD");
}

const day = moment(format("2020%s", targetDay), "YYYYMMDD");
const seasonStart = moment("2020-06-19");
const seasonEnd = moment(format("2020%s", seasonEndArg), "YYYYMMDD");

const datePath = "/Users/IsamuUmetsu/dev/py_baseball/output";
const gamePath = "/Users/IsamuUmetsu/dev/py_baseball/output/%s/%s";
const jsonPath = "/Users/IsamuUmetsu/dev/py_baseball/output/%s/%s/%s.json";

/**
 * 1シーンごとの試合データ取得、jsonファイル保存
 * @param scene
 * @param dateStr
 * @param gameNo
 */
const getData = async (scene: number, dateString: string, gameNo: string): Promise<OutputJson> => {
  // フォルダから取得
  return JSON.parse(getJson(format(jsonPath, dateString, gameNo, scene)));
};

/**
 * DB保存実行処理
 * @param scene
 * @param dateStr
 * @param gameNo
 */
const saveData = async (scene: number, dateStr: string, gameNo: string, isNoGame: boolean) => {
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

      // insert into `game_info`
      const gameInfoId = await insertGameInfo(
        dateStr,
        liveHeader.away.teamInitial,
        liveHeader.home.teamInitial,
        isNoGame
      );

      // insert into `live_header`
      await insertLiveHeader(gameInfoId, scene, liveHeader);
      // insert into `live_body`
      await insertLiveBody(gameInfoId, scene, liveBody);
      // insert into `pitch_info`, `pitcher_batter`, `pitch_details`, `pitch_course`
      await insertPitchInfo(gameInfoId, scene, pitchInfo);
      // insert into `battery_info`, `homerun_info`, `team_info`, `game_order`, `bench_master`, `bench_menber_info`
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
  while (day.isSameOrAfter(seasonStart) && day.isSameOrBefore(seasonEnd)) {
    // define game date
    const dateStr = day.format("YYYYMMDD");
    // 日付ディレクトリがない場合スキップ
    const existDateDir = await checkDateDir(datePath, dateStr);
    if (! existDateDir) { day.add(1, "days"); continue; }

    for (let gameNo = startGameNo; gameNo <= endGameNo; gameNo++) {
      // define game no
      const targetGameNo = format("0%d", gameNo);
      // 日付・ゲーム番号ディレクトリがない場合スキップ
      const existGameDir = await checkGameDir(datePath, dateStr, targetGameNo);
      if (! existGameDir) continue;
      // 試合終了していなければスキップ
      const sceneCnt = await countFiles(format(gamePath, dateStr, targetGameNo));
      let isNoGame = false;
      if (sceneCnt > 0) {
        const lastJson: OutputJson = JSON.parse(getJson(format(jsonPath, dateStr, targetGameNo, sceneCnt)));
        if (! ["試合終了", "試合中止"].includes(lastJson.liveHeader.inning)) {
          console.log(format('----- finished: date: [%s], gameNo: [%s] but not imported [because not complete game] -----', dateStr, targetGameNo));
          continue;
        }
        isNoGame = lastJson.liveHeader.inning == "試合中止";
      }

      for (let cnt = startSceneCnt; cnt <= sceneCnt; cnt++) {
        await saveData(cnt, dateStr, targetGameNo, isNoGame).catch(err => {
          console.log(err);
          console.log(format('----- finished: date: [%s], gameNo: [%s] -----', dateStr, targetGameNo));
        });
      }
      console.log(format('----- finished: date: [%s], gameNo: [%s] -----', dateStr, targetGameNo));
    }
    day.add(1, "days");
  }
  console.log('----- done!! -----');
};

// Execute
(async () => {
  if (! error) {
    await createConnection('default');
    await getDataAndSave().catch(err => { console.log(err); });
  }
})();
