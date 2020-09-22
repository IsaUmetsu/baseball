/**
 * 打席数判定
 */
export const judgePlateAppearance = (battingResult: string, currentBatterName: string): number => {
  // 打席数カウント対象のうち、打席数に含まれない結果を除外
  const isNotPA = battingResult.indexOf("けん制") > -1 || 
    battingResult.indexOf("ボーク") > -1 || 
    battingResult.indexOf("ボール") > -1 ||
    (battingResult.indexOf("見逃し") > -1 && battingResult.indexOf("三振") == -1) ||
    (battingResult.indexOf("空振り") > -1 && battingResult.indexOf("三振") == -1) ||
    // 選手変更
    battingResult.indexOf("継投") > -1 || 
    battingResult.indexOf("代走") > -1 || 
    battingResult.indexOf("代打") > -1 || 
    battingResult.indexOf("守備") > -1
  ;

  return Number(
    currentBatterName.length > 0 &&
    battingResult.length > 0 &&
    !isNotPA
  );
}

/**
 * 打数判定
 */
export const judgeAtBat = (battingResult: string, currentBatterName: string): number => {
  // 打席数のうち打数に含まれない結果を除外
  const isNotBat = battingResult.indexOf("四球") > -1 || 
    battingResult.indexOf("申告敬遠") > -1 || 
    battingResult.indexOf("死球") > -1 || 
    battingResult.indexOf("犠飛") > -1 ||
    battingResult.indexOf("犠打") > -1 || 
    battingResult.indexOf("妨害") > -1 ||
    // 打席数除外対象も追加
    battingResult.indexOf("けん制") > -1 || 
    battingResult.indexOf("ボーク") > -1 || 
    battingResult.indexOf("ボール") > -1 ||
    (battingResult.indexOf("見逃し") > -1 && battingResult.indexOf("三振") == -1) ||
    (battingResult.indexOf("空振り") > -1 && battingResult.indexOf("三振") == -1) ||
    battingResult.indexOf("代走") > -1
  ;

  // 打者名
  return Number(currentBatterName.length > 0 && !isNotBat);
}

/**
 * 
 */
export const judgeHit = (battingResult: string): number => {
  return Number(
    battingResult.indexOf("安打") > -1 || 
    battingResult.indexOf("二塁打") > -1 || 
    battingResult.indexOf("三塁打") > -1 || 
    battingResult.indexOf("2塁打") > -1 || 
    battingResult.indexOf("3塁打") > -1 || 
    battingResult.indexOf("本塁打") > -1
  );
}
  
/**
 * 
 */
export const judgeOnbase = (battingResult: string): number => {
  return Number(
    battingResult.indexOf("安打") > -1 || 
    battingResult.indexOf("二塁打") > -1 || 
    battingResult.indexOf("三塁打") > -1 || 
    battingResult.indexOf("2塁打") > -1 || 
    battingResult.indexOf("3塁打") > -1 || 
    battingResult.indexOf("本塁打") > -1 || 
    battingResult.indexOf("四球") > -1 || 
    battingResult.indexOf("死球") > -1 || 
    battingResult.indexOf("申告敬遠") > -1
  );
}

/**
 * 
 */
export const judgeError = (battingResult: string): number => {
  return Number(
    battingResult.indexOf("エラー") > -1 || 
    battingResult.indexOf("犠打失") > -1
  );
}

/**
 * 
 */
export const judgeFc = (battingResult: string): number => {
  return Number(battingResult.indexOf("野選") > -1);
}

/**
 * 
 */
export const calcTotalBase = (battingResult: string): number => {
  let totalBase = 0;

  if (battingResult.indexOf("安打") > -1) totalBase = 1;
  if (battingResult.indexOf("二塁打") > -1 || battingResult.indexOf("2塁打") > -1) totalBase = 2;
  if (battingResult.indexOf("三塁打") > -1 || battingResult.indexOf("3塁打") > -1) totalBase = 3;
  if (battingResult.indexOf("本塁打") > -1) totalBase = 4;

  return totalBase
}

/**
 * 
 */
export const judgePlayerChange = (battingResult: string, changeKind: string): number => {
  return Number(battingResult.indexOf(changeKind) > -1);
}

/**
 * 
 */
export const judgeIsBall = (battingResult: string, countBall: number): number => {
  const isBall = battingResult.indexOf("四球") > -1;
  const ball = isBall ? countBall - 1 : countBall;

  return ball < 0 ? 0 : ball;
}

/**
 * 
 */
export const judgeIsStrike = (battingResult: string, countStrike: number): number => {
  const isStrike = 
    battingResult.indexOf("三振") > -1 || 
    battingResult.indexOf("振り逃げ") > -1 || 
    battingResult.indexOf("スリーバント失敗") > -1 || 
    battingResult.indexOf("空振り") > -1 || 
    battingResult.indexOf("見逃し") > -1
  ;

  const strike = isStrike ? countStrike - 1 : countStrike;

  return strike < 0 ? 0 : strike;
}

/**
 * 
 */
export const calcOut = (battingResult: string, pitchingResult: string, countOut: number): number => {
  let out = countOut;

  const isOut = 
    // 打撃結果関連
    battingResult.indexOf("三振") > -1 || 
    battingResult.indexOf("振り逃げ") > -1 || 
    battingResult.indexOf("スリーバント失敗") > -1 || 
    (battingResult.indexOf("犠打") > -1 && battingResult.indexOf("野選") == -1) || // 犠打野選を除外
    battingResult.indexOf("犠飛") > -1 || 
    battingResult.indexOf("ゴロ") > -1 || 
    battingResult.indexOf("ライナー") > -1 || 
    battingResult.indexOf("フライ") > -1 || 
    // 投球結果関連
    pitchingResult.indexOf("盗塁失敗") > -1 ||  
    pitchingResult.indexOf("牽制アウト") > -1 
  ;

  if (isOut) out = out - 1;
  if (battingResult.indexOf("併殺") > -1) out = out - 2;

  return out < 0 ? 0 : out;
}

export const judgePlusOutCount = (battingResult: string, pitchingResult: string): number => {
  let plusOut = 0;

  const isOut = 
    // 打撃結果関連
    battingResult.indexOf("三振") > -1 || 
    battingResult.indexOf("振り逃げ") > -1 || 
    battingResult.indexOf("スリーバント失敗") > -1 || 
    (battingResult.indexOf("犠打") > -1 && battingResult.indexOf("野選") == -1) || // 犠打野選を除外
    battingResult.indexOf("犠飛") > -1 || 
    battingResult.indexOf("ゴロ") > -1 || 
    battingResult.indexOf("ライナー") > -1 || 
    battingResult.indexOf("フライ") > -1 || 
    // 投球結果関連
    pitchingResult.indexOf("盗塁失敗") > -1 ||  
    pitchingResult.indexOf("牽制アウト") > -1 
  ;

  if (isOut) plusOut = 1;
  if (battingResult.indexOf("併殺") > -1 || pitchingResult.indexOf("併殺") > -1) plusOut = 2;

  return plusOut;
}

export const judgePlusScore = (battingResult: string): number => {
  let plusScore = 0;
  if (battingResult.indexOf("＋1点") > -1) plusScore = 1;
  if (battingResult.indexOf("＋2点") > -1) plusScore = 2;
  if (battingResult.indexOf("＋3点") > -1) plusScore = 3;
  if (battingResult.indexOf("＋4点") > -1) plusScore = 4;
  return plusScore;
}
