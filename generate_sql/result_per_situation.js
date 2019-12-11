"use strict";

const { execute, getFilename } = require("./util/func");
const { BASE_TYPE, BASE_TYPE_NAME } = require("../constants");

let sql = `-- CREATE TABLE ${getFilename(__filename)}_base
-- CREATE TABLE ${getFilename(__filename)}_regulation
`;

// -------------------- [select part] --------------------

// player_info
sql += `SELECT
  pb.id, p.name, p.team,`;

// any info(hit, hr, rbi, bat) per inning
Object.keys(BASE_TYPE).map(baseTypeId => {
  const baseType = BASE_TYPE[baseTypeId];
  sql += `
  IFNULL(b_${baseType}.hit, 0) AS hit_${baseType},
  IFNULL(b_${baseType}.hr, 0) AS hr_${baseType},
  IFNULL(b_${baseType}.rbi, 0) AS rbi_${baseType},
  IFNULL(b_${baseType}.bat, 0) AS bat_${baseType},
  ROUND(CASE WHEN IFNULL(b_${baseType}.bat, 0) > 0 THEN b_${baseType}.hit / b_${baseType}.bat ELSE 0 END, 5) AS rate_${baseType},`;
});

// -------------------- /[select part] --------------------

sql += `
  'e' AS eol
FROM baseball._player_batter pb
  LEFT JOIN player p ON pb.id = p.id`;

// -------------------- [left join part] --------------------

// left join part per inning
Object.keys(BASE_TYPE).map(baseTypeId => {
  const baseType = BASE_TYPE[baseTypeId];
  sql += `
  -- ${BASE_TYPE_NAME[baseTypeId]}`;

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
    LEFT JOIN hit_id_info h ON sb.rst_id = h.rst_id
    LEFT JOIN exclude_batting_info e ON sb.result = e.name
    LEFT JOIN _rbi_all rbi ON sb.g_id = rbi.g_id
    WHERE sb.on_all_base = ${baseType}
    GROUP BY sb.batter
  ) AS b_${baseType} ON b_${baseType}.batter = pb.id`;
});

// -------------------- /[left join part] --------------------

// end of query
sql += `
  LEFT JOIN batter_reaching_regulation br ON pb.id = br.batter WHERE br.batter IS NOT NULL
;`;

// generate
execute(`${getFilename(__filename)}_base`, sql);
