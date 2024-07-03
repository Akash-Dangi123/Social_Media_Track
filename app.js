var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


/////////////////////////// start from here ///////////////////////////////////////

var passport =  require("passport");
var users = require('./routes/users');
var expressSession = require("express-session");

//////////////////////////////////  end here////////////////////////////////////////

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

///////////////////////////start from here ///////////////////////////////////////

app.use(expressSession(({     // express session ke ander user ki sari detail rehti h
  resave: false,
  saveUninitialized: false,
  secret: "sarahah sarahah"
})))

app.use(passport.initialize());   // passport ko chalu kar rhi h
app.use(passport.session())    //for use 
passport.serializeUser(users.serializeUser());    //for store
passport.deserializeUser(users.deserializeUser());    //for access

//////////////////////////////////  end here////////////////////////////////////////

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
