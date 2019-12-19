"use strict";

const { execute, getFilename, cols } = require("./util/func");
const getWhereClause = require("./util/situation_where_clause");
const { SITUATION_COL_NAME, SITUATION } = require("../constants");

// -------------------- [select part] --------------------

let batCols = "",
  runsCols = "",
  hitCols = "",
  insertCols = ["id", "`name`", "team"],
  sql = `SELECT
  pb.id, p.name, p.team,`;

// any info(hit, hr, rbi, bat) per inning
Object.keys(SITUATION_COL_NAME).map(baseTypeId => {
  const baseType = SITUATION_COL_NAME[baseTypeId];
  let col1 = `${baseType}_hit`,
    col2 = `${baseType}_bat`,
    col3 = `${baseType}_runs`,
    col4 = `rate_${baseType}`;

  sql += `
  IFNULL(b_${baseType}.hit_cnt, 0) AS ${col1},
  IFNULL(b_${baseType}.bat_cnt, 0) AS ${col2},
  IFNULL(b_${baseType}.runs, 0) AS ${col3},
  ROUND(CASE WHEN IFNULL(b_${baseType}.bat_cnt, 0) > 0 THEN b_${baseType}.hit_cnt / b_${baseType}.bat_cnt ELSE 0 END, 5) AS ${col4},`;

  batCols += `IFNULL(b_${baseType}.bat_cnt, 0) + `;
  runsCols += `IFNULL(b_${baseType}.runs, 0) + `;
  hitCols += `IFNULL(b_${baseType}.hit_cnt, 0) + `;

  insertCols = [...insertCols, col1, col2, col3, col4];
});

let totalCol = ["total_hit", "total_bat", "total_runs", "rate_total"];

// about `total`
sql += `-- 各項目合計`;
sql += `
  ${cols(hitCols)} AS ${totalCol[0]},
  ${cols(batCols)} AS ${totalCol[1]},
  ${cols(runsCols)} AS ${totalCol[2]},
  ROUND((${cols(hitCols)})/(${cols(batCols)}), 5) AS ${totalCol[3]},`;

insertCols = [...insertCols, totalCol];

// calcurate percent
/*
Object.keys(SITUATION_COL_NAME).map(baseTypeId => {
  const baseType = SITUATION_COL_NAME[baseTypeId];
  let colName = `${baseType}_ttl_pct`;
  sql += `
  ROUND(CASE WHEN (${cols(
    hitCols
  )}) > 0 THEN (IFNULL(b_${baseType}.hit_cnt, 0)) / (${cols(
    hitCols
  )}) ELSE 0 END, 5) AS ${colName},`;

  insertCols = [...insertCols, colName];
});
*/

// -------------------- /[select part] --------------------
insertCols = [...insertCols, "eol"];

sql += `
  'e' AS eol
FROM baseball._player_batter pb
  LEFT JOIN player p ON pb.id = p.id`;

// -------------------- [left join part] --------------------

// left join part per inning
Object.keys(SITUATION_COL_NAME).map(situId => {
  const situation = SITUATION_COL_NAME[situId];
  sql += `
  -- ${SITUATION[situId]}`;

  sql += `
  LEFT JOIN (
    SELECT 
      sc.batter,
      COUNT((sc.rst_id IN (2, 3, 4, 6, 8) AND IFNULL(rbi.RBI, 0) > 0) OR NULL) AS hit_cnt,
      COUNT(e.name IS NULL OR NULL) AS bat_cnt,
      SUM(CASE WHEN rbi.rst_id IN (2, 3, 4, 6, 8) THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS runs
    FROM
      situation_hit_rbi_commit sc
    LEFT JOIN exclude_batting_info e ON sc.result = e.name
    LEFT JOIN _rbi_all rbi ON sc.g_id = rbi.g_id
    WHERE ${getWhereClause("sc", situation)}
    GROUP BY sc.batter
  ) AS b_${situation} ON b_${situation}.batter = pb.id`;
});

// -------------------- /[left join part] --------------------

// end of query
// sql += `LEFT JOIN batter_reaching_regulation br ON pb.id = br.batter WHERE br.batter IS NOT NULL;`;

sql =
  `-- CREATE TABLE ${getFilename(__filename)}
-- INSERT INTO ${getFilename(__filename)} (${insertCols.join(",")})

` + sql;

// generate
execute(getFilename(__filename), sql);
