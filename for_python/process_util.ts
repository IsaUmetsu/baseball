import * as moment from "moment";
import { format } from 'util';

import { TotalPitchStats } from './type/jsonType';
import { getJson, checkDateDir, checkGameJson } from './fs_util';
import { TeamPitchStats, TeamBatStats, TotalBatStats } from './type/jsonType.d';
import { teamArray, posArr } from './constant';
import { getRepository } from "typeorm";
import { GameInfo, StatsPitcher, StatsScoreboard, StatsBatter } from "./entities";

const startGameNo = 1;
const endGameNo = 6;

const pitchDatePath = "/Users/IsamuUmetsu/dev/py_baseball/pitcherStats";
const pitchJsonPath = "/Users/IsamuUmetsu/dev/py_baseball/pitcherStats/%s/%s.json";

// -------------------- Pitcher Stats --------------------

/**
 * 
 */
const doCheckPitch = async (gameNo, dateStr) => {
  // define game no
  const targetGameNo = format("0%d", gameNo);
  // 日付・ゲーム番号ディレクトリがない場合スキップ
  const existGameJson = await checkGameJson(pitchDatePath, dateStr, targetGameNo);
  if (! existGameJson) return;

  const savedGameInfo = await getRepository(GameInfo).findOne({ date: dateStr, gameNo });
  if (! savedGameInfo) return;

  const { id: gameInfoId } = savedGameInfo;

  /**
   * 
   */
  const calcOuts = (ip: string) => {
    const [ intPart, decimalPart ] = ip.split('.');
    return Number(intPart) * 3 + (decimalPart ? Number(decimalPart) : 0);
  }

  /**
   * 
   */
  const doImportPitch = async (teamInfo: TeamPitchStats) => {
    const { team, stats } = teamInfo;

    stats.forEach(async (pitchStats, idx) => {
      const order = idx + 1;
      const pTeam = teamArray[team];
      let savedRecord = await getRepository(StatsPitcher).findOne({ gameInfoId, pTeam, order });

      if (! savedRecord) {
        const newRecord = new StatsPitcher();
        const { name, result, era, ip, np, bf, ha, hra, so, bb, hbp, balk, ra, er } = pitchStats;

        newRecord.gameInfoId = gameInfoId;
        newRecord.pTeam = pTeam;
        newRecord.name = name;
        newRecord.order = order;
        newRecord.result = result;
        newRecord.era = era;
        newRecord.ip = ip;
        newRecord.outs = calcOuts(ip);
        newRecord.np = Number(np);
        newRecord.bf = Number(bf);
        newRecord.ha = Number(ha);
        newRecord.hra = Number(hra);
        newRecord.so = Number(so);
        newRecord.bb = Number(bb);
        newRecord.hbp = Number(hbp);
        newRecord.balk = Number(balk);
        newRecord.ra = Number(ra);
        newRecord.er = Number(er);

        await newRecord.save();
      }
    })
  }

  const { away, home, isFinished }: TotalPitchStats = JSON.parse(getJson(format(pitchJsonPath, dateStr, targetGameNo)));

  if (isFinished === undefined || isFinished) {
    await doImportPitch(away);
    await doImportPitch(home);
    console.log(format('----- [pitch] finished: date: [%s], gameNo: [%s] -----', dateStr, targetGameNo));
  } else {
    console.log(format('----- [pitch] finished: date: [%s], gameNo: [%s] but not imported [because not complete game] -----', dateStr, targetGameNo));
  }
}

/**
 * 
 */
export const savePitchData = async (
  targetDay: string,
  seasonStart: moment.Moment,
  seasonEnd: moment.Moment,
  specifyArg: number
) => {
  const day = moment(format("2020%s", targetDay), "YYYYMMDD");
  while (day.isSameOrAfter(seasonStart) && day.isSameOrBefore(seasonEnd)) {
    // define game date
    const dateStr = day.format("YYYYMMDD");
    // 日付ディレクトリがない場合スキップ
    const existDateDir = await checkDateDir(pitchDatePath, dateStr);
    if (! existDateDir) { day.add(1, "days"); continue; }


    if (specifyArg) {
      await doCheckPitch(specifyArg, dateStr);
    } else {
      for (let gameNo = startGameNo; gameNo <= endGameNo; gameNo++) {
        await doCheckPitch(gameNo, dateStr);
      }
    }

    day.add(1, "days");
  }
  console.log('----- done!! -----');
};
// -------------------- /Pitcher Stats --------------------

// -------------------- Batter Stats And ScoreBoard --------------------
const batDatePath = "/Users/IsamuUmetsu/dev/py_baseball/batterStats";
const batJsonPath = "/Users/IsamuUmetsu/dev/py_baseball/batterStats/%s/%s.json";

/**
 * 
 */
const isStartingMember = (position: string) => {
  return Boolean(position.match(/\(*\)/));
}

/**
 * 
 */
const doCheckBat = async (gameNo, dateStr) => {
  // define game no
  const targetGameNo = format("0%d", gameNo);
  // 日付・ゲーム番号ディレクトリがない場合スキップ
  const existGameJson = await checkGameJson(batDatePath, dateStr, targetGameNo);
  if (! existGameJson) return;

  const savedGameInfo = await getRepository(GameInfo).findOne({ date: dateStr, gameNo });
  if (! savedGameInfo) return;

  const { id: gameInfoId } = savedGameInfo;

  /**
   * 
   */
  const doImportBat = async (teamInfo: TeamBatStats) => {
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

  const { away, home, isFinished }: TotalBatStats = JSON.parse(getJson(format(batJsonPath, dateStr, targetGameNo)));

  if (isFinished === undefined || isFinished) {
    await doImportBat(away);
    await doImportBat(home);
    console.log(format('----- [bat] finished: date: [%s], gameNo: [%s] -----', dateStr, targetGameNo));
  } else {
    console.log(format('----- [bat] finished: date: [%s], gameNo: [%s] but not imported [because not complete game] -----', dateStr, targetGameNo));
  }
}

/**
 * 
 */
export const saveBatAndScoreData = async (
  targetDay: string,
  seasonStart: moment.Moment,
  seasonEnd: moment.Moment,
  specifyArg: number
) => {
  const day = moment(format("2020%s", targetDay), "YYYYMMDD");
  while (day.isSameOrAfter(seasonStart) && day.isSameOrBefore(seasonEnd)) {
    // define game date
    const dateStr = day.format("YYYYMMDD");
    // 日付ディレクトリがない場合スキップ
    const existDateDir = await checkDateDir(batDatePath, dateStr);
    if (! existDateDir) { day.add(1, "days"); continue; }

    if (specifyArg) {
      await doCheckBat(Number(specifyArg), dateStr);
    } else {
      for (let gameNo = startGameNo; gameNo <= endGameNo; gameNo++) {
        await doCheckBat(gameNo, dateStr);
      }
    }

    day.add(1, "days");
  }
  console.log('----- done!! -----');
};
// -------------------- /Batter Stats And ScoreBoard --------------------
