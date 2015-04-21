module.exports = function(sequelize, DataTypes) {
  var Causerie = sequelize.define('Causerie', {
    slug: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        Causerie.hasMany(models.Post);
      }
    }
  });
  return Causerie;
};
