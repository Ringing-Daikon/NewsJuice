const Comment = require('./comment.schema.js');

module.exports = {
  getComments(req, res) {
    Comment.find({id: req.params.id},
      (err, data) => err || data === null ? 
        res.status(404).send(err)
        : res.status(200).send(data)
    );
  },
  postComment(req, res) { 
    new Comment({
      id: req.params.id,
      _facebookUniqueID: req.body._facebookUniqueID,
      text: req.body.text
    }).save((err, data) => err ?
      res.status(500).send(err)
      : res.status(201).send(data)
    );
  },
  editComment(req, res) {
    Comment.findOneAndUpdate({id: req.params.id, _id: req.body._id},
      {text: req.body.text},
      {new: true}, 
      (err, data) => err || data === null ?
        res.status(404).send(err)
        : res.status(200).send(data)
    );
  },
  deleteComment(req, res) {
    Comment.remove({id: req.params.id, _id: req.body._id}, 
      (err, data) => err || data === null ?
        res.status(404).send(err)
        : res.status(200).send(data)
    );
  }
};