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
    col_1: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    col_2: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    col_3: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    col_4: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    col_5: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    col_6: {
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
    tableName: 'TR_info'
  });
};
