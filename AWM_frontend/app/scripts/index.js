'use strict';

/**
 * @ngdoc overview
 * @name Todo
 * @description
 * # Todo
 *
 * Main module of the application.
 */
angular
  .module('Todo', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/signIn.html',
        controller: 'signInCtrl',
        controllerAs: 'signIn'
      })
        .when('/signUp', {
            templateUrl: 'views/signUp.html',
            controller: 'signUpCtrl',
            controllerAs: 'signUp'
        })
        .when('/todoGroup', {
            templateUrl: 'views/todoGroup.html',
            controller: 'todoGroupCtrl',
            controllerAs: 'todoGroup'
        })
        .when('/todo', {
            templateUrl: 'views/todo.html',
            controller: 'todoCtrl',
            controllerAs: 'todo'
        })
        .when('/logout', {
            templateUrl: 'views/logout.html',
            controller: 'logoutCtrl',
            controllerAs: 'logout'
        })
      .otherwise({
        redirectTo: '/'
      });
  });
