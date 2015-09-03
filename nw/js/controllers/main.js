angular.module('app').controller('main', function ($rootScope, $scope) {
  $rootScope.title = "Untitled";
  $rootScope.loading = false;
  /*
   *$rootScope.$on('$routeChangeSuccess', function (e, data) {
   *  if (data.redirectTo !== undefined) {
   *    mainWindow.redraw();
   *  }
   *});
   */
});
