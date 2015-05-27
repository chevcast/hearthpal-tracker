module.exports = function () {
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
      $scope.card = cards[$scope.cardId];
    }
  }
};
