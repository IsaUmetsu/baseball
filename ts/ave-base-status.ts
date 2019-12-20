/**
 * Twitter 文字数制限を満たす範囲で順位を作成
 *
 * 基本的に書くツイートに以下の内容を持つ
 *   header: タイトル
 *   content: 順位・選手名・球団 打率 打数・安打数
 *   footer: ハッシュタグ
 *
 * 同率順位について複数ツイートにまたがる場合は header は省略
 */

import * as yargs from 'yargs';
const argv = yargs.options({
  tweet: { type: 'count', alias: 't' },
  kindTeam: { type: 'count', alias: 'k' },
  result: { type: 'number', alias: 'r', default: 1 },
  base: { type: 'number', alias: 'b', default: 1 }
}).argv;

import { resultPerAny } from './query';
import { QueryResult, ResultPerAny } from './type';
import { RESULT_PER_TYPE, RESULT_PER_TYPE_NAME, BASE_TYPE, BASE_TYPE_NAME } from './constants';
import { isValid, executeRoundSmallNum, createHeader } from "./util";
import { executeWithRound } from "./execute";

// validated
if (!isValid(argv.base, Object.keys(BASE_TYPE), "base")) process.exit();
if (!isValid(argv.result, Object.keys(RESULT_PER_TYPE), "result")) process.exit();
// set bat
const base: number = argv.base;
const rst: number = argv.result;
const tweet: boolean = argv.tweet > 0;
const isKindTeam: boolean = argv.kindTeam > 0;

/**
 *
 * @param results
 * @param idx
 * @param round2ndDecimal
 * @param round3rdDecimal
 * @return
 */
const createRow = (results: Array<QueryResult>, idx, round2ndDecimal, round3rdDecimal): [string, boolean, boolean] => {
  let [rounded, flag2, flag3] = executeRoundSmallNum(
    results as Array<ResultPerAny>,
    idx,
    round2ndDecimal,
    round3rdDecimal,
    { cntCol: "hit", allCol: "bat", targetCol: "rate" }
  );
  const { name, team, hr, rbi, hit, bat, rank } = results[idx] as ResultPerAny;
  let namePart = `${isKindTeam ? `${team}` : `${name}(${team})`}`;
  let row = `${rank}位 ${namePart} ${rounded} (${bat}-${hit}) ${hr}本 ${rbi}打点\n`;
  return [row, flag2, flag3];
};

/**
 * Execute
 */
(async () => {
  await executeWithRound(
    resultPerAny(
      BASE_TYPE[base],
      RESULT_PER_TYPE[rst],
      "result_per_situation_base",
      isKindTeam
    ),
    tweet,
    createHeader(
      isKindTeam,
      `走者${BASE_TYPE_NAME[base]}`,
      `${RESULT_PER_TYPE_NAME[rst]}ランキング`
    ),
    createRow
  )
    .then(r => r)
    .catch(e => {
      console.log(e);
    });
})();
