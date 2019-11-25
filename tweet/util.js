"use strict";

const util = module.exports = {};

/**
 *
 * @param {array} results
 * @param {string} idx
 * @param {boolean} round2ndDecimal
 * @return {object} roundedPercent, flag
 */
util.executeRound = (results, idx, round2ndDecimal) => {
  const { cnt, batting_cnt, percent } = results[idx];
  idx = Number(idx)

  let nextIdx = idx + 1 < results.length ? idx + 1 : idx;
  let roundedPercent = Math.round(Number(percent) * 10) / 10;

  // 小数点第2位での四捨五入フラグがONの場合
  if (round2ndDecimal) {
    // 次の打者のpercentと小数点1位を四捨五入した値が違う場合、フラグをfalseに戻す
    if (
      roundedPercent !=
      Math.round(Number(results[nextIdx].percent) * 10) / 10
    ) {
      round2ndDecimal = false;
    }
    // 小数点第2位での四捨五入
    roundedPercent = Math.round(Number(percent) * 100) / 100;
  } else {
    // 次の打者のpercentと小数点1位を四捨五入した値が同じ場合
    if (
      roundedPercent ==
      Math.round(Number(results[nextIdx].percent) * 10) / 10
    ) {
      // 本数・打数のどちらかが違う場合、小数点第2位で四捨五入させ、次の順位も同様に四捨五入させるフラグをtrue
      if (
        !(
          results[nextIdx].cnt == cnt &&
          results[nextIdx].batting_cnt == batting_cnt
        )
      ) {
        roundedPercent = Math.round(Number(percent) * 100) / 100;
        round2ndDecimal = true;
        // 全く同じ場合、次に違う選手が出てくるまでチェック
      } else {
        for (let idxNext = idx + 2; idxNext < results.length; idxNext++) {
          // 本数・打席数が異なる選手がある場合
          if (
            !(
              results[idxNext].cnt == cnt &&
              results[idxNext].batting_cnt == batting_cnt
            )
          ) {
            // 小数点1位で四捨五入した結果を比較し、同じ場合、小数点2位にしてフラグtrue
            if (
              roundedPercent ==
              Math.round(Number(results[idxNext].percent) * 10) / 10
            ) {
              roundedPercent = Math.round(Number(percent) * 100) / 100;
              round2ndDecimal = true;
              break;
            }
          }
        }
      }
    }
  }
  return { roundedPercent, flag: round2ndDecimal };
};

/**
 * 
 * @param {boolean} tweet
 * @param {object} client twitter client
 * @param {string} status
 * @param {string} in_reply_to_status_id
 * @return {string} tweet_id
 */
util.tweetResult = async (tweet, client, status, in_reply_to_status_id) => {
  let res = "";
  if (tweet) {
    let { id_str } = await client.post("statuses/update", {
      status,
      in_reply_to_status_id
    });
    res = id_str;
    console.log('--- tweeted ---')
  }
  return res;
};