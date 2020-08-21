import { getRepository } from 'typeorm';

import { GameInfo } from './entities/GameInfo';
import { LiveHeader } from './entities/LiveHeader';

/**
 * 試合情報保存
 */
export async function insertGameInfo (
  date: string, awayTeamInitial: string, homeTeamInitial: string
): Promise<number> {

  const gameInfoRepository = getRepository(GameInfo);

  let savedGameInfo = await gameInfoRepository.findOne({
    date, awayTeamInitial, homeTeamInitial
  });

  if (savedGameInfo == null) {
    const gameInfo = new GameInfo();
    gameInfo.date = date;
    gameInfo.awayTeamInitial = awayTeamInitial;
    gameInfo.homeTeamInitial = homeTeamInitial;

    await gameInfo.save();

    savedGameInfo = await gameInfoRepository.findOne({
      date, awayTeamInitial, homeTeamInitial
    });
  }

  return savedGameInfo.id;
}

export const insertLiveHeader = async (
  gameInfoId: number, scene: number, liveHeader: any
): Promise<void> => {
  
  const liveHeaderRepository = getRepository(LiveHeader);

  let savedLiveHeader = await liveHeaderRepository.findOne({
    gameInfoId, scene
  });

  if (savedLiveHeader == null) {
    const { away, home, count } = liveHeader;
    const newLiveHader = new LiveHeader();

    newLiveHader.gameInfoId = gameInfoId;
    newLiveHader.scene = scene;
    newLiveHader.inning = liveHeader.inning;
    newLiveHader.awayInitial = away.teamInitial;
    newLiveHader.awayScore = away.currentScore;
    newLiveHader.homeInitial = home.teamInitial;
    newLiveHader.homeScore = home.currentScore;
    newLiveHader.countBall = count.b;
    newLiveHader.countStrike = count.s;
    newLiveHader.countOut = count.o;

    await newLiveHader.save()
    savedLiveHeader = await liveHeaderRepository.findOne({
      gameInfoId, scene
    });
  }
}

export const insertLiveBody = async (
  gameInfoId: number, scene: number, liveBody: any
): Promise<void> => {
  //
}

export const insertPitchInfo = async (
  gameInfoId: number, scene: number, pitchInfo: any
): Promise<void> => {
  //
}

export const insertHomeTeamInfo = async (
  gameInfoId: number, scene: number, homeTeamInfo: any
): Promise<void> => {
  //
}

export const insertAwayTeamInfo = async (
  gameInfoId: number, scene: number, awayTeamInfo: any
): Promise<void> => {
  //
}