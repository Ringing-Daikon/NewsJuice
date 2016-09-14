var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
  title: String,
  author: String,
  publishDate: Date,
  savedDate: Date,
  articleLink: String,
  articleSource: String,
  img: String,
  body: String,
  comments: [{
    _facebookUniqueID: String,
    text: String
  }]
});

module.exports = mongoose.model('Article', articleSchema);
