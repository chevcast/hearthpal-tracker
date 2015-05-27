module.exports = function ($location, $rootScope) {
  var utils = {};
  utils.navigate = function (path, confirmMsg) {
    if (!confirmMsg) {
      $location.path(path);
    } else {
      $rootScope.confirmData = {
        msg: confirmMsg,
        path: path
      };
      $location.path('/confirm');
    }
  };
  return utils;
};
