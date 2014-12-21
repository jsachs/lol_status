// server.js


// set up ======================================================================
var express  = require('express');
var app      = express(); 								            // create our app w/ express
var mongoose = require('mongoose'); 					        // mongoose for mongodb
var port  	 = Number(process.env.PORT || 5000); 			// set the port
var morgan   = require('morgan'); 		                // log requests to the console (express4)
var bodyParser = require('body-parser');              // pull information from HTML POST (express4)
var methodOverride = require('method-override');      // simulate DELETE and PUT (express4)


// configuration ===============================================================
var database = require('./config');
mongoose.connect(database.db.url);

app.use(express.static(__dirname + '/public')); 				        // set the static files location
app.use(morgan('dev')); 										                    // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			      // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									                  // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


// routes ======================================================================
require('./app/routes')(app);


// listen (start app with node server.js) ======================================
app.listen(port, function() {
  console.log("Listening on " + port);
});
