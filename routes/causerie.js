var express = require('express');
var router = express.Router();

var models = require('../models');

var forms = require('forms');
var fields = forms.fields;
var widgets = forms.widgets;

var bootstrapField = require('../utils/bootstrapField');

router.get('/causerie/:slug', function(req, res) {
  withCauserie(req.params.slug, function(causerie) {

    // Wrong causerie slug
    if (!causerie) {
      res.redirect('/');
    }

    // All good
    withPosts(req.params.slug, function(posts) {
      res.render('causerie', {
        causerie: causerie,
        posts: posts,
        form: postForm().toHTML(bootstrapField)
      });
    });
  });
});

router.post('/causerie/:slug', function(req, res) {
  withCauserie(req.params.slug, function(causerie) {

    // Validate form
    pform = postForm(req.body);
    pform.handle(req, {
      success: function(form) {
        // Save Causerie
        models.Post.create({
          author: form.data.author || null,
          content: form.data.content,
          causerie_id: causerie.slug
        }).catch(function(error) {
          postFormError(pform, res, error);
        }).then(function(post) {
          // All good
          withPosts(causerie.slug, function(posts) {
            res.render('causerie', {
              causerie: causerie,
              posts: posts,
              form: pform.toHTML(bootstrapField)
            });
          });
        });
      },
      error: function(form) {
        postFormError(form, res);
      }
    });

  });
});

var withCauserie = function(slug, func) {
  models.Causerie.find({
    where: {
      slug: slug
    }
  }).then(function(causerie) {
    func(causerie);
  });
};

var withPosts = function(slug, func) {
  models.Post.findAll({
    where: {
      causerie_id: slug
    }
  }).then(function(posts) {
    func(posts);
  });
};

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

var postFormError = function(form, res, error) {
  var errorHTML = (error || '') + form.fields.content.errorHTML();
  res.render('causerie', {
    error: errorHTML,
    form: form.toHTML(bootstrapField)
  });
};

module.exports = router;
