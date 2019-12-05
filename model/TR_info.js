/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TR_info', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    game_info_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    order_overview_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    b_bat: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    b_hit: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    b_err: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    t_bat: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    t_hit: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    t_err: {
      type: DataTypes.INTEGER(4),
      allowNull: true
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
    tableName: 'TR_info'
  });
};
