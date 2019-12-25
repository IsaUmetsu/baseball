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
  .baseBothBatTeam.alias("s", "situation")
  .default({ situation: 1 })
  .alias("l", "limit")
  .default({ limit: 50 })
  .count("devide")
  .alias("d", "devide").argv;

const {
  isValid,
  executeRoundSmallNum,
  createHeaderNoRegulation
} = require("./util/util");
const { executeWithRound, executeWithRoundDevide } = require("./average/b-ave");
const { homerunTypeRank } = require("../query");
const { SITUATION, SITUATION_COL_NAME } = require("../constants");

const tweet = argv.tweet > 0;
const isKindTeam = argv.kindTeam > 0;
const isDevide = argv.devide > 0;
const homerunTypeId = argv.situation;

// validate args
if (!isValid(argv.situation, Object.keys(SITUATION), "situation"))
  process.exit();

/**
 *
 * @param {array} results
 * @param {number} idx
 * @param {boolean} round2ndDecimal
 * @param {boolean} round3rdDecimal
 * @return {array}
 */
const createRowAll = (results, idx, round2ndDecimal, round3rdDecimal) => {
  let { rounded, flag2, flag3 } = executeRoundSmallNum(
    results,
    idx,
    round2ndDecimal,
    round3rdDecimal,
    { cntCol: "hr", allCol: "total", targetCol: "pct" }
  );
  const { name, team, hr, total, rank } = results[idx];
  const namePart = `${isKindTeam ? `${team}` : `${name}(${team})`}`;
  let row = `${rank}位 ${namePart} (${hr}本/全${total}本) ${rounded}\n`;
  return [row, flag2, flag3];
};

/**
 *
 * @param {array} results
 * @param {number} idx
 * @param {boolean} round2ndDecimal
 * @param {boolean} round3rdDecimal
 * @return {array}
 */
const createRowDevide = (results, idx, round2ndDecimal, round3rdDecimal) => {
  const { name, team, hr, total, rank } = results[idx];
  let { rounded, flag2, flag3 } = executeRoundSmallNum(
    results,
    idx,
    round2ndDecimal,
    round3rdDecimal,
    { cntCol: "hr", allCol: "total", targetCol: "pct" }
  );
  const namePart = `${isKindTeam ? `${team}` : `${name}(${team})`}`;
  let row = `${rank}位 ${namePart} (${hr}本/全${total}本) ${rounded}\n`;
  return [row, hr, rank, flag2, flag3];
};

// 分割表示表
const createHeaderDevide = (rank, cnt, results) => {
  let sameRankCnt = results.filter(r => r.rank == rank).length;
  return `2019年 ${
    SITUATION[homerunTypeId]
  }HRランキング\n第${rank}位 ${cnt}本 ${
    sameRankCnt > 1 ? `(${sameRankCnt}名)` : ``
  }\n\n`;
};
// 一括表示用
const createHeaderAll = createHeaderNoRegulation(
  isKindTeam,
  `${SITUATION[homerunTypeId]}`,
  "HRランキング",
  "((本/全本塁打数) 当該本塁打率)"
);

/**
 * Execute 以下の項目については分割表示or全部表示で分ける
 *   - executeRound関数
 *   - createHeader関数
 *   - createRow関数
 */
(async () => {
  await (isDevide ? executeWithRoundDevide : executeWithRound)(
    homerunTypeRank(
      SITUATION_COL_NAME[homerunTypeId],
      isDevide,
      isKindTeam,
      argv.limit
    ),
    tweet,
    isDevide ? createHeaderDevide : createHeaderAll,
    isDevide ? createRowDevide : createRowAll
  )
    .then(r => r)
    .catch(e => {
      console.log(e);
    });
})();
