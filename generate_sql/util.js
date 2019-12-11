"use strict";

/**
 * クエリ生成ユーティリティクラス
 */
const util = (module.exports = {});

/**
 * @param {string} fullFilePath
 * @return {string} 
 */
util.getFilename = fullFilePath => {
  const fnSplit = fullFilePath.split("/");
  return fnSplit[fnSplit.length - 1].split(".")[0];
};

/**
 * 
 * @param {string} filename
 * @param {string} sql
 */
util.execute = (filename, sql) => {
  // generate
  require("fs").writeFile(`./sql/generated/${filename}.sql`, sql, err => {
    if (err) console.log(err);
  });
};