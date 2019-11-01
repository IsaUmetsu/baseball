/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('game_score_info', {
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
    top_bottom: {
      type: DataTypes.INTEGER(2),
      allowNull: false
    },
    inning_1: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    inning_2: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    inning_3: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    inning_4: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    inning_5: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    inning_6: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    inning_7: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    inning_8: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    inning_9: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    inning_10: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    inning_11: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    inning_12: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    total: {
      type: DataTypes.STRING(2),
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
    tableName: 'game_score_info'
  });
};
