var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var debug = require('debug')('causerie:server');
var http = require('http');
var models = require('./models');

var nunjucks = require('nunjucks');
var marked = require('marked');
var dateFormat = require('dateformat');

var passport = require('passport');

var causerie = require('./routes/causerie');
var causerieEdit = require('./routes/causerie-edit');
var index = require('./routes/index');
var login = require('./routes/login');

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
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.get('/causerie/:slug', causerie);
app.post('/causerie/:slug', causerie);
app.get('/causerie_add', causerieEdit);
app.post('/causerie_add', causerieEdit);
app.get('/login', login);
app.get('/login/:slug', login);
app.post('/login', login);
app.post('/login/:slug', login);

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

/**
 * Listen on provided port, on all network interfaces.
 */
var server = http.createServer(app);
var port = parseInt(process.env.PORT, 10) || 3000;
app.set('port', port);
models.sequelize.sync().then(function() {
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
});

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
