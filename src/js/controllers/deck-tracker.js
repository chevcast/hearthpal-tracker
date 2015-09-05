angular.module('app').controller('deckTracker', function ($rootScope, $scope, $routeParams, $window, cards, utils, socket) {
  $rootScope.loading = true;
  cards.then(function (cards) {
    $rootScope.loading = false;
    $rootScope.title = "Deck Tracker";
    $scope.selectedZone = "deck";
    $scope.selectedTeam = "friendly";
    $scope.friendlyName = "Friendly Player";
    $scope.opposingName = "Opposing Player";
    $rootScope.loading = true;
    
    $rootScope.$on('hotkey', function (e, keyCode) {
      switch (keyCode) {
        case 49:
          $scope.selectedZone = "deck";
          break;
        case 50:
          $scope.selectedZone = "hand";
          break;
        case 51:
          $scope.selectedZone = "play";
          break;
        case 52:
          $scope.selectedZone = "grave";
          break;
      }
    });
    
    socket.perform('getDeck', $routeParams.deckFile, function (err, deck) {
      if (err) { return console.error(err); }
      $scope.deck = deck;
      $rootScope.loading = false;

      // Monitor tracking arrays and update zone display arrays.
      ['friendlyDeck', 'friendlyHand', 'friendlyPlay', 'friendlyGraveyard', 'opposingDeck', 'opposingHand', 'opposingPlay', 'opposingGraveyard'].forEach(function (zone) {
        var firstRun = true;
        $scope[zone] = [];
        $scope[zone + 'Zone'] = [];
        $scope.$watchCollection(zone, function (current, previous) {

          // Determine all cards that need to be added.
          var toAdd = [];
          current.forEach(function (card) {
            var previouslyExists = false;
            previous.forEach(function (previousCard) {
              if (card === previousCard) {
                previouslyExists = true;
              }
            });
            if (!previouslyExists || firstRun) {
              toAdd.push(card);
            }
          });
          var toRemove = [];
          previous.forEach(function (previousCard) {
            var exists = false;
            current.forEach(function (card) {
              if (card === previousCard) {
                exists = true;
              }
            });
            if (!exists) {
              toRemove.push(previousCard);
            }
          });
          toAdd.forEach(function (card) {
            var cardExists = false;
            $scope[zone + 'Zone'].forEach(function (cardData) {
              if (cardData.id === card.id) {
                cardExists = true;
                cardData.count++;
              }
            });
            if (!cardExists) {
              var cardInfo = cards[card.id];
              var cost = cardInfo.hasOwnProperty('cost') ? cardInfo.cost : 0;
              $scope[zone + 'Zone'].push({
                id: card.id,
                count: 1,
                collectible: cardInfo.collectible,
                playerClass: cardInfo.playerClass,
                cost: cost,
                type: cardInfo.type,
                name: cardInfo.name
              });
            }
          });
          toRemove.forEach(function (card) {
            $scope[zone + 'Zone'].forEach(function (cardData, index) {
              if (cardData.id === card.id) {
                if (cardData.count > 1) {
                  cardData.count--;
                } else {
                  $scope[zone + 'Zone'].splice(index, 1);
                }
              }
            });
          });

          firstRun = false;
        });
      });

      //// Add all cards from deck to deck zone.
      Object.keys($scope.deck.cards).forEach(function (cardId) {
        var count = $scope.deck.cards[cardId];
        for (var i = 0; i < count; i++) {
          $scope.friendlyDeck.push({
            id: cardId,
            entityId: null
          });
        }
      });

      // Detect when the game has begun and set player names.
      socket.on('hlw:game-start', function (players) {
        $scope.$apply(function () {
          players.forEach(function (player) {
            $scope[player.team.toLowerCase() + 'Name'] = player.name;
          });
        });
      });

      // Associate deck cards with reported entities, or add new cards.
      socket.on('hlw:zone-change', function (data) {
        $scope.$apply(function () {
          // Overrid weapon and secret zones with the play zone and ignore hero and hero power zones.
          switch(data.toZone) {
            case 'SECRET':
            case 'PLAY (Weapon)':
              data.toZone = 'PLAY';
              break;
            case 'PLAY (Hero)':
            case 'PLAY (Hero Power)':
              return;
          }
          switch(data.fromZone) {
            case 'SECRET':
            case 'PLAY (Weapon)':
              data.fromZone = 'PLAY';
              break;
            case 'PLAY (Hero)':
            case 'PLAY (Hero Power)':
              return;
          }

          // Create new entity.
          var card = {
            id: data.cardId
          };

          // Remove card from previous zone.
          if (data.fromTeam) {
            var fromZone = data.fromTeam.toLowerCase() + data.fromZone.charAt(0).toUpperCase() + data.fromZone.slice(1).toLowerCase();
            $scope[fromZone].forEach(function (zoneCard, index, zone) {
              if (zoneCard.id === data.cardId) {
                if (zoneCard.entityId === data.entityId) {
                  card = zoneCard;
                  zone.splice(index, 1);
                }
              }
            });
          }

          // If card is friendly and has no entityId then it either didn't have a fromZone or the card did not exist in any zones.
          // In this case check our friendly deck to see if we have a card by the same name but not yet associated with an entityId.
          // If so, associate it and remove it from the deck zone.
          if (data.toTeam === 'FRIENDLY' && !card.hasOwnProperty('entityId')) {
            $scope.friendlyDeck.forEach(function (deckCard, index, friendlyDeck) {
              if (deckCard.id === data.cardId && deckCard.entityId === null) {
                deckCard.entityId = data.entityId;
                card = deckCard;
                friendlyDeck.splice(index, 1);
              }
            });
          }

          // Put card into new zone.
          if (data.toTeam) {
            // If card still has no entityId then it was not found in a zone and was not associated with a card in our deck. Add the
            // entityId from the zone change event and press forward.
            if (!card.hasOwnProperty('entityId')) {
              card.entityId = data.entityId;
            }
            var toZone = data.toTeam.toLowerCase() + data.toZone.charAt(0).toUpperCase() + data.toZone.slice(1).toLowerCase();
            $scope[toZone].push(card);
          }

        });
      });

      // Detect when game has finished and clean up data.
      socket.on('hlw:game-over', function (players) {
        console.log('game over fired');
        socket.removeAllListeners('hlw:game-start');
        socket.removeAllListeners('hlw:zone-change');
        socket.removeAllListeners('hlw:game-over');
        socket.perform('stopLogWatcher', null, function () {
          console.log('log watcher stopped');
          $window.location.reload();
        });
      });

      socket.perform('startLogWatcher');

      $scope.done = function () {
        socket.removeAllListeners('hlw:game-start');
        socket.removeAllListeners('hlw:zone-change');
        socket.removeAllListeners('hlw:game-over');
        socket.perform('stopLogWatcher', null, function () {
          utils.navigate('/decks');
        });
      };
    });
  }).catch(console.error.bind(console));
});
