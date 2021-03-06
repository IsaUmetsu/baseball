import * as moment from "moment";
import { format } from 'util';
import { createConnection } from 'typeorm';

import { OutputJson, TeamInfoJson } from './type/jsonType.d';
import { insertGameInfo, insertLiveHeader, insertLiveBody, insertPitchInfo, insertAwayTeamInfo, insertHomeTeamInfo, executeUpdatePlusOutCount } from './util/db';
import { checkGameDir, getJson, countFiles, checkDateDir } from './util/fs';
import { checkArgDaySeasonEndSpecify, checkArgI } from "./util/display";
import { savePitchData, saveBatAndScoreData, saveText } from "./util/process";
import { teamArray as teams, TOP } from "./constant";

const startGameNo = 1;
const endGameNo = 6;
const startSceneCnt = 1;

const { D, SE, S, I } = process.env;
let { targetDay, seasonEndArg, specifyArg } = checkArgDaySeasonEndSpecify(D, SE, S);

const seasonStart = moment(format("2020%s", targetDay), "YYYYMMDD");
const seasonEnd = moment(format("2020%s", seasonEndArg), "YYYYMMDD");

const { importGame, importText, importPitch, importBat } = checkArgI(I);

const datePath = "/Users/IsamuUmetsu/dev/py_baseball/output";
const gamePath = "/Users/IsamuUmetsu/dev/py_baseball/output/%s/%s";
const jsonPath = "/Users/IsamuUmetsu/dev/py_baseball/output/%s/%s/%s.json";
const cardsJsonPath = "/Users/IsamuUmetsu/dev/py_baseball/starter/%s/%s.json";

/**
 * 
 */
const commitTeamInfo = (topBtm: number, awayTeamInfo: TeamInfoJson, homeTeamInfo: TeamInfoJson) => {
  return topBtm == TOP
    ? homeTeamInfo ? homeTeamInfo.batteryInfo : ''
    : awayTeamInfo ? awayTeamInfo.batteryInfo : ''
  ;
}

/**
 * DB保存実行処理
 */
const saveData = async (scene: number, gameInfoId: number, data: OutputJson) => {
  // get all
  const { liveHeader, liveBody, pitchInfo, homeTeamInfo, awayTeamInfo } = data;

  // if nogame, return
  if (liveHeader.away == undefined) return;

  // insert into `live_header`
  const { ballCount, topBtm } = await insertLiveHeader(gameInfoId, scene, liveHeader);
  // insert into `live_body`
  await insertLiveBody(gameInfoId, scene, liveBody, ballCount, commitTeamInfo(topBtm, awayTeamInfo, homeTeamInfo));
  // insert into `pitch_info`, `pitcher_batter`, `pitch_details`, `pitch_course`
  await insertPitchInfo(gameInfoId, scene, pitchInfo);
  // insert into `battery_info`, `homerun_info`, `team_info`, `game_order`, `bench_master`, `bench_menber_info`
  await insertHomeTeamInfo(gameInfoId, scene, homeTeamInfo);
  await insertAwayTeamInfo(gameInfoId, scene, awayTeamInfo);
};

/**
 * 
 */
const getCardsAndInsert = async (date, gameNo, isNoGame) => {
  const { away, home } = JSON.parse(getJson(format(cardsJsonPath, date, gameNo)));
  return await insertGameInfo(date, teams[away.team], teams[home.team], gameNo, isNoGame);
}

/**
 * 
 */
const doSave = async (gameNo: string, dateStr: string) => {
  // define game no
  // 日付・ゲーム番号ディレクトリがない場合スキップ
  const existGameDir = await checkGameDir(datePath, dateStr, gameNo);
  if (! existGameDir) return;
  // 試合の全シーン数取得
  const sceneCnt = await countFiles(format(gamePath, dateStr, gameNo));
  let isNoGame = false;
  if (sceneCnt > 0) {
    const lastJson: OutputJson = JSON.parse(getJson(format(jsonPath, dateStr, gameNo, sceneCnt)));
    isNoGame = ["試合中止", "ノーゲーム"].includes(lastJson.liveHeader.inning);
  }
  // 対戦カード取得 & insert into `game_info`
  const gameInfoId = await getCardsAndInsert(dateStr, gameNo, isNoGame);

  for (let cnt = startSceneCnt; cnt <= sceneCnt; cnt++) {
    const data = JSON.parse(getJson(format(jsonPath, dateStr, gameNo, cnt)));
    if (data === undefined) continue;

    await saveData(cnt, gameInfoId, data).catch(err => {
      console.log(err);
      console.log(format('----- [game] finished: date: [%s], gameNo: [%s] -----', dateStr, gameNo));
    });
  }
  console.log(format('----- [game] finished: date: [%s], gameNo: [%s] %s -----', dateStr, gameNo, sceneCnt == 0 ? 'but not imported [because not complete game]' : ''));
}

/**
 *
 */
const saveGame = async () => {
  const day = moment(format("2020%s", targetDay), "YYYYMMDD");
  while (day.isSameOrAfter(seasonStart) && day.isSameOrBefore(seasonEnd)) {
    // define game date
    const dateStr = day.format("YYYYMMDD");
    // 日付ディレクトリがない場合スキップ
    const existDateDir = await checkDateDir(datePath, dateStr);
    if (! existDateDir) { day.add(1, "days"); continue; }

    if (specifyArg) {
      await doSave(format("0%d", Number(specifyArg)), dateStr);
    } else {
      for (let gameNo = startGameNo; gameNo <= endGameNo; gameNo++) {
        await doSave(format("0%d", gameNo), dateStr);
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

    if (importGame) {
      await saveGame();
      await executeUpdatePlusOutCount(format("2020%s", targetDay), format("2020%s", seasonEndArg));
    }

    if (importText) await saveText(targetDay, seasonStart, seasonEnd, specifyArg);
    if (importPitch) await savePitchData(targetDay, seasonStart, seasonEnd, specifyArg);
    if (importBat) await saveBatAndScoreData(targetDay, seasonStart, seasonEnd, specifyArg);
  } catch (err) {
    console.log(err);
  }
})();
