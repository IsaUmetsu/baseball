"use strict";

const { execute, getFilename } = require("./util/func");
const { COUNT_ALL } = require("../constants");

const ballTypeIds = [...Array(9).keys()].map(num => ++num);

let sql = `-- CREATE TABLE ${getFilename(__filename)}
`;

// -------------------- [select part] --------------------

// player_info
sql += `SELECT
  pp.*, p.name, p.team,`;

// any info(hit, hr, rbi, bat) per inning
ballTypeIds.map(ballTypeId => {
  sql += `
  p${ballTypeId}.b_id AS b${ballTypeId},
  p${ballTypeId}.avg_spd AS b${ballTypeId}_avg_spd,
  p${ballTypeId}.max_spd AS b${ballTypeId}_max_spd,
  p${ballTypeId}.cnt AS b${ballTypeId}_cnt,`;
});

// -------------------- /[select part] --------------------

sql += `
  'e' AS eol
FROM baseball._player_pitcher pp
  LEFT JOIN player p ON pp.id = p.id`;

// -------------------- [left join part] --------------------

// left join part per inning
ballTypeIds.map(ballTypeId => {
  sql += `
  LEFT JOIN (
    SELECT 
      ball_type_id AS b_id,
      pitcher,
      AVG(speed) AS avg_spd,
      MAX(speed) AS max_spd,
      COUNT(pitcher) AS cnt
    FROM
      _pitched_ball
    WHERE
      ball_type_id = ${ballTypeId}
    GROUP BY ball_type_id , pitcher
  ) AS p${ballTypeId} ON pp.id = p${ballTypeId}.pitcher`;
});

// -------------------- /[left join part] --------------------

// end of query
sql += `
;`;

// generate
execute(`${getFilename(__filename)}`, sql);
