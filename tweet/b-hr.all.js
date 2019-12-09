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

const argv = require("./average/yargs").batterHR.argv;

const { isValidHR, executeRoundSmallNum } = require("./util");
const { executeWithRound } = require("./average/b-ave");
const { homerunTypeRankBatter } = require("../query");
const { SITUATION, SITUATION_COL_NAME } = require("../constants")

const tweet = argv.tweet > 0;
const homerunTypeId = argv.situation;

// validate args
if (!isValidHR(argv.situation, Object.keys(SITUATION))) process.exit();

/**
 * ヘッダ作成 (rank, number of homerun, tie)
 */
const header = `2019年 ${SITUATION[homerunTypeId]}HRランキング\n((本/全本塁打数) 当該本塁打率)\n\n`;

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
    { cntCol: "hr", allCol: "total", targetCol: "pct" }
  );
  const { name, team, hr, total, rank } = results[idx];
  let row = `${rank}位 ${name}(${team}) (${hr}本/全${total}本) ${rounded}\n`;
  return [row, flag2, flag3];
};

/**
 * Execute
 */
(async () => {
  await executeWithRound(
    homerunTypeRankBatter(SITUATION_COL_NAME[homerunTypeId], false),
    tweet,
    header,
    createRow
  )
    .then(r => r)
    .catch(e => {
      console.log(e);
    });
})();
