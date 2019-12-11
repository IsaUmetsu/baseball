"use strict";

/**
 * Twitter 文字数制限を満たす範囲で順位を作成
 *
 * 基本的に書くツイートに以下の内容を持つ
 *   header: 順位、本数、同率順位人数
 *   content: 選手名・球団 対象本塁打数/全本塁打数 対象本塁打割合
 *   footer: ハッシュタグ (暫定で #npb)))
 *
 * 同率順位について複数ツイートにまたがる場合は header は省略
 */

const argv = require("yargs")
  .count("tweet")
  .alias("t", "tweet")
  .alias("r", "result")
  .default({ result: 1 })
  .alias("i", "inning").argv;

const { resultPerInningTeam } = require("../query");
const { RESULT_PER_TYPE, RESULT_PER_TYPE_NAME, INNINGS_COL, INNINGS_SET_NAME } = require("../constants");
const { executeRoundSmallNum, putArgvInning, isValid } = require("./util");
const { executeWithRound } = require("./average/b-ave");

const inningArgv = argv.inning;
const inningArray = String(inningArgv).split(",");

const [firstArg, secondArg, willFin] = putArgvInning(
  inningArgv,
  inningArray,
  INNINGS_COL
);
if (willFin) process.exit();

const inningName =
  Object.keys(INNINGS_SET_NAME).indexOf(inningArgv) > -1
    ? INNINGS_SET_NAME[inningArgv]
    : inningArray.length > 1
    ? `${firstArg}~${secondArg}回`
    : `${firstArg}回`;

if (!isValid(argv.result, Object.keys(RESULT_PER_TYPE), "result")) process.exit();

const tweet = argv.tweet > 0;
const rst = argv.result;

// converter
const n = n => Number(n);
// select target cols
const targetInings = Object.keys(INNINGS_COL).filter(key =>
  secondArg
    ? n(firstArg) <= n(key) && n(key) <= n(secondArg)
    : n(firstArg) == n(key)
);

const createTargetCols = (targetInings, col) => targetInings.map(inningNum => `h.${col}_${INNINGS_COL[inningNum]}`).join(" + ")

const selectCols = {
  hr: createTargetCols(targetInings, "hr"),
  hit: createTargetCols(targetInings, "hit"),
  rbi: createTargetCols(targetInings, "rbi"),
  bat: createTargetCols(targetInings, "bat")
}

/**
 * ヘッダ作成 (rank, number of homerun, tie)
 */
const header = `2019年 チーム別${inningName}${RESULT_PER_TYPE_NAME[rst]}ランキング\n※同数の場合は打率が高い順に順位付け\n\n`;

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
  const { team, hit, hr, rbi, bat, rank } = results[idx];
  let row = `${rank}位 ${team} ${rounded}(${bat}-${hit}) ${hr}本 ${rbi}打点\n`;
  return [row, flag2, flag3];
};

/**
 * Execute
 */
(async () => {
  await executeWithRound(
    resultPerInningTeam(selectCols, RESULT_PER_TYPE[rst]),
    tweet,
    header,
    createRow
  )
    .then(r => r)
    .catch(e => {
      console.log(e);
    });
})();
