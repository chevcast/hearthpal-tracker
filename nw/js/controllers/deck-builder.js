angular.module('app').controller('deckBuilder', function ($rootScope, $scope, $routeParams, utils, cards, socket) {
  $rootScope.loading = true;
  cards.then(function (cards) {
    $rootScope.loading = false;
    $rootScope.title = "Deck Builder";
    $scope.go = utils.navigate;
    $scope.mode = $routeParams.mode.toLowerCase();

    var deckFile = $routeParams.deckFile;

    // If delete mode, delete the deck file.
    switch ($scope.mode) {
      case 'delete':
        socket.perform('deleteDeck', deckFile, function () {
          utils.navigate('/decks');
        });
        return;
      default:
        socket.perform('getDeck', deckFile, function (err, deck) {
          if (err) { return console.error(err); }
          $scope.deck = deck;
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
        });
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
      utils.navigate('/decks');
    };

    $scope.save = function () {
      $rootScope.loading = true;
      socket.perform('saveDeck', {
        deckFile: deckFile,
        deck: $scope.deck
      }, function (err) {
        if (err) { return console.error(err); }
        $rootScope.loading = false;
        utils.navigate('/decks');
      });
    };
  }).catch(console.error.bind(console));
});
