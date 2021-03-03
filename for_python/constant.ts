export const TARGET_YEAR = 2021;

export const teamArray = {
  'H': 'ソ',
  'M': 'ロ',
  'E': '楽',
  'F': '日',
  'L': '西',
  'B': 'オ',
  'G': '巨',
  'T': '神',
  'De': 'デ',
  'D': '中',
  'C': '広',
  'S': 'ヤ'
}

export const teamHashTags = {
  'H': '#sbhawks',
  'M': '#chibalotte',
  'E': '#RakutenEagles',
  'F': '#lovefigters',
  'L': '#seibulions',
  'B': '#bs2020',
  'G': '#giants',
  'T': '#hanshin',
  'De': '#baysters',
  'D': '#dragons',
  'C': '#carp',
  'S': '#swallows'
}

export const teamNames = {
  'H': 'ソフトバンク',
  'M': 'ロッテ',
  'E': '楽天',
  'F': '日本ハム',
  'L': '西武',
  'B': 'オリックス',
  'G': '巨人',
  'T': '阪神',
  'De': 'DeNA',
  'D': '中日',
  'C': '広島',
  'S': 'ヤクルト'
}

export const teamNameHalfToIni = {
  'ソフトバンク': 'ソ',
  'ロッテ': 'ロ',
  '楽天': '楽',
  '日本ハム': '日',
  '西武': '西',
  'オリックス': 'オ',
  '巨人': '巨',
  '阪神': '神',
  'ＤｅＮＡ': 'デ',
  '中日': '中',
  '広島': '広',
  'ヤクルト': 'ヤ'
}

export const teamFullNames = {
  'H': '福岡ソフトバンクホークス',
  'M': '千葉ロッテマリーンズ',
  'E': '東北楽天ゴールデンイーグルス',
  'F': '北海道日本ハムファイターズ',
  'L': '埼玉西武ライオンズ',
  'B': 'オリックスバファローズ',
  'G': '読売巨人軍',
  'T': '阪神タイガース',
  'De': '横浜DeNAベイスターズ',
  'D': '中日ドラゴンズ',
  'C': '広島東洋カープ',
  'S': '東京ヤクルトスワローズ'
};

export const rankCircle = {
  1: '①',
  2: '②',
  3: '③',
  4: '④',
  5: '⑤',
  6: '⑥'
};

export const leagueP = ['H', 'M', 'E', 'F', 'L', 'B'];
export const leagueC = ['G', 'T', 'De', 'D', 'C', 'S'];

export const leagueList = {
  'P': 'パリーグ',
  'C': 'セリーグ'
}

export const teamList = {
  'P': ['ソ', 'ロ', '楽', '日', '西', 'オ'],
  'C': ['巨', 'デ', '神', 'ヤ', '中', '広']
}

export const dayOfWeekArr = {
  1: "日曜",
  2: "月曜",
  3: "火曜",
  4: "水曜",
  5: "木曜",
  6: "金曜",
  7: "土曜"
}

export const posArgDic = {
  'C': '捕',
  '1B':'一',
  '2B': '二',
  '3B': '三',
  'SS': '遊',
  'LF': '左',
  'CF': '中',
  'RF': '右'
};

export const posFullDic = {
  'C': '捕',
  '1B':'一塁',
  '2B': '二塁',
  '3B': '三塁',
  'SS': '遊撃',
  'LF': '左翼',
  'CF': '中堅',
  'RF': '右翼'
};

export const PT_STARTER = 1;
export const PT_RELIEVER = 2;

export const PitcherType = {
  [PT_STARTER]: '先発',
  [PT_RELIEVER]: '中継ぎ'
}

export const pitcherTypeArgArr = {
  ST: 1,
  RL: 2
}

export const strikeTypes = {'SW': 'swing', 'MS': 'missed'};
export const batOuts = {'G': 'ground', 'F': 'fly'};
export const pitcherRoles = {'S': '先発', 'M': '中継ぎ'};
export const pitchTypes = {'F': 'ストレート', 'B': '変化球'};

export const TOP = 1;
export const BTM = 2;

export const HM = 'home';
export const AW = 'away';

export const FORMAT_BATTER = '\n%s (%s-%s)  %s%s %s%s';
export const FORMAT_BATTER_TEAM = '(%s)';
export const FORMAT_BATTER_HR = ' %s本';
export const FORMAT_BATTER_RBI = ' %s打点';

export const FORMAT_BATTER_ONBASE = '\n%s (%s-%s)  %s%s %s%s%s';
export const FORMAT_BATTER_HIT = ' %s安';
export const FORMAT_BATTER_BB = ' %s四';
export const FORMAT_BATTER_HBP = ' %s死';

export const FORMAT_BATTER_OPS = '\n%s %s%s (%s %s)';

export const sortType = {'D': 'DESC', 'A': 'ASC'};

export const courseTypes = {
  s_low: 'ストライク 低め',
  s_high: 'ストライク 高め',
  s_mid: 'ストライク 高さ真ん中',
  b_high: 'ボール 高め',
  b_low: 'ボール 低め',
  b_mid: 'ボール 高さ真ん中'
};

export const RC5_BAT_NPB_BASE = '0.400';
export const RC5_OB_NPB_BASE = '0.450';
export const RC5_OPS_NPB_BASE = '1.100';
export const DOW_BAT_NPB_BASE = '0.350';