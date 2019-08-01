const db = require('../db')
const DataTypes = require('sequelize').DataTypes

const orderOverview = require('./order_overview')(db, DataTypes)
const orderDetails = require('./order_detail')(db, DataTypes)

module.exports = {
  orderOverview,
  orderDetails
}