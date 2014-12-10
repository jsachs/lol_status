var mongoose = require('mongoose');

var statusSchema = mongoose.Schema({
  region: {type: String, required: true, unique: true},
  gameStatus: {type: String, required: true}
});

// TODO have this better designed alongside new documentation
// executes the callback if game server status has changed for a region
statusSchema.statics.statusChange = function(reg, newStatus, fn) {
  var Status = this || mongoose.model('Status');
  Status.findOne({region: reg}, function(err, status) {
    if (err) {
      console.log(err);
      return err;
    }
    if (status) {
      if (status.gameStatus == newStatus) return;
      status.update({gameStatus: newStatus}).exec();
      return fn(null, reg, newStatus);
    }
    // if there is no current status, create the status
    Status.create({
      region : reg,
      gameStatus : newStatus,
    }, function(err, status) {
      if (err) {
        return fn(new Error('error creating status: ' + err));
      }
    });
  });
};

module.exports = mongoose.model('Status', statusSchema);
