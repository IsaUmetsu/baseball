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
    battingResult.indexOf("代走") > -1
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
export const judgePlayerChange = (battingResult: string, changeKind: string): number => {
  return Number(battingResult.indexOf(changeKind) > -1);
}
