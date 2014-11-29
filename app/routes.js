var User = require('./models/user');
var path = require('path');
var index = path.resolve(__dirname, '..', 'public/index.html');

module.exports = function(app) {

  // API ---------------------------------------------------------------------
  app.post('/signup', function(req, res) {
    User.create({
      email : req.body.inputEmail,
      region : req.body.inputRegion.name,
    }, function(err, user) {
      if (err) {
        console.log(err);
        return err;
      }
      console.log('signing up user: ' + user);
      res.send(user);
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
    });
  });

  // application -------------------------------------------------------------
  app.get('*', function(req, res) {
    res.sendFile(index); // load the single view file (angular will handle the page changes on the front-end)
  });

};
