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
const argv = require("./average/yargs")
  .baseBothBatTeam.alias("r", "result")
  .default({ result: 1 })
  .alias("o", "opponent")
  .default({ opponent: "G" }).argv;

const { resultPerAny } = require("../query");
const {
  RESULT_PER_TYPE,
  RESULT_PER_TYPE_NAME,
  TEAM_INITIAL,
  TEAM_INITIAL_NAME: teamName,
  HASHTAGS
} = require("../constants");
const { isValid, executeRoundSmallNum, createHeader } = require("./util/util");
const { executeWithRoundChangeHashTags } = require("./average/b-ave");

const tweet = argv.tweet > 0;
const isKindTeam = argv.kindTeam > 0;

// validated
if (!isValid(argv.opponent, TEAM_INITIAL, "opponent")) process.exit();
if (!isValid(argv.result, Object.keys(RESULT_PER_TYPE), "result"))
  process.exit();
// set bat
const oppo = argv.opponent;
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
  let namePart = `${isKindTeam ? `${team}` : `${name}(${team})`}`;
  let row = `${rank}位 ${namePart} ${rounded} (${bat}-${hit}) ${hr}本 ${rbi}打点\n`;
  return [row, flag2, flag3];
};

/**
 * Execute
 */
(async () => {
  await executeWithRoundChangeHashTags(
    resultPerAny(
      oppo,
      RESULT_PER_TYPE[rst],
      "result_per_oppenent_base",
      isKindTeam,
      `WHERE bat_${oppo} >= ${isKindTeam ? 200 : 20}`
    ),
    tweet,
    createHeader(
      isKindTeam,
      `${teamName[oppo]}キラー`,
      `${RESULT_PER_TYPE_NAME[rst]}部門`,
      ""
    ),
    createRow,
    HASHTAGS[oppo]
  )
    .then(r => r)
    .catch(e => {
      console.log(e);
    });
})();
