module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    author: {
      type: DataTypes.STRING
    },
    content: {
      type: DataTypes.TEXT
    }
  }, {
    classMethods: {
      associate: function(models) {
        Post.belongsTo(models.Causerie);
      }
    },
    freezeTableName: true
  });
  return Post;
};
