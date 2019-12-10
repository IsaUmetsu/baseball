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
  .alias("l", "limit")
  .default({ limit: 50 })
  .alias("i", "inning").argv;

const { homerunTypeRankSituationBatter } = require("../query");
const { INNINGS_COL, INNINGS_SET_NAME } = require("../constants");
const { executeRoundPercent, putArgvInning } = require("./util");
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

const tweet = argv.tweet > 0;

// converter
const n = n => Number(n);
// select target cols
const targetInings = Object.keys(INNINGS_COL).filter(key =>
  secondArg
    ? n(firstArg) <= n(key) && n(key) <= n(secondArg)
    : n(firstArg) == n(key)
);

const selectHrCols = targetInings.map(key => `h.${INNINGS_COL[key]}_hr`).join(" + ");
const selectBatCols = targetInings.map(key => `h.${INNINGS_COL[key]}_bat`).join(" + ");

/**
 * ヘッダ作成 (rank, number of homerun, tie)
 */
const header = `2019年 ${inningName}HRランキング\n(本/${inningName}打数)\n※同数の場合は率が高い順に順位付け\n\n`;

const createRow = (results, idx, round2ndDecimal, round3rdDecimal) => {
  let { rounded, flag2, flag3 } = executeRoundPercent(
    results,
    idx,
    round2ndDecimal,
    round3rdDecimal,
    { cntCol: "hr", allCol: "bat", targetCol: "percent" }
  );
  const { name, team, hr, bat, rank } = results[idx];
  let row = `${rank}位 ${name}(${team}) ${hr}本 (${bat}打数) ${rounded}%\n`;
  return [row, flag2, flag3];
};

/**
 * Execute
 */
(async () => {
  await executeWithRound(
    homerunTypeRankSituationBatter(selectHrCols, selectBatCols, argv.limit),
    tweet,
    header,
    createRow
  )
    .then(r => r)
    .catch(e => {
      console.log(e);
    });
})();
