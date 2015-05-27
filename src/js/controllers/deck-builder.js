var path = require('path');
var fs = require('fs');
var bluebird = require('bluebird');
bluebird.promisifyAll(fs);

module.exports = function ($rootScope, $scope, $routeParams, utils, cards) {
  $rootScope.title = "Deck Builder";
  $scope.go = utils.navigate;
  $scope.mode = $routeParams.mode.toLowerCase();

  var deckFile = $routeParams.deckFile;
  var deckPath = path.join(__dirname, '..', '..', 'data', 'decks', deckFile);

  // If delete mode, delete the deck file.
  switch ($scope.mode) {
    case 'delete':
      fs.unlink(deckPath);
      utils.navigate('/decks');
      return;
    default:
      var deckName = $routeParams.deckName;
      $scope.deck = require(deckPath);
      $scope.$watch('deck.cards', function (newValue) {
        $scope.totalCards = 0;
        $scope.cards = Object.keys(newValue).map(function (cardId) {
          var count = $scope.deck.cards[cardId];
          $scope.totalCards += count;
          var cardInfo = cards[cardId];
          return {
            id: cardId,
            count: count,
            collectible: cardInfo.collectible,
            playerClass: cardInfo.playerClass,
            cost: cardInfo.cost,
            type: cardInfo.type,
            name: cardInfo.name
          };
        });
      }, true);
      break;
  }

  $scope.addCard = function (cardToAdd) {
    if ($scope.deck.cards.hasOwnProperty(cardToAdd.id)) {
      $scope.deck.cards[cardToAdd.id] += 1;
    } else {
      $scope.deck.cards[cardToAdd.id] = 1;
    }
  };

  $scope.removeCard = function (cardId) {
    if ($scope.deck.cards[cardId] > 1) {
      $scope.deck.cards[cardId]--;
    } else {
      delete $scope.deck.cards[cardId];
    }
  };

  $scope.cancel = function () {
    delete require.cache[deckPath];
    utils.navigate('/decks');
  };

  $scope.save = function () {
    $rootScope.loading = true;
    fs.writeFileAsync(deckPath, JSON.stringify($scope.deck, null, '\t'))
      .then(function () {
        $scope.$apply(function () {
          $rootScope.loading = false;
          utils.navigate('/decks');
        });
      })
      .catch(console.error.bind(console));
  };
};
