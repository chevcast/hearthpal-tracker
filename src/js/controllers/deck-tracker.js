var path = require('path');
var LogWatcher = require('hearthstone-log-watcher');
var decksPath = path.join(__dirname, '..', '..', 'data', 'decks');

module.exports = function ($rootScope, $scope, $routeParams, mainWindow, cards, utils) {
  $rootScope.title = "Deck Tracker";
  $scope.selectedZone = "deck";
  $scope.selectedTeam = "friendly";
  $scope.friendlyName = "Friendly Player";
  $scope.opposingName = "Opposing Player";
  $scope.deck = require(path.join(decksPath, $routeParams.deckFile));

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

  // Add all cards from deck to deck zone.
  Object.keys($scope.deck.cards).forEach(function (cardId) {
    var count = $scope.deck.cards[cardId];
    for (var i = 0; i < count; i++) {
      $scope.friendlyDeck.push({
        id: cardId,
        entityId: null
      });
    }
  });

  // Configure the log watcher.
  var logWatcher = new LogWatcher();

  // Detect when the game has begun and set player names.
  logWatcher.on('game-start', function (players) {
    $scope.$apply(function () {
      players.forEach(function (player) {
        $scope[player.team.toLowerCase() + 'Name'] = player.name;
      });
    });
  });

  // Associate deck cards with reported entities, or add new cards.
  logWatcher.on('zone-change', function (data) {
    console.log('zone-change: ', data);
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

      console.log('zone-change2: ', data);

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
              console.log(data.cardName + ' found in ' + fromZone + '.');
              zone.splice(index, 1);
              console.log(data.cardName + ' removed from ' + fromZone + '.');
            }
          }
        });
      }

      // If card is friendly and has no entityId then it either didn't have a fromZone or the card did not exist in any zones.
      // In this case check our friendly deck to see if we have a card by the same name but not yet associated with an entityId.
      // If so, associate it and remove it from the deck zone.
      if (data.toTeam === 'FRIENDLY' && !card.hasOwnProperty('entityId')) {
        console.log(data.cardName + ' has no entityId and is friendly.');
        $scope.friendlyDeck.forEach(function (deckCard, index, friendlyDeck) {
          if (deckCard.id === data.cardId && deckCard.entityId === null) {
            deckCard.entityId = data.entityId;
            card = deckCard;
            console.log(data.cardName + ' has been associated with a card in our deck.');
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
        console.log(data.cardName + ' has been added to ' + toZone + '.');
      }

    });
  });

  // Detect when game has finished and clean up data.
  logWatcher.on('game-over', function (players) {
    logWatcher.removeAllListeners();
    logWatcher.stop();
    mainWindow.reload();
  });

  logWatcher.start();

  $scope.done = function () {
    logWatcher.removeAllListeners();
    logWatcher.stop();
    utils.navigate('/decks');
  };
};
