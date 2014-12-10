var mongoose = require('mongoose');

var statusSchema = mongoose.Schema({
    region: {type: String, required: true, unique: true},
    gameStatus: {type: String, required: true}
});


// executes the callback if game server status has changed for a region
statusSchema.statics.statusChange = function(reg, newStatus, cb) {
  var Status = this || mongoos.model('Status');
  Status.findOne({region: reg}, function(err, status) {
    if (status) {
      if (status.gameStatus == newStatus) return;
      status.update({gameStatus: newStatus}).exec();
      return cb(reg, newStatus);
    }
    // if there is no current status, create the status and return false
    Status.create({
      region : reg,
      gameStatus : newStatus,
    }, function(err, status) {
      if (err) {
        console.log('error creating Status: ' + err);
      }
    });
  });
};

module.exports = mongoose.model('Status', statusSchema);
