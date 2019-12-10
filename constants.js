"use strict";

const constants = (module.exports = {});

constants.ORDER_PITCHER = 10;
constants.POSITIONS = {
  P: 1,
  C: 2,
  "1B": 3,
  "2B": 4,
  "3B": 5,
  SS: 6,
  LF: 7,
  CF: 8,
  RF: 9,
  D: 10,
  PH: 11,
  PR: 12
};

constants.POSITIONS_NAME = {
  1: "ピッチャー",
  2: "キャッチャー",
  3: "ファースト",
  4: "セカンド",
  5: "サード",
  6: "ショート",
  7: "レフト",
  8: "センター",
  9: "ライト",
  10: "指名打者",
  11: "代打",
  12: "代走"
};

constants.VISITOR_TEAM = 1;
constants.HOME_TEAM = 2;
constants.TOP_BOTTOM = { 1: "表", 2: "裏" };
constants.TOP = 1;
constants.BOTTOM = 2;

constants.FIRST_BASE = 1;
constants.SECOND_BASE = 2;
constants.THIRD_BASE = 3;

constants.DATA_TYPE_URL = "url";
constants.DATA_TYPE_JSON = "json";

constants.INNINGS = {
  初回: "1回",
  序盤: "1〜3回",
  中盤: "4〜6回",
  終盤: "7〜9回",
  最終回: "9回",
  延長: "10回〜"
};

constants.INNINGS_SET_NAME = {
  "1": "初回",
  "1,3": "序盤",
  "4,6": "中盤",
  "7,9": "終盤",
  "9": "最終回",
  "1,5": "前半イニング",
  "6,9": "後半イニング",
  "10,": "延長",
};

constants.INNINGS_COL = {
  1: "oen",
  2: "two",
  3: "thr",
  4: "fur",
  5: "fiv",
  6: "six",
  7: "sev",
  8: "egt",
  9: "nin",
  10: "ten",
  11: "elv",
  12: "twl"
}

constants.HASHTAGS = {
  // pacific
  L: "seibulions",
  H: "sbhawks",
  E: "RakutenEagles",
  M: "chibalotte",
  F: "lovefighters",
  B: "Bs2019",
  // central
  G: "giants",
  S: "swallows",
  DB: "baystars",
  C: "carp",
  D: "dragons",
  T: "hanshintigers"
};

constants.BALL_TYPES = {
  1: "ストレート",
  2: "カーブ",
  3: "シュート(ツーシーム)",
  4: "スライダー",
  5: "フォーク",
  6: "シンカー",
  7: "チェンジアップ",
  9: "カットボール"
};

constants.SITUATION = {
  1: "先制",
  2: "追い上げ",
  3: "追加点",
  4: "同点",
  5: "勝ち越し",
  6: "逆転",
  7: "サヨナラ"
};

constants.SITUATION_COL_NAME = {
  1: "sns",
  2: "oia",
  3: "tik",
  4: "dtn",
  5: "kck",
  6: "gkt",
  7: "syn"
};

// 打撃成績種別カラム名
constants.RESULT_PER_TYPE = {
  1: "rate",
  2: "hr",
  3: "rbi"
};
// 打撃成績種別名称
constants.RESULT_PER_TYPE_NAME = {
  1: "打率",
  2: "本塁打",
  3: "打点"
};
