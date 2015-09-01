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

      // For some reason the first time this fires, current and previous are identical.
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
    $scope.$apply(function () {
      // Overrid weapon and secret zones with the play zone and ignore hero and hero power zones.
      switch(data.zone) {
        case 'SECRET':
        case 'PLAY (Weapon)':
          data.zone = 'PLAY';
          break;
        case 'PLAY (Hero)':
        case 'PLAY (Hero Power)':
          return;
      }

      // Create new entity.
      var card = {
        id: data.cardId,
        entityId: data.entityId
      };

      // Check all tracking arrays to see if entity exists.
      // If it does, override card with the existing card.
      var team = data.team.toLowerCase();
      var newZone = team + data.zone.charAt(0).toUpperCase() + data.zone.slice(1).toLowerCase();
      var entityFound = false;

      if (!entityFound && newZone !== team + 'Hand') {
        $scope[team + 'Hand'].forEach(function (handCard, index, zone) {
          if (handCard.id === data.cardId) {
            if (handCard.entityId === data.entityId) {
              card = handCard;
              entityFound = true;
              zone.splice(index, 1);
            }
          }
        });
      }
      if (!entityFound && newZone !== team + 'Play') {
        $scope[team + 'Play'].forEach(function (playCard, index, zone) {
          if (playCard.id === data.cardId) {
            if (playCard.entityId === data.entityId) {
              card = playCard;
              entityFound = true;
              zone.splice(index, 1);
            }
          }
        });
      }
      if (!entityFound && newZone !== team + 'Graveyard') {
        $scope[team + 'Graveyard'].forEach(function (graveCard, index, zone) {
          if (graveCard.id === data.cardId) {
            if (graveCard.entityId === data.entityId) {
              card = graveCard;
              entityFound = true;
              zone.splice(index, 1);
            }
          }
        });
      }
      if (!entityFound && newZone !== team + 'Deck') {
        $scope[team + 'Deck'].forEach(function (deckCard, index, zone) {
          if (deckCard.id === data.cardId) {
            if (deckCard.entityId === null) {
              deckCard.entityId = data.entityId;
            }
            if (deckCard.entityId === data.entityId) {
              card = deckCard;
              entityFound = true;
              zone.splice(index, 1);
            }
          }
        });
      }
      
      // Put card into new zone.
      $scope[newZone].push(card);
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
