module.exports = function (app) {
  var auth = {};

  auth.generateActivateCode = function (element) {
    return (element.email + Math.random() + '-activate_code-' + Math.random()).md5;
  };

  auth.generatePasswordSalt = function () {
    return (Math.random() + '-salt-' + Math.random()).md5;
  };

  auth.encryptPassword = function (password, salt) {
    // salty sandwich password! yummy!
    return (salt + password + salt).md5;
  };

  auth.isPasswordMatching = function (element, password) {
    var introduced_password = this.encryptPassword(password, element.password_salt);
    return introduced_password === element.password;
  };

  auth.generateAuth = function (element) {
    var salt = this.generatePasswordSalt(),
        activate_code = this.generateActivateCode(element),
        encrypted_password = this.encryptPassword(element.password, salt),
        url = 'http://' + GLOBAL.HOST + '/public/users/activate/' + activate_code,
        Mailer = require('./mailer')();

    delete element.password_confirmation;

    element.password_salt = salt;
    element.password = encrypted_password;
    element.activate_code = activate_code;

    Mailer.smtp({
      to : element.email,
      from : "noreply@" + GLOBAL.APP_NAME + ".com",
      subject : GLOBAL.APP_NAME + " - Activate your account",
      body : "Welcome " + element.name + " !!\n\n" +
             "To activate your account please visit this link \n" +
             "<a href='" + url + "'>" + url + "</a>"
    });
  };

  auth.formStrategy = function (req, res, callback) {
    var strategy = {name: 'form'},
        User = app.model('user'),
        self = this,

        failed_validation = function (req, res, uri) {
          var parsedUrl = require('url').parse(req.url, true),
              redirectUrl = "/auth/form";

          if (uri) {
            redirectUrl = redirectUrl + "?redirect_url=" + uri;
          } else if (parsedUrl.query && parsedUrl.query.redirect_url) {
            redirectUrl = redirectUrl + "?redirect_url=" + parsedUrl.query.redirect_url;
          }
          res.writeHead(303, {'Location':  redirectUrl});
          res.end('');
        },

        validate_credentials = function (scope, req, res, callback) {
          User.mongoCall('findOne', {email: req.param('email')}, function (error, user) {
            if (user && self.isPasswordMatching(user, req.param('password'))) {
              scope.success({
                _id: user._id.toHexString(), // some auth middlewares apply toString
                roles: user.roles,
                email: user.email
              }, callback);
            } else {
              scope.fail(callback);
            }
          });
        },

        validate_activate = function (scope, req, res, callback) {
          User.mongoCall('findAndModify', {'activate_code': req.param('activate_code')}, [], {'$set': {'activate_code': null}}, {}, function (error, user) {
            if (user) {
              scope.success({
                _id: user._id.toHexString(),
                roles: user.roles,
                email: user.email
              }, callback);
            } else {
              scope.fail(callback);
            }
          });
        };

    strategy.authenticate = function (req, res, callback) {
      if (req.param('email') && req.param('password')) {
        validate_credentials(this, req, res, callback);
      } else if (req.param('activate_code')) {
        validate_activate(this, req, res, callback);
      } else {
        failed_validation(req, res, req.url);
      }
    };

    return strategy;
  };

  return auth;
};
