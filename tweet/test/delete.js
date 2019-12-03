"use strict";

const twClient = require("../twitter");
const argv = require("../average/yargs").search.argv;

(async () => {
  const tweets = await twClient
    .get("statuses/home_timeline", { screen_name: "shimamiya6", count: argv.count })
    .catch(e => {
      throw e;
    });

  tweets
    .filter(tweet => tweet.text.indexOf(argv.word) > -1)
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
