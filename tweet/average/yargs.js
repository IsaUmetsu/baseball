"use strict";

const y = (module.exports = {});

const yargs = require("yargs");

y.batter = yargs
  .alias("b", "bat")
  .default({ bat: 1 })
  .count("tweet")
  .alias("t", "tweet");
