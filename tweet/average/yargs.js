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
  .default({ word: 25 });

/**
 * for having output type batter and team
 */
y.baseBothBatTeam = require("yargs")
  .count("tweet")
  .alias("t", "tweet")
  .count("kindTeam")
  .alias("k", "kindTeam")
  .count("random")
  .alias("x", "random");

/**
 * for having output type batter and team
 */
y.baseSimple = require("yargs")
  .count("tweet")
  .alias("t", "tweet");
