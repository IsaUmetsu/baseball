"use strict";

module.exports = (pref, situation) => {

  const whereClause = {
    sns: `
      ${pref}.b_total = 0 AND ${pref}.t_total = 0  AND NOT (
        ${pref}.ining >= 9
        AND ${pref}.top_bottom = 2
      ) -- サヨナラシチュエーションは除外`,
    oia: `
      ROUND((SELECT (CHAR_LENGTH(${pref}.on_all_base) - CHAR_LENGTH(REPLACE(${pref}.on_all_base, '1', ''))) / CHAR_LENGTH('1')), 0) <= CASE (CASE ${pref}.top_bottom
          WHEN 1 THEN ${pref}.b_total - ${pref}.t_total
          WHEN 2 THEN ${pref}.t_total - ${pref}.b_total
      END)
          WHEN 2 THEN 1
          WHEN 3 THEN 2
          -- WHEN 4 THEN 3
          ELSE 3
      END
      AND (CASE ${pref}.top_bottom WHEN 1 THEN ${pref}.t_total - ${pref}.b_total WHEN 2 THEN ${pref}.b_total - ${pref}.t_total END ) < - 1`,
    tik: `
      (
        CASE
          ${pref}.top_bottom
          WHEN 1 THEN ${pref}.t_total - ${pref}.b_total
          WHEN 2 THEN ${pref}.b_total - ${pref}.t_total
        END
      ) > 0`,
    dtn: `
      ROUND((SELECT (CHAR_LENGTH(${pref}.on_all_base) - CHAR_LENGTH(REPLACE(${pref}.on_all_base, '1', ''))) / CHAR_LENGTH('1')), 0) = CASE (CASE ${pref}.top_bottom
          WHEN 1 THEN ${pref}.b_total - ${pref}.t_total
          WHEN 2 THEN ${pref}.t_total - ${pref}.b_total
        END)
          WHEN 1 THEN 1
          WHEN 2 THEN 2
          WHEN 3 THEN 3
          -- WHEN 4 THEN 3
          ELSE 3
        END
        AND (CASE ${pref}.top_bottom
        WHEN 1 THEN ${pref}.b_total - ${pref}.t_total
        WHEN 2 THEN ${pref}.t_total - ${pref}.b_total
      END) < 5
        AND (CASE ${pref}.top_bottom
        WHEN 1 THEN ${pref}.t_total - ${pref}.b_total
        WHEN 2 THEN ${pref}.b_total - ${pref}.t_total
      END) < 0`,
    kck: `
      ${pref}.b_total - ${pref}.t_total = 0
      AND NOT (
        ${pref}.b_total = 0
        OR ${pref}.t_total = 0
      )
      AND NOT (
        ${pref}.ining >= 9
        AND ${pref}.top_bottom = 2
      ) -- サヨナラシチュエーションは除外`,
    gkt: `
      ROUND((SELECT (CHAR_LENGTH(${pref}.on_all_base) - CHAR_LENGTH(REPLACE(${pref}.on_all_base, '1', ''))) / CHAR_LENGTH('1')), 0) >= CASE (CASE ${pref}.top_bottom
          WHEN 1 THEN ${pref}.b_total - ${pref}.t_total
          WHEN 2 THEN ${pref}.t_total - ${pref}.b_total
        END)
          WHEN 1 THEN 2
          WHEN 2 THEN 3
          -- WHEN 3 THEN 3
          ELSE 3
        END
        AND (CASE ${pref}.top_bottom
        WHEN 1 THEN ${pref}.b_total - ${pref}.t_total
        WHEN 2 THEN ${pref}.t_total - ${pref}.b_total
      END) < 5
        AND (CASE ${pref}.top_bottom
        WHEN 1 THEN ${pref}.t_total - ${pref}.b_total
        WHEN 2 THEN ${pref}.b_total - ${pref}.t_total
      END) < 0
            AND (${pref}.ining < 9 OR (${pref}.ining >= 9 and ${pref}.top_bottom = 1)) -- サヨナラシチュエーションは除外`,
    syn: `
      ${pref}.ining >= 9 AND ${pref}.top_bottom = 2
      AND (
        ${pref}.b_total - ${pref}.t_total = 0 OR (
          ${pref}.t_total - ${pref}.b_total > 0
          AND ${pref}.t_total - ${pref}.b_total < 4 AND (
            ROUND((SELECT (CHAR_LENGTH(${pref}.on_all_base) - CHAR_LENGTH(REPLACE(${pref}.on_all_base, '1', ''))) / CHAR_LENGTH('1')),
                  0) >= CASE (CASE ${pref}.top_bottom
                WHEN 1 THEN ${pref}.b_total - ${pref}.t_total
                WHEN 2 THEN ${pref}.t_total - ${pref}.b_total
              END)
                WHEN 1 THEN 2
                WHEN 2 THEN 3
                ELSE 3
              END
            )
          )
        )`
  }

  return whereClause[situation];
};
