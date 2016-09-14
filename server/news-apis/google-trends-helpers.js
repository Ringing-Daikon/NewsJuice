const googleTrends = require('google-trends-api');

var trafficToNumber = traffic => Number(traffic
  .replace('+', '')
  .replace(',', '')
);
var sortByTraffic = result => result
  .sort((a, b) => trafficToNumber(b['ht:approx_traffic'][0])
     - trafficToNumber(a['ht:approx_traffic'][0])
);
/***GOOGLE TRENDS***/
module.exports = {
  hotTrends (res, limit, country = 'US') {  
  // hotTrends pull top # of trends from specified country
    // resultLimit: Number
    // country: String, ex: 'US', default is US
    googleTrends.hotTrends(country)
      .then(data => res.status(200).send(data.slice(0, limit)))
      .catch(err => res.status(500).send(err));
  },
  hotTrendsDetail (res, limit, country = 'US') {  
  // hotTrends pull top # of trends from specified country
    // resultLimit: Number
    // country: String, ex: 'US', default is US
    // Response: Array of objects of each individual trend
    googleTrends.hotTrendsDetail(country)
      .then(data => res.status(200)
        .send(sortByTraffic(data.rss.channel[0].item)
          .slice(0, limit)))
      .catch(err => res.status(500).send(err));
  }
};




