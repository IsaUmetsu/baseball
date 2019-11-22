"use strict";

const Twitter = require("twitter");
const moment = require('moment')

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
  const tweets = await twClient
    .get("statuses/home_timeline", { screen_name: "shimamiya6", count: 25 })
    .catch(e => {
      throw e;
    });

  tweets
    .filter(tweet => tweet.text.indexOf("Test tweet") > -1)
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
