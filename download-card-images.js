var fs = require('fs');
var request = require('request');
var imageUrl = 'http://wow.zamimg.com/images/hearthstone/cards/enus/original/{{cardId}}.png';
var cardSets = require('./src/data/all-sets.json');
require('colors');

// Build a complete array of card IDs from the Hearthstone JSON data.
var cardIds = [];
Object.keys(cardSets).forEach(function (setName) {
 cardIds = cardIds.concat(cardSets[setName].map(function (card) {
   return card.id;
 }));
});

// Download card images from Hearthhead.com for each ID.
// Thank you Hearthhead for naming the card image URLs with the Hearthstone card ID.
var recurse = function (cardId) {
  if (!cardId) return;
  console.log('Trying ' + cardId + '...');
  var uri = imageUrl.replace("{{cardId}}", cardId);
  request.head(uri, function(err, res, body){
    if (err) {
      console.error(err); 
      return;
    }
    if (res.statusCode !== 200) {
      console.error(cardId + ': ' + res.statusCode.toString().red + ' ' + res.statusMessage.red);
      recurse(cardIds.shift());
      return;
    }
    var timedOut = false;
    var timeoutId = setTimeout(function () {
      timedOut = true;
      console.log(cardId + ': ' + 'timed out.'.red);
      console.log('Retrying ' + cardId + '...');
      recurse(cardId);
    }, 25000);
    request(uri).pipe(fs.createWriteStream('./src/imgs/cards/' + cardId + '.png'))
      .on('close', function () {
        if (!timedOut) {
          clearTimeout(timeoutId);
          console.log(cardId + ': ' + 'SAVED!'.green);
          recurse(cardIds.shift());
        }
      });
  });
};
recurse(cardIds.shift());
