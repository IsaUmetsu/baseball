"use strict";

const cron = require("node-cron");
const { spawn } = require("child_process");
const fs = require("fs");
const moment = require("moment");

const cronSetting = " */15 12,19,20,21,22 * * * ";

cron.schedule(cronSetting, () => {
  // jsファイルのみ抽出してランダムで1つのファイルを選択する
  const files = fs
    .readdirSync("C:/Users/Umetsu/Documents/avinton/baseball/tweet")
    .filter(file => file.split(".")[1] == "js");
  const targetFile = files[Math.floor(Math.random() * files.length)];
  // 実行プロセス生成
  const child = spawn("node", [
    `C:/Users/Umetsu/Documents/avinton/baseball/tweet/${targetFile}`,
    "-x",
    "-t"
  ]);
  console.log(`[start]: ${moment().format("YYYY-MM-DD HH:mm:ss")}`);
  console.log(`--------------------------------------------------`);
  // イベント設定
  child.on("exit", code => {
    console.log(`Child process exited with code ${code}`);
  });
  child.stdout.on("data", data => {
    console.log(`stdout: ${data}`);
  });
  child.stderr.on("data", data => {
    console.log(`stderr: ${data}`);
  });
  console.log(`--------------------------------------------------`);
});
