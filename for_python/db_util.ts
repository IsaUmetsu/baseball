import { getRepository } from 'typeorm';

import {
  GameInfo,
  LiveHeader,
  LiveBody,
  PitchInfo,
  PitchCourse,
  PitchDetails,
  PitcherBatter,
  TeamInfo,
  GameOrder,
  BenchMemberInfo,
  BenchMaster,
  BatteryInfo,
  HomerunInfo
} from './entities';

import {
  LiveHeaderJson,
  LiveBodyJson,
  PitchDetail,
  PitchCourseType,
  PitchInfoJson,
  TeamInfoJson,
  BenchMemberInfoType,
  SavedBallCount
} from './type/jsonType.d';

import {
  judgePlateAppearance,
  judgeAtBat,
  judgeHit,
  judgeOnbase,
  judgeError,
  judgeFc,
  judgePlayerChange,
  judgeIsBall,
  judgeIsStrike,
  judgeIsOut
} from './liveBody_util';

/**
 * 試合情報保存
 */
export const insertGameInfo = async (
  date: string, awayTeamInitial: string, homeTeamInitial: string, isNoGame: boolean
): Promise<number> => {

  const gameInfoRepository = getRepository(GameInfo);

  let savedGameInfo = await gameInfoRepository.findOne({
    date, awayTeamInitial, homeTeamInitial
  });

  if (savedGameInfo == null) {
    const gameInfo = new GameInfo();
    gameInfo.date = date;
    gameInfo.awayTeamInitial = awayTeamInitial;
    gameInfo.homeTeamInitial = homeTeamInitial;
    gameInfo.noGame = Number(isNoGame);

    await gameInfo.save();

    savedGameInfo = await gameInfoRepository.findOne({
      date, awayTeamInitial, homeTeamInitial
    });
  }

  return savedGameInfo.id;
}

/**
 * LiveHeader 情報保存
 */
export const insertLiveHeader = async (
  gameInfoId: number, scene: number, liveHeader: LiveHeaderJson
): Promise<SavedBallCount> => {
  
  const liveHeaderRepository = getRepository(LiveHeader);

  let savedLiveHeader = await liveHeaderRepository.findOne({ gameInfoId, scene });

  if (savedLiveHeader == null) {
    const { inning, away, home, count } = liveHeader;
    const newLiveHader = new LiveHeader();

    newLiveHader.gameInfoId = gameInfoId;
    newLiveHader.scene = scene;
    newLiveHader.inning = inning;
    newLiveHader.awayInitial = away.teamInitial;
    newLiveHader.awayScore = Number(away.currentScore);
    newLiveHader.homeInitial = home.teamInitial;
    newLiveHader.homeScore = Number(home.currentScore);
    newLiveHader.countBall = Number(count.b);
    newLiveHader.countStrike = Number(count.s);
    newLiveHader.countOut = Number(count.o);

    await newLiveHader.save();
    savedLiveHeader = await liveHeaderRepository.findOne({ gameInfoId, scene });
  }

  let { countBall, countStrike, countOut } = savedLiveHeader;
  return { b: countBall, s: countStrike, o: countOut };
}

/**
 * LiveBody 情報保存
 */
export const insertLiveBody = async (
  gameInfoId: number, scene: number, liveBody: LiveBodyJson, ballCount: SavedBallCount
): Promise<void> => {

  const liveBodyRepository = getRepository(LiveBody);
  const savedLiveBody = await liveBodyRepository.findOne({ gameInfoId, scene });

  if (savedLiveBody == null) {
    const newLiveBody = new LiveBody();

    newLiveBody.gameInfoId = gameInfoId;
    newLiveBody.scene = scene;

    const {
      battingResult,
      pitchingResult,
      onbaseInfo,
      currentBatterInfo: cbi,
      currentPicherInfo: cpi,
      nextBatter,
      inningBatterCnt
    } = liveBody;

    newLiveBody.battingResult = battingResult;
    newLiveBody.pitchingResult = pitchingResult;

    if (onbaseInfo) {
      onbaseInfo.forEach(({ base, player }) => {
        if (base == "base1") newLiveBody.base1Player = player
        if (base == "base2") newLiveBody.base2Player = player
        if (base == "base3") newLiveBody.base3Player = player
      })
    }

    if (cbi) {
      newLiveBody.currentBatterName = cbi.name;
      newLiveBody.currentBatterPlayerNo = cbi.playerNo;
      newLiveBody.currentBatterDomainHand = cbi.domainHand;
      newLiveBody.currentBatterAverage = cbi.average;
    }

    if (cpi) {
      newLiveBody.currentPitcherName = cpi.name;
      newLiveBody.currentPitcherPlayerNo = cpi.playerNo;
      newLiveBody.currentPitcherDomainHand = cpi.domainHand;
      newLiveBody.currentPitcherPitch = Number(cpi.pitch);
      newLiveBody.currentPitcherVsBatterCnt = Number(cpi.vsBatterCount);
      newLiveBody.currentPitcherEra = cpi.pitchERA;
    }
    
    newLiveBody.nextBatterName = nextBatter;
    newLiveBody.inningBatterCnt = inningBatterCnt;

    const { b, s, o } = ballCount;

    newLiveBody.prevCountBall = judgeIsBall(battingResult, b);
    newLiveBody.prevCountStrike = judgeIsStrike(battingResult, s);
    newLiveBody.prevCountOut = judgeIsOut(battingResult, pitchingResult, o);

    newLiveBody.isPa = judgePlateAppearance(battingResult, cbi ? cbi.name :  "");
    newLiveBody.isAb = judgeAtBat(battingResult, cbi ? cbi.name :  "");
    newLiveBody.isHit = judgeHit(battingResult);
    newLiveBody.isOnbase = judgeOnbase(battingResult);
    newLiveBody.isErr = judgeError(battingResult);
    newLiveBody.isFc = judgeFc(battingResult);
    newLiveBody.isChangePitcher = judgePlayerChange(battingResult, "継投");
    newLiveBody.isChangeFileder = judgePlayerChange(battingResult, "守備");
    newLiveBody.isChangeBatter = judgePlayerChange(battingResult, "代打");
    newLiveBody.isChangeRunner = judgePlayerChange(battingResult, "代走");

    await newLiveBody.save();
  }
}

/**
 * PitcherInfo 保存
 */
export const insertPitchInfo = async (
  gameInfoId: number, scene: number, pitchInfo: PitchInfoJson
): Promise<void> => {

  if (! pitchInfo) return;

  // about `pitch_info`
  const pitchInfoRepository = getRepository(PitchInfo);
  let savedPitchInfo = await pitchInfoRepository.findOne({ gameInfoId, scene });

  if (savedPitchInfo == null) {
    const newPitchInfo = new PitchInfo();

    newPitchInfo.gameInfoId = gameInfoId;
    newPitchInfo.scene = scene;

    await newPitchInfo.save();
    savedPitchInfo = await pitchInfoRepository.findOne({ gameInfoId, scene });
  }

  const pitchInfoId = savedPitchInfo.id;

  // about `pitcher_batter`
  const pbRepo = getRepository(PitcherBatter);
  let savedPitcherBatter = await pbRepo.findOne({ pitchInfoId });

  if (savedPitcherBatter == null) {
    const { left, right } = pitchInfo.gameResult;
    const newPitcherPatter = new PitcherBatter();

    newPitcherPatter.pitchInfoId = pitchInfoId;
    newPitcherPatter.leftTitle = left.title;
    newPitcherPatter.leftName = left.name;
    newPitcherPatter.leftDomainHand = left.domainHand;
    newPitcherPatter.rightTitle = right.title;
    newPitcherPatter.rightName = right.name;
    newPitcherPatter.rightDomainHand = right.domainHand;

    await newPitcherPatter.save();
  }

  // about `pitch_details`
  const pdRepo = getRepository(PitchDetails);
  let savedPitcherDetails = await pdRepo.findOne({ pitchInfoId });

  if (savedPitcherDetails == null) {
    pitchInfo.pitchDetails.forEach(async (detail: PitchDetail) => {
      const { judgeIcon, pitchCnt, pitchType, pitchSpeed, pitchJudgeDetail } = detail;

      const newPitchDetails = new PitchDetails();

      newPitchDetails.pitchInfoId = pitchInfoId;
      newPitchDetails.judgeIcon = Number(judgeIcon);
      newPitchDetails.pitchCnt = Number(pitchCnt);
      newPitchDetails.pitchType = pitchType;
      newPitchDetails.pitchSpeed = pitchSpeed;
      newPitchDetails.pitchJudgeDetail = pitchJudgeDetail;

      await newPitchDetails.save();
    });
  }

  // about `pitch_course`
  const pcRepo = getRepository(PitchCourse);
  let savedPitchCourse = await pcRepo.findOne({ pitchInfoId });

  if (savedPitchCourse == null) {
    pitchInfo.allPitchCourse.forEach(async (pitchCourse: PitchCourseType) => {
      const { top, left } = pitchCourse;
      const newPitchCourse = new PitchCourse();

      newPitchCourse.pitchInfoId = pitchInfoId;
      newPitchCourse.top = Number(top);
      newPitchCourse.left = Number(left);

      await newPitchCourse.save();
    })
  }
}

/**
 * 
 */
const insertTeamInfo = async (
  gameInfoId: number, scene: number, teamInfo: TeamInfoJson, homeAway: string
): Promise<void> => {

  if (! teamInfo) return;
  const { batteryInfo, homerunInfo, name } = teamInfo;
  // about `battery_info`
  let batteryInfoId = null;
  if (batteryInfo) {
    const [ pitcher, catcher ] = batteryInfo.split(" - ");
    const batteryInfoRepo = getRepository(BatteryInfo);
    let savedBatteryInfo = await batteryInfoRepo.findOne({ gameInfoId, pitcher, catcher });

    if (savedBatteryInfo == null) {
      const newRecord = new BatteryInfo();
      newRecord.gameInfoId = gameInfoId;
      newRecord.scene = scene;
      newRecord.pitcher = pitcher;
      newRecord.catcher = catcher;
      await newRecord.save();
      savedBatteryInfo = await batteryInfoRepo.findOne({ gameInfoId, pitcher, catcher });
    }

    batteryInfoId = savedBatteryInfo.id;
  }
  // about `homerun_info`
  let homerunInfoId = null;
  if (homerunInfo) {
    const homerunInfoRepo = getRepository(HomerunInfo);
    let savedHomerunInfo = await homerunInfoRepo.findOne({ gameInfoId, homerun: homerunInfo });

    if (savedHomerunInfo == null) {
      const newRecord = new HomerunInfo();
      newRecord.gameInfoId = gameInfoId;
      newRecord.scene = scene;
      newRecord.homerun = homerunInfo;
      await newRecord.save();
      savedHomerunInfo = await homerunInfoRepo.findOne({ gameInfoId, homerun: homerunInfo });
    }

    homerunInfoId = savedHomerunInfo.id;
  }
  // about `team_info`
  const teamInfoRepository = getRepository(TeamInfo);
  let savedTeamInfo = await teamInfoRepository.findOne({ gameInfoId, scene, homeAway });
  if (savedTeamInfo == null) {

    const newRecord = new TeamInfo();
    newRecord.gameInfoId = gameInfoId;
    newRecord.scene = scene;
    newRecord.homeAway = homeAway;
    newRecord.teamName = name;
    newRecord.batteryInfoId = batteryInfoId;
    newRecord.homerunInfoId = homerunInfoId;

    await newRecord.save();
    savedTeamInfo = await teamInfoRepository.findOne({ gameInfoId, scene });
  }

  const teamInfoId = savedTeamInfo.id;
  // about `game_order`
  const gameOrderRepo = getRepository(GameOrder);
  const savedGameOrder = await gameOrderRepo.find({ teamInfoId });
  if (savedGameOrder.length == 0) {
    teamInfo.order.forEach(async order => {
      const { no, position, name, domainHand, average } = order;

      const newRecord = new GameOrder();
      newRecord.teamInfoId = teamInfoId;
      newRecord.orderNo = Number(no);
      newRecord.position = position;
      newRecord.name = name;
      newRecord.domainHand = domainHand;
      newRecord.average = average;

      await newRecord.save();
    })
  }

  const { benchPitcher: p, benchCatcher: c, benchInfielder: i, benchOutfielder: o } = teamInfo;
  const currentMemberCount = p.length + c.length + i.length + o.length;
  // about `bench_master`
  const newRecordBenchMaster = new BenchMaster();
  newRecordBenchMaster.gameInfoId = gameInfoId;
  newRecordBenchMaster.scene = scene;
  newRecordBenchMaster.teamInfoId = teamInfoId;
  newRecordBenchMaster.teamName = name;
  newRecordBenchMaster.memberCount = currentMemberCount;
  await newRecordBenchMaster.save();

  // abount `bench_menber_info`
  // 直前のベンチ入り情報
  const benchMasterRepo = getRepository(BenchMaster);
  const prevBenchMaster = await benchMasterRepo.findOne({ gameInfoId, scene: scene - 1, teamName: name });
  // 初期保存 or ベンチ入り人数に変更があった場合のみ保存
  if (prevBenchMaster == null || currentMemberCount < prevBenchMaster.memberCount) {    
    const saveBenchMember = async (position: string, benchMember: BenchMemberInfoType) => {
      const { name, domainHand, average } = benchMember;
      const newRecord = new BenchMemberInfo();

      newRecord.teamInfoId = teamInfoId;
      newRecord.position = position;
      newRecord.playerName = name;
      newRecord.domainHand = domainHand;
      newRecord.average = average;

      await newRecord.save();
    }

    p.forEach(async member => { await saveBenchMember("投手", member); });
    c.forEach(async member => { await saveBenchMember("捕手", member); });
    i.forEach(async member => { await saveBenchMember("内野手", member); });
    o.forEach(async member => { await saveBenchMember("外野手", member); });
  }
}

/**
 * 
 */
export const insertHomeTeamInfo = async (
  gameInfoId: number, scene: number, homeTeamInfo: TeamInfoJson
): Promise<void> => {
  await insertTeamInfo(gameInfoId, scene, homeTeamInfo, "home");
}

/**
 * 
 */
export const insertAwayTeamInfo = async (
  gameInfoId: number, scene: number, awayTeamInfo: TeamInfoJson
): Promise<void> => {
  await insertTeamInfo(gameInfoId, scene, awayTeamInfo, "away");
}