import * as moment from "moment";
import { format } from 'util';
import { createConnection } from 'typeorm';

import {
  insertGameInfo,
  insertLiveHeader,
  insertLiveBody,
  insertPitchInfo,
  insertAwayTeamInfo,
  insertHomeTeamInfo,
  executeUpdatePlusOutCount
} from './db_util';

import { OutputJson } from './type/jsonType.d';

import { checkGameDir, getJson, countFiles, checkDateDir } from './fs_util';
import { checkArgDaySeasonEndSpecify } from "./disp_util";

const startGameNo = 1;
const endGameNo = 6;
const startSceneCnt = 1;

const { D, SE, S } = process.env;
let { targetDay, seasonEndArg, specifyArg } = checkArgDaySeasonEndSpecify(D, SE, S);

const day = moment(format("2020%s", targetDay), "YYYYMMDD");
const seasonStart = moment(format("2020%s", targetDay), "YYYYMMDD");
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
  const data = await getData(scene, dateStr, gameNo);
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
    gameNo,
    isNoGame
  );

  // insert into `live_header`
  const ballCount = await insertLiveHeader(gameInfoId, scene, liveHeader);
  // insert into `live_body`
  await insertLiveBody(gameInfoId, scene, liveBody, ballCount);
  // insert into `pitch_info`, `pitcher_batter`, `pitch_details`, `pitch_course`
  await insertPitchInfo(gameInfoId, scene, pitchInfo);
  // insert into `battery_info`, `homerun_info`, `team_info`, `game_order`, `bench_master`, `bench_menber_info`
  await insertHomeTeamInfo(gameInfoId, scene, homeTeamInfo);
  await insertAwayTeamInfo(gameInfoId, scene, awayTeamInfo);
};

const doSave = async (gameNo, dateStr) => {
  // define game no
  const targetGameNo = format("0%d", gameNo);
  // 日付・ゲーム番号ディレクトリがない場合スキップ
  const existGameDir = await checkGameDir(datePath, dateStr, targetGameNo);
  if (! existGameDir) return;
  // 試合終了していなければスキップ
  const sceneCnt = await countFiles(format(gamePath, dateStr, targetGameNo));
  let isNoGame = false;
  if (sceneCnt > 0) {
    const lastJson: OutputJson = JSON.parse(getJson(format(jsonPath, dateStr, targetGameNo, sceneCnt)));
    if (! ["試合終了", "試合中止", "ノーゲーム"].includes(lastJson.liveHeader.inning)) {
      console.log(format('----- finished: date: [%s], gameNo: [%s] but not imported [because not complete game] -----', dateStr, targetGameNo));
      return;
    }
    isNoGame = ["試合中止", "ノーゲーム"].includes(lastJson.liveHeader.inning);
  }

  for (let cnt = startSceneCnt; cnt <= sceneCnt; cnt++) {
    await saveData(cnt, dateStr, targetGameNo, isNoGame).catch(err => {
      console.log(err);
      console.log(format('----- finished: date: [%s], gameNo: [%s] -----', dateStr, targetGameNo));
    });
  }
  console.log(format('----- finished: date: [%s], gameNo: [%s] %s -----', dateStr, targetGameNo, sceneCnt == 0 ? 'but not imported [because not complete game]' : ''));
}

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

    if (specifyArg) {
      await doSave(Number(specifyArg), dateStr);
    } else {
      for (let gameNo = startGameNo; gameNo <= endGameNo; gameNo++) {
        await doSave(gameNo, dateStr);
      }
    }

    day.add(1, "days");
  }
  console.log('----- done!! -----');
};

// Execute
(async () => {
  try {
    await createConnection('default');
    await getDataAndSave();
    await executeUpdatePlusOutCount();
  } catch (err) {
    console.log(err);
  }
})();
