"use strict";

module.exports = require("yargs")
  .alias("b", "bat")
  .default({ bat: 1 })
  .count("tweet")
  .alias("t", "tweet");
