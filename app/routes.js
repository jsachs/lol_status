var User = require('./models/user')

module.exports = function(app) {
  
  // API ---------------------------------------------------------------------
  app.post('/signup', function(req, res) {
      User.create({
          email : req.body.inputEmail,
          region : req.body.inputRegion.name,
      }, function(err) {
          if (err) console.log(err);
      });
      console.log(req.body);
  });

  // application -------------------------------------------------------------
  app.get('*', function(req, res) {
      //res.sendfile('./public/index2.html'); // load the single view file (angular will handle the page changes on the front-end)
  });
  
  
  
};