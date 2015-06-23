var express = require('express');
var router = express.Router();

var models = require('../models');
var getSlug = require('speakingurl');

var forms = require('forms');
var fields = forms.fields;
var widgets = forms.widgets;

var bootstrapField = require('../utils/bootstrapField');

router.get('/causerie_add', function(req, res) {
  res.render('causerie-edit', {
    form: causerieForm().toHTML(bootstrapField)
  });
});

router.post('/causerie_add', function(req, res) {
  // Validate form
  var cform = causerieForm(req.body);
  cform.handle(req, {
    success: function(form) {
      // Save Causerie
      models.Causerie.create({
        slug: getSlug(form.data.title),
        title: form.data.title,
        description: form.data.description
      }).catch(function(error) {
        causerieFormOnError(cform, res, error);
      }).then(function() {
        // All good
        res.redirect('/');
      });
    },
    error: function(form) {
      causerieFormOnError(cform, res);
    }
  });
});

// Define form accordingly to model
var causerieForm = function(values) {
  var cform = forms.create({
    title: fields.string({
      required: true,
      value: values ? values.title : null,
      placeholder: 'Title',
      errorAfterField: true,
      widget: widgets.text({
        classes: ['input-lg']
      })
    }),
    description: fields.string({
      required: true,
      value: values ? values.description : null,
      errorAfterField: true,
      widget: widgets.textarea()
    })
  });
  return cform;
};

// Handle all kind of form errors
var causerieFormOnError = function(form, res, error) {
  var errorHTML = (error || '') + form.fields.title.errorHTML() +
    form.fields.description.errorHTML();
  res.render('causerie-edit', {
    error: errorHTML,
    form: form.toHTML(bootstrapField)
  });
};

module.exports = router;
