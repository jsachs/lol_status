// server.js


// set up ========================
var express  = require('express');
var app      = express(); 								    // create our app w/ express
var mongoose = require('mongoose'); 					    // mongoose for mongodb
var port  	 = Number(process.env.PORT || 5000); 			// set the port
var cron     = require('cron');
var morgan   = require('morgan'); 		              // log requests to the console (express4)
var bodyParser = require('body-parser');              // pull information from HTML POST (express4)
var methodOverride = require('method-override');      // simulate DELETE and PUT (express4)

var Client = require('node-rest-client').Client;      // node REST API client
client = new Client();


// configuration =================
var database = require('./config');
mongoose.connect(database.db.url);

app.use(express.static(__dirname + '/public')); 				// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 										            // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			      // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									                  // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


// models ======================================================================
var mailer = require('./app/models/mailer')  // get the nodemailer wrapper model
var Status = require('./app/models/status')


// routes ======================================================================
require('./app/routes')(app);


// listen (start app with node server.js) ======================================
app.listen(port, function() {
  console.log("Listening on " + port);
});


// server logic ================================================================


// cron job to check server status
var cronJob = cron.job("*/30 * * * * *", function(){
  var regions = ['na','euw','eune','lan','las','br','tr','ru','oce'];
  var newStatus;

  // get each region's game status
  regions.forEach(function(region) {
    client.get("http://status.leagueoflegends.com/shards/" + region, function(data, response){
      newStatus = data.services[1].status
      // check the game status:
      // if the game status has changed:
      //  - update the status (done in Model method)
      //  - send an email alert
      Status.statusChange(region, newStatus, sendEmailAlert);
    });
  });

});
// run the cron job
cronJob.start();


// send alert emails if there is a status change  TODO put this into the mailer file
function sendEmailAlert(reg, newState){
  User.find({ region: reg }, function(err, docs) {
    console.log("Emailing users: " + docs);
    docs.forEach(function(user) {
      var locals = {
        email: user.email,
        subject: user.region + " is " + newState,
        region: user.region,
        status: newState,
        unsubscribeUrl: '/unsubscribe/' + user._id         // TODO is this secure to send the ID raw?
      };
      mailer.sendOne('alert', locals, function(error) {
        console.log(error);
      });
    });
  });
};
