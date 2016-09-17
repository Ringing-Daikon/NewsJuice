angular.module('smartNews.home')

.controller('PrimaryArticleCtrl', function($scope, TopTrendsFactory, saveArticle, isAuth, renderWatsonBubbleChart) {
    $scope.isAuth = function() {
      return !!($scope.user = isAuth());
    };

  $scope.getPrimaryArticle = function(title) {
    $scope.articleLoad = false;
    TopTrendsFactory.getPrimaryArticle(title)
    .then(function(data) {
      $scope.primaryArticle = data;
      $scope.clickSave = function() {
        saveArticle({
          title: data.title,
          author: data.name,
          publishDate: data.publishedAt,
          savedDate: new Date(),
          articleLink: data.links.permalink,
          articleSource: data.source.name,
          img: data.media[0].url,
          body: data.body
        });
      };
      $scope.renderBubbleChart = function(articleData, $event) {
        articleData = articleData ? articleData : $scope.primaryArticle;
        renderWatsonBubbleChart.renderWatsonBubbleChart(articleData, $event);
      };
      $scope.articleLoad = true;
      $scope.getComments(data);
    });

  };

});