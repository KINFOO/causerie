var express = require('express');
var router = express.Router();

var forms = require('forms');
var fields = forms.fields;
var widgets = forms.widgets;

var bootstrapField = require('../utils/bootstrapField');

router.get('/login', function(req, res) {
  renderGet(res, null);
});

router.get('/login/:slug', function(req, res) {
  renderGet(res, req.params.slug);
});

router.post('/login', function(req, res) {
  renderPost(res, req);
});

router.post('/login/:slug', function(req, res) {
  renderPost(res, req);
});

var renderGet = function(response, causerieSlug) {
  response.render('login', {
    causerieSlug: causerieSlug,
    form: loginForm().toHTML(bootstrapField)
  });
};

var renderPost = function(response, request) {
  // Validate form
  var lform = loginForm(request.body);
  lform.handle(request, {
    success: function(form) {
      console.log(form.data.login);
      console.log(form.data.password);
      if (request.params.slug) {
        response.redirect('/causerie/' + request.params.slug);
      } else {
        response.redirect('/');
      }
    },
    error: function(form) {
      return response.render('login', {
        causerieSlug: request.params.slug,
        error: form.fields.login.errorHTML() + form.fields.password.errorHTML(),
        form: lform.toHTML(bootstrapField)
      });
    }
  });
};

var loginForm = function(values) {
  var lform = forms.create({
    login: fields.string({
      required: true,
      value: values ? values.login : null,
      placeholder: 'login',
      errorAfterField: true,
      widget: widgets.text({
        classes: ['input-lg']
      })
    }),
    password: fields.password({
      required: true,
      errorAfterField: true,
      widget: widgets.password({
        classes: ['input-lg']
      })
    })
  });
  return lform;
};
module.exports = router;
