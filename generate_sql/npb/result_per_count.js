"use strict";

const { execute, getFilename } = require("../util/func");
const { COUNT_ALL } = require("../../constants");

let sql = `-- CREATE TABLE ${getFilename(__filename)}_npb
`;

// -------------------- [select part] --------------------

// any info(hit, hr, rbi, bat) per inning
COUNT_ALL.map(cnt => {
  sql += `
  SELECT
    '${cnt}' AS cnt,
    SUM(hit_${cnt}) AS hit,
    SUM(hr_${cnt}) AS hr,
    SUM(rbi_${cnt}) AS rbi,
    SUM(bat_${cnt}) AS bat,
    ROUND(SUM(hit_${cnt}) / SUM(bat_${cnt}), 5) AS rate
  FROM baseball.result_per_count_base
  UNION`;
});

// -------------------- /[select part] --------------------

// generate
execute(`npb_${getFilename(__filename)}`, sql.slice(0, -5));
