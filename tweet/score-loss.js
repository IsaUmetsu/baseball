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

const argv = require("./average/yargs")
  .baseSimple.alias("r", "result")
  .default({ result: 1 })
  .alias("i", "inning").argv;

const { scoreLossPerInning } = require("../query");
const { SCORE_TYPE, SCORE_TYPE_NAME } = require("../constants");
const {
  executeRoundSmallNum,
  isValid,
  createHeaderNoRegulation,
  createInningInfo,
  createTargetCols
} = require("./util");
const { executeWithRound } = require("./average/b-ave");

const [inningName, willFin, targetInings] = createInningInfo(argv.inning);
if (willFin) process.exit();

if (!isValid(argv.result, Object.keys(SCORE_TYPE_NAME), "result"))
  process.exit();

const tweet = argv.tweet > 0;
const rst = argv.result;

const selectCols = {
  scr: createTargetCols(targetInings, "scr"),
  ls: createTargetCols(targetInings, "ls"),
  df: createTargetCols(targetInings, "df")
};

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
    { cntCol: SCORE_TYPE[rst], allCol: `total_${SCORE_TYPE[rst]}`, targetCol: "rate" }
  );
  const { team, scr, ls, df, rank } = results[idx];
  let row = `${rank}位 ${team}  ${scr} ${ls} ${df}\n`;
  return [row, flag2, flag3];
};

/**
 * Execute
 */
(async () => {
  await executeWithRound(
    scoreLossPerInning(selectCols, SCORE_TYPE[rst]),
    tweet,
    createHeaderNoRegulation(
      false,
      inningName,
      `${SCORE_TYPE_NAME[rst]}ランキング`,
      "(得点 失点 得失点差)"
    ),
    createRow
  )
    .then(r => r)
    .catch(e => {
      console.log(e);
    });
})();
