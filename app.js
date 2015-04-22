var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var nunjucks = require('nunjucks');
var marked = require('marked');
var dateFormat = require('dateformat');

var index = require('./routes/index');
var causerie = require('./routes/causerie');
var causerieEdit = require('./routes/causerie-edit');

var app = express();

// view engine setup
app.set('view engine', 'html');
var env = nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// add markdown filter
env.addFilter('markdown', marked);

// date filter
env.addFilter('date', function(timestamp) {
  return dateFormat(new Date(timestamp), 'yyyy-mm-dd hh:MM:ss');
});

// Favicon
app.use(favicon(path.join(__dirname, 'public', 'img', 'causerie.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use('/', index);
app.get('/causerie/:slug', causerie);
app.post('/causerie/:slug', causerie);
app.get('/causerie_add', causerieEdit);
app.post('/causerie_add', causerieEdit);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
