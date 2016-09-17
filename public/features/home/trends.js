angular.module('smartNews.home')

.controller('TopTrendsCtrl', function($scope, $http, TopTrendsFactory, Comment) {
  TopTrendsFactory.getTrends().then(function(topics) {
    $scope.trends = topics;
    // var getSavedComments = function(article) {
    //   Comment.get(article);
    // };
    ($scope.selectArticle = function (topic) { 
      $scope.getPrimaryArticle(topic.articleTitle);
      
      // TopTrendsFactory.getPrimaryArticle(topic.articleTitle)
      // .then(function (article) {

        //getSavedComments(article.data.stories);
      // });
    })(topics[0]);
  });
});