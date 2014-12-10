var User   = require('./models/user');
var mailer = require('./models/mailer');
var path   = require('path');
var index  = path.resolve(__dirname, '..', 'public/index.html');

module.exports = function(app) {

  // API ---------------------------------------------------------------------
  app.post('/signup', function(req, res) {
    User.create({
      email : req.body.inputEmail,
      region : req.body.inputRegion,
    }, function(err, user) {
      if (err) {
        console.log(err);
        return err;
      }
      console.log('signing up user: ' + user);
      res.send(user);
      sendSignupAlert(req.body.inputEmail, req.body.inputRegion, user._id);
    });
  });

  app.delete('/unsubscribe/:user_id', function(req, res) {  // TODO send an email on unsubscribe
    User.remove({
      _id : req.params.user_id
    }, function(err, result) {
      if (err) {
        console.log(err);
        return err;
      }
      res.send((result===1)?{msg:'success'}:{msg:'error'})
      sendUnsubscribeAlert(req.body.inputEmail, req.body.inputRegion);
    });
  });

  // application -------------------------------------------------------------
  app.get('*', function(req, res) {
    res.sendFile(index); // load the single view file (angular will handle the page changes on the front-end)
  });

};


function sendSignupAlert(inputEmail, inputRegion, userID){
  var locals = {
    email: inputEmail,
    subject: "Subscribed to alerts for " + inputRegion,
    region: inputRegion,
    unsubscribeUrl: '/unsubscribe/' + userID  // TODO is this secure to send the ID raw?
  };
  mailer.sendOne('signup', locals, function(error) {
    console.log(error);
  });
};


function sendUnsubscribeAlert(inputEmail, inputRegion){
  var locals = {
    email: inputEmail,
    subject: "Subscribed to alerts for " + inputRegion,
    region: inputRegion,
  };
  mailer.sendOne('unsubscribe', locals, function(error) {
    console.log(error);
  });
};
