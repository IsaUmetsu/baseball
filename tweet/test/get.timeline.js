"use strict";

const Twitter = require("twitter");
const moment = require('moment')
moment.locale('ja')

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
      console.log(e)
      throw e;
    });
  console.log(tweets)

  tweets
    .map(async tweet => {
      console.log(tweet.text)
      // console.log(tweet.created_at)
      // console.log(moment(tweet.created_at).format('YYYYMMDD hhmmss'))
    });
})();
