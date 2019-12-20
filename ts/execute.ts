import * as twText from "twitter-text";
import { con as db, SELECT as type } from './db';
import { tweetResult } from "./util";

let contents: string = ""; // whole
let row: string = "";
let header: string = ""; // rank, number of homerun, tie
let footer: string = "\n#npb "; // hashtag
let prevTweetId: string = "";

export async function executeWithRound(execQuery, tweet, headerBase, createRowCb) {
  return await exeWithRoundInner(execQuery, tweet, headerBase, createRowCb)
    .then(r => r)
    .catch(e => {
      throw e;
    });
}

const exeWithRoundInner = async (
  execQuery: string, tweet: boolean, headerBase: string,
  createRowCb: (results, idx, round2ndDecimal, round3rdDecimal) => [string, boolean, boolean]
) => {
  // get target records
  const results = await db
    .query(execQuery, { type })
    .then(r => r)
    .catch(e => {
      console.log(e);
      throw e;
    });

  let round2ndDecimal: boolean = false;
  let round3rdDecimal: boolean = false;

  for (let idx in results) {
    if (!header) {
      header = headerBase;
      contents += header;
    }

    [row, round2ndDecimal, round3rdDecimal] = createRowCb(
      results,
      idx,
      round2ndDecimal,
      round3rdDecimal
    );

    // 次の内容を足してもツイート可能な場合
    if (twText.parseTweet(contents + row + footer).valid) {
      contents += row;
      // 次の内容を足すとツイート不可である場合（文字数超過)
    } else {
      prevTweetId = await executeTweet(tweet, contents, footer, prevTweetId)
        .then(r => r)
        .catch(e => {
          throw e;
        });
      // reset content
      contents = header + row;
    }
  }

  await executeTweet(tweet, contents, footer, prevTweetId);
};


const executeTweet = async (tweet, contents, footer, prevTweetId) => {
  let displayContent = contents + footer;
  // 最終ツイート内容出力
  console.log("----------");
  console.log(displayContent);
  // tweet
  return await tweetResult(tweet, displayContent, prevTweetId);
};