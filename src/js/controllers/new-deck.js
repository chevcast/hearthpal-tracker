var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var bluebird = require('bluebird');
bluebird.promisifyAll(fs);

module.exports = function ($rootScope, $scope, utils) {
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
    var deckDirectory = path.join(__dirname, '..', '..', 'data', 'decks');
    var deckPath = path.join(deckDirectory, deckFile);

    var deckData = {
      name: $scope.deckName,
      deckClass: deckClass,
      cards: {}
    };

    $rootScope.loading = true;
    if (fs.existsSync(deckPath)) {
      var files = fs.readdirSync(deckDirectory);
      deckFile = $scope.deckName.replace(/ /g, '-').toLowerCase() + '-' + files.length + '.json';
      deckPath = path.join(deckDirectory, deckFile);
    }
    fs.writeFileAsync(deckPath, JSON.stringify(deckData, null, '\t'))
      .then(function () {
        $scope.$apply(function () {
          $rootScope.loading = false;
          utils.navigate('/deck-builder/edit/' + deckFile);
        });
      })
      .catch(console.error.bind(console));
  };
};
