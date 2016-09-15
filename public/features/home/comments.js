angular.module('smartNews.home')

.controller('CommentCtrl', function($timeout, $scope, $http, isAuth, Comment, TopTrendsFactory) {


  $scope.commentData = {};


  // USER INFO
  $scope.user = isAuth();
  // console.log($scope.user);
  // $timeout(functition() {
  // Primary Article Info
  $scope.articleID = TopTrendsFactory.primaryArticle;
  // console.log($scope.articleID[0]);

  $scope.getComments = function() {
    // TopTrendsFactory.getComments();
    // console.log($scope.articleID[0]);
    Comment.get($scope.articleID)
        .success(function(data) {
          $scope.comments = data;
        });
  };

  $timeout(function() {
    $scope.getComments();
  }, 2000);


  $scope.addComment = function() {

    Comment.save($scope.commentData, $scope.user, $scope.articleID)
      .success(function(data) {
        $scope.comments.push(data);
        console.log($scope.articleID[0]);
      })
      .error(function(err) {
        console.log(err);
      });

  };
 // ), 1000}

  $scope.deleteComment = function(commentID) {
    console.log(commentID)
    Comment.delete(commentID)
      .success(function(data) {
        console.log('deleted', data);
      })
      .error(function(err) {
        console.log(err);
      });
    $scope.getComments();
  };
});