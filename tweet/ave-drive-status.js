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

const { BASE_TYPE, BASE_TYPE_NAME } = require("../constants");

const argv = require("yargs")
  .count("tweet")
  .alias("t", "tweet")
  .alias("s", "status")
  .default({ status: 2 })
  .count("kindTeam")
  .alias("k", "kindTeam").argv;

const { isValid, executeRoundSmallNum } = require("./util");
const { executeWithRound } = require("./average/b-ave");
const { resultDrivedPerStatus } = require("../query");

const tweet = argv.tweet > 0;
const isKindTeam = argv.kindTeam > 0;
const status = argv.status;

let msg = "",
  valid = true;
// validate args
if (!isValid(argv.status, Object.keys(BASE_TYPE), "status")) valid = false;
if (status == 1) {
  valid = false;
  msg = "please don't input -s=1";
}

if (!valid) {
  console.log(msg);
  process.exit();
}

/**
 * ヘッダ作成 (rank, number of homerun, tie)
 */
const header = `2019年 走者${BASE_TYPE_NAME[status]} ${isKindTeam ? `チーム別` : ``}進塁率ランキング\n(打数-進塁成功数)\n(カウント対象:安打,ゴロ,フライ,犠打,犠飛)\n\n`;

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
    { cntCol: "drv", allCol: "bat", targetCol: "ave" }
  );
  const { name, team, bat, drv, rank } = results[idx];
  let row = `${rank}位 ${
    isKindTeam ? `${team}` : `${name}(${team})`
  } ${rounded} (${bat}-${drv}) \n`;
  return [row, flag2, flag3];
};

/**
 * Execute
 */
(async () => {
  await executeWithRound(
    resultDrivedPerStatus(BASE_TYPE[status], isKindTeam),
    tweet,
    header,
    createRow
  )
    .then(r => r)
    .catch(e => {
      console.log(e);
    });
})();
