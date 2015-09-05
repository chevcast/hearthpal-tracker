var angularDependencies = ['ngRoute'];
if (config.target !== 'nw') {
  angularDependencies.push('ngAnimate');
}
angular.module('app', angularDependencies)
  .config(function ($routeProvider, $compileProvider) {
    $routeProvider
      .when('/decks', {
        templateUrl: resolvePath('/templates/decks.html'),
        controller: 'decks'
      })
      .when('/confirm', {
        templateUrl: resolvePath('/templates/confirm.html'),
        controller: 'confirm'
      })
      .when('/new-deck', {
        templateUrl: resolvePath('/templates/new-deck.html'),
        controller: 'newDeck'
      })
      .when('/deck-builder/:mode/:deckFile', {
        templateUrl: resolvePath('/templates/deck-builder.html'),
        controller: 'deckBuilder'
      })
      .when('/deck-tracker/:deckFile', {
        templateUrl: resolvePath('/templates/deck-tracker.html'),
        controller: 'deckTracker'
      })
      .otherwise({
        redirectTo: '/decks'
      });
      
    // Holy crap this took forever to figure out. Angular hated the overwolf-extnesion prefix for URLs.
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|overwolf-extension):|data:image\/)/);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|overwolf-extension):/)
  });

