// test cases for the status model and game status management

var should = require('should');
var mongoose = require('mongoose');
var Status = require('../../app/models/status');

describe('models: status', function() {

  before(function(done) {
    mongoose.connect('mongodb://localhost:27017/lol_status');
    done();
  });

  after(function(done) {
    mongoose.connection.close();
    done();
  });

  beforeEach(function(done) {
    Status.remove({}, function(){
      done();
    });
  });

  afterEach(function(done) {
    Status.remove({}, function(){
      done();
    });
  });

  describe('statusChange', function() {

    it('loads a Status model for each region when initialized', function(done) {
      done();
    });

    it('returns true when there is a game status change', function(done) {
      done();
    });

    it('returns false when there is no game status change', function(done) {
      done();
    });

  });

});
