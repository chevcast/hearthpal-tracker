module.exports = function ($rootScope, $scope, mainWindow) {
  $rootScope.title = "Untitled";
  $scope.closeApp = function () {
    mainWindow.close();
  };
  $scope.minimizeApp = function () {
    mainWindow.minimize();
  };
  $scope.devTools = function (event) {
    if (!event.ctrlKey || event.keyCode !== 68) {
      return;
    }
    if (!mainWindow.isDevToolsOpen()) {
      mainWindow.showDevTools();
    } else {
      mainWindow.closeDevTools();
    }
  };
  $rootScope.loading = false;
  $rootScope.$on('$routeChangeSuccess', function (e, data) {
    if (data.redirectTo !== undefined) {
      mainWindow.redraw();
    }
  });
};
