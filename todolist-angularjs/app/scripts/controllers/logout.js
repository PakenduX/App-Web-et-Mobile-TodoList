'use strict';

/**
 * @ngdoc function
 * @name pkssApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pkssApp
 */
angular.module('Todo')
    .controller('logoutCtrl', function ($cookies, $rootScope, $window) {
        $cookies.remove('email');
        $cookies.remove('isConnected');
        $cookies.remove('userId');
        $rootScope.isConnected = false;
        $window.location.href = '#!/';

    });
