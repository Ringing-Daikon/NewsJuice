/***EXPRESS***/
const router = require('express').Router();
//***APIS***/
const passport = require('./passport.js');
const aylien = require('../news-apis/aylien-helpers.js');
const googleTrends = require('../news-apis/google-trends-helpers.js');
/***CONTROLLERS***/
const user = require('../db/user.controller.js'); 
const comment = require('../db/comment.controller.js');
/***AUTOCOMPLETE***/
router.get('/input/:input', (req, res) => require('request')(`https://en.wikipedia.org/w/api.php?action=query&format=json&generator=prefixsearch&prop=pageprops%7Cpageimages%7Cpageterms&redirects=&ppprop=displaytitle&piprop=thumbnail&pithumbsize=80&pilimit=5&wbptterms=description&gpssearch=${req.params.input}&gpsnamespace=0&gpslimit=5`, 
    (err, resp, body) => err ? 
      res.status(500).send(err) 
      : res.status(200).send(body)
    )
  );
/***USER AUTH FACEBOOK***/
router.get('/enter', (req, res) => {
  res.redirect('/layout.html');
});
router.get('/auth/facebook',
  passport.authenticate('facebook'));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
    // Successful authentication, redirect home.
      res.cookie('authenticate', req.session.passport);
      res.redirect('/enter');
    });
router.get('/results/:input', (req, res) => aylien.timelineData(req.params.input, res));
// http://localhost/3000/see-article?input=obama&start=[startdate]&end=[enddate]
router.get('/seearticle', (req, res) => {
    let q = req.query; 
    aylien.articleImport(q.input, res, q.start, q.end, q.limit)
  });
/***GOOGLE TRENDS***/
// Top trends pull top # of trends from specified country
  // googleTrends.hotTrends(resultLimit, country, res)
    // resultLimit: Number
    // country: String, ex: 'US', default is US
router.get('/api/news/topTrends', (req, res) => googleTrends.hotTrends(res, 10, 'US'));
router.get('/api/news/topTrendsDetail', (req, res) => googleTrends.hotTrendsDetail(res, 10, 'US'));
/***SAVE ARTICLE***/
router.post('/article', user.saveArticle);
router.delete('/unsaveArticle/:id', user.unsaveArticle);
router.get('/profile', user.getProfile);
/***COMMENT HANDLING***/
router.route('/:id/comments')
  .get(comment.getComments)
  .post(comment.postComment)
  .put(comment.editComment)
  .delete(comment.deleteComment);

module.exports = router;
