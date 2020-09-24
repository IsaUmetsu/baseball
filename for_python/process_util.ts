import * as moment from "moment";
import { format } from 'util';

import { BatStats, PitchStats, ScoreBoard, TotalPitchStats } from './type/jsonType';
import { getJson, checkDateDir, checkGameJson } from './fs_util';
import { TeamPitchStats, TeamBatStats, TotalBatStats } from './type/jsonType.d';
import { teamArray, posArgDic } from './constant';
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
    const pTeam = teamArray[team];

    /**
     * 
     */
    const doSaveStatsPitcher = async (statsPitcher: StatsPitcher, pitchStats: PitchStats, order: number) => {
      const { name, result, era, ip, np, bf, ha, hra, so, bb, hbp, balk, ra, er } = pitchStats;

      statsPitcher.gameInfoId = gameInfoId;
      statsPitcher.pTeam = pTeam;
      statsPitcher.name = name;
      statsPitcher.order = order;
      statsPitcher.result = result;
      statsPitcher.era = era;
      statsPitcher.ip = ip;
      statsPitcher.outs = calcOuts(ip);
      statsPitcher.np = Number(np);
      statsPitcher.bf = Number(bf);
      statsPitcher.ha = Number(ha);
      statsPitcher.hra = Number(hra);
      statsPitcher.so = Number(so);
      statsPitcher.bb = Number(bb);
      statsPitcher.hbp = Number(hbp);
      statsPitcher.balk = Number(balk);
      statsPitcher.ra = Number(ra);
      statsPitcher.er = Number(er);

      await statsPitcher.save();
    }

    for (let idx in stats) {
      const order = Number(idx) + 1;
      let savedRecord = await getRepository(StatsPitcher).findOne({ gameInfoId, pTeam, order });

      if (! savedRecord) {
        await doSaveStatsPitcher(new StatsPitcher(), stats[idx], order);
      } else {
        await doSaveStatsPitcher(savedRecord, stats[idx], order);
      }
    }
  }

  const { away, home, isFinished }: TotalPitchStats = JSON.parse(getJson(format(pitchJsonPath, dateStr, targetGameNo)));

  await doImportPitch(away);
  await doImportPitch(home);

  console.log(format('----- [pitch] finished: date: [%s], gameNo: [%s] %s-----', dateStr, targetGameNo, isFinished ? '' : 'but not complete because not complete game '));
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

    /**
     * 
     */
    const doSaveStatsBatter = async (statsBatter: StatsBatter, batStats: BatStats) => {
      const {
        position, name, ave, ab, run, hit, rbi, so, bb, hbp, sh, sb, e, hr,
        ing1, ing2, ing3, ing4, ing5, ing6, ing7, ing8, ing9, ing10
      } = batStats;

      statsBatter.gameInfoId = gameInfoId;
      statsBatter.bTeam = bTeam;
      statsBatter.name = name;
      statsBatter.order = calcOrder(position, currentOrder);
      statsBatter.position = position;        
      statsBatter.ave = ave;
      statsBatter.ab = Number(ab);
      statsBatter.run = Number(run);
      statsBatter.hit = Number(hit);
      statsBatter.rbi = Number(rbi);
      statsBatter.so = Number(so);
      statsBatter.bb = Number(bb);
      statsBatter.hbp = Number(hbp);
      statsBatter.sh = Number(sh);
      statsBatter.sb = Number(sb);
      statsBatter.err = Number(e);
      statsBatter.hr = Number(hr);

      statsBatter.ing1 = ing1;
      statsBatter.ing2 = ing2;
      statsBatter.ing3 = ing3;
      statsBatter.ing4 = ing4;
      statsBatter.ing5 = ing5;
      statsBatter.ing6 = ing6;
      statsBatter.ing7 = ing7;
      statsBatter.ing8 = ing8;
      statsBatter.ing9 = ing9;
      statsBatter.ing10 = ing10 ? ing10 : '';

      statsBatter.isSm = Number(isStartingMember(position));
      statsBatter.isPh = Number(position.indexOf('打') > -1);
      statsBatter.isPr = Number(position.indexOf('走') > -1);
      statsBatter.isSf = Number(!isStartingMember(position) && Object.values(posArgDic).indexOf(position.split('')[0]) > -1);

      await statsBatter.save();
    }

    /**
     * 
     */
    const doSaveScoreBoard = async (statsScoreBoard: StatsScoreboard, scoreBoard: ScoreBoard) => {
      const { total, ing1, ing2, ing3, ing4, ing5, ing6, ing7, ing8, ing9, ing10 } = scoreBoard;

      statsScoreBoard.gameInfoId = gameInfoId;
      statsScoreBoard.bTeam = bTeam;
      statsScoreBoard.ing1 = ing1;
      statsScoreBoard.ing2 = ing2;
      statsScoreBoard.ing3 = ing3;
      statsScoreBoard.ing4 = ing4;
      statsScoreBoard.ing5 = ing5;
      statsScoreBoard.ing6 = ing6;
      statsScoreBoard.ing7 = ing7;
      statsScoreBoard.ing8 = ing8;
      statsScoreBoard.ing9 = ing9;
      statsScoreBoard.ing10 = ing10 ? ing10 : '';
      statsScoreBoard.total = total;

      await statsScoreBoard.save();
    }

    for (let idx in stats) {
      const batStats = stats[idx];
      let savedBatRecord = await getRepository(StatsBatter).findOne({ gameInfoId, bTeam, name: batStats.name });

      if (! savedBatRecord) {
        await doSaveStatsBatter(new StatsBatter(), batStats);
      } else {
        await doSaveStatsBatter(savedBatRecord, batStats);
      }
    }

    let savedScoreRecord = await getRepository(StatsScoreboard).findOne({ gameInfoId, bTeam });
    if (! savedScoreRecord) {
      await doSaveScoreBoard(new StatsScoreboard(), scoreBoard);
    } else {
      await doSaveScoreBoard(savedScoreRecord, scoreBoard);
    }
  }

  const { away, home, isFinished }: TotalBatStats = JSON.parse(getJson(format(batJsonPath, dateStr, targetGameNo)));

  await doImportBat(away);
  await doImportBat(home);
  console.log(format('----- [bat] finished: date: [%s], gameNo: [%s] %s-----', dateStr, targetGameNo, isFinished ? '' : 'but not complete because not complete game '));
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
