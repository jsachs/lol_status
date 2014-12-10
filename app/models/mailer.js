var config = require('../../config');
var nodemailer = require('nodemailer');
var path = require('path');
var templatesDir = path.resolve(__dirname, '../..', 'views/mailer');
var emailTemplates = require('email-templates');

// create a defaultTransport using gmail and authentication that are
// storeed in the `config.js` file.
var defaultTransport = nodemailer.createTransport({
  service: 'Mandrill',
  auth: {
    user: config.mailer.auth.user,
    pass: config.mailer.auth.pass
  }
});

module.exports.EmailAddressRequiredError = new Error('email address required');
module.exports.SubjectRequiredError = new Error('subject required');

exports.sendOne = function (templateName, locals, fn) {
  // make sure that we have an user email
  if (!locals.email) {
    return fn(module.exports.EmailAddressRequiredError);
  }
  // make sure that we have a message
  if (!locals.subject) {
    return fn(module.exports.SubjectRequiredError);
  }
  emailTemplates(templatesDir, function (err, template) {
    if (err) {
      console.log(err);
      return fn(err);
    }
    // Send a single email
    template(templateName, locals, function (err, html, text) {
      if (err) {
        console.log(err);
        return fn(err);
      }
      // if we are testing don't send out an email instead return
      // success and the html and txt strings for inspection
      if (process.env.NODE_ENV === 'test') {
        return fn(null, '250 2.0.0 OK 1350452502 s5sm19782310obo.10', html, text);
      }
      var transport = defaultTransport;
      transport.sendMail({
        from: config.mailer.defaultFromAddress,
        to: locals.email,
        subject: locals.subject,
        html: html,
        text: text
      }, function (err, responseStatus) {
        if (err) {
          return fn(err);
        }
        return fn(null, responseStatus.message, html, text);
      });
    });
  });
}
