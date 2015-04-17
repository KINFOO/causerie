var express = require('express');
var router = express.Router();

var models = require('../models');

var forms = require('forms');
var fields = forms.fields;
var widgets = forms.widgets;

var bootstrapField = require('../utils/bootstrapField');

router.get('/causerie/:slug', function(req, res) {
  models.Causerie.find({
    where: {
      slug: req.params.slug
    }
  }).then(function(causerie) {

    // Wrong causerie slug
    if (!causerie) {
      res.redirect('/');
    }
    // All good
    res.render('causerie', {
      causerie: causerie,
      postForm: postForm().toHTML(bootstrapField)
    });
  });
});

router.post('/causerie/:slug', function(req, res) {});

// Define form accordingly to model
var postForm = function(values) {
  var pform = forms.create({
    author: fields.string({
      value: values ? values.author : null,
      placeholder: 'Your name',
      errorAfterField: true,
      widget: widgets.text({
        classes: ['input-lg']
      })
    }),
    content: fields.string({
      required: true,
      value: values ? values.content : null,
      errorAfterField: true,
      widget: widgets.textarea()
    })
  });
  return pform;
};

module.exports = router;
