angular.module('smartNews.home')

.controller('CommentCtrl', function($scope, $http, isAuth, Comment) {

  $scope.profile = 'Hi this is the comments page';

  // $scope.comments = [
  // { date: 'Sept, 14th 2016',
  //   author: 'Mike',
  //   message: 'Message Me!'
  // },
  // { date: 'Sept, 14th 2016',
  //   author: 'Brad',
  //   message: 'Message You!'
  // },
  // { date: 'Sept, 14th 2016',
  //   author: 'Mike',
  //   message: 'We made it!'
  // }
  // ];

  $scope.commentData = {};

  Comment.get()
    .success(function(data) {
      $scope.comments = data;
    });


  console.log($scope.commentData);
  console.log($scope.comments);
  //Grab form data for a new comment
  //  grab user data to also send with comment

  // PROB NEED THIS BUT WHY?
  // $scope.user = isAuth();

  //  $scope.isAuth = function() {
  //   $scope.user = isAuth();
  //   return !!isAuth();
  // };


  // need FB ID
  $scope.addComment = function() {

    Comment.save($scope.commentData)
      .success(function(data) {
        Comment.get()
          .success(function(getData) {
            $scope.comments = getData;
          });
      })
      .error(function(err) {
        console.log(err);
      });

  };




  $scope.deleteComment = function() {

  };
});