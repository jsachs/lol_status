#!/usr/bin/env node

// set up ======================================================================
var express  = require('express');
var app      = express(); 								    // create our app w/ express
var mongoose = require('mongoose'); 					    // mongoose for mongodb
var Client = require('node-rest-client').Client;      // node REST API client
client = new Client();


// configuration ===============================================================
var database = require('./config');
mongoose.connect(database.db.url);


// models ======================================================================
var mailer = require('./app/models/mailer');
var Status = require('./app/models/status');
var User   = require('./app/models/user');


// heroku scheduled task =======================================================
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

// send alert emails if there is a status change
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
