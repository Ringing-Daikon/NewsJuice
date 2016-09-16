angular.module('smartNews.home')

.controller('TopTrendsCtrl', function($scope, $http, TopTrendsFactory, Comment) {
  var sanitizeTitle = TopTrendsFactory.sanitizeTitle;
  $scope.topTrends = TopTrendsFactory.topTrends;

  var getSavedComments = function(article) {
    Comment.get(article);
  };

  var top = TopTrendsFactory;
  $scope.selectArticle = function (topic) {

    var title = sanitizeTitle(topic.articleTitle);

    TopTrendsFactory.getPrimaryArticle(title)
    .then(function (article) {
      TopTrendsFactory.primaryArticle[0] = article.data.stories[0];

      getSavedComments(article.data.stories);
    });

  };

});