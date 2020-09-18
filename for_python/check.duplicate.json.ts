import * as moment from "moment";
import { format } from 'util';

import { OutputJson } from './type/jsonType';
import { checkGameDir, getJson, countFiles, checkDateDir } from './fs_util';
import { checkArgDaySeasonEndSpecify } from "./disp_util";

const startGameNo = 1;
const endGameNo = 6;
const startSceneCnt = 1;

const { D, SE, S } = process.env;
let { targetDay, seasonEndArg, specifyArg } = checkArgDaySeasonEndSpecify(D, SE, S);

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

const doCheck = async (gameNo, dateStr) => {
  // define game no
  const targetGameNo = format("0%d", gameNo);
  // 日付・ゲーム番号ディレクトリがない場合スキップ
  const existGameDir = await checkGameDir(datePath, dateStr, targetGameNo);
  if (! existGameDir) return;
  const sceneCnt = await countFiles(format(gamePath, dateStr, targetGameNo));
  // let isNoGame = false;
  // // 試合終了していなければスキップ
  // if (sceneCnt > 0) {
  //   const lastJson: OutputJson = JSON.parse(getJson(format(jsonPath, dateStr, targetGameNo, sceneCnt)));
  //   if (! ["試合終了", "試合中止", "ノーゲーム"].includes(lastJson.liveHeader.inning)) {
  //     console.log(format('----- finished: date: [%s], gameNo: [%s] but not imported [because not complete game] -----', dateStr, targetGameNo));
  //     return;import { checkArgDaySeasonEndSpecify } from './disp_util';

  //   }
  //   isNoGame = ["試合中止", "ノーゲーム"].includes(lastJson.liveHeader.inning);
  // }

  const doCheckDuplicate = async (cnt, prevCnt) => {
    if (cnt > prevCnt) {
      const data = await getData(cnt, dateStr, targetGameNo);
      const prevData = await getData(cnt - prevCnt, dateStr, targetGameNo);
  
      if (data.liveBody && prevData.liveBody && data.liveBody.currentBatterInfo && prevData.liveBody.currentBatterInfo) {
        const isSameBatter = data.liveBody.currentBatterInfo.name == prevData.liveBody.currentBatterInfo.name;
        const isSameBattingResult = data.liveBody.battingResult == prevData.liveBody.battingResult;
        const isSamePitchingResult = data.liveBody.pitchingResult == prevData.liveBody.pitchingResult;
        if (isSameBatter && isSameBattingResult && isSamePitchingResult) {
          console.log(format('----- is same!! date: %s, gameNo: %s, scene1: %d, scene2: %d', dateStr, gameNo, cnt - prevCnt, cnt));
        }
      }
    }
  }

  for (let cnt = startSceneCnt; cnt <= sceneCnt; cnt++) {
    await doCheckDuplicate(cnt, 1);
    await doCheckDuplicate(cnt, 2);
    await doCheckDuplicate(cnt, 3);
  }
  console.log(format('----- finished: date: [%s], gameNo: [%s] -----', dateStr, targetGameNo));
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
      await doCheck(Number(specifyArg), dateStr);
    } else {
      for (let gameNo = startGameNo; gameNo <= endGameNo; gameNo++) {
        await doCheck(gameNo, dateStr);
      }
    }

    day.add(1, "days");
  }
  console.log('----- done!! -----');
};

// Execute
(async () => {
  try {
    await getDataAndSave();
  } catch (err) {
    console.log(err);
  }
})();
