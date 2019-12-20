/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_detail', {
    order_overview_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    top_bottom: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      primaryKey: true
    },
    pitch_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    batting_order: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      primaryKey: true
    },
    player: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    pos: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    profile_number: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    player_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'order_detail'
  });
};
