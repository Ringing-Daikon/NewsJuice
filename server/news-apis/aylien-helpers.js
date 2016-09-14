const aylienKeys = require('../../keys.js').aylien;
const AylienNewsApi = require('aylien-news-api');

/************* AYLIEN API HELPERS ********************/
// Instantiate AylienNewsApi model
const api = new AylienNewsApi.DefaultApi();
// Configure API ID: app_id
api.apiClient.authentications['app_id'].apiKey = aylienKeys.app_id;
// Configure API key: app_key
api.apiClient.authentications['app_key'].apiKey = aylienKeys.app_key;

module.exports = {
  timelineData (input, res) {
    // more options here: https://newsapi.aylien.com/docs/endpoints/time_series/nodejs
    // date/time formatting: https://newsapi.aylien.com/docs/working-with-dates
    // if period !== 1, start and/or end date should probably be adjusted to result in an even multiple of period. i.e. if period=7days, end minus start should be some multiple of 7 so that data is not skewed by a partial period.
    // values prior to about 3/15/2016 are consistently much lower, reason currently unknown
    api.listTimeSeries({
      'title': input,
      'language': ['en'],
      // 'publishedAtStart': '2016-03-15T00:00:00Z',
      'publishedAtStart': 'NOW-175DAYS',
      'publishedAtEnd': 'NOW',
      // 'period': '+1DAYS'
    }, (err, data) => err ?
      res.status(500).send(err)
      : res.status(200).send(data));
  },
  articleImport (input, res, start, end, limit = 3) {
    api.listStories({
      'title': input,
      // 'text': input,
      'language': ['en'],
      'sortBy': 'relevance',
      'publishedAtStart': start,
      'publishedAtEnd': end,
      'perPage': limit,
    }, (err, data) => err ?
      res.status(500).send(err)
      : res.status(200).send(data));
  }
};