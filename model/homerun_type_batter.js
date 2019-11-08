/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('homerun_type_batter', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    homerun_type: {
      type: DataTypes.STRING(4),
      allowNull: false,
      defaultValue: ''
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    team: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    cnt: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: '0'
    },
    summary: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    summary_all: {
      type: DataTypes.STRING(47),
      allowNull: true
    },
    total_cnt: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    percent: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    tableName: 'homerun_type_batter'
  });
};
