var express = require('express');
var router = express.Router();

var models = require('../models');
var getSlug = require('speakingurl');

var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;
var widgets = forms.widgets;

router.get('/causerie_add', function(req, res) {
  res.render('causerie-edit', {
    form: causerieForm().toHTML(bootstrapField)
  });
});

router.post('/causerie_add', function(req, res) {
  // Validate form
  cform = causerieForm(req.body);
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
      causerieFormOnError(form, res);
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

// Provide boot strap look to generated form
var bootstrapField = function(name, object) {
  object.widget.classes = object.widget.classes || [];
  object.widget.classes.push('form-control');

  var label = object.labelHTML(name);
  var error = object.error ? '<div class="alert alert-error help-block">' +
    object.error + '</div>' : '';

  var validationclass = object.value && !object.error ? 'has-success' : '';
  validationclass = object.error ? 'has-error' : validationclass;

  var widget = object.widget.toHTML(name, object);
  return '<div class="form-group ' + validationclass + '">' + label + widget +
    error + '</div>';
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
