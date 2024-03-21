import { AppDataSource } from '../util/datasource';
import { getIsTweet } from '../util/tweet';
import { execDayTeamEra, execMonthTeamEra, execWeekTeamEra } from '../util/execute';
import { getIsDevide } from '../util/display';

/**
 * Execute
 * 
 * (リーグ) M月 防御率
 * 全体 先発 中継ぎ
 */
(async () => {
  await AppDataSource.initialize();
  const { PR, LG, P, M, D } = process.env;

  if (PR == 'D') await execDayTeamEra(getIsTweet(), getIsDevide(), LG, P, D);
  if (PR == 'W') await execWeekTeamEra(getIsTweet(), getIsDevide(), LG, P, D);
  if (PR == 'M') await execMonthTeamEra(getIsTweet(), getIsDevide(), LG, P, M);
})();
