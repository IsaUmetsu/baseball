/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_detail', {
    order_overview_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'order_overview',
        key: 'id'
      }
    },
    pitch_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    batting_order: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    player_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    pos_id: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    profile_number: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    player_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'order_detail'
  });
};
