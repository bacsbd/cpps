const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const secret = require('world').secretModule.secret;
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

module.exports = {
  addSession(app) {
    app.use(cookieParser(secret));

    app.use(session({
      secret,
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 2 * 60 * 60,
        touchAfter: 2 * 3600
      })
    }));
  }
};
