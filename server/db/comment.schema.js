var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  id: Number,
  _facebookUniqueID: String,
  text: String
},
{versionKey: false});

module.exports = mongoose.model('Comment', commentSchema);
