"use strict";

const func = (module.exports = {});

const fs = require("fs");

/**
 *
 */
func.checkAndCreateDir = async (prevPath, date_string, game_no) => {
  const path_date = `${prevPath}/${date_string}`;
  const path_file = `${prevPath}/${date_string}/${game_no}`;
  // 日付ディレクトリがない場合、作成作成
  if (!fs.existsSync(path_date)) {
    fs.mkdirSync(path_date);
  }
  // ゲーム番号ディレクトリがない場合、作成
  if (!fs.existsSync(path_file)) {
    fs.mkdirSync(path_file);
  }
  return path_file;
};

/**
 * 選手の打順ごとのスタメン回数リスト作成
 */
func.createListByPlayer = async (rstByPly, order_no, count, player_name) => {
  // 選手情報がある場合、抽出
  if (Object.keys(rstByPly).filter(ply => ply == player_name).length) {
    rstByPly[player_name][order_no] = count;
  } else {
    rstByPly[player_name] = { [order_no]: count };
  }
};
