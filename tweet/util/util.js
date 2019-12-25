"use strict";
/**
 * Nightmareユーティリティクラス
 */
const util = (module.exports = {});

const client = require("./twitter");
const { RATE_TYPE_COL_OPS, INNINGS_SET_NAME } = require("../../constants");

/**
 * 指定桁数四捨五入
 * @param {string | number} target
 * @param {number} decimal
 */
util.round = (target, decimal) =>
  addedZero(customRound(target, decimal), decimal);

/**
 * 指定桁数四捨五入
 * @param {string | number} target
 * @param {number} decimal
 */
const customRound = (target, decimal) =>
  Math.round(Number(target) * Math.pow(10, decimal)) / Math.pow(10, decimal);

/**
 *
 * @param {boolean} tweet
 * @param {object} client twitter client
 * @param {string} status
 * @param {string} in_reply_to_status_id
 * @return {string} tweet_id
 */
util.tweetResult = async (tweet, status, in_reply_to_status_id) => {
  let res = "";
  if (tweet) {
    let { id_str } = await client.post("statuses/update", {
      status,
      in_reply_to_status_id
    });
    res = id_str;
    console.log("--- tweeted ---");
  }
  return res;
};

/**
 *
 * @param {array} results
 * @param {number} idx
 * @param {boolean} round2ndDecimal
 * @param {boolean} round3rdDecimal
 * @return {[string, boolean, boolean]}
 */
util.createRoundedRow = (results, idx, round2ndDecimal, round3rdDecimal) => {
  const { name, team, bat_cnt, target_cnt, rank } = results[idx];

  let { rounded, flag2, flag3 } = exeRoundSmallNum(
    results,
    idx,
    round2ndDecimal,
    round3rdDecimal,
    { cntCol: "target_cnt", allCol: "bat_cnt", targetCol: "average" }
  );
  // create display info
  let row = `${rank}位: ${name}(${team}) ${rounded} (${bat_cnt}-${target_cnt})\n`;

  return [row, flag2, flag3];
};

/**
 * 割合小数点第3位四捨五入
 * @param {array} results
 * @param {string} idx
 * @param {boolean} round2ndDcm
 * @param {boolean} round3rdDcm
 * @param {object} cols
 * @return {object} rounded, round2ndFlag, round3rdFlag
 */
const exeRoundSmallNum = (results, idx, round2ndDcm, round3rdDcm, cols) =>
  doRoundDecimal(results, idx, round2ndDcm, round3rdDcm, 3, cols);

/**
 * 割合小数点第3位四捨五入
 *
 * @param {Save as above}
 * @return {Save as above}
 */
util.executeRoundSmallNum = (results, idx, round2ndDcm, round3rdDcm, cols) =>
  doRoundDecimal(results, idx, round2ndDcm, round3rdDcm, 3, cols);

/**
 * パーセント 四捨五入
 *
 * @param {Save as above}
 * @return {Save as above}
 */
util.executeRoundPercent = (results, idx, round2ndDcm, round3rdDcm, cols) =>
  doRoundDecimal(results, idx, round2ndDcm, round3rdDcm, 1, cols);

/**
 * 小数点四捨五入実行
 *
 * @param {array} results 全結果格納
 * @param {number} idx 四捨五入対象要素index
 * @param {boolean} round2ndDecimal 指定桁の次の桁を四捨五入するか
 * @param {boolean} round3rdDecimal 指定桁の次の次の桁を四捨五入するか
 * @param {number} baseDecimal 四捨五入対象の小数点の桁数
 * @param {object} cols 分子, 分母, 分子を分母で割った値を格納しているカラムの名前
 * @return {object}
 */
const doRoundDecimal = (
  results,
  idx,
  round2ndDecimal,
  round3rdDecimal,
  baseDecimal,
  cols
) => {
  const { cntCol, allCol, targetCol } = cols;
  const {
    [cntCol]: cntVal,
    [allCol]: allVal,
    [targetCol]: targetVal
  } = results[idx];

  idx = Number(idx);
  let nextIdx = idx + 1 < results.length ? idx + 1 : idx,
    rounded = customRound(targetVal, baseDecimal),
    roudedDecimal = baseDecimal;

  // 小数点第4位での四捨五入フラグがONの場合
  if (round2ndDecimal) {
    // 次の打者の値と小数点3位を四捨五入した値が違う場合、フラグをfalseに戻す
    if (rounded != customRound(results[nextIdx][targetCol], baseDecimal)) {
      round2ndDecimal = false;
    }

    if (round3rdDecimal) {
      rounded = customRound(targetVal, baseDecimal + 2);
      roudedDecimal = baseDecimal + 2;
      round3rdDecimal = false;
    } else {
      // 小数点第4位での四捨五入
      rounded = customRound(targetVal, baseDecimal + 1);
      roudedDecimal = baseDecimal + 1;
      round3rdDecimal = false;

      if (
        rounded == customRound(results[nextIdx][targetCol], baseDecimal + 1) &&
        allVal != results[nextIdx][allCol]
      ) {
        round3rdDecimal = true;
        // 小数点第3位での四捨五入
        rounded = customRound(targetVal, baseDecimal + 2);
        roudedDecimal = baseDecimal + 2;
      }
    }
  } else {
    // 次の打者の値と小数点3位を四捨五入した値が同じ場合
    if (rounded == customRound(results[nextIdx][targetCol], baseDecimal)) {
      // 本数・打数のどちらかが違う and 約分したら同じ比率にならない場合、小数点第2位で四捨五入させ、次の順位も同様に四捨五入させるフラグをtrue
      if (
        !(
          (results[nextIdx][cntCol] == cntVal &&
            results[nextIdx][allCol] == allVal) ||
          sameAsDevide(
            cntVal,
            allVal,
            results[nextIdx][cntCol],
            results[nextIdx][allCol]
          )
        )
      ) {
        rounded = customRound(targetVal, baseDecimal + 1);
        round2ndDecimal = true;
        roudedDecimal = baseDecimal + 1;
        // 全く同じ場合、次に違う選手が出てくるまでチェック
      } else {
        for (let idxNext = idx + 2; idxNext < results.length; idxNext++) {
          // 本数・打席数が異なる選手がある場合
          if (
            !(
              (results[idxNext][cntCol] == cntVal &&
                results[idxNext][allCol] == allVal) ||
              sameAsDevide(
                cntVal,
                allVal,
                results[nextIdx][cntCol],
                results[nextIdx][allCol]
              )
            )
          ) {
            // 小数点3位で四捨五入した結果を比較し、同じ場合、小数点4位にしてフラグtrue
            if (
              rounded == customRound(results[idxNext][targetCol], baseDecimal)
            ) {
              rounded = customRound(targetVal, baseDecimal + 1);
              round2ndDecimal = true;
              roudedDecimal = baseDecimal + 1;
              break;
            }
          }
        }
      }
    }
  }

  rounded = addedZero(rounded, roudedDecimal);
  // create flugs
  let isIntPartOne = String(rounded).slice(0, 1) == "1";
  let isOps = targetCol == RATE_TYPE_COL_OPS;

  if (baseDecimal == 3) {
    // OPS以外 (when rounded = 1. then output as 1.000)
    if (isIntPartOne && !isOps) {
      rounded = "1.000";
      // OPS (1を超える場合があるため、1未満のみ`0`を削除)
    } else if (!isIntPartOne) {
      rounded = String(rounded).slice(1);
    }
  }

  return {
    rounded,
    flag2: round2ndDecimal,
    flag3: round3rdDecimal
  };
};

/**
 * 0パディング処理実行
 *
 * @param {number} target
 * @param {number} roundedDecimal
 */
const addedZero = (target, roudedDecimal) => {
  let rounded = target;
  let decimalPart = String(rounded).split(".")[1]; // 小数点で分割
  // 小数点パートがある場合
  if (decimalPart) {
    if (decimalPart.length < roudedDecimal) {
      for (let idx = 0; idx < roudedDecimal - decimalPart.length; idx++) {
        rounded = rounded + "0";
      }
    }
    // when rounded = .0 then output as .000
  } else {
    rounded = String(rounded).split(".")[0] + ".";
    for (let idx = 0; idx < roudedDecimal; idx++) {
      rounded = rounded + "0";
    }
  }
  return rounded;
};

/**
 * 引数バリデーション
 *
 * @param {number} bat
 * @param {array} validList
 * @param {string} option
 * @return {boolean}
 */
util.isValid = (value, validList, option) =>
  innerIsValid(value, validList, option);

/**
 * @param {Save as above}
 * @return {Save as above}
 */
const innerIsValid = (value, validList, option) => {
  let valid = true;
  // 入力有無
  if (!value) {
    console.log("please input `--" + option + "` option");
    valid = false;
  }
  // 範囲内判定
  if (valid && validList.indexOf(String(value)) == -1) {
    console.log("please input valid `--" + option + "` option");
    valid = false;
  }
  return valid;
};

/**
 * 引数バリデーション (allow empty)
 *
 * @param {number} bat
 * @param {array} validList
 * @param {string} option
 * @return {boolean}
 */
util.isValidAllowEmply = (val, validList, option) => {
  let valid = true;
  // 範囲内判定
  if (val && validList.indexOf(String(val)) == -1) {
    console.log("please input valid `--" + option + "` option");
    valid = false;
  }
  return valid;
};

/**
 *
 * @param {number} hitCntVal
 * @param {number} batCntVal
 * @param {number} nextHitCntVal
 * @param {number} nextBatCntVal
 * @return {boolean}
 */
const sameAsDevide = (hitCntVal, batCntVal, nextHitCntVal, nextBatCntVal) => {
  let currentGcd = gcd(hitCntVal, batCntVal);
  let nextGcd = gcd(nextHitCntVal, nextBatCntVal);

  return (
    hitCntVal / currentGcd == nextHitCntVal / nextGcd &&
    batCntVal / currentGcd == nextBatCntVal / nextGcd
  );
};

/**
 * 最大公約数計算
 *
 * @param {number} a 比較対象1
 * @param {number} b 比較対象2
 */
const gcd = (a, b) => {
  if (b == 0) return a;
  return gcd(b, a % b);
};

/**
 *
 * @param {boolean} isKindTeam
 * @param {string} first ヘッダ前半見出し
 * @param {string} second ヘッダ中盤見出し
 * @param {string} third ヘッダ後半見出し
 */
util.createHeader = (isKindTeam, first, second, third) =>
  `2019年 ${first} ${isKindTeam ? `チーム別` : ``}${second}${
    isKindTeam ? `` : `\n※規定打席到達打者のみ`
  }${third}\n\n`;

/**
 *
 * @param {boolean} isKindTeam
 * @param {string} first ヘッダ前半見出し
 * @param {string} second ヘッダ中盤見出し
 * @param {string} third ヘッダ後半見出し
 */
util.createHeaderNoRegulation = (isKindTeam, first, second, third) =>
  `2019年 ${first} ${isKindTeam ? `チーム別` : ``}${second}${
    third ? `\n${third}` : ``
  }\n\n`;

/**
 * イニング表記名、バリデエラー、集計対象イニング情報作成
 *
 * @param {string} iningArgv
 * @param {object} INNINGS_SET_NAME
 * @return
 */
util.createInningInfo = inningArgv => {
  const inningArray = String(inningArgv).split(",");
  const innings = [...Array(12).keys()].map(idx => String(++idx));

  const [firstArg, secondArg, willFin] = putArgvInning(
    inningArgv,
    inningArray,
    innings
  );

  const inningName =
    Object.keys(INNINGS_SET_NAME).indexOf(inningArgv) > -1
      ? INNINGS_SET_NAME[inningArgv]
      : inningArray.length > 1
      ? `${firstArg}~${secondArg}回`
      : `${firstArg}回`;

  // converter
  const n = n => Number(n);
  // select target cols
  const targetInings = innings.filter(key =>
    secondArg
      ? n(firstArg) <= n(key) && n(key) <= n(secondArg)
      : n(firstArg) == n(key)
  );

  return [inningName, willFin, targetInings];
};

/**
 * 引数のイニング数とバリデーションエラーによる終了判定を実行
 * @param {string} inningArgv
 * @param {array} inningArray
 * @param {array} innings
 * @return {array} number|number|boolean
 */
const putArgvInning = (inningArgv, inningArray, innings) => {
  let firstArg, secondArg;
  let willFin = false;
  // カンマ区切りにで2イニング指定した場合
  if (inningArray.length == 2) {
    // 引数の値を代入
    [firstArg, secondArg] = inningArray;
    // 最初未指定の場合、初回を自動指定
    if (!firstArg) firstArg = 1;
    // 最後未指定の場合、最初が10回以上だったら12回を、9回以下の場合は9回を自動指定
    if (!secondArg) secondArg = firstArg > 9 ? 12 : 9;
    // 大小関係を正す
    if (firstArg > secondArg) [firstArg, secondArg] = [secondArg, firstArg];

    // validated
    if (!innerIsValid(firstArg, innings, "inning")) willFin = true;
    if (!willFin && !innerIsValid(secondArg, innings, "inning")) willFin = true;

    // 同じイニングの場合、後半をリセット
    if (firstArg == secondArg) secondArg = undefined;

    // 1イニング指定した場合
  } else if (inningArray.length == 1) {
    if (!innerIsValid(inningArgv, innings, "inning")) willFin = true;
    firstArg = inningArgv;

    // 指定なし or 3イニング以上指定した場合
  } else {
    willFin = true;
  }

  return [firstArg, secondArg, willFin];
};

/**
 * 集計対象カラム作成
 * 
 * @param {array} targetInnings
 * @param {string} cols
 * @return {array}
 */
util.createTargetCols = (targetInings, col) =>
  targetInings.map(inningNum => `${col}${inningNum}`).join(" + ");
