const User = require('./user.schema.js');

var fbProfile = data => ({
  _facebookUniqueID: data.id,
  firstname: data.name.givenName,
  lastname: data.name.familyName,
  picture: data.photos[0].value,
  gender: data.gender
});
var getUserObj = req => req.headers['x-xsrf-token'] ?
    JSON.parse(req.headers['x-xsrf-token'].slice(2)).user
    : null;
module.exports = {
  findOrCreateUser (req, cb) {
    User.findOne({_facebookUniqueID: req.id}, 
      (err, user) => err ?
        res.status(500).send(err)
        : user ?
          cb(null, user)
          : User.collection.insert(fbProfile(req), 
            (err, user) => err ?
              cb(err)
              : cb(null, user))
    );
  },
  saveArticle (req, res) {
    getUserObj(req) ?
      User.findOneAndUpdate({_facebookUniqueID: getUserObj(req)._facebookUniqueID}, {$push: {articles: req.body}}, {safe: true, upsert: true},
        (err, data) => err ?
          res.status(501).send(err)
          : res.status(200).send({article: data}))
      : res.status(404).send('Invalid user');
  },
  unsaveArticle (req, res) {
    let obj = getUserObj(req); 
    obj && User.update({_facebookUniqueID: obj._facebookUniqueID}, 
      {$pull: {articles: {_id: req.params.id}}}, 
      (err, data) => err ? 
          res.status(500).send(err)
          : res.status(200).send(data)
    );
  },
  getProfile (req, res) {
    let obj = getUserObj(req);
    obj && User.findOne({_facebookUniqueID: obj._facebookUniqueID}, 
      (err, data) => err ?
        res.status(500).send(err)
        : res.status(200).send(data.articles)
    );
  },
  getUser (req, res) {
    console.log('blah')
    User.findOne({_facebookUniqueID: req.params.id}, 
      (err, data) => err ? 
        res.status(404).send(err)
        : res.status(200).send(data)
    );
  }
};