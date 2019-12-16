"use strict";

const { execute, getFilename, cols } = require("./util/func");
const { TEAM_INITIAL } = require("../constants");

// -------------------- [select part] --------------------

let totalHitCol = "",
  totalHrCol = "",
  totalRbiCol = "",
  totalBatCol = "",
  insertCols = ["id", "name", "team"],
  sql = `SELECT
  pb.id,
  p.name,
  p.team,
  `; // append insert target cols

// any info(hit, hr, rbi, bat) per inning
TEAM_INITIAL.map(team => {
  let col1 = `hit_${team}`,
    col2 = `hr_${team}`,
    col3 = `rbi_${team}`,
    col4 = `bat_${team}`,
    col5 = `rate_${team}`;;

  sql += `-- vs ${team}`;
  sql += `
  IFNULL(tm_${team}.hit, 0) AS ${col1},
  IFNULL(tm_${team}.hr, 0) AS ${col2},
  IFNULL(tm_${team}.rbi, 0) AS ${col3},
  IFNULL(tm_${team}.bat, 0) AS ${col4},
  CASE WHEN IFNULL(tm_${team}.bat, 0) > 0 THEN ROUND(IFNULL(tm_${team}.hit, 0) / IFNULL(tm_${team}.bat, 0), 5) ELSE 0 END AS ${col5},
  `;

  totalHitCol += `IFNULL(tm_${team}.hit, 0) + `;
  totalHrCol += `IFNULL(tm_${team}.hr, 0) + `;
  totalRbiCol += `IFNULL(tm_${team}.rbi, 0) + `;
  totalBatCol += `IFNULL(tm_${team}.bat, 0) + `;

  insertCols = [...insertCols, col1, col2, col3, col4, col5];
});

let totalCol1 = "total_hit",
  totalCol2 = "total_hr",
  totalCol3 = "total_rbi",
  totalCol4 = "total_bat",
  totalCol5 = "total_rate";

// about `total`
sql += `-- 各項目合計`;
sql += `
  ${cols(totalHitCol)} AS ${totalCol1},
  ${cols(totalHrCol)} AS ${totalCol2},
  ${cols(totalRbiCol)} AS ${totalCol3},
  ${cols(totalBatCol)} AS ${totalCol4},
  CASE WHEN IFNULL(${cols(totalBatCol)}, 0) > 0 THEN ROUND((${cols(totalHitCol)})/(${cols(totalBatCol)}), 5) ELSE 0 END AS ${totalCol5},
  `;

insertCols = [...insertCols, totalCol1, totalCol2, totalCol3, totalCol4, totalCol5, "eol"];
// -------------------- /[select part] --------------------

sql += `'e' AS eol
FROM baseball._player_batter pb
  LEFT JOIN player p ON pb.id = p.id
`;

// -------------------- [left join part] --------------------

// left join part per inning
TEAM_INITIAL.map(team => {
  sql += `-- vs ${team}`;
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
    LEFT JOIN order_overview oo ON oo.id = sb.oo_id
    WHERE CASE sb.top_bottom WHEN 1 THEN oo.home_team WHEN 2 THEN oo.visitor_team END = '${team}'
    GROUP BY sb.batter
  ) AS tm_${team} ON tm_${team}.batter = pb.id
  `;
});

// -------------------- /[left join part] --------------------

// end of query
sql = `-- CREATE TABLE ${getFilename(__filename)}_base
-- INSERT INTO ${getFilename(__filename)}_regulation (${insertCols.join(', ')})

` + sql + `-- LEFT JOIN batter_reaching_regulation br ON pb.id = br.batter WHERE br.batter IS NOT NULL
;`;

// generate
execute(getFilename(__filename), sql);
