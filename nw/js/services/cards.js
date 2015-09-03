angular.module('app').factory('cards', function ($q, socket) {
  return new $q(function (resolve, reject) {
    socket.perform('getCards', null, function (err, cards) {
      if (err) { return reject(err); }
      resolve(cards); 
    });
  });
});
