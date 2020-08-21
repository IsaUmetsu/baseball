/** ---------- definition of `LiveHeader` ---------- */
export interface TeamInitialScore {
    teamInitial: string,
    currentScore: string
}

export interface BallCount {
    b: string,
    s: string,
    o: string
}
/** ---------- /definition of `LiveHeader` ---------- */
export interface LiveHeaderJson {
    inning: string,
    away: TeamInitialScore,
    home: TeamInitialScore,
    count: BallCount
}

/** ---------- definition of `LiveBody` ---------- */
export interface OnbaseInfo {
    base: string,
    player: string
}

export interface CurrentPlayerInfo {
    name?: string,
    playerNo?: string,
    domainHand?: string
}

export interface CurrentBatterInfo extends CurrentPlayerInfo {
    average: string
}

export interface CurrentPitcherInfo extends CurrentPlayerInfo {
    pitch?: string,
    vsBatterCount?: string,
    pitchERA?: string
}
/** ---------- /definition of `LiveBody` ---------- */
export interface LiveBodyJson {
    battingResult: string,
    pitchingResult: string,
    onbaseInfo: OnbaseInfo[],
    currentBatterInfo: CurrentBatterInfo,
    currentPicherInfo: CurrentPitcherInfo,
    nextBatter: string,
    inningBatterCnt: string
}
