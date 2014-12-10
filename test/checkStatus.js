// test cases for the checkStatus script

var should = require('should');
var mongoose = require('mongoose');
var Status = require('../app/models/status');  // TODO set these all from the root dir
var User   = require('../app/models/user');

describe('checkStatus', function() {

  before(function(done) {
    mongoose.connect('mongodb://localhost:27017/lol_status');
    done();
  });

  after(function(done) {
    mongoose.connection.close();
    done();
  });

  beforeEach(function(done) {
    Status.remove({}, function() {
      Status.statusChange('na', 'online');
      User.create({email:  'jacob@jacob.com',
                   region: 'na'});
      setTimeout(function(){done()}, 500);
    });
  });

  afterEach(function(done) {
    Status.remove({}, function(){
      User.remove({}, function(){
        done();
      });
    });
  });


  it('sends an email for every user in the database', function(done) {
      done();
  });

  it('logs an error if there is a problem sending mail', function(done) {
      done();
  });



});
