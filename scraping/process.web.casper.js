var casper = require('casper').create()
var fs     = require('fs');
var $      = require('jquery');
casper.start("https://baseball.yahoo.co.jp/npb/")
// casper.viewport(1280, 768)

(async function() {
  await casper.then(function() {
    // this.capture('nikkan.png');
    var t1 = this.getHTML()
    fs.write("./01_baseball-top.html", t1)

    this.click('#subnav ul li a[data-rapid_p="2"]')
  })

  await casper.then(function() {
    this.capture('02_yahoo-schedule.png')
    var t2 = this.getHTML()
    fs.write("./02_schedule.html", t2)
  })

  await casper.run();
})()


