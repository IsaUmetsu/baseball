import { format } from 'util';
import * as twitter from "twitter-text";

/**
 * 
 */
export const trimRateZero = rate => {
  return Number(rate) < 1 ? String(rate).slice(1) : rate;
}

/**
 * 
 */
export const displayResult = (title, rows, footer?) => {
  const mainContents = [];
  let mainContent = "";

  mainContent += title;
  
  rows.forEach(row => {
    if (twitter.parseTweet(mainContent + row).valid) {
      mainContent += row;
    } else {
      mainContents.push(mainContent);
      mainContent = title; // reset
    }
  });
  mainContents.push(mainContent);

  if (footer) mainContents.push(footer);

  // display
  mainContents.forEach(text => {
    console.log("--------------------\n\n%s\n", text);
  })
}
