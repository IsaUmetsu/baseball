"use strict";

const moment = require("moment");
moment.locale("ja");

const twClient = require("../twitter");

(async () => {
  const tweets = await twClient
    .get("statuses/home_timeline", { screen_name: "shimamiya6", count: 25 })
    .catch(e => {
      console.log(e);
    });

  tweets
    // .filter(tweet => tweet.text.indexOf("追い上げ") > -1)
    .map(async tweet => {
      console.log(tweet.text);
      // console.log(tweet.created_at)
      // console.log(moment(tweet.created_at).format('YYYYMMDD hhmmss'))
    });
})();
