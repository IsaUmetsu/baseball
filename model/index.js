const db = require('../db')
const DataTypes = require('sequelize').DataTypes

const orderOverview = require('./order_overview')(db, DataTypes)
const orderDetails = require('./order_detail')(db, DataTypes)
const gameInfo = require('./game_info')(db, DataTypes)
const gameScoreInfo = require("./game_score_info")(db, DataTypes)
const player = require('./player')(db, DataTypes)
const pitchInfo = require('./pitch_info')(db, DataTypes)
const RInfo = require('./R_info')(db, DataTypes)
const TRInfo = require('./TR_info')(db, DataTypes)
const homerunTypeB = require('./homerun_type_batter')(db, DataTypes)

module.exports = {
  db,
  orderOverview,
  orderDetails,
  gameInfo,
  gameScoreInfo,
  player,
  pitchInfo,
  RInfo,
  TRInfo,
  homerunTypeB
}