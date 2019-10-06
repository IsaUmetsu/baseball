"use strict"

const func = module.exports = {}

/**
 * 
 */
func.checkAndCreateDir = async (date_string, game_no) => {
  const path_date = `./data/${date_string}`
  const path_file = `./data/${date_string}/${game_no}`
  // 日付ディレクトリがない場合、作成作成
  if (!fs.existsSync(path_date)) { fs.mkdirSync(path_date) }
  // ゲーム番号ディレクトリがない場合、作成
  if (!fs.existsSync(path_file)) { fs.mkdirSync(path_file) }
  return path_file
}