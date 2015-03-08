var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// Facebook
var graph = require('fbgraph');
var token = require('./tokens');
graph.setAccessToken(token.fb.token);


//*MongoDB
var mongo = require('mongoskin');
var db = mongo.db("mongodb://<USER:PASS>@ds053251.mongolab.com:53251/hakmof", [
  "scraped_data", "trends_data"
]);


var routes = require('./routes/index');
var feed = require('./routes/feed');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// *Make our db accessible to our router
app.use(function(req, res, next) {
  req.db = db;
  next();
});


// Facebook Graph Calls to Periodically Collect Data
setInterval(function() {
  graph
    .get("1553840998179517/posts", function(err, res) {
      //console.log(res); // { id: '4', name: 'Mark Zuckerberg'... }
    });
}, 5000);


// *Make our db accessible to our router
app.use(function(req, res, next) {
  req.db = db;
  next();
});

app.use('/', routes);
app.use('/feed', feed);


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
