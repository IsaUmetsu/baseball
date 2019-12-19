"use strict";

const { execute, getFilename } = require("./util/func");
const whereClause = require("./util/case_where_clause");
const { CASE_COL_NAME } = require("../constants");

let sql = `-- CREATE TABLE ${getFilename(__filename)}_base
-- CREATE TABLE ${getFilename(__filename)}_regulation
`;

// -------------------- [select part] --------------------

// player_info
sql += `SELECT
  pb.id, p.name, p.team,`;

// any info(hit, hr, rbi, bat) per inning
Object.keys(CASE_COL_NAME).map(cnt => {
  let caseNm = CASE_COL_NAME[cnt];

  sql += `
  IFNULL(c_${caseNm}.hit, 0) AS hit_${caseNm},
  IFNULL(c_${caseNm}.hr, 0) AS hr_${caseNm},
  IFNULL(c_${caseNm}.rbi, 0) AS rbi_${caseNm},
  IFNULL(c_${caseNm}.bat, 0) AS bat_${caseNm},
  ROUND(CASE WHEN IFNULL(c_${caseNm}.bat, 0) > 0 THEN c_${caseNm}.hit / c_${caseNm}.bat ELSE 0 END, 5) AS rate_${caseNm},`;
});

// -------------------- /[select part] --------------------

sql += `
  'e' AS eol
FROM baseball._player_batter pb
  LEFT JOIN player p ON pb.id = p.id
`;

// -------------------- [left join part] --------------------

// left join part per inning
Object.keys(CASE_COL_NAME).map(cnt => {
  let caseNm = CASE_COL_NAME[cnt];

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
    WHERE ${whereClause("sb", caseNm)}
    GROUP BY sb.batter
  ) AS c_${caseNm} ON c_${caseNm}.batter = pb.id`;
});

// -------------------- /[left join part] --------------------

// end of query
sql += `
LEFT JOIN batter_reaching_regulation br ON pb.id = br.batter WHERE br.batter IS NOT NULL
;`;

// generate
execute(`${getFilename(__filename)}_base`, sql);
