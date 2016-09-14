const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');

require('./db/config.js');
app.use(
  require('morgan')('dev'),
  bodyParser.json(),
  bodyParser.urlencoded({extended: true}),
  passport.initialize(),
  passport.session(),
  require('express-session')({
    secret: 'juice juice',
    saveUninitialized: false,
    resave: true,
  }),
  express.static(`${__dirname}/../public`, {
    index: 'layout.html'
  }),
  require('./config/routes.js')
);

module.exports = app