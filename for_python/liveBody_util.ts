/**
 * 打数判定
 */
export const judgeAtBat = (battingResult: string, currentBatterName: string, pitchingResult: string): number => {
  // 打席数のうち打数に含まれない結果を除外
  const isNotBat = battingResult.indexOf("四球") > -1 || 
    battingResult.indexOf("申告敬遠") > -1 || 
    battingResult.indexOf("死球") > -1 || 
    battingResult.indexOf("犠飛") > -1 ||
    battingResult.indexOf("犠打") > -1 || 
    battingResult.indexOf("妨害") > -1;
  
  // 盗塁成功、盗塁失敗、代走 のケースを除外対象とする
  let isOnlySteal = pitchingResult.indexOf("盗塁") > -1;
  // 盗塁を仕掛けたが三振した場合は打数としてカウント
  if (isOnlySteal && battingResult.indexOf("三振") > -1) isOnlySteal = false;

  // 打者名
  return Number(currentBatterName.length > 0 && !isNotBat && !isOnlySteal);
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
