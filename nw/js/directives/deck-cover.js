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
      $scope.go = utils.navigate;
    }
  }
});
