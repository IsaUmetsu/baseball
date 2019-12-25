'use strict';

const cron = require('node-cron');
const { spawn } = require('child_process');
const fs = require('fs');



cron.schedule('24 * * * * ', () => {
    const files = fs.readdirSync("./tweet").filter(file => file.split(".")[1] == "js")
    const targetFile = files[Math.floor(Math.random() * files.length)];

    const child = spawn("node", [`./tweet/${targetFile}`, "-x"]);

    child.on('exit', (code) => {
        console.log(`Child process exited with code ${code}`);
    });
    child.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    child.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
})