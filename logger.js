const log4js = require('log4js')

log4js.configure({
  appenders: { system: { type: 'file', filename: 'system.log' }},
  categories: { default: { appenders: ['system'], level: 'debug' } }
})

module.exports = log4js.getLogger()
