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

const twText = require("twitter-text");

const { db } = require("../model");
const { homerunTypeRankSituationBatter } = require("../query");
const { executeRound, tweetResult } = require("./util");

const homerun_type = "最終回";
const innings = {
  初回: "1回",
  序盤: "1〜3回",
  中盤: "4〜6回",
  // ラッキー７: "7回",
  終盤: "7〜9回",
  最終回: "9回",
  延長: "10回〜"
};
const homerun_type_other = ""; // 反撃の一打
const { SELECT: type } = db.QueryTypes;

const tweet = false;
let prevTweetId = "";

// test
// let tweet = "鶴岡(F) (1/1) 100%\n高橋(D) (1/7) 14.3%\n頓宮(B) (1/3) 33.3%\n長谷川勇(H) (1/3) 33.3%\n長坂(T) (1/1) 100%\n釜元(H) (1/4) 25%\n遠藤(D) (1/2) 50%\n近藤(F) (1/2) 50%\n西村(B) (1/2) 50%\n藤岡(M) (1/2) 50%\n荒木(S) (1/2) 50%"
// const result = twText.parseTweet(tweet)

/**
 * Execute
 */
(async () => {
  // get target records
  const results = await db
    .query(homerunTypeRankSituationBatter(homerun_type), { type })
    .then(r => r)
    .catch(e => {
      console.log(e);
      throw e;
    });

  let contents = ""; // whole
  let header = ""; // rank, number of homerun, tie
  let footer = "\n#侍ジャパン #プレミア12 #npb "; // hashtag
  let currentRank = 0;

  let round2ndDecimal = false;
  let round3rdDecimal = false;

  for (let idx in results) {
    const { name, team, cnt, batting_cnt, rank } = results[idx];

    if (!header) {
      header = createHeader();
      contents += header;
    }

    let rankPart = "";
    if (currentRank == rank && currentRank != 0) {
      rankPart = `${rank}位: `;
    } else {
      rankPart = `${rank}位: `;
      currentRank = rank;
    }

    let { roundedPercent, flag2, flag3 } = executeRound(
      results,
      idx,
      round2ndDecimal,
      round3rdDecimal
    );
    // update flag
    round2ndDecimal = flag2;
    round3rdDecimal = flag3;
    // create display info
    let row = `${name}(${team}) (${cnt}本/${batting_cnt}打数) ${roundedPercent}%\n`;

    // 次の内容を足してもツイート可能な場合
    if (twText.parseTweet(contents + (rankPart + row) + footer).valid) {
      contents += rankPart + row;
      // 次の内容を足すとツイート不可である場合（文字数超過)
    } else {
      // finalize content (足す前の内容で確定)
      let displayContent = contents + footer;
      // reset content
      rankPart = `${rank}位: `;
      contents = header + (rankPart + row);
      // display temp content
      console.log("----------");
      console.log(displayContent);
      // tweet
      prevTweetId = await tweetResult(tweet, displayContent, prevTweetId);
    }
  }

  let lastDisplayContent = contents + footer;
  // 最終ツイート内容出力
  console.log("----------");
  console.log(lastDisplayContent);
  // tweet
  await tweetResult(tweet, lastDisplayContent, prevTweetId);
})();

/**
 * ヘッダ作成 (rank, number of homerun, tie)
 */
const createHeader = () => {
  const dispHomerunType = homerun_type_other
    ? homerun_type_other
    : homerun_type;

  // 表示対象のイニングがある場合のみ、表示する
  const dispIning = Object.keys(innings).indexOf(dispHomerunType) > -1 ? `(${innings[dispHomerunType]})` : ''
  // 各種ヘッダ作成
  const header1 = `2019年 ${dispHomerunType}${dispIning}HRランキング\n`;
  const header2 = `(本/${dispHomerunType}打数)\n`;
  // 連結して返却
  return `${header1}${header2}※同数の場合は率が高い順に順位付け\n\n`;
};
