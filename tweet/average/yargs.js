"use strict";

const y = (module.exports = {});

/**
 * for batting result
 */
y.batter = require("yargs")
  .count("tweet")
  .alias("t", "tweet")
  .alias("b", "bat")
  .default({ bat: 1 });

/**
 * for pitching result
 */
y.pitcher = require("yargs")
  .count("tweet")
  .alias("t", "tweet")
  .alias("b", "ballType")
  .default({ ballType: 1 });

/**
 * for pitching result
 */
y.search = require("yargs")
  .alias("w", "word")
  .default({ word: "ランキング" })
  .alias("c", "count")
  .default({ word: 25 })
  ;
