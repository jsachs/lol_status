// server.js

// set up ========================
var express  = require('express');
var app      = express(); 								    // create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port  	 = process.env.PORT || 1234; 			// set the port
var database = require('./config/database');  // load the database config
var crypto = require('crypto');
var cron     = require('cron');
var morgan = require('morgan'); 		              // log requests to the console (express4)
var bodyParser = require('body-parser');          // pull information from HTML POST (express4)
var methodOverride = require('method-override');  // simulate DELETE and PUT (express4)

var Client = require('node-rest-client').Client;  // node REST API client
client = new Client();

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
   service: "Gmail",
   auth: {
       user: "jacob.s.sachs@gmail.com",
       pass: "Do I dare disturb the universe?"
   }
});

// configuration =================
mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public')); 				// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 										            // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			      // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									                  // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// models ======================================================================
var userSchema = mongoose.Schema({
		email: {type: String, unique: true},
		region: {type: String, required: true}
});

var User = mongoose.model('User', userSchema);


// routes ======================================================================

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

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);


// variables for regions and current game state
var currentState = {};
var regions = ['na','euw','eune','lan','las','br','tr','ru','oce'];

// cron job to check server status
var cronJob = cron.job("*/30 * * * * *", function(){

	var newState = {};

  // get each region's game status
	regions.forEach(function(region) {
		client.get("http://status.leagueoflegends.com/shards/" + region, function(data, response){
			newState[region] = data.services[1].status
			// send an email if the status has changed
			if (currentState[region]) {
				if (newState[region] != currentState[region]) {
					sendEmailAlert(region, newState[region]);
				};
			};
			currentState[region] = newState[region];
		});
	});

});
// run the cron job
cronJob.start();

// send alert emails if there is a status change
function sendEmailAlert(reg, newState){
	User.find({ region: reg }, function(err, docs) {
		console.log("Emailing users: " + docs);
		docs.forEach(function(user) {
			transporter.sendMail({
				from: "jacob.s.sachs@gmail.com", // sender address
				to: user.email, // comma separated list of receivers
				subject: user.region + " alert", // Subject line
				text: "The game server for " + user.region + " is now " + newState // plaintext body
			}, function(error, response){
				if(error){
					console.log(error);
				}else{
					console.log("Message sent: " + response.message);
				}
			});
		});
	});
};
