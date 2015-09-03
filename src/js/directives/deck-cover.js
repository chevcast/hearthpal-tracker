angular.module('app').directive('deckCover', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      deckClass: '@',
      deckName: '@',
      deckFile: '@',
      interactive: '@'
    },
    templateUrl: resolvePath('/templates/directives/deck-cover.html'),
    controller: function ($scope, utils) {
      $scope.classImageUrl = resolvePath('/imgs/deck-covers/' + $scope.deckClass.toLowerCase() + '-deck.png');
      $scope.go = utils.navigate;
    }
  }
});
