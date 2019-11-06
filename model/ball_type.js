/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ball_type', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    ball_type: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updateAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'ball_type'
  });
};
