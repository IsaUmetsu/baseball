"use strict";

const twClient = require("../twitter")

(async () => {
  const tweets = await twClient
    .get("statuses/home_timeline", { screen_name: "shimamiya6", count: 25 })
    .catch(e => {
      throw e;
    });

  tweets
    .filter(tweet => tweet.text.indexOf("追い上げ") > -1)
    .map(async tweet => {
      await twClient
        .post(`statuses/destroy/${tweet.id_str}`, {
          screen_name: "shimamiya6"
        })
        .catch(e => {
          console.log(e);
        });
    });
})();
