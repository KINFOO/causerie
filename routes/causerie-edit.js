var express = require('express');
var router = express.Router();
var models = require('../models');
var getSlug = require('speakingurl');

router.get('/causerie_add', function(req, res) {
	res.render('causerie-edit');
});

router.post('/causerie_add', function(req, res) {
	models.Causerie.create({
		slug: getSlug(req.body.title),
		title: req.body.title,
		description: req.body.description
	}).catch(function(error) {
		res.render('causerie-edit', {
			error: error
		});
	}).then(function() {
		res.redirect('/');
	});
});

module.exports = router;
