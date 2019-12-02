"use strict";

const y = (module.exports = {});

const yargs = require("yargs")
  .count("tweet")
  .alias("t", "tweet");

/**
 * for batting result
 */
y.batter = yargs.alias("b", "bat").default({ bat: 1 });

/**
 * for pitching result
 */
y.pitcher = yargs.alias("bt", "ballType").default({ ballType: 1 });

/**
 * for pitching result
 */
y.search = require("yargs").alias("w", "word").default({ word: "ランキング" });
