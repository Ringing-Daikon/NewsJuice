angular.module('smartNews.home')

.controller('CommentCtrl', function($scope, $http, isAuth, Comment, TopTrendsFactory) {


  $scope.commentData = {};


  // USER INFO
  $scope.user = isAuth();
  console.log($scope.user);

  // Primary Article Info
  $scope.news = TopTrendsFactory.primaryArticle;

  $scope.getComments = function() {
    Comment.get($scope.news)
        .success(function(data) {
          $scope.comments = data;
        });
  };
  $scope.getComments();

  $scope.addComment = function() {

    Comment.save($scope.commentData, $scope.user, $scope.news)
      .success(function(data) {
        $scope.comments.push(data);
        console.log($scope.news[0]);
      })
      .error(function(err) {
        console.log(err);
      });

  };

  $scope.deleteComment = function(commentID) {

    Comment.delete(commentID)
      .success(function(data) {
        console.log('deleted', data);
      });
    $scope.getComments();
  };
});