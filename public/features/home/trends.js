angular.module('smartNews.home')

.controller('TopTrendsCtrl', function($scope, $http, TopTrendsFactory, Comment) {
  TopTrendsFactory.getTrends().then(function(topics) {
    $scope.trends = topics;
    ($scope.selectArticle = function (topic) { 
      $scope.getPrimaryArticle(topic.articleTitle);
    })(topics[0]);
  });
});