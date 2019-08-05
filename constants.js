"use strict"

const constants = module.exports = {}

constants.ORDER_PITCHER = 10
constants.POSITIONS = {
  P: 1, C: 2, "1B": 3, "2B": 4, "3B": 5,
  SS: 6, LF: 7, CF: 8, RF: 9, D: 10,
  PH: 11, PR: 12
}
constants.POSITIONS_NAME = {
  1: "ピッチャー", 2: "キャッチャー", 3: "ファースト", 4: "セカンド", 5: "サード",
  6: "ショート", 7: "レフト", 8: "センター", 9: "ライト", 10: "指名打者",
  11: "代打", 12: "代走"
}
constants.VISITOR_TEAM = 1
constants.HOME_TEAM = 2
constants.TOP_BOTTOM = { 1: '表', 2: '裏' }