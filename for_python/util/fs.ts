import * as fs from "fs";
import * as moment from "moment";
import { format } from "util";

/**
 * 
 */
export const checkGameDir = async(
  basePath: string, date_string: string, game_no: string
): Promise<boolean> => {
  const existDateDir = await checkDateDir(basePath, date_string);
  const path_file = `${basePath}/${date_string}/${game_no}`;
  
  return existDateDir && fs.existsSync(path_file);
}

/**
 * 
 */
export const checkGameJson = async(
  basePath: string, date_string: string, game_no: string
): Promise<boolean> => {
  const path_file = `${basePath}/${date_string}/${game_no}.json`;
  
  return fs.existsSync(path_file);
}

/**
 * 
 */
export const checkDateDir = async(
  basePath: string, date_string: string
): Promise<boolean> => {
  const path_date = `${basePath}/${date_string}`;
  return fs.existsSync(path_date);
}

/**
 * 
 */
export const getJson = (filePath: string): string => {
    return fs.readFileSync(filePath, 'utf8')
}

/**
 * 
 */
export const countFiles = async (dir: string): Promise<number> => {
    let fileCnt = await fs.promises.readdir(dir);
    // .DS_Store を除外
    fileCnt = fileCnt.filter(file => file != '.DS_Store')

    return fileCnt.length;
}

/**
 * 
 */
export const getPitcher = async (pitcherPath: string, jsonPath: string) => {
  const targetPitchers = [];
  const todayStr = moment().format('YYYYMMDD');
  const totalGameCnt = await countFiles(format(pitcherPath, todayStr));

  for (let gameCnt = 1; gameCnt <= totalGameCnt; gameCnt++) {
    const fmJsonPath = format(jsonPath, todayStr, format("0%d", gameCnt));
    const data = JSON.parse(getJson(fmJsonPath));
    const { start, away, home } = data;

    const [ hours, minute ] = start.split(':');
    // 現在日時と試合開始時刻を比較
    const isStartGame = moment().isAfter(moment({ hours, minute }));

    targetPitchers.push({ team: away.team, pitcher: away.pitcher, oppoTeam: home.team, isStartGame });
    targetPitchers.push({ team: home.team, pitcher: home.pitcher, oppoTeam: away.team, isStartGame });
    console.log(format('対戦カード%s (away): %s(%s)', gameCnt, away.pitcher, away.team));
    console.log(format('対戦カード%s (home): %s(%s)', gameCnt, home.pitcher, home.team));
  }

  return targetPitchers;
} 