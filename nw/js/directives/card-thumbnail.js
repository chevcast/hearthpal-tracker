angular.module('app').directive('cardThumbnail', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      interactive: '=',
      cardId: '@',
      cardCount: '@'
    },
    templateUrl: './templates/directives/card-thumbnail.html',
    controller: function ($scope, cards) {
      cards.then(function (cards) {
        $scope.card = cards[$scope.cardId];
      }).catch(console.error.bind(console));
    }
  }
});
