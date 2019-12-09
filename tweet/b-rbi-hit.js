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

const argv = require("./average/yargs").batterRbi.argv;

const { isValidSituationHitRbi, executeRoundSmallNum } = require("./util");
const { executeWithRound } = require("./average/b-ave");
const { hitRbiSituation } = require("../query");
const { SITUATION, SITUATION_COL_NAME } = require("../constants")

const tweet = argv.tweet > 0;
const situation = argv.situation;

// validate args
if (!isValidSituationHitRbi(argv.situation, Object.keys(SITUATION))) process.exit();

/**
 * ヘッダ作成 (rank, number of homerun, tie)
 */
const header = `2019年 ${situation ? SITUATION[situation] : '累計'}適時打数ランキング\n(本/適時打状況打数 打点 率)\n\n`;

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
    { cntCol: "hit", allCol: "bat", targetCol: "percent" }
  );
  const { name, team, hit, bat, runs, rank } = results[idx];
  let row = `${rank}位 ${name}(${team}) (${hit}本/${bat}打数 ${runs}打点) ${rounded}\n`;
  return [row, flag2, flag3];
};

/**
 * Execute
 */
(async () => {
  await executeWithRound(
    hitRbiSituation(SITUATION_COL_NAME[situation], argv.limit),
    tweet,
    header,
    createRow
  )
    .then(r => r)
    .catch(e => {
      console.log(e);
    });
})();
