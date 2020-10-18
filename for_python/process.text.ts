import * as moment from "moment";
import { format } from 'util';
import { createConnection } from 'typeorm';

import { isFinishedGameById } from './util/db';
import { getJson, checkDateDir, checkGameJson } from './util/fs';
import { checkArgDaySeasonEndSpecify } from "./util/display";

import { getRepository } from 'typeorm';
import { GameInfo, SummaryPoint } from "./entities";

const startGameNo = 1;
const endGameNo = 6;

const { D, SE, S } = process.env;
let { targetDay, seasonEndArg, specifyArg } = checkArgDaySeasonEndSpecify(D, SE, S);

const seasonStart = moment(format("2020%s", targetDay), "YYYYMMDD");
const seasonEnd = moment(format("2020%s", seasonEndArg), "YYYYMMDD");

const datePath = "/Users/IsamuUmetsu/dev/py_baseball/text";
const jsonPath = "/Users/IsamuUmetsu/dev/py_baseball/text/%s/%s.json";

interface ResultText {
  inning: string,
  team: string,
  no: string,
  order: string,
  batter: string,
  detail: string
}

/**
 * 
 */
const doSaveRecord = async (record: SummaryPoint, gameInfoId: number, json: ResultText) => {

  record.gameInfoId = gameInfoId;
  record.inning = json.inning;
  record.team = json.team.replace(/の攻撃/g, '');
  record.no = json.no.replace(/：/g, '');
  record.order = json.order.replace(/番/g, '');
  record.batter = json.batter;
  record.detail = json.detail;
  record.isRbiHit = Number(json.detail.indexOf('タイムリー') > -1);

  await record.save();
}

/**
 * 
 */
const doSave = async (gameNo: string, dateStr: string) => {
  // define game no
  const targetGameNo = format("0%d", gameNo);
  // 日付・ゲーム番号ディレクトリがない場合スキップ
  const existGameJson = await checkGameJson(datePath, dateStr, targetGameNo);
  if (! existGameJson) return;

  const savedGameInfo = await getRepository(GameInfo).findOne({ date: dateStr, gameNo });
  if (! savedGameInfo) return;

  const { id: gameInfoId } = savedGameInfo;

  const jsonArray: ResultText[] = JSON.parse(getJson(format(jsonPath, dateStr, targetGameNo)));
  console.log(format('%s %s', dateStr, gameNo))

  for (const json of jsonArray) {
    const { inning, no } = json;
    const isFinished = await isFinishedGameById(gameInfoId);

    const savedSummaryPoint = await getRepository(SummaryPoint).findOne({ gameInfoId, inning, no });
    await doSaveRecord(savedSummaryPoint ?? new SummaryPoint(), gameInfoId, json);
  }
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

    await saveGame();
  } catch (err) {
    console.log(err);
  }
})();
