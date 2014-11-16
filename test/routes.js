  // test cases for the routes

  var should = require('should');
  var request = require('supertest');
  var mongoose = require('mongoose');
  var User = require('../app/models/user');
  var url = 'http://localhost:5000'


  describe('routes', function() {

    before(function(done) {
      mongoose.connect('mongodb://localhost:27017/lol_status');
      done();
    });

    beforeEach(function(done) {
      User.remove({}, function(){
        done();
      });
    });

    afterEach(function(done) {
      User.remove({}, function(){
        done();
      });
    });

    describe('/signup endpoint', function() {
      it('adds a user to the database, with their email and region of choice', function(done) {
        request(url)
        .post('/signup')
        .send({inputEmail:  'jacob@jacob.com',
               inputRegion: {name: 'na'}})
        .end(function(e,res) {
          should.not.exist(e);
          should.exist(res.body);
          User.findOne({email: 'jacob@jacob.com', region: 'na'}, function(err, user) {
            should.equal(user.email, 'jacob@jacob.com');
            should.equal(user.region, 'na');
            done();
          });
        });
      });
    });

    describe('/unsubscribe endpoint', function() {
      it('removes a user from the database', function(done) {
        var userId;
        User.create({email:  'jacob@jacob.com',
                     region: 'na'}, function(err, user) {
          if (err) {
            console.log(err);
            return err;
          }
          userId = user._id;
          request(url)
          .del('/unsubscribe/' + userId)
          .end(function(e,res) {
            should.not.exist(e);
            should.exist(res.body);
            User.findOne({email: 'jacob@jacob.com', region: 'na'}, function(err, user) {
              should.not.exist(user);
              done();
            });
          });
        });
      });
    });
  });
