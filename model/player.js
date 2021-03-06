/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('player', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    profile_number: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    team: {
      type: DataTypes.STRING(3),
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
    tableName: 'player'
  });
};
