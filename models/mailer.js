module.exports = function Mailer() {
  var mailer = {},
      log4js = require('log4js')(),
      conf = require('../config/mailer'),
      logger = log4js.getLogger('mailer');

  mailer.smtp = function (options) {
    var mail = require('mail').Mail(conf.smtp);
    this.sendEmail(mail, options);
  };

  mailer.sendEmail = function (mail, options) {
    if (GLOBAL.APP_ENV === 'production') {
      mail.message({
        from: options.from,
        to: options.to,
        subject: options.subject
      })
      .body(options.body)
      .send(options.callback || function (error) {
        console.log('Email sent!');
      });
    } else {
      logger.trace(
        "\n\n" +
        '* from: ' + options.from + "\n" +
        '* to: ' + options.to + "\n" +
        '* subject: ' + options.subject + "\n\n" +
        "* body: \n" + options.body
      );
    }
  };

  // init
  log4js.addAppender(log4js.consoleAppender());
  log4js.addAppender(log4js.fileAppender('logs/mailer.log'), 'mailer');
  logger.setLevel('TRACE');

  return mailer;
};
