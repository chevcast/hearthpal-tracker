var fs = require('fs');
var path = require('path');
var bluebird = require('bluebird');
var extend = require('extend');
bluebird.promisifyAll(fs);
module.exports = function ($scope, $rootScope, utils) {
  $rootScope.title = "My Decks";
  var decksPath = path.join(__dirname, '..', '..', 'data', 'decks');
  if (!fs.existsSync(decksPath)) {
    fs.mkdirSync(decksPath);
  }
  $scope.decks = [];
  fs.readdirAsync(decksPath).then(function (decks) {
    $scope.$apply(function () {
      decks = decks.filter(function (deckFile) {
        return path.extname(deckFile) === '.json';
      });
      $scope.decks = decks.map(function (deckFile) {
        var deck = require(path.join(decksPath, deckFile));
        deck.fileName = deckFile;
        return deck;
      });
    });
  }).catch(console.error.bind(console));
  $scope.go = utils.navigate;
};
