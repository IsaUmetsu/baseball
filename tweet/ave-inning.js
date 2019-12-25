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
  .baseBothBatTeam.alias("r", "result")
  .default({ result: 1 })
  .alias("i", "inning").argv;

const { resultPerAnyColSum } = require("../query");
const { RESULT_PER_TYPE, RESULT_PER_TYPE_NAME } = require("../constants");
const {
  executeRoundSmallNum,
  isValid,
  createHeader,
  createInningInfo,
  createTargetCols
} = require("./util/util");
const { executeWithRound } = require("./average/b-ave");

const [inningName, willFin, targetInings] = createInningInfo(argv.inning);
if (willFin) process.exit();

if (!isValid(argv.result, Object.keys(RESULT_PER_TYPE), "result"))
  process.exit();

const tweet = argv.tweet > 0;
const isKindTeam = argv.kindTeam > 0;
const rst = argv.result;

const selectCols = {
  hr: createTargetCols(targetInings, "hr"),
  hit: createTargetCols(targetInings, "hit"),
  rbi: createTargetCols(targetInings, "rbi"),
  bat: createTargetCols(targetInings, "bat")
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
    { cntCol: "hit", allCol: "bat", targetCol: "rate" }
  );
  const { name, team, hit, hr, rbi, bat, rank } = results[idx];
  const namePart = `${isKindTeam ? `${team}` : `${name}(${team})`}`;
  let row = `${rank}位 ${namePart} ${rounded}(${bat}-${hit}) ${hr}本 ${rbi}打点\n`;
  return [row, flag2, flag3];
};

/**
 * Execute
 */
(async () => {
  await executeWithRound(
    resultPerAnyColSum(selectCols, isKindTeam, RESULT_PER_TYPE[rst], "result_per_inning_base"),
    tweet,
    createHeader(
      isKindTeam,
      inningName,
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
