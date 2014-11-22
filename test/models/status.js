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
    Status.remove({}, function() {
      Status.statusChange('na', 'online');
      setTimeout(function(){done()}, 500);
    });
  });

  afterEach(function(done) {
    Status.remove({}, function(){
      done();
    });
  });

  describe('statusChange', function() {

    it('loads a Status model for each region when initialized', function(done) {
      Status.findOne({region: 'na'}, function(err, doc) {
        should.exist(doc);
        done();
      });
    });

    it('executes a callback when there is a game status change', function(done) {
      Status.statusChange('na', 'offline', function() {
        done();
      });
    });

  });

});
