angular.module('app', ['ngRoute','ngAnimate'])
  .config(function ($routeProvider) {
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
      })
  });

