module.exports = function ($scope, $rootScope, $window, utils) {
  $rootScope.title = "Confirm";
  if (!$rootScope.confirmData) {
    $window.history.back(); 
    return;
  }
  $scope.msg = $rootScope.confirmData.msg;
  $scope.path = $rootScope.confirmData.path;
  delete $rootScope.confirmData; 

  $scope.yes = function () {
    utils.navigate($scope.path);
  };

  $scope.no = function () {
    $window.history.back();
  };
};
