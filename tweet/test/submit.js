"use strict";

const Twitter = require("twitter");
const moment = require("moment");

const {
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret
} = require("../config");

const twClient = new Twitter({
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret
});

(async () => {
  let in_reply_to_status_id = "";

  for (let cnt = 0; cnt < 10; cnt++) {
    
    let res = await twClient.post(
      "statuses/update",
      { status: `Test tweet ${moment().format('x')}`, in_reply_to_status_id }
    );
    // 直前のTweetIdを取得してスレッドとして連続投稿
    in_reply_to_status_id = res.id_str 
  }
})();
