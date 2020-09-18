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

/** ---------- definition of `PitchInfo` ---------- */
export interface PitchDetail {
    judgeIcon: string,
    pitchCnt: string,
    pitchType: string,
    pitchSpeed: string,
    pitchJudgeDetail: string
}

export interface PitchCourseType {
    top: string,
    left: string
}

export interface GameResultDetail {
    title: string,
    name: string,
    domainHand: string
}

export interface GameResult {
    left: GameResultDetail,
    right: GameResultDetail
}
/** ---------- /definition of `PitchInfo` ---------- */
export interface PitchInfoJson {
    pitchDetails: PitchDetail[],
    allPitchCourse: PitchCourseType[],
    gameResult: GameResult
}

/** ---------- definition of `TeamInfo` ---------- */
export interface Order {
    no: string,
    position: string,
    name: string,
    domainHand: string,
    average: string
}

export interface BenchMemberInfoType {
    name: string,
    domainHand: string,
    average: string
}

export interface TeamInfoJson {
    name: string,
    order: Order[],
    batteryInfo: string,
    homerunInfo: string,
    benchPitcher: BenchMemberInfoType[],
    benchCatcher: BenchMemberInfoType[],
    benchInfielder: BenchMemberInfoType[],
    benchOutfielder: BenchMemberInfoType[]
}
/** ---------- /definition of `TeamInfo` ---------- */
export interface HomeTeamInfoJson {
    homeTeamInfo: TeamInfoJson
}

export interface AwayTeamInfoJson {
    awayTeamInfo: TeamInfoJson
}


export interface OutputJson {
    liveHeader: LiveHeaderJson,
    liveBody: LiveBodyJson,
    pitchInfo: PitchInfoJson,
    homeTeamInfo: TeamInfoJson,
    awayTeamInfo: TeamInfoJson
}

export interface SavedBallCount {
    b: number,
    s: number,
    o: number
}


export interface RunsRunsAllowed {
    inning: number,
    runs: number,
    runsAllowed: number
}

export interface TotalPitchStats {
    away: TeamPitchStats,
    home: TeamPitchStats
}

export interface TeamPitchStats {
    team: string,
    stats: PitchStats[]
}

export interface PitchStats {
    result: string,
    name: string,
    era: string,
    ip: string,
    np: string,
    bf: string,
    ha: string,
    hra: string,
    so: string,
    bb: string,
    hbp: string,
    balk: string,
    ra: string,
    er: string
}
