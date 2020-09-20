import * as moment from "moment";
import { format } from 'util';

import { TotalPitchStats } from './type/jsonType';
import { getJson, checkDateDir, checkGameJson } from './fs_util';
import { checkArgDaySeasonEndSpecify } from "./disp_util";
import { TeamPitchStats } from './type/jsonType.d';
import { teamArray } from './constant';
import { createConnection, getRepository } from "typeorm";
import { GameInfo, StatsPitcher } from "./entities";

const startGameNo = 1;
const endGameNo = 6;

const { D, SE, S } = process.env;
let { targetDay, seasonEndArg, specifyArg } = checkArgDaySeasonEndSpecify(D, SE, S);

const day = moment(format("2020%s", targetDay), "YYYYMMDD");
const seasonStart = moment(format("2020%s", targetDay), "YYYYMMDD");
const seasonEnd = moment(format("2020%s", seasonEndArg), "YYYYMMDD");

const datePath = "/Users/IsamuUmetsu/dev/py_baseball/pitcherStats";
const jsonPath = "/Users/IsamuUmetsu/dev/py_baseball/pitcherStats/%s/%s.json";

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

  const calcOuts = (ip: string) => {
    const [ intPart, decimalPart ] = ip.split('.');
    return Number(intPart) * 3 + (decimalPart ? Number(decimalPart) : 0);
  }

  const doImport = (teamInfo: TeamPitchStats) => {
    const { team, stats } = teamInfo;

    stats.forEach(async (pitchStats, idx) => {
      const order = idx + 1;
      let savedRecord = await getRepository(StatsPitcher).findOne({ gameInfoId, pTeam: teamArray[team], order });

      if (! savedRecord) {
        const newRecord = new StatsPitcher();
        const { name, result, era, ip, np, bf, ha, hra, so, bb, hbp, balk, ra, er } = pitchStats;

        newRecord.gameInfoId = gameInfoId;
        newRecord.pTeam = teamArray[team];
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

  const { away, home }: TotalPitchStats = JSON.parse(getJson(format(jsonPath, dateStr, targetGameNo)));
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
