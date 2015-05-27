var _ = require('lodash');

module.exports = function (cards, $filter) {
  return {
    restrict: 'EA',
    scope: {
      suggestedCard: '=',
      cardSelected: '&'
    },
    link: function (scope, element, attrs) {
      var collectibleCards = $filter('collectible')(cards);

      var cardsEngine = new window.Bloodhound({
        local: Object.keys(collectibleCards).map(function (cardName) {
          return collectibleCards[cardName];
        }),
        identify: function (card) {
          return card.id;
        },
        datumTokenizer: window.Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: window.Bloodhound.tokenizers.whitespace
      });

      element.typeahead({
        minLength: 2
      }, {
        name: 'collectible-cards',
        display: 'name',
        source: cardsEngine
      });

      // Simple hack to prevent double card add when pressing enter while
      // highlighting a typeahead suggestion.
      element.preventKeyUp = false;

      element.on('keyup', function (event) {
        scope.$apply(function () {
          var value = element.val();
          scope.suggestedCard = null;
          for (var cardId in collectibleCards) {
            var card = collectibleCards[cardId];
            if (card.name.toLowerCase() === value.toLowerCase()) {
              scope.suggestedCard = card;
              if (event.which === 13 && !element.preventKeyUp) {
                scope.cardSelected({ $card: card });
                element.typeahead('close');
                element.typeahead('val', '');
              } else if (element.preventKeyUp) {
                element.preventKeyUp = false;
              }
              break;
            }
          }
        });
      });

      element.on('typeahead:select', function (event, suggestedCard) {
        scope.$apply(function () {
          element.preventKeyUp = true;
          scope.suggestedCard = suggestedCard;
          scope.cardSelected({ $card: suggestedCard });
          element.typeahead('val', '');
        });
      });

      /*
       *var logEvent = function (event, suggestion) { console.log(event, suggestion) };
       *$element.on('typeahead:select', logEvent);
       *$element.on('typeahead:change', logEvent);
       *$element.on('typeahead:active', logEvent);
       *$element.on('typeahead:idle', logEvent);
       *$element.on('typeahead:open', logEvent);
       *$element.on('typeahead:close', logEvent);
       *$element.on('typeahead:render', logEvent);
       *$element.on('typeahead:autocomplete', logEvent);
       *$element.on('typeahead:cursorchange', logEvent);
       */
    }
  }
};
