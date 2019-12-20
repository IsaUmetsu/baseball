export type Cols = {
  cntCol: string
  allCol: string
  targetCol: string
};

// DB取得結果の基底インターフェース
export interface QueryResult {
  name: string,
  team: string
}

// 汎用結果格納クラス
export interface ResultPerAny extends QueryResult {
  hit: string,
  hr: string,
  rbi: string,
  bat: string,
  rate: string,
  rank: string
};