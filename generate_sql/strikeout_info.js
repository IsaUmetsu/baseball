"use strict";

const { execute, getFilename } = require("./util/func");

const ballTypeIds = [...Array(9).keys()].map(num => ++num);

// -------------------- [select part] --------------------

// player_info
let insertCols = [
    "id",
    "lr",
    "name",
    "team",
    "`all`",
    "swing",
    "swg_rate",
    "look",
    "look_rate",
    "avg_cnt"
  ],
  sql = `SELECT
  pp.*,
  p.name,
  p.team,
  all_k.all_cnt as \`all\`,
  IFNULL(swing_k.all_cnt, 0) AS swing,
  ROUND(IFNULL(swing_k.all_cnt, 0) / all_k.all_cnt, 3) AS swg_rate,
  IFNULL(look_k.all_cnt, 0) AS look,
  ROUND(IFNULL(look_k.all_cnt, 0) / all_k.all_cnt, 3) AS look_rate,
  ROUND(p_avg.avg_cnt, 4) AS avg_cnt,`;

// ball count and average
ballTypeIds.map(ballTypeId => {
  let col1 = `b${ballTypeId}`,
    col2 = `b${ballTypeId}_rate`;

  sql += `
  b${ballTypeId}.cnt AS ${col1},
  ROUND(IFNULL(b${ballTypeId}.cnt, 0) / all_k.all_cnt, 4) AS ${col2},`;

  insertCols = [...insertCols, col1, col2];
});

insertCols = [...insertCols, "eol"];
// -------------------- /[select part] --------------------

sql += `
  'e' AS eol
FROM baseball._player_pitcher pp
  LEFT JOIN player p ON pp.id = p.id
  -- all k
  LEFT JOIN (
    SELECT pitcher, COUNT(*) AS all_cnt
    FROM _tmp_strikeout
    GROUP BY pitcher
  ) AS all_k ON p.id = all_k.pitcher
  -- swing
  LEFT JOIN (
    SELECT pitcher, COUNT(*) AS all_cnt
    FROM _tmp_strikeout
    WHERE rst_id IN (16, 28)
    GROUP BY pitcher
  ) AS swing_k ON p.id = swing_k.pitcher
  -- look
  LEFT JOIN (
    SELECT pitcher, COUNT(*) AS all_cnt
    FROM _tmp_strikeout
    WHERE rst_id = 17
    GROUP BY pitcher
  ) AS look_k ON p.id = look_k.pitcher
  -- average
  LEFT JOIN (
    SELECT pitcher, AVG(batter_pitch_count) AS avg_cnt
    FROM _tmp_strikeout
    WHERE rst_id IN (16, 17, 28)
    GROUP BY pitcher
  ) AS p_avg ON p.id = p_avg.pitcher`;

// -------------------- [left join part] --------------------

// left join part per inning
ballTypeIds.map(ballTypeId => {
  sql += `
  LEFT JOIN (
    SELECT 
      pitcher,
      ball_type,
      COUNT(ball_type) AS cnt
    FROM _tmp_strikeout
    WHERE
      rst_id IN (16, 17, 28)
      AND ball_type_id = ${ballTypeId}
    GROUP BY pitcher, ball_type
  ) AS b${ballTypeId} ON p.id = b${ballTypeId}.pitcher`;
});

// -------------------- /[left join part] --------------------

// end of query
sql =
  `-- CREATE TABLE ${getFilename(__filename)}
-- INSERT INTO ${getFilename(__filename)} (${insertCols.join(',')})

` +
  sql +
  `
WHERE
  all_k.all_cnt IS NOT NULL`;

// generate
execute(`${getFilename(__filename)}`, sql);
