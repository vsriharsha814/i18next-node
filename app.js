var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



// i18next configuration
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
   fallbackLng: 'en',
   preload: ['en', 'tr'],
   ns:["common", "translation"],
   backend: {
     loadPath: './locales/{{lng}}/{{ns}}.json'
   }
  })



var app = express();

app.use(middleware.handle(i18next)); // code to use the i18next

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



// // simple get request for testing
// app.get('/getRequest/:name', function (req, res) {
//   res.send(req.t("key") + req.params.name)
// })


// Example of a post request
app.post('/postRequest', function(req, res) {
  res.send(req.t("slokey", { ns: 'common', lng: 'en'}))
  })




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
