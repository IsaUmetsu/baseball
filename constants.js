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
  "1,3": "序盤(1~3回)",
  "4,6": "中盤(4~6回)",
  "7,9": "終盤(7~9回)",
  "9": "最終回(9回)",
  "1,5": "前半イニング(1~5回)",
  "6,9": "後半イニング(6~9回)",
  "10,": "延長(10回~)"
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
};

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

constants.CASE = {
  1: "無得点",
  2: "同点",
  3: "ビハインド",
  4: "リード"
};

constants.CASE_COL_NAME = {
  1: "no",
  2: "dw",
  3: "bh",
  4: "ld"
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
// 塁状況(1: onbase, 0: not onbase)
constants.BASE_TYPE = {
  1: "000",
  2: "100",
  3: "110",
  4: "101",
  5: "010",
  6: "011",
  7: "001",
  8: "111"
};
// 塁状況名
constants.BASE_TYPE_NAME = {
  1: "無し",
  2: "一塁",
  3: "一二塁",
  4: "一三塁",
  5: "二塁",
  6: "二三塁",
  7: "三塁",
  8: "満塁"
};
// 全カウント
constants.COUNT_ALL = [
  "00",
  "01",
  "02",
  "10",
  "11",
  "12",
  "20",
  "21",
  "22",
  "30",
  "31",
  "32"
];
// 開発用
constants.BATS_COL = {
  1: "fst",
  2: "scd",
  3: "thr",
  4: "fur",
  5: "fif",
  6: "six",
  7: "sev"
};
// 率種別カラム名
constants.RATE_TYPE = {
  1: "rate",
  2: "obrate",
  3: "slug",
  4: "ops"
};
// 率種別和名
constants.RATE_TYPE_NAME = {
  1: "打率",
  2: "出塁率",
  3: "長打率",
  4: "OPS"
};
constants.RATE_TYPE_OPS = 4;
constants.RATE_TYPE_COL_OPS = "ops";

// 得失点カラム名
constants.SCORE_TYPE = {
  1: "scr",
  2: "ls",
  3: "df"
};
// 得失点別和名
constants.SCORE_TYPE_NAME = {
  1: "得点",
  2: "失点",
  3: "得失点差"
};

// チーム英頭文字
constants.TEAM_INITIAL = [
  "G",
  "DB",
  "C",
  "D",
  "T",
  "S",
  "H",
  "L",
  "E",
  "M",
  "F",
  "B"
];
// チーム短名称
constants.TEAM_INITIAL_LOCALE_NAME = {
  G: "巨人",
  DB: "DeNA",
  C: "広島",
  D: "中日",
  T: "阪神",
  S: "ヤクルト",
  H: "ソフトバンク",
  L: "西武",
  E: "楽天",
  M: "ロッテ",
  F: "日本ハム",
  B: "オリックス"
};

// チーム短名称
constants.TEAM_INITIAL_NAME = {
  G: "ジャイアンツ",
  DB: "ベイスターズ",
  C: "カープ",
  D: "ドラゴンズ",
  T: "タイガース",
  S: "スワローズ",
  H: "ホークス",
  L: "ライオンズ",
  E: "イーグルス",
  M: "マリーンズ",
  F: "ファイターズ",
  B: "バファローズ"
};
