var mongoose = require('mongoose');

var statusSchema = mongoose.Schema({
    region: {type: String, required: true, unique: true},
    gameStatus: {type: String, required: true}
});


// returns true if the game status has changed
statusSchema.statics.statusChange = function(reg, newStatus) {
  var Status = this || mongoos.model('Status');
  Status.findOne({region: reg}, function(err, status) {
    if (status) {
      if (status.gameStatus == newStatus) return false;
      status.update({gameStatus: newStatus}).exec();
      return true;
    }
    // if there is no current status, create the status and return false
    Status.create({
      region : reg,
      gameStatus : newStatus,
    }, function(err, status) {
      if (err) {
        console.log(err);
        return false;
      }
      console.log('initializing status for region: ' + reg);
      return false;
    });
  });
};

module.exports = mongoose.model('Status', statusSchema);
