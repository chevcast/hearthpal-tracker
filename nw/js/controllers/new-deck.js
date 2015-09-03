angular.module('app').controller('newDeck', function ($rootScope, $scope, utils, socket) {
  $rootScope.title = 'Choose Class'; 
  $scope.go = utils.navigate;
  $scope.classes = [
    'Warrior',
    'Shaman',
    'Rogue',
    'Paladin',
    'Hunter',
    'Druid',
    'Warlock',
    'Mage',
    'Priest'
  ];
  $scope.createDeck = function (deckClass) {
    if (!$scope.deckName) {
      $scope.deckName = 'Custom ' + deckClass;
    }

    var deckFile = $scope.deckName.replace(/ /g, '-').toLowerCase() + '.json';
    $rootScope.loading = true;
    socket.perform('newDeck', {
      deckFile: deckFile,
      deckData: {
        name: $scope.deckName,
        deckClass: deckClass,
        cards: {}
      }
    }, function (err) {
      if (err) { return console.error(err); }
      $rootScope.loading = false;
      utils.navigate('/deck-builder/edit/' + deckFile);
    });
  };
});
