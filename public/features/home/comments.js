angular.module('smartNews.home')

.controller('CommentCtrl', function($scope, $http, isAuth, Comment, TopTrendsFactory) {




  $scope.commentData = {};



  Comment.get()
    .success(function(data) {
      $scope.comments = data;
    });


  //Grab form data for a new comment
  //  grab user data to also send with comment

  // USER INFO
  $scope.user = isAuth();
  console.log($scope.user);

  // Primary Article Info
  $scope.news = TopTrendsFactory.primaryArticle;


  // $scope.url = '/' + $scope.news[0].id + '/comments';

  // need FB ID
  $scope.addComment = function() {

    Comment.save($scope.commentData, $scope.user, $scope.news)
      .success(function(data) {
        $scope.comments.push(data);
        console.log($scope.news[0].title);
      })
      .error(function(err) {
        console.log(err);
      });

  };

  $scope.deleteComment = function() {

  };
});