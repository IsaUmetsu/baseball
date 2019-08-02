const db = require('../db')
const DataTypes = require('sequelize').DataTypes

const orderOverview = require('./order_overview')(db, DataTypes)
const orderDetails = require('./order_detail')(db, DataTypes)
const gameInfo = require('./game_info')(db, DataTypes)
const player = require('./player')(db, DataTypes)

module.exports = {
  db,
  orderOverview,
  orderDetails,
  gameInfo,
  player
}