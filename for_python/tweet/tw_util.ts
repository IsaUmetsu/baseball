import * as twitterText from 'twitter-text';
import { client } from './twitter';

/**
 * 
 */
export const tweet = async (title, rows, footer?) => {
  let mainContent = '';

  mainContent += title;
 
  rows.forEach(async row => {
    if (twitterText.parseTweet(mainContent + row).valid) {
      mainContent += row;
    } else {
      await doTweet(mainContent);
      mainContent = title; // reset
    }
  });

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
}

const doTweet = async status => {
  try {
    const tweet = await client.post('statuses/update', { status });
    console.log(tweet);
  } catch (err) {
    console.log(err);
  }
}
