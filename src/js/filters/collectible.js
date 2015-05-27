var _ = require('lodash');

module.exports = function ($filter) {
  var orderBy = $filter('orderBy');
  var cardSort = $filter('cardSort');
  return function (cards) {
    var filteredCards = _.filter(cards, function (card) {
      return card.collectible && _.contains(['Minion', 'Spell', 'Weapon'], card.type);
    });
    return cardSort(filteredCards);
  };
};
