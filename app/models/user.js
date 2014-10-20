var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email: {type: String, unique: true},
    region: {type: String, required: true}
});

var User = mongoose.model('User', userSchema);
