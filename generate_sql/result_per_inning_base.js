"use strict";

const { execute, getFilename, cols } = require("./util/func");
const innings = [...Array(12).keys()].map(num => ++num);

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
innings.map(inning => {
  let col1 = `hit${inning}`,
    col2 = `hr${inning}`,
    col3 = `rbi${inning}`,
    col4 = `bat${inning}`;

  sql += `-- ${inning}回`;
  sql += `
  IFNULL(ing${inning}.hit, 0) AS ${col1},
  IFNULL(ing${inning}.hr, 0) AS ${col2},
  IFNULL(ing${inning}.rbi, 0) AS ${col3},
  IFNULL(ing${inning}.bat, 0) AS ${col4},
  `;

  totalHitCol += `IFNULL(ing${inning}.hit, 0) + `;
  totalHrCol += `IFNULL(ing${inning}.hr, 0) + `;
  totalRbiCol += `IFNULL(ing${inning}.rbi, 0) + `;
  totalBatCol += `IFNULL(ing${inning}.bat, 0) + `;

  insertCols = [...insertCols, col1, col2, col3, col4];
});

let totalCol1 = "total_hit",
  totalCol2 = "total_hr",
  totalCol3 = "total_rbi",
  totalCol4 = "total_bat";

// about `total`
sql += `-- 各項目合計`;
sql += `
  ${cols(totalHitCol)} AS ${totalCol1},
  ${cols(totalHrCol)} AS ${totalCol2},
  ${cols(totalRbiCol)} AS ${totalCol3},
  ${cols(totalBatCol)} AS ${totalCol4},
  `;

insertCols = [...insertCols, totalCol1, totalCol2, totalCol3, totalCol4, "eol"];
// -------------------- /[select part] --------------------

sql += `'e' AS eol
FROM baseball._player_batter pb
  LEFT JOIN player p ON pb.id = p.id
`;

// -------------------- [left join part] --------------------

// left join part per inning
innings.map(inning => {
  sql += `-- ${inning}回`;
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
    WHERE sb.ining = ${inning}
    GROUP BY sb.batter
  ) AS ing${inning} ON ing${inning}.batter = pb.id
  `;
});

// -------------------- /[left join part] --------------------

// end of query
sql = `-- CREATE TABLE ${getFilename(__filename)}
-- INSERT INTO ${getFilename(__filename)} (${insertCols.join(', ')})

` + sql + `-- LEFT JOIN batter_reaching_regulation br ON pb.id = br.batter WHERE br.batter IS NOT NULL
;`;

// generate
execute(getFilename(__filename), sql);
