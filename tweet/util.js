"use strict";
/**
 * Nightmareユーティリティクラス
 */
const util = (module.exports = {});

const client = require("./twitter");

/**
 * 指定桁数四捨五入
 * @param {string | number} target
 * @param {number} decimal
 */
const customRound = (target, decimal) =>
  Math.round(Number(target) * Math.pow(10, decimal)) / Math.pow(10, decimal);

/**
 * パーセント表示四捨五入
 * @param {array} results
 * @param {string} idx
 * @param {boolean} round2ndDecimal
 * @param {boolean} round3rdDecimal
 * @return {object} rounded, flag
 */
util.executeRound = (results, idx, round2ndDecimal, round3rdDecimal) => {
  const {
    batting_cnt: batCntVal,
    cnt: hitCntVal,
    percent: targetVal
  } = results[idx];

  let baseDecimal = 1;
  let target = "percent";
  let hitCnt = "cnt";
  let batCnt = "batting_cnt";

  return doRoundDecimal(
    results,
    idx,
    round2ndDecimal,
    round3rdDecimal,
    batCntVal,
    hitCntVal,
    targetVal,
    baseDecimal,
    target,
    hitCnt,
    batCnt
  );
};

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
 * 打率四捨五入
 * @param {array} results
 * @param {string} idx
 * @param {boolean} round2ndDecimal
 * @param {boolean} round3rdDecimal
 * @return {object} rounded, flag
 */
util.executeRoundAverage = (results, idx, round2ndDecimal, round3rdDecimal) => {
  const {
    bat_cnt: batCntVal,
    hit_cnt: hitCntVal,
    average: targetVal
  } = results[idx];

  let baseDecimal = 3;
  let target = "average";
  let hitCnt = "hit_cnt";
  let batCnt = "bat_cnt";

  return doRoundDecimal(
    results,
    idx,
    round2ndDecimal,
    round3rdDecimal,
    batCntVal,
    hitCntVal,
    targetVal,
    baseDecimal,
    target,
    hitCnt,
    batCnt
  );
};

/**
 * 小数点四捨五入実行
 */
const doRoundDecimal = (
  results,
  idx,
  round2ndDecimal,
  round3rdDecimal,
  batCntVal,
  hitCntVal,
  targetVal,
  baseDecimal,
  target,
  hitCnt,
  batCnt
) => {
  idx = Number(idx);
  let nextIdx = idx + 1 < results.length ? idx + 1 : idx;
  let rounded = customRound(targetVal, baseDecimal);
  let roudedDecimal = baseDecimal;

  // 小数点第4位での四捨五入フラグがONの場合
  if (round2ndDecimal) {
    // 次の打者の値と小数点3位を四捨五入した値が違う場合、フラグをfalseに戻す
    if (rounded != customRound(results[nextIdx][target], baseDecimal)) {
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
        rounded == customRound(results[nextIdx][target], baseDecimal + 1) &&
        batCntVal != results[nextIdx][batCnt]
      ) {
        round3rdDecimal = true;
        // 小数点第3位での四捨五入
        rounded = customRound(targetVal, baseDecimal + 2);
        roudedDecimal = baseDecimal + 2;
      }
    }
  } else {
    // 次の打者の値と小数点3位を四捨五入した値が同じ場合
    if (rounded == customRound(results[nextIdx][target], baseDecimal)) {
      // 本数・打数のどちらかが違う場合、小数点第2位で四捨五入させ、次の順位も同様に四捨五入させるフラグをtrue
      if (
        !(
          results[nextIdx][hitCnt] == hitCntVal &&
          results[nextIdx][batCnt] == batCntVal
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
              results[idxNext][hitCnt] == hitCntVal &&
              results[idxNext][batCnt] == batCntVal
            )
          ) {
            // 小数点3位で四捨五入した結果を比較し、同じ場合、小数点4位にしてフラグtrue
            if (rounded == customRound(results[idxNext][target], baseDecimal)) {
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

  // 0パディング処理
  let decimalPart = String(rounded).split(".")[1]; // 小数点で分割
  // 小数点パートがある場合
  if (decimalPart) {
    if (decimalPart.length < roudedDecimal) {
      for (let idx = 0; idx < roudedDecimal - decimalPart.length; idx++) {
        rounded = rounded + "0";
      }
    }
  } else {
    rounded = rounded + ".0";
  }

  return {
    rounded,
    flag2: round2ndDecimal,
    flag3: round3rdDecimal
  };
};

/**
 * 取得対象打席数 バリデーション
 * 
 * @param {number} bat
 * @param {array} validList
 * @return {boolean}
 */
util.isValidBat = (bat, validList) => {
  let valid = true;
  // 入力有無
  if (!bat) {
    console.log("please input `--bat` option");
    valid = false;
  }
  // 範囲内判定
  if (valid && validList.indexOf(String(bat)) == -1) {
    console.log("please input valid `--bat` option");
    valid = false;
  }
  return valid;
};
