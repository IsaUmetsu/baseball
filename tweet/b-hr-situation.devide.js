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

const { isValid, executeRoundAverageHR } = require("./util");
const { executeWithRoundDevide } = require("./average/b-ave");
const { homerunTypeRankBatter } = require("../query");
const { SITUATION, SITUATION_COL_NAME } = require("../constants");

const tweet = argv.tweet > 0;
const homerunTypeId = argv.situation;

// validate args
if (!isValid(argv.situation, Object.keys(SITUATION), "situation")) process.exit();

/**
 *
 * @param {array} results
 * @param {number} idx
 * @param {boolean} round2ndDecimal
 * @param {boolean} round3rdDecimal
 * @return {array}
 */
const createRow = (results, idx, round2ndDecimal, round3rdDecimal) => {
  const { name, team, hr, total, rank } = results[idx];
  let { rounded, flag2, flag3 } = executeRoundAverageHR(
    results,
    idx,
    round2ndDecimal,
    round3rdDecimal
  );
  let average = String(rounded).slice(0, 1) == "1" ? "1.000" : String(rounded).slice(1);
  let row = `${rank}位 ${name}(${team}) (${hr}本/全${total}本) ${average}\n`;
  return [row, hr, rank, flag2, flag3];
};

/**
 * ヘッダ作成 (rank, number of homerun, tie)
 * @param {number} rank
 * @param {number} cnt
 * @param {arrat} results
 * @return {string}
 */
const createHeader = (rank, cnt, results) => {
  let sameRankCnt = results.filter(r => r.rank == rank).length;
  return `2019年 ${SITUATION[homerunTypeId]}HRランキング\n第${rank}位 ${cnt}本 ${sameRankCnt > 1 ? `(${sameRankCnt}名)` : ``}\n\n`;
};

/**
 * Execute
 */
(async () => {
  await executeWithRoundDevide(
    homerunTypeRankBatter(SITUATION_COL_NAME[homerunTypeId], true),
    tweet,
    createHeader,
    createRow
  )
    .then(r => r)
    .catch(e => {
      throw e;
    });
})();
