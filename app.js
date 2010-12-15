require.paths.unshift(__dirname + '/vendor/');

var Db = require('mongodb/db').Db,
    Server = require('mongodb/connection').Server,
    express = require('express');

require('ext');

var app = express.createServer();
var db = new Db('transsiberian', new Server('localhost', 27017, {auto_reconnect: true, native_parser: true}), {});

db.open(function () {

  GLOBAL.OBJECTID = require('mongodb/bson/bson').ObjectID;
  GLOBAL.HOST = 'localhost:3000';
  GLOBAL.APP_NAME = 'transsiberian';

  // extending app
  app.model = function (thing) {
    return require('./models/mongo/' + thing)(db, app);
  };

  // Configuration
  require('./config/config')(app, express);
  require('./config/environments')(app, express);

  // Helpers
  app.dynamicHelpers(require('./helpers/dynamic'));
  app.helpers(require('./helpers/static'));

  // Controllers
  require('./controllers/public')(app);
  require('./controllers/auth')(app);
  require('./controllers/users')(app);

  app.listen(3000);

  // express-dialect
  //(function (app) {
  //  require('express-dialect')({
  //    app: app,
  //    path: __dirname + '/locales',
  //    title: 'Transsiberian',
  //    store: 'mongodb',
  //    database: 'translations'
  //  }, function (error, dialect) {
  //    dialect.app.listen(3001);
  //  });
  //}(app));
});
