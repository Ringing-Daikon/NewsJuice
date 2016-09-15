angular.module('smartNews.home')

.controller('TopTrendsCtrl', function($scope, $http, TopTrendsFactory, Comment) {
  var sanitizeTitle = TopTrendsFactory.sanitizeTitle;
  $scope.topTrends = TopTrendsFactory.topTrends;
  $scope.selectArticle = function (topic) {

    var title = sanitizeTitle(topic.articleTitle);

    TopTrendsFactory.getPrimaryArticle(title)
    .then(function (article) {
      TopTrendsFactory.primaryArticle[0] = article.data.stories[0];
      Comment.get(TopTrendsFactory.primaryArticle[0].id);
    });
  };

});