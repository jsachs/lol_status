# League of Legends Server Status


[![Build Status](https://travis-ci.org/jsachs/lol_status.svg?branch=master)](https://travis-ci.org/jsachs/lol_status)
[![Coverage Status](https://coveralls.io/repos/jsachs/lol_status/badge.png)](https://coveralls.io/r/jsachs/lol_status)



## Purpose
This is a simple web app for monitoring regional server statuses for League of Legends. Users can quickly view the status of the game server, the store, and the forums for each region.

Users can subscribe to emails that will alerts subscribers when the game server for a region goes up or down.

## Running the project
```
# install node.js and mongodb

# run a local version of mongo
sudo mongod

# run the server
node server.js

# you can access the page at localhost:5000

# with the server running, you can run the tests
npm test
```

Alternatively, you can use the nifty button below to deploy your own version of the app to Heroku.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Architecture

### server.js
The app runs using [Express](http://expressjs.com/). It simply listens on the process port to serve the index page.

### Models
The application has three models:
- user: Mongoose model to store email and region for a user. This means a person will need to sign up multiple times to be alerted on different regions.
- mailer: Wrapper model used to abstract the functionality for sending alert emails.
- status: Game server status (online or offline) for a given region. The statusChange method looks to see if a provided status is different than the current one, executing a callback if there is a change.

### Testing
The app uses [Mocha](http://mochajs.org/) and [Supertest](https://github.com/tj/supertest) (for API endpoints). To run the tests, start the server, then type `npm test`.

### Front end
The front end is written in [Angular](https://angularjs.org/). It uses one controller for accessing the Riot Games API, and another for POSTs from the contact form. That's about all there is to it.

## Add-ons
### Sendgrid
Emails are delivered using the [Sendgrid NodeJS module](https://github.com/sendgrid/sendgrid-nodejs). This requires setting up a Sendgrid account, most easily accomplished with the Heroku add-on.
### Heroku scheduler
The app checks the status of the LoL servers, and takes any required action, through use of the Heroku scheduler add-on. Once added, the checkStatus script (located in the bin directory) is configured to run at a regular interval.
### Mongolab
MongoDB backend of choice for Heroku. Used here because of the easy-to-use free plan, but any Mongo backend will do.
