'use strict';

/**
 * @ngdoc function
 * @name pkssApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pkssApp
 */
angular.module('Todo')
    .controller('signUpCtrl', function ($scope, $http, $window) {
        $scope.formData = {};
        $scope.userSignUp = () => {
            $http.post('http://localhost:3000/signUp', $scope.formData)
                .then(res => {
                    if(res.data.errors !== undefined){
                        $scope.errors = res.data.errors;
                    }else
                        $window.location.href = '#!/signIn';

                })
                .catch(error => {
                    console.log('Error: ' + error);
                });
        };
    });
