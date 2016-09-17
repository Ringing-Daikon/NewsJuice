angular.module('smartNews.home')

.controller('TopTrendsCtrl', function($scope, $http, TopTrendsFactory, Comment) {
  TopTrendsFactory.getTrends().then(function(topics) {
    $scope.trends = topics;
    ($scope.selectArticle = function (topic) { 
      $scope.getPrimaryArticle(topic.articleTitle);
    })(topics[0]);
  });
// =======
// .controller('TopTrendsCtrl', function($scope, $http, TopTrendsFactory, Comment, renderWatsonBubbleChart) {
//   var sanitizeTitle = TopTrendsFactory.sanitizeTitle;
//   $scope.topTrends = TopTrendsFactory.topTrends;

//   var getSavedComments = function(article) {
//     Comment.get(article);
//   };

//   var removeBubbleChart = function(event) {
//     renderWatsonBubbleChart.removeBubbleChart(event);
//   }

//   var top = TopTrendsFactory;
//   $scope.selectArticle = function (topic, $event) {

//     removeBubbleChart($event);

//     var title = sanitizeTitle(topic.articleTitle);

//     TopTrendsFactory.getPrimaryArticle(title)
//     .then(function (article) {
//       TopTrendsFactory.primaryArticle[0] = article.data.stories[0];

//       getSavedComments(article.data.stories);
//     });

//   };

// >>>>>>> Fix homepage bubblechart bugs.  Now bubble chart disappears when you select a new trending article
});