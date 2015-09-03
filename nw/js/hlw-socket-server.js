var io = require('socket.io')(1337);
var fs = require('fs');
var path = require('path');
var LogWatcher = require('hearthstone-log-watcher');
var logWatcher = new LogWatcher();

var decksPath = path.join(__dirname, '..', 'data', 'decks');
if (!fs.existsSync(decksPath)) {
  fs.mkdirSync(decksPath);
}

io.on('connection', function (socket) {
  socket.on('getCards', function (data, cb) {
    cb(null, require('../data/cards.json'));
  });
  socket.on('deleteDeck', function (deckFile, cb) {
    fs.unlink(path.join(decksPath, deckFile), cb); 
  });
  socket.on('getDeck', function (deckFile, cb) {
    fs.readFile(path.join(decksPath, deckFile), function (err, deck) {
      if (err) { return cb(err); }
      cb(null, JSON.parse(deck));
    });
  });
  socket.on('getDecks', function (data, cb) {
    fs.readdirAsync(decksPath, function (err, decks) {
      if (err) { return cb(err); }
      cb(null, decks.reduce(function (previousDeck, deckFile) {
        if (path.extname(deckFile) === '.json') {
          var deck = JSON.parse(fs.readFileSync(path.join(decksPath, deckFile)));
          deck.fileName = deckFile;
          return previousDeck.concat([deck]);
        }
      }));
    });
  });
  socket.on('saveDeck', function (data, cb) {
    fs.writeFile(path.join(decksPath, data.deckFile), JSON.stringify(data.deck, null, '\t'), function (err) {
      cb(err);
    });
  });
  socket.on('newDeck', function (data, cb) {
    if (fs.existsSync(path.join(decksPath, data.deckFile))) {
      var files = fs.readdirSync(decksPath);
      deckFile = data.deckData.name.replace(/ /g, '-').toLowerCase() + '-' + files.length + '.json';
    }
    fs.writeFileAsync(path.join(decksPath, deckFile), JSON.stringify(data.deckData, null, '\t'), cb);
  });
  
  // LogWatcher
  logWatcher.on('zone-change', socket.emit.bind(socket, 'hlw:zone-change'));
  logWatcher.on('game-start', socket.emit.bind(socket, 'hlw:game-start'));
  logWatcher.on('game-over', socket.emit.bind(socket, 'hlw:game-over'));

  socket.on('startLogWatcher', function (data, cb) {
    logWatcher.start();
    cb();
  });

  socket.on('stopLogWatcher', function (data, cb) {
    logWatcher.stop();
    cb();
  });
});
