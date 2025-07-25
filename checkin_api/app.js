require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const logger = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const errorHandler = require('./app/middlewares/errorHandler');

const app = express();

if (process.env.NODE_ENV === 'ngrok') {
  app.set('trust proxy', 1);
}

if (!fs.existsSync('./logs')) {
  fs.mkdirSync('./logs');
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let corsOrigin;
if (process.env.NODE_ENV === 'ngrok') {
  corsOrigin = process.env.CORS_NGROK_URL;
} else if (process.env.NODE_ENV === 'development') {
  corsOrigin = process.env.CORS_ORIGIN_URL;
} else {
  corsOrigin = 'http://localhost:8081';
}

app.use(
  cors({
    origin: corsOrigin,
    //allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    //exposedHeaders: ['Set-Cookie'],
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
      secure: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'ngrok',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'ngrok' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// db
const db = require('./app/models');

/*db.sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database');
  });*/

if (process.env.NODE_ENV !== 'test') {
  db.sequelize
    .sync()
    .then(() => {
      console.log('Synced db.');
    })
    .catch(err => {
      console.log('Failed to sync db: ' + err.message);
    });
}
// drop the table if it already exists
/*
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});
*/

require('./app/routes')(app);

app.use(errorHandler);
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 8080;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });
}

module.exports = app;
