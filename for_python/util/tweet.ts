import * as twitterText from 'twitter-text';
import { client } from '../tweet/twitter';
import * as yargs from 'yargs';
import * as moment from 'moment';
import { Tweet } from '../entities';
import { getRepository } from 'typeorm';
import { format } from 'util';

export const MSG_S = '----- [done] date: [%s], team: [%s], script: [%s] -----';
export const MSG_F = '----- date: [%s], team: [%s], script: [%s], not tweeted because: [%s] -----';

export const SC_RC5T = 'bat_rc5_team';
export const SC_RC5A = 'bat_rc5_all';
export const SC_RC5N = 'bat_rc5_npb';
export const SC_BRC5A = 'onbase_rc5_all';
export const SC_BRC5N = 'onbase_rc5_npb';
export const SC_ORC5A = 'ops_rc5_all';
export const SC_ORC5N = 'ops_rc5_npb';
export const SC_DBT= 'day_bat_team';
export const SC_DBC= 'day_of_week_bat_champ';
export const SC_DBCN= 'day_of_week_bat_champ_npb';
export const SC_DS= 'day_of_week_stand';
export const SC_DTE = 'day_team_era';
export const SC_DTED = 'day_team_era_div';
export const SC_DLOB = 'day_left_on_base';
export const SC_PT = 'pitch_type';
export const SC_PC = 'pitch_course';
export const SC_RC10 = 'pitch_rc10';
export const SC_RC10N = 'pitch_rc10_npb';
export const SC_PSG = 'pitch_strike_game';
export const SC_GFS = 'pitch_gf_start';
export const SC_POS = 'pitch_per_out';
export const SC_PRS= 'pitch_ra_start';
export const SC_MBC= 'month_bat_champ';
export const SC_MS= 'month_stand';
export const SC_MT= 'month_title';
export const SC_MTED = 'month_team_era_div';
export const SC_MTE = 'month_team_era';
export const SC_WBC= 'week_bat_champ';
export const SC_WBT= 'week_bat_team';
export const SC_WS= 'week_stand';
export const SC_WTE = 'week_team_era';
export const SC_WTED = 'week_team_era_div';

/**
 * 
 */
export const genTweetedDay = () => {
  return moment().format('YYYYMMDD');
}

/**
 * 
 */
export const findSavedTweeted = async (scriptName, team, tweetedDay = genTweetedDay()) => {
  return await getRepository(Tweet).findOne({ scriptName, team, tweetedDay });
}

/**
 * 
 */
export const saveTweeted = async (scriptName, team, tweetedDay) => {
  const newTweet = new Tweet();
  newTweet.scriptName = scriptName;
  newTweet.team = team;
  newTweet.tweetedDay = tweetedDay;

  await newTweet.save()
}

/**
 * 
 */
export const getIsTweet = () => {
  return yargs.count('team').alias('t', 'tweet').argv.tweet > 0;
}

/**
 * 
 */
export const getIsScoringPos = () => {
  return yargs.count('scoring').alias('s', 'scoring').argv.scoring > 0;
}

/**
 * 
 */
export const tweet = async (title: string, rows: string[], footer?: string) => {
  let mainContent = '';

  mainContent += title;
 
  for (const row of rows) {
    if (twitterText.parseTweet(mainContent + row).valid) {
      mainContent += row;
    } else {
      await doTweet(mainContent);
      mainContent = title + row; // reset and join row
    }
  }

  if (footer) {
    if (twitterText.parseTweet(mainContent + footer).valid) {
      await doTweet(mainContent + footer);
    } else {
      await doTweet(mainContent);
      await doTweet(footer);
    }
  } else {
    await doTweet(mainContent);
  }

  console.log('---------- done!!! ----------');
}

/**
 * 
 */
const doTweet = async status => {
  let res = '';
  try {
    const tweet = await client.post('statuses/update', { status });
    res = tweet.id_str;
    console.log('---------- tweeted ----------');
  } catch (err) {
    console.log(err);
  }
  return res;
}



/**
 * 
 */
export const tweetMulti = async (title: string, rows: string[], footer?: string) => {
  let in_reply_to_status_id = '';
  let mainContent = '';

  mainContent += title;
 
  for (let idx in rows) {
    const row = rows[idx];
    if (twitterText.parseTweet(mainContent + row).valid) {
      mainContent += row;
    } else {
      in_reply_to_status_id = await doTweetMulti(mainContent, in_reply_to_status_id);
      mainContent = title + row; // reset and join row
    }
  }

  if (footer) {
    if (twitterText.parseTweet(mainContent + footer).valid) {
      await doTweetMulti(mainContent + footer, in_reply_to_status_id);
    } else {
      in_reply_to_status_id = await doTweetMulti(mainContent, in_reply_to_status_id);
      await doTweetMulti(footer, in_reply_to_status_id);
    }
  } else {
    await doTweetMulti(mainContent, in_reply_to_status_id);
  }

  console.log('---------- done!!! ----------');
}

/**
 * 
 */
const doTweetMulti = async (status, in_reply_to_status_id) => {
  let res = '';
  try {
    // console.log(status)
    const { id_str } = await client.post('statuses/update', { status, in_reply_to_status_id });
    res = id_str;
    console.log('---------- tweeted ----------');
  } catch (err) {
    console.log(err);
  }
  return res;
}

/**
 * 
 */
export const outputLogStart = msg => {
  const currentDatetime = moment().format('YYYY/MM/DD HH:mm:ss');
  console.log(format('\n\n ----- START [%s] at %s -----', msg, currentDatetime));
}

/**
 * 
 */
export const outputLogEnd = msg => {
  const currentDatetime = moment().format('YYYY/MM/DD HH:mm:ss');
  console.log(format('----- END [%s] at %s -----', msg, currentDatetime));
}