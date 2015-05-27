module.exports = function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      deckClass: '@',
      deckName: '@',
      deckFile: '@',
      interactive: '@'
    },
    templateUrl: './templates/directives/deck-cover.html',
    controller: function ($scope, utils) {
      $scope.go = utils.navigate;
    }
  }
};
