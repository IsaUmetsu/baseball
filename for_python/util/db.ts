import { getRepository, getManager, getConnection, Connection } from 'typeorm';

import { LiveHeaderJson, LiveBodyJson, PitchInfoJson, TeamInfoJson, BenchMemberInfoType, SavedBallCount } from '../type/jsonType';
import { GameInfo, LiveHeader, LiveBody, PitchInfo, PitchCourse, PitchDetails, PitcherBatter, TeamInfo, GameOrder, BenchMemberInfo, BenchMaster, BatteryInfo, HomerunInfo } from '../entities';
import { judgePlateAppearance, judgeAtBat, judgeHit, judgeOnbase, judgeError, judgeFc, judgePlayerChange, judgeIsBall, judgeIsStrike, judgePlusScore, judgePlusOutCount, calcTotalBase, indexOfAnd } from './liveBody';
import { teamNameHalfToIni, TOP, BTM, HM, AW } from '../constant';
import { createConnection } from 'typeorm';

/**
 * 
 */
export const generateConnection = async () => {
  let conn: Connection;
  try {
    conn = await createConnection('default');
  } catch (err) {
    if (err.name == 'AlreadyHasActiveConnectionError') {
      console.log('err')
      conn = await getConnection('default');
    }
  }
  return conn;
}

/**
 * 試合情報保存
 */
export const insertGameInfo = async (
  date: string, awayTeamInitial: string, homeTeamInitial: string, gameNo: string, isNoGame: boolean
): Promise<number> => {

  const gameInfoRepository = getRepository(GameInfo);

  let savedGameInfo = await gameInfoRepository.findOne({ date, awayTeamInitial, homeTeamInitial });

  if (savedGameInfo == null) {
    const gameInfo = new GameInfo();
    gameInfo.date = date;
    gameInfo.awayTeamInitial = awayTeamInitial;
    gameInfo.homeTeamInitial = homeTeamInitial;
    gameInfo.gameNo = gameNo;
    gameInfo.noGame = Number(isNoGame);

    await gameInfo.save();

    savedGameInfo = await gameInfoRepository.findOne({
      date, awayTeamInitial, homeTeamInitial
    });
  } else {
    // await savedGameInfo.save();
  }

  return savedGameInfo.id;
}

/**
 * LiveHeader 情報保存
 */
export const insertLiveHeader = async (
  gameInfoId: number, scene: number, liveHeader: LiveHeaderJson
) => {
  // イニング情報取得
  const getInningInfo = (inning: string) => {
    const splitInning = inning.split('回');

    let ingNum: number = Number(splitInning[0]);
    let ingTb: number = 0;

    if (splitInning[0] == '試合終了') ingNum = 99; // 試合終了時は 99 を設定
    if (splitInning[0] == '試合中止' || splitInning[0] == 'ノーゲーム' || splitInning[0] == '試合前') ingNum = 0; // その他は 0 を設定

    if (splitInning[1] == '表') ingTb = TOP;
    if (splitInning[1] == '裏') ingTb = BTM;

    return { ingNum, ingTb };
  }
  
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

    const { ingNum, ingTb } = getInningInfo(inning);
    newLiveHader.ingNum = ingNum;
    newLiveHader.ingTb = ingTb;

    newLiveHader.pTeam = ingTb == TOP ? home.teamInitial : ingTb == BTM ? away.teamInitial : null;
    newLiveHader.bTeam = ingTb == TOP ? away.teamInitial : ingTb == BTM ? home.teamInitial : null;

    await newLiveHader.save();
    savedLiveHeader = await liveHeaderRepository.findOne({ gameInfoId, scene });
  } else {
    const { inning, away, home, count } = liveHeader;

    const { ingNum, ingTb } = getInningInfo(inning);
    savedLiveHeader.ingNum = ingNum;
    savedLiveHeader.ingTb = ingTb;

    savedLiveHeader.pTeam = ingTb == TOP ? home.teamInitial : ingTb == BTM ? away.teamInitial : null;
    savedLiveHeader.bTeam = ingTb == TOP ? away.teamInitial : ingTb == BTM ? home.teamInitial : null;

    await savedLiveHeader.save();
  }

  let { countBall: b, countStrike: s, countOut: o, inning } = savedLiveHeader;
  const topBtm = inning.indexOf('表') > -1 ? TOP : inning.indexOf('裏') > -1 ? BTM : 0;

  return { ballCount: { b, s, o }, topBtm };
}

/**
 * LiveBody 情報保存
 */
export const insertLiveBody = async (
  gameInfoId: number,
  scene: number,
  liveBody: LiveBodyJson,
  ballCount: SavedBallCount,
  batteryInfo: string
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

    const isPa = judgePlateAppearance(battingResult, cbi ? cbi.name :  "");

    if (onbaseInfo) {
      for (const { base, player } of onbaseInfo) {
        if (base == "base1") newLiveBody.base1Player = player;
        if (base == "base2") newLiveBody.base2Player = player;
        if (base == "base3") newLiveBody.base3Player = player;
      }
    }

    if (cbi) {
      newLiveBody.currentBatterName = cbi.name;
      newLiveBody.currentBatterPlayerNo = cbi.playerNo;
      newLiveBody.currentBatterDomainHand = cbi.domainHand;
      newLiveBody.currentBatterAverage = cbi.average;
      newLiveBody.currentBatterAtBat = isPa ? (cbi.prevResult ? cbi.prevResult.split('、').length + 1 : 1) : null;
    }

    if (cpi) {
      newLiveBody.currentPitcherName = cpi.name;
      newLiveBody.currentPitcherPlayerNo = cpi.playerNo;
      newLiveBody.currentPitcherDomainHand = cpi.domainHand;
      newLiveBody.currentPitcherPitch = Number(cpi.pitch);
      newLiveBody.currentPitcherVsBatterCnt = Number(cpi.vsBatterCount);
      newLiveBody.currentPitcherEra = cpi.pitchERA;
      if (batteryInfo) {
        const [ pitcher ] = batteryInfo.split(" - ");
        newLiveBody.currentPitcherOrder = pitcher.split('、').length;
      }
    }

    newLiveBody.nextBatterName = nextBatter;
    newLiveBody.inningBatterCnt = inningBatterCnt;

    const { b, s, o } = ballCount;
    const plusOutCount = judgePlusOutCount(battingResult, pitchingResult);

    newLiveBody.prevCountBall = judgeIsBall(battingResult, b);
    newLiveBody.prevCountStrike = judgeIsStrike(battingResult, s);
    newLiveBody.prevCountOut = o - plusOutCount;

    newLiveBody.plusScore = judgePlusScore(battingResult);
    newLiveBody.plusOutCount = plusOutCount;

    newLiveBody.isPa = isPa;
    newLiveBody.isAb = judgeAtBat(battingResult, cbi ? cbi.name :  "");
    newLiveBody.isHit = judgeHit(battingResult);
    newLiveBody.isOnbase = judgeOnbase(battingResult);
    newLiveBody.isErr = judgeError(battingResult);
    newLiveBody.isFc = judgeFc(battingResult);
    newLiveBody.totalBase = calcTotalBase(battingResult);
    newLiveBody.isChangePitcher = judgePlayerChange(battingResult, "継投");
    newLiveBody.isChangeFileder = judgePlayerChange(battingResult, "守備");
    newLiveBody.isChangeBatter = judgePlayerChange(battingResult, "代打");
    newLiveBody.isChangeRunner = judgePlayerChange(battingResult, "代走");

    await newLiveBody.save();
  } else {
    // await savedLiveBody.save();
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
  let savedPitcherDetails = await pdRepo.find({ pitchInfoId });
  let pitchCnts = [];

  if (savedPitcherDetails == null || savedPitcherDetails.length == 0) {
    for (const detail of pitchInfo.pitchDetails) {
      const { judgeIcon, pitchCnt, pitchType, pitchSpeed, pitchJudgeDetail } = detail;

      const newPitchDetails = new PitchDetails();

      newPitchDetails.pitchInfoId = pitchInfoId;
      newPitchDetails.judgeIcon = Number(judgeIcon);
      newPitchDetails.pitchCnt = Number(pitchCnt);
      newPitchDetails.pitchType = pitchType;
      newPitchDetails.pitchSpeed = pitchSpeed;
      newPitchDetails.pitchJudgeDetail = pitchJudgeDetail;
      newPitchDetails.isSwing = Number(indexOfAnd(pitchJudgeDetail, ['空', '振']));
      newPitchDetails.isMissed = Number(pitchJudgeDetail.indexOf('見') > -1);

      await newPitchDetails.save();
      // update pitch_cnt array
      pitchCnts.push(Number(pitchCnt));
    }
  } else {
    // for (const savedPitcherDetail of savedPitcherDetails) {
    //   const detail = pitchInfo.pitchDetails.find(detail => Number(detail.pitchCnt) == savedPitcherDetail.pitchCnt);
    //   const { pitchJudgeDetail } = detail;
    //   await savedPitcherDetail.save();
    //   pitchCnts.push(Number(savedPitcherDetail.pitchCnt));
    // }
  }

  // about `pitch_course`
  const pcRepo = getRepository(PitchCourse);
  let savedPitchCourses = await pcRepo.find({ pitchInfoId });

  if (savedPitchCourses == null || savedPitchCourses.length == 0) {
    for (const idx in pitchInfo.allPitchCourse) {
      const { top, left } = pitchInfo.allPitchCourse[idx];
      const newPitchCourse = new PitchCourse();

      newPitchCourse.pitchInfoId = pitchInfoId;
      newPitchCourse.pitchCnt = pitchCnts[idx];
      newPitchCourse.top = Number(top);
      newPitchCourse.left = Number(left);

      await newPitchCourse.save();
    }
  } else {
    // for (const idx in savedPitchCourses) {
    //   savedPitchCourses[idx].pitchCnt = pitchCnts[idx];
    //   await savedPitchCourses[idx].save();
    // }
  }
}

/**
 * 
 */
const insertTeamInfo = async (
  gameInfoId: number, scene: number, teamInfo: TeamInfoJson, homeAway: string
): Promise<void> => {

  /**
   * 
   */
  const getCurrentPlayer = (allPlayers: string) => {
    const players = allPlayers.split('、');
    return players[players.length - 1];
  }

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
      newRecord.currentP = getCurrentPlayer(pitcher);
      newRecord.currentC = getCurrentPlayer(catcher);
      newRecord.pitcher = pitcher;
      newRecord.catcher = catcher;
      await newRecord.save();
      savedBatteryInfo = await batteryInfoRepo.findOne({ gameInfoId, pitcher, catcher });
    } else {
      // savedBatteryInfo.currentP = getCurrentPlayer(pitcher);
      // savedBatteryInfo.currentC = getCurrentPlayer(catcher);
      // await savedBatteryInfo.save();
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
    newRecord.teamInitialKana = teamNameHalfToIni[name];
    newRecord.batteryInfoId = batteryInfoId;
    newRecord.homerunInfoId = homerunInfoId;

    await newRecord.save();
    savedTeamInfo = await teamInfoRepository.findOne({ gameInfoId, scene });
  } else {
    // await savedTeamInfo.save();
  }

  const teamInfoId = savedTeamInfo.id;
  // about `game_order`
  const gameOrderRepo = getRepository(GameOrder);
  const savedGameOrder = await gameOrderRepo.find({ teamInfoId });
  if (savedGameOrder.length == 0) {
    for (const order of teamInfo.order) {
      const { no, position, name, domainHand, average } = order;

      const newRecord = new GameOrder();
      newRecord.teamInfoId = teamInfoId;
      newRecord.orderNo = Number(no);
      newRecord.position = position;
      newRecord.name = name;
      newRecord.domainHand = domainHand;
      newRecord.average = average;

      await newRecord.save();
    }
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

    for (const member of p) { await saveBenchMember("投手", member); }
    for (const member of c) { await saveBenchMember("捕手", member); }
    for (const member of i) { await saveBenchMember("内野手", member); }
    for (const member of o) { await saveBenchMember("外野手", member); }
  }
}

/**
 * 
 */
export const insertHomeTeamInfo = async (
  gameInfoId: number, scene: number, homeTeamInfo: TeamInfoJson
): Promise<void> => {
  await insertTeamInfo(gameInfoId, scene, homeTeamInfo, HM);
}

/**
 * 
 */
export const insertAwayTeamInfo = async (
  gameInfoId: number, scene: number, awayTeamInfo: TeamInfoJson
): Promise<void> => {
  await insertTeamInfo(gameInfoId, scene, awayTeamInfo, AW);
}

/**
 * 
 */
export const executeUpdatePlusOutCount = async (fromDate = '', toDate = '') => {

  const manager = await getManager();
  const results: any[] = await manager.query(`
    SELECT 
      lb_id,
      prev_count_out,
      after_count_out,
      plus_out_count,
      plus_out_count_new,
      after_count_out - plus_out_count_new AS prev_count_out_new
    FROM
      check_not_match_plus_out
    WHERE date BETWEEN '${fromDate}' AND '${toDate}'
  `);

  console.log(`----- update plus_out_count target count: ${results.length} -----`);

  for (const result of results) {
    const { lb_id, plus_out_count_new, prev_count_out_new } = result;

    await manager.query(`
      UPDATE
        live_body
      SET
        plus_out_count = ${plus_out_count_new},
        prev_count_out = ${prev_count_out_new}
      WHERE
        id = ${lb_id}
    `);
  }

  console.log('----- done!! -----');
}

/**
 * 
 */
export const isFinishedAllGame = async (day = ''): Promise<boolean> => {

  const manager = await getManager();
  const results: {is_finished: string}[] = await manager.query(`
    SELECT
      L.game_cnt = R.game_cnt AS is_finished
    FROM
      -- 開催試合数
      (
        SELECT
          date,
          COUNT(id) AS game_cnt
        FROM game_info
        WHERE date = '${day}' AND no_game = 0
        GROUP BY date
      ) AS L
      -- 終了試合数
      LEFT JOIN (
        SELECT
          date,
          COUNT(g_id) AS game_cnt
        FROM
          debug_base
        WHERE
          g_id IN (
            SELECT
              id
            FROM game_info
            WHERE date = '${day}' AND no_game = 0
          )
          AND batting_result LIKE '%試合%'
        GROUP BY date
      ) AS R ON L.date = R.date
  `);

  let result = false;
  if (results && results.length > 0) {
    const { is_finished } = results[0];
    result = Boolean(Number(is_finished));
  }
  return result;
}

/**
 * 
 */
export const isFinishedGame = async (team, day): Promise<boolean> => {

  const manager = await getManager();
  const results: {is_finished: string}[] = await manager.query(`
    SELECT 
      COUNT(id) > 0 AS is_finished
    FROM
      (SELECT 
          id
      FROM
          live_body
      WHERE
          game_info_id = (SELECT 
                  id
              FROM
                  game_info
              WHERE
                  (away_team_initial = '${team}' OR home_team_initial = '${team}')
          AND date = '${day}'
      )
      AND batting_result LIKE '%試合%'
    ) AS A
  `);

  let result = false;
  if (results && results.length > 0) {
    const { is_finished } = results[0];
    result = Boolean(Number(is_finished));
  }
  return result;
}

/**
 * 
 */
export const isFinishedGameByLeague = async (teams, day): Promise<boolean> => {

  const manager = await getManager();
  const results: {is_finished: string}[] = await manager.query(`
    SELECT
      L.game_cnt = R.game_cnt AS is_finished
    FROM
      -- 開催試合数
      (
        SELECT
          date,
          COUNT(id) AS game_cnt
        FROM
          game_info
        WHERE
          (
            away_team_initial IN ('${teams.join("', '")}') OR home_team_initial IN ('${teams.join("', '")}')
          )
          AND date = '${day}'
          AND no_game = 0
        GROUP BY
          date
      ) AS L
      -- 終了試合数
      LEFT JOIN (
        SELECT
          date,
          COUNT(g_id) AS game_cnt
        FROM
          debug_base
        WHERE
          g_id IN (
            SELECT
              id
            FROM
              game_info
            WHERE
              (
                away_team_initial IN ('${teams.join("', '")}') OR home_team_initial IN ('${teams.join("', '")}')
              )
              AND date = '${day}'
              AND no_game = 0
          )
          AND batting_result LIKE '%試合%'
        GROUP BY
          date
      ) AS R ON L.date = R.date
  `);

  let result = false;
  if (results && results.length > 0) {
    const { is_finished } = results[0];
    result = Boolean(Number(is_finished));
  }
  return result;
}

/**
 * 
 */
export const isFinishedGameById = async (gameInfoId): Promise<boolean> => {

  const manager = await getManager();
  const results: {is_finished: string}[] = await manager.query(`
    SELECT 
      COUNT(id) > 0 AS is_finished
    FROM
      (SELECT 
          id
      FROM
          live_body
      WHERE
          game_info_id = ${gameInfoId}
          AND batting_result LIKE '%試合%'
    ) AS A;
  `);

  let result = false;
  if (results && results.length > 0) {
    const { is_finished } = results[0];
    result = Boolean(Number(is_finished));
  }
  return result;
}

/**
 * 
 */
export const isLeftMoundStarterAllGame = async (day): Promise<boolean> => {

  const manager = await getManager();
  const results: { is_left: string }[] = await manager.query(`
    SELECT 
      L.cnt = R.cnt AS is_left
    FROM
      (SELECT 
          date, COUNT(id) * 2 AS cnt
      FROM
          game_info
      WHERE
          date = '${day}' AND no_game = 0
      GROUP BY date) AS L
          LEFT JOIN
      (SELECT 
          date, COUNT(p_team) AS cnt
      FROM
          baseball_2020.debug_stats_pitcher sp
      WHERE
          date = '${day}'
              AND (sp.order = 2
              OR (sp.order = 1 AND complete = 1))
      GROUP BY date) AS R ON L.date = R.date
  `);

  let result = false;
  if (results && results.length > 0) {
    const { is_left } = results[0];
    result = Boolean(Number(is_left));
  }
  return result;
}

/**
 * 
 */
export const isFinishedInningPitchStarterByTeam = async (day = '', team = '', ip = 0): Promise<boolean> => {

  const manager = await getManager();
  const results: { is_finished: string }[] = await manager.query(`
    SELECT 
      COUNT(sp.name) AS is_finished
    FROM
      baseball_2020.debug_stats_pitcher sp
    WHERE
      date = '${day}'
      AND ip >= ${ip}
      AND sp.order = 1
      AND p_team = '${team}'
  `);

  let result = false;
  if (results && results.length > 0) {
    const { is_finished } = results[0];
    result = Boolean(Number(is_finished));
  }
  return result;
}

/**
 * 
 */
export const isLeftMoundStarterByTeam = async (day = '', team = ''): Promise<boolean> => {

  const manager = await getManager();
  const results: { is_left: string }[] = await manager.query(`
    SELECT 
      COUNT(sp.name) AS is_left
    FROM
      baseball_2020.debug_stats_pitcher sp
    WHERE
      date = '${day}'
    AND (sp.order = 2 OR (sp.order = 1 AND complete = 1))
      AND p_team = '${team}'
  `);

  let result = false;
  if (results && results.length > 0) {
    const { is_left } = results[0];
    result = Boolean(Number(is_left));
  }
  return result;
}
