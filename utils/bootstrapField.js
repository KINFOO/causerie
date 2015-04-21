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

module.exports = bootstrapField;
