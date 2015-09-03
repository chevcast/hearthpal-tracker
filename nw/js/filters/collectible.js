angular.module('app').filter('collectible', function ($filter) {
  var orderBy = $filter('orderBy');
  var cardSort = $filter('cardSort');
  return function (cards) {
    cards = Object.keys(cards).map(function (cardId) {
      return cards[cardId];
    });
    var filteredCards = cards.filter(function (card) {
      var validType = false;
      switch (card.type) {
        case 'Minion':
        case 'Spell':
        case 'Weapon':
          validType = true;
          break;
      }
      return card.collectible && validType;
    });
    return cardSort(filteredCards);
  };
});
