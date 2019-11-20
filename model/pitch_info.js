/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pitch_info', {
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
    batter_pitch_count: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    col_1: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    col_2: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    col_3: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    col_4: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    col_5: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    speed: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    col_7: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    result: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    col_9: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    total_batter_count: {
      type: DataTypes.INTEGER(6),
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
    tableName: 'pitch_info'
  });
};
