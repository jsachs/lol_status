//test cases for nodemailer

var should = require('should');
var mailer = require('../../app/models/mailer');

describe('models: mailer', function () {

 describe('sendOne', function () {

   it('should render the alert template correctly', function (done) {
     var locals = {
       email: 'jacob.s.sachs@gmail.com',
       subject: "NA is online",
       region: "na",
       status: "online",
       unsubscribeUrl: 'lorem ipsum'
     };
     mailer.sendOne('alert', locals, function (err, responseStatus, html, text) {
       should.not.exist(err);
       responseStatus.should.containEql("OK");  // TODO validate each template
       text.should.containEql('na');
       html.should.containEql('lorem ipsum');
       done();
     });
   });
 });

});
