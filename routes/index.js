var express = require('express');
var router = express.Router();
var models = require('../models');

// Home page
router.get('/', function(req, res, next) {
	models.Causerie.findAll({
		include: [models.Post]
	}).then(function(causeries) {
		res.render('index', {
			causeries: causeries
		});
	});
});

module.exports = router;
