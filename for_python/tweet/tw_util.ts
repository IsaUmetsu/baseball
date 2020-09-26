import * as twitterText from 'twitter-text';
import { client } from './twitter';
import * as yargs from 'yargs';
import * as moment from 'moment';
import { Tweet } from '../entities';
import { getRepository } from 'typeorm';

export const SC_RC5 = 'bat_rc5';
export const SC_PT = 'pitch_type';
export const SC_RC10 = 'pitch_rc10';
export const SC_PSG = 'pitch_strike_game';
export const SC_GFS = 'pitch_gf_start';

/**
 * 
 */
export const genTweetedDay = () => {
  return moment().format('YYYYMMDD');
}

/**
 * 
 */
export const findSavedTweeted = async (scriptName, team, tweetedDay) => {
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
