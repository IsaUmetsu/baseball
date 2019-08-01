/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_overview', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    team: {
      type: DataTypes.STRING(2),
      allowNull: false
    }
  }, {
    tableName: 'order_overview'
  });
};
