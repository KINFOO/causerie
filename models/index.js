var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
var confPath = path.normalize(path.join(__dirname, "../configuration/db.json"));
var config = require(confPath)[env];
var sequelize = new Sequelize(config.database, config.username, config.password,
  config);

var database = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize["import"](path.join(__dirname, file));
    database[model.name] = model;
  });

Object.keys(database).forEach(function(modelName) {
  if ("associate" in database[modelName]) {
    database[modelName].associate(database);
  }
});

database.Sequelize = Sequelize;
database.sequelize = sequelize;

module.exports = database;
