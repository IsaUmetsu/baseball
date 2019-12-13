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
  // skip base `000`
  if (baseTypeId == 1) return false;

  const baseType = BASE_TYPE[baseTypeId];
  sql += `
  IFNULL(b_${baseType}.bat, 0) AS bat_${baseType},
  IFNULL(b_${baseType}.drived, 0) AS drv_${baseType},
  IFNULL(b_${baseType}.ave, 0) AS ave_${baseType},`
});

// -------------------- /[select part] --------------------

sql += `
  'e' AS eol
FROM baseball._player_batter pb
  LEFT JOIN player p ON pb.id = p.id`;

// -------------------- [left join part] --------------------

const n = n => Number(n);

// left join part per inning
Object.keys(BASE_TYPE).map(baseTypeId => {
  // skip base `000`
  if (baseTypeId == 1) return false;

  const baseType = BASE_TYPE[baseTypeId];
  const [on1b, on2b, on3b] = baseType;
  const drivedCond = [];
  if (n(on1b)) drivedCond.push("next_1b_go > 1");
  if (n(on2b)) drivedCond.push("next_2b_go > 2");
  if (n(on3b)) drivedCond.push("next_3b_go > 3");

  sql += `
  -- ${BASE_TYPE_NAME[baseTypeId]}`;

  sql += `
  LEFT JOIN (
    SELECT
      sb.batter,
      COUNT(eb.result IS NULL) AS bat,
      COUNT(((${drivedCond.join(" OR ")}) AND a.rst_id IS NOT NULL) OR NULL) AS drived,
      ROUND(COUNT(((${drivedCond.join(" OR ")}) AND a.rst_id IS NOT NULL) OR NULL) / COUNT(eb.result IS NULL), 5) AS ave
    FROM baseball.situation_base_commit sb
    LEFT JOIN exclude_drived_info eb ON eb.result = sb.result
    LEFT JOIN advanced_base_id_info a ON a.rst_id = sb.rst_id
    WHERE ${n(on1b) ? `` : `NOT`} runner_1b AND ${n(on2b) ? `` : `NOT`} runner_2b AND ${n(on3b) ? `` : `NOT`} runner_3b
    GROUP BY sb.batter) AS b_${baseType} ON b_${baseType}.batter = pb.id`;
});

// -------------------- /[left join part] --------------------

// end of query
sql += `
  LEFT JOIN batter_reaching_regulation br ON pb.id = br.batter WHERE br.batter IS NOT NULL
;`;

// generate
execute(`${getFilename(__filename)}_base`, sql);
