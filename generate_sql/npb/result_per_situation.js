"use strict";

const { execute, getFilename } = require("../util/func");
const { BASE_TYPE } = require("../../constants");

let sql = `-- CREATE TABLE ${getFilename(__filename)}_npb
`;

// -------------------- [select part] --------------------

// any info(hit, hr, rbi, bat) per inning
Object.keys(BASE_TYPE).map(baseTypeId => {
  const baseType = BASE_TYPE[baseTypeId];
  sql += `
  SELECT
    '${baseType}' AS base,
    SUM(hit_${baseType}) AS hit,
    SUM(hr_${baseType}) AS hr,
    SUM(rbi_${baseType}) AS rbi,
    SUM(bat_${baseType}) AS bat,
    ROUND(SUM(hit_${baseType}) / SUM(bat_${baseType}), 5) AS rate
  FROM baseball.result_per_situation_base
  UNION`;
});

// generate
execute(`npb_${getFilename(__filename)}`, sql.slice(0, -5));
