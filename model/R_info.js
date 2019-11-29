/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('R_info', {
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
    is_commit: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    rst_id: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    result: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    direction: {
      type: DataTypes.STRING(2),
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
    pickoff_base: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    pickoff: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    ball_flow: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    s_col_1: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    s_col_2: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    s_col_3: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    s_col_4: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    s_col_5: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    o_col_1: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    o_col_2: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    o_col_3: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    o_col_4: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    o_col_5: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    ps_col_1: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    ps_col_2: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    ps_col_3: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    ps_col_4: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    ps_col_5: {
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
    tableName: 'R_info'
  });
};
