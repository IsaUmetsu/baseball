"use strict";

const { execute, getFilename } = require("./util/func");
const { INNINGS_COL } = require("../constants");

let sql = `-- CREATE TABLE ${getFilename(__filename)}
`;

// -------------------- [select part] --------------------

// player_info
sql += `SELECT
  pb.id,
  p.name,
  p.team,
  `;

let totalHitCol = "";
let totalHrCol = "";
let totalRbiCol = "";
let totalBatCol = "";

// any info(hit, hr, rbi, bat) per inning
Object.keys(INNINGS_COL).map(inningNum => {
  const inning = INNINGS_COL[inningNum];
  sql += `-- ${inningNum}回`;
  sql += `
  IFNULL(${inning}.hit, 0) AS hit_${inning},
  IFNULL(${inning}.hr, 0) AS hr_${inning},
  IFNULL(${inning}.rbi, 0) AS rbi_${inning},
  IFNULL(${inning}.bat, 0) AS bat_${inning},
  `;

  totalHitCol += `IFNULL(${inning}.hit, 0) + `;
  totalHrCol += `IFNULL(${inning}.hr, 0) + `;
  totalRbiCol += `IFNULL(${inning}.rbi, 0) + `;
  totalBatCol += `IFNULL(${inning}.bat, 0) + `;
});

// about `total`
sql += `-- 各項目合計`;
sql += `
  ${totalHitCol.slice(0, -3)} AS total_hit,
  ${totalHrCol.slice(0, -3)} AS total_hr,
  ${totalRbiCol.slice(0, -3)} AS total_rbi,
  ${totalBatCol.slice(0, -3)} AS total_bat,
  `;

// -------------------- /[select part] --------------------

sql += `'e' AS eol
FROM baseball._player_batter pb
  LEFT JOIN player p ON pb.id = p.id
`;

// -------------------- [left join part] --------------------

// left join part per inning
Object.keys(INNINGS_COL).map(inningNum => {
  const inning = INNINGS_COL[inningNum];
  sql += `-- ${inningNum}回`;
  sql += `
  LEFT JOIN (
    SELECT 
      sb.batter,
      COUNT(h.rst_id IS NOT NULL OR NULL) AS hit,
      COUNT(h.rst_id = 9 OR NULL) AS hr,
      SUM(CASE WHEN rbi.RBI IS NOT NULL THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS rbi,
      COUNT(e.name IS NULL OR NULL) AS bat
    FROM
      baseball.situation_base_commit sb
    LEFT JOIN hit_id_info h on sb.rst_id = h.rst_id
    LEFT JOIN exclude_batting_info e on sb.result = e.name
    LEFT JOIN _rbi_all rbi on sb.g_id = rbi.g_id
    WHERE sb.ining = ${inningNum}
    GROUP BY sb.batter
  ) AS ${inning} ON ${inning}.batter = pb.id
  `;
});

// -------------------- /[left join part] --------------------

// end of query
sql += ";";

// generate
execute(getFilename(__filename), sql);
