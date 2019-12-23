"use strict";

/**
 * クエリ生成ユーティリティクラス
 */
const func = (module.exports = {});

/**
 * @param {string} fullFilePath
 * @return {string}
 */
func.getFilename = fullFilePath => {
  const isMac = process.cwd() == "/";
  const separator = isMac ? "/" : "\\";

  const fnSplit = fullFilePath.split(separator);
  return fnSplit[fnSplit.length - 1].split(".")[0];
};

/**
 *
 * @param {string} filename
 * @param {string} sql
 */
func.execute = (filename, sql) => {
  // generate
  require("fs").writeFile(`./sql/generated/${filename}.sql`, sql, err => {
    if (err) console.log(err);
  });
};

/**
 * 
 * @param {string} cols
 * @return {string} trimmed ` + ` of end 
 */
func.cols = cols => cols.slice(0, -3);
