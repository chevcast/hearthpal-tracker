angular.module('app').factory('socket', function ($rootScope) {
  var socket = io('http://localhost:1337');

  socket.on('error', console.error.bind(console));

  // Create new method to ensure that any callback
  // logic runs within an angular digest cycle.
  socket.perform = function (name, data, cb) {
    if (cb) {
      socket.emit(name, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          cb.apply(null, args);
        });
      });
    } else {
      socket.emit(name, data);
    }
  };
  return socket;
});
