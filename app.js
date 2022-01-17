var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var catalogRouter = require('./routes/cafe');  //Import routes for "catalog" area of site
var compression = require('compression');
var helmet = require('helmet');

var app = express();

app.use(helmet());

//Устанавливаем соединение с mongoose
var mongoose = require('mongoose');
//var dev_db_url = 'mongodb+srv://waverma:92I7vB07vmwQvms5@cafe.zlank.mongodb.net'
var mongoDB = process.env.MONGODB_URI
//var mongoDB = process.env.MONGODB_URI || dev_db_url


mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



app.use(compression()); 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static('public'))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/cafe', catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
