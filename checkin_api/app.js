require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const errorHandler = require('./app/middlewares/errorHandler');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: `${process.env.CORS_ORIGIN_URL}` || 'http://localhost:8081',
    credentials: true,
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    name: 'sessionId',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true, // 자바스크립트에서 쿠키 접근 방지 (XSS 방어)
      sameSite: 'lax', // CSRF 보호 강화
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// db
const db = require('./app/models');

db.sequelize
  .sync()
  .then(() => {
    console.log('Synced db.');
  })
  .catch(err => {
    console.log('Failed to sync db: ' + err.message);
  });

// drop the table if it already exists
/*
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});
*/

require('./app/routes')(app);

app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

module.exports = app;
