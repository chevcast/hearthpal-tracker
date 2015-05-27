module.exports = function ($filter) {
  var orderBy = $filter('orderBy');
  return function (cards) {
    var typeSort = function (card) {
      var typePriority = {
        'Weapon': 0,
        'Spell': 1,
        'Minion': 2
      };
      return typePriority[card.type];
    };
    return orderBy(cards, ['cost',typeSort,'name']);
  };
};
