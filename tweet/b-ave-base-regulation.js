"use strict";

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
const argv = require("yargs")
  .count("tweet")
  .alias("t", "tweet")
  .alias("r", "result")
  .default({ result: 1 })
  .alias("b", "base")
  .default({ base: 1 }).argv;

const { resultPerBaseRegulation } = require("../query");
const { RESULT_PER_TYPE, RESULT_PER_TYPE_NAME } = require("../constants");
const { isValid, executeRoundSmallNum } = require("./util");
const { executeWithRound } = require("./average/b-ave");

const tweet = argv.tweet > 0;

const baseType = {
  1: "000",
  2: "100",
  3: "110",
  4: "101",
  5: "010",
  6: "011",
  7: "001",
  8: "111"
};

const baseTypeName = {
  1: "無し",
  2: "一塁",
  3: "一二塁",
  4: "一三塁",
  5: "二塁",
  6: "二三塁",
  7: "三塁",
  8: "満塁"
};

// validated
if (!isValid(argv.base, Object.keys(baseType), "base")) process.exit();
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
  let row = `${rank}位 ${name}(${team}) ${rounded} (${bat}-${hit}) ${hr}本 ${rbi}打点 \n`;
  return [row, flag2, flag3];
};

/**
 * ヘッダ作成 (rank, number of homerun, tie)
 */
const header = `2019年 走者${baseTypeName[base]} ${RESULT_PER_TYPE_NAME[rst]}ランキング\n※規定打席到達打者のみ\n\n`;

/**
 * Execute
 */
(async () => {
  await executeWithRound(
    resultPerBaseRegulation(baseType[base], RESULT_PER_TYPE[rst]),
    tweet,
    header,
    createRow
  )
    .then(r => r)
    .catch(e => {
      console.log(e);
    });
})();