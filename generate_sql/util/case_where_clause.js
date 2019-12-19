"use strict";

module.exports = (pref, situation) => {

  const whereClause = {
    no: `
      ${pref}.b_total = 0 AND ${pref}.t_total = 0`,
    dw: `
      (${pref}.b_total != 0 AND ${pref}.t_total != 0) AND (${pref}.b_total = ${pref}.t_total)`,
    bh: `
      (CASE ${pref}.top_bottom
        WHEN 1 THEN ${pref}.b_total - ${pref}.t_total
        WHEN 2 THEN ${pref}.t_total - ${pref}.b_total
      END) > 0`,
    ld: `
      (CASE ${pref}.top_bottom
        WHEN 1 THEN ${pref}.t_total - ${pref}.b_total
        WHEN 2 THEN ${pref}.b_total - ${pref}.t_total
      END) > 0`,
    
  }

  return whereClause[situation];
};
