module.exports = function(sequelize, DataTypes) {
	var Post = sequelize.define('Post', {
		author: {
			type: DataTypes.STRING
		},
		content: {
			type: DataTypes.TEXT
		},
		// Set Foreign Key with `Causerie`
		causerie_id: {
			type: DataTypes.STRING,
			references: "Causerie",
			referencesKey: "slug"
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
