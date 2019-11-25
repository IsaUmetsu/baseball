"use strict";

const moment = require("moment");

const twClient = require("../twitter")

(async () => {
  let in_reply_to_status_id = "";

  for (let cnt = 0; cnt < 10; cnt++) {
    let res = await twClient.post("statuses/update", {
      status: `Test tweet ${moment().format("x")}`,
      in_reply_to_status_id
    });
    // 直前のTweetIdを取得してスレッドとして連続投稿
    in_reply_to_status_id = res.id_str;
    console.log(in_reply_to_status_id)
  }
})();
