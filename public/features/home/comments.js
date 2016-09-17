angular.module('smartNews.home')

.controller('CommentCtrl', function($scope, $http, isAuth, Comment, TopTrendsFactory) {
  var interval;
  $scope.getComments = function(article) {
    return Comment.get(article)
    .success(function(data) {
      $scope.comments = data;
      var fbIdObj = data
        .map(function(comment) {
          return comment._facebookUniqueID;
        }).reduce(function(obj, next){
          obj[next] = 1;
          return obj;
        }, {});
      var fbIdArr = [];
      for(var key in fbIdObj) {
        fbIdArr.push(key);
      }
      Comment.getUsers(fbIdArr).then(function(users) {
        $scope.users = users; 
      })
    })
    .error(function(err) {
      console.error(err);
    });
  };
  $scope.addComment = function() {
    Comment.save($scope.commentText, $scope.user, $scope.primaryArticle)
    .success(function(data) {
      $scope.users[$scope.user._facebookUniqueID] = $scope.users[$scope.user._facebookUniqueID] || $scope.user;
      $scope.comments.push(data); 
      $scope.commentText = '';
    })
    .error(function(err) {
      console.error(err);
    });
  };
  // $scope.editComment = function(commentID, index) {
  //   Comment.edit(commentID)
  //   .success(function(data) {
  //     $scope.comments[$scope.comments.length - 1 - index] = data;
  //   })
  //   .error(function(err) {
  //     console.error(err);
  //   });
  // };
  $scope.deleteComment = function(commentID, index) {
    Comment.delete(commentID)
    .success(function(data) {
      $scope.comments.splice($scope.comments.length - 1 - index, 1);
    })
    .error(function(err) {
      console.error(err);
    });
  };

  // 
});