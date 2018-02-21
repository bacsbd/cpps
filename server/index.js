const express = require('express');
const world = require('world');
const path = require('path');
const bodyParser = require('body-parser');
const recaptcha = require('express-recaptcha');
const app = express();
const server = require('http').createServer(app);
const rootPath = world.rootPath;
const secret = require('world').secretModule;
const morgan = require('morgan');

const clientBuild = path.join(rootPath, '../client/build');

app.set('port', process.env.PORT || 8002);
app.set('view engine', 'pug');
app.set('views', path.join(rootPath, '../views'));

app.use('/', express.static(path.join(rootPath, '../public')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true,
})); // support encoded bodies


/* Configuration*/
require('./configuration/database');
require('./configuration/session').addSession(app);
app.use(require('connect-flash')());
recaptcha.init(secret.recaptcha.site, secret.recaptcha.secret);


/* Models*/
require('./models/userModel.js');
require('./models/notebookModel.js');
require('./models/gateModel.js');
require('./models/settingModel.js');
require('./models/classroomModel.js');
require('./models/contestModel.js');
require('./models/standingModel.js');
require('./models/ratingModel.js');


/* Middleware*/
app.use(require('middlewares/flash.js'));
app.use(require('middlewares/verification.js'));
app.use(require('middlewares/username.js'));
app.use(require('middlewares/passSession.js'));
app.use(require('middlewares/privateSite.js'));
app.use(morgan('dev'));

/* Routers*/
require('./controllers/admin/dashboard.js').addRouter(app);
require('./controllers/admin/root.js').addRouter(app);


require('./controllers/index/indexController.js').addRouter(app);

require('./controllers/user/loginController.js').addRouter(app);
require('./controllers/user/verificationController.js').addRouter(app);
require('./controllers/user/profileController.js').addRouter(app);

require('./controllers/notebook/noteController.js').addRouter(app);
require('./controllers/notebook/otherController.js').addRouter(app);

require('./controllers/gateway/crudController.js').addRouter(app);
require('./controllers/gateway/getChildrenController.js').addRouter(app);
require('./controllers/gateway/otherController.js').addRouter(app);
require('./controllers/gateway/doneStat.js').addRouter(app);
require('./controllers/gateway/ojscraper.js').addRouter(app);

/* API */
app.use('/api/*', require('middlewares/login').apiLogin );
require('./api/v1/classrooms.js').addRouter(app);
require('./api/v1/contests.js').addRouter(app);
require('./api/v1/users.js').addRouter(app);
require('./api/v1/ratings.js').addRouter(app);
require('./api/v1/standings.js').addRouter(app);

app.use('/api/v1', function(err, req, res, next) {
  if ( err.status ) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  }
  console.log(err);
  return res.status(500).json({
    status: 500,
    message: err.message,
  });
});

app.use('/api/v1/*', function(req, res, next) {
  return res.status(404).json({
    status: 404,
    message: 'API not found',
  });
});

/* React Modules */
app.use('/', express.static(path.join(clientBuild, 'coach')));
app.get(/\/coach.*/, function(req, res, next) {
  return res.sendFile(path.join(clientBuild, 'coach/index.html'));
});
app.get('/classroom/*', function(req, res, next) {
  return res.sendFile(path.join(clientBuild, 'coach/index.html'));
});
app.get('/users/*', function(req, res, next) {
  return res.sendFile(path.join(clientBuild, 'coach/index.html'));
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  if ( req.session.status !== 'user' ) res.status(500).send(err.message);
  else res.status(500).send('Something broke!');
  next();
});

app.get('*', function(req, res) {
  return res.status(404).send('Page not found\n');
});

process.on('unhandledRejection', (reason) => {
    console.log('Reason: ' + reason);
});

if (require.main === module) {
  server.listen(app.get('port'), function() {
    console.log(`Server running at port ${app.get('port')}`);
  });
} else {
  module.exports = {
    server,
    app,
  };
}
