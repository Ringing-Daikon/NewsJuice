var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  _facebookUniqueID: String,
  firstname: String,
  lastname: String,
  picture: String,
  gender: String,
  articles: [{
    title: String,
    author: String,
    publishDate: Date,
    savedDate: Date,
    articleLink: String,
    articleSource: String,
    img: String,
    body: String 
  }]
},
{versionKey: false});

module.exports = mongoose.model('User', userSchema);
