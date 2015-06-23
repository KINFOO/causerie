var express = require('express');
var router = express.Router();
var models = require('../models');

// Home page
router.get('/', function(req, res, next) {
  models.Causerie.findAll({
    include: [models.Post],
    order: [
      // Showing Causerie with fresh Posts first
      [models.Post, 'createdAt', 'DESC']
    ]
  }).then(function(causeries) {
    res.render('index', {
      causeries: causeries
    });
  });
});

module.exports = router;