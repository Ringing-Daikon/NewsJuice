angular.module('smartNews.home', ['smartNews.services'])

// Sub-Views
.directive('primaryarticle', function() {
  return {
    templateUrl: 'features/home/primaryArticle.html',
    controller: 'PrimaryArticleCtrl'
  };
})
.directive('toptrends', function() {
  return {
    templateUrl: 'features/home/trends.html',
    controller: 'TopTrendsCtrl'
  };
})
.directive('comments', function() {
  return {
    templateUrl: 'features/home/comments.html',
    controller: 'CommentCtrl'
  };
})

// Home Controller
.controller('HomeCtrl', function($scope) {
  $scope.test = 'Home View';

});
