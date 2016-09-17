angular.module('smartNews.home')

.controller('CommentCtrl', function($timeout, $scope, $http, isAuth, Comment, TopTrendsFactory) {


  $scope.commentData = {};


  // USER INFO
  $scope.user = isAuth();
  console.log($scope.user);

  // Primary Article Info
  $scope.article = TopTrendsFactory.primaryArticle;


  $scope.getSavedComments = function() {

    Comment.get($scope.article)
        .success(function(data) {
          $scope.comments = data;
        });
  };

  $timeout(function() {
    $scope.getSavedComments();
  }, 2000);

  setInterval(function() {
    $scope.getSavedComments();
  }, 750);


  $scope.addComment = function() {

    Comment.save($scope.commentData, $scope.user, $scope.article)
      .success(function(data) {
        $scope.comments.push(data);
        $scope.commentData.text = '';
        // console.log($scope.article[0]);
      })
      .error(function(err) {
        console.log(err);
      });

  };


  $scope.deleteComment = function(commentID) {
    // console.log(commentID);
    Comment.delete(commentID)
      // .success(function(data) {
      //   // console.log('deleted', data);
      // })
      .error(function(err) {
        console.log(err);
      });
    $scope.getSavedComments();
  };
});