angular.module('app').controller('decks', function ($scope, $rootScope, utils, socket) {
  $rootScope.title = "My Decks";
  $scope.decks = [];
  $rootScope.loading = true;
  socket.perform('getDecks', null, function (err, decks) {
    $rootScope.loading = false;
    if (err) { return console.error(err); }
    $scope.decks = decks
  });
  $scope.go = utils.navigate;
});
