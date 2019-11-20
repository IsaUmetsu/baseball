/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('game_info', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    order_overview_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    pitch_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    ining: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    top_bottom: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    pitcher: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    unkcol_4: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    unkcol_5: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    batter: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    LR: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    strike: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    ball: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    out: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    aft_s: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    aft_b: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    aft_o: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    on_all_base: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    runner_1b: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    next_1b_go: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    runner_2b: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    next_2b_go: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    runner_3b: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    next_3b_go: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    unkcol_21: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    game_datetime: {
      type: DataTypes.STRING(10),
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
    tableName: 'game_info'
  });
};
