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
import yargs from 'yargs';
import { resultPerAny } from './query';
import { Cols } from './type';

const argv = yargs
  .count("tweet")
  .alias("t", "tweet")
  .count("kindTeam")
  .alias("k", "kindTeam").alias("r", "result")
  .default({ result: 1 })
  .alias("b", "base")
  .default({ base: 1 }).argv;

import { RESULT_PER_TYPE, RESULT_PER_TYPE_NAME, BASE_TYPE, BASE_TYPE_NAME } from './constants';

const { isValid, executeRoundSmallNum, createHeader } = require("./util");
const { executeWithRound } = require("./average/b-ave");

const tweet = argv.tweet > 0;
const isKindTeam = argv.kindTeam > 0;

// validated
if (!isValid(argv.base, Object.keys(BASE_TYPE), "base")) process.exit();
if (!isValid(argv.result, Object.keys(RESULT_PER_TYPE), "result"))
  process.exit();
// set bat
const base = argv.base;
const rst = argv.result;

/**
 *
 * @param {array} results
 * @param {number} idx
 * @param {boolean} round2ndDecimal
 * @param {boolean} round3rdDecimal
 * @return {array}
 */
const createRow = (results, idx, round2ndDecimal, round3rdDecimal) => {
  let { rounded, flag2, flag3 } = executeRoundSmallNum(
    results,
    idx,
    round2ndDecimal,
    round3rdDecimal,
    { cntCol: "hit", allCol: "bat", targetCol: "rate" }
  );
  const { name, team, hr, rbi, hit, bat, rank } = results[idx];
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
      isKindTeam,
      ""
    ),
    tweet,
    createHeader(
      isKindTeam,
      `走者${BASE_TYPE_NAME[base]}`,
      `${RESULT_PER_TYPE_NAME[rst]}ランキング`,
      ""
    ),
    createRow
  )
    .then(r => r)
    .catch(e => {
      console.log(e);
    });
})();
