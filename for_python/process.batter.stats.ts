import * as moment from "moment";
import { format } from 'util';

import { TeamBatStats, TotalBatStats } from './type/jsonType';
import { getJson, checkDateDir, checkGameJson } from './fs_util';
import { checkArgDaySeasonEndSpecify } from "./disp_util";
import { posArr, teamArray } from './constant';
import { createConnection, getRepository } from "typeorm";
import { GameInfo, StatsScoreboard } from "./entities";
import { StatsBatter } from './entities/StatsBatter';

const startGameNo = 1;
const endGameNo = 6;

const { D, SE, S } = process.env;
let { targetDay, seasonEndArg, specifyArg } = checkArgDaySeasonEndSpecify(D, SE, S);

const day = moment(format("2020%s", targetDay), "YYYYMMDD");
const seasonStart = moment(format("2020%s", targetDay), "YYYYMMDD");
const seasonEnd = moment(format("2020%s", seasonEndArg), "YYYYMMDD");

const datePath = "/Users/IsamuUmetsu/dev/py_baseball/batterStats";
const jsonPath = "/Users/IsamuUmetsu/dev/py_baseball/batterStats/%s/%s.json";

/**
 * 
 */
const isStartingMember = (position: string) => {
  return Boolean(position.match(/\(*\)/));
}

/**
 * 
 */
const doCheck = async (gameNo, dateStr) => {
  // define game no
  const targetGameNo = format("0%d", gameNo);
  // 日付・ゲーム番号ディレクトリがない場合スキップ
  const existGameJson = await checkGameJson(datePath, dateStr, targetGameNo);
  if (! existGameJson) return;

  const savedGameInfo = await getRepository(GameInfo).findOne({ date: dateStr, gameNo });
  if (! savedGameInfo) return;

  const { id: gameInfoId } = savedGameInfo;

  /**
   * 
   */
  const doImport = async (teamInfo: TeamBatStats) => {
    const { team, stats, scoreBoard } = teamInfo;
    const bTeam = teamArray[team];
    let currentOrder = 0;

    /**
     * 
     */
    const calcOrder = (position: string, order: number) => {
      currentOrder = isStartingMember(position) ? order + 1 : order;
      return currentOrder;
    }

    for (let idx in stats) {
      const batStats = stats[idx];
      let savedBatRecord = await getRepository(StatsBatter).findOne({ gameInfoId, bTeam, name: batStats.name });

      if (! savedBatRecord) {
        const newRecord = new StatsBatter();

        const {
          position, name, ave, ab, run, hit, rbi, so, bb, hbp, sh, sb, e, hr,
          ing1, ing2, ing3, ing4, ing5, ing6, ing7, ing8, ing9, ing10
        } = batStats;

        newRecord.gameInfoId = gameInfoId;
        newRecord.bTeam = bTeam;
        newRecord.name = name;
        newRecord.order = calcOrder(position, currentOrder);
        newRecord.position = position;        
        newRecord.ave = ave;
        newRecord.ab = Number(ab);
        newRecord.run = Number(run);
        newRecord.hit = Number(hit);
        newRecord.rbi = Number(rbi);
        newRecord.so = Number(so);
        newRecord.bb = Number(bb);
        newRecord.hbp = Number(hbp);
        newRecord.sh = Number(sh);
        newRecord.sb = Number(sb);
        newRecord.err = Number(e);
        newRecord.hr = Number(hr);

        newRecord.ing1 = ing1;
        newRecord.ing2 = ing2;
        newRecord.ing3 = ing3;
        newRecord.ing4 = ing4;
        newRecord.ing5 = ing5;
        newRecord.ing6 = ing6;
        newRecord.ing7 = ing7;
        newRecord.ing8 = ing8;
        newRecord.ing9 = ing9;
        newRecord.ing10 = ing10 ? ing10 : '';

        newRecord.isSm = Number(isStartingMember(position));
        newRecord.isPh = Number(position.indexOf('打') > -1);
        newRecord.isPr = Number(position.indexOf('走') > -1);
        newRecord.isSf = Number(!isStartingMember(position) && posArr.indexOf(position.split('')[0]) > -1);

        await newRecord.save();
      }
    }

    let savedScoreRecord = await getRepository(StatsScoreboard).findOne({ gameInfoId, bTeam });
    if (! savedScoreRecord) {
      const { total, ing1, ing2, ing3, ing4, ing5, ing6, ing7, ing8, ing9, ing10 } = scoreBoard;
      const nr = new StatsScoreboard();

      nr.gameInfoId = gameInfoId;
      nr.bTeam = bTeam;
      nr.ing1 = ing1;
      nr.ing2 = ing2;
      nr.ing3 = ing3;
      nr.ing4 = ing4;
      nr.ing5 = ing5;
      nr.ing6 = ing6;
      nr.ing7 = ing7;
      nr.ing8 = ing8;
      nr.ing9 = ing9;
      nr.ing10 = ing10 ? ing10 : '';
      nr.total = total;

      await nr.save();
    }
  }

  const { away, home }: TotalBatStats = JSON.parse(getJson(format(jsonPath, dateStr, targetGameNo)));
  await doImport(away);
  await doImport(home);
  
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
    await createConnection('default');
    await getDataAndSave();
  } catch (err) {
    console.log(err);
  }
})();
