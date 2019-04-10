'use strict';

/**
 * @ngdoc function
 * @name pkssApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pkssApp
 */
angular.module('Todo')
    .controller('todoGroupCtrl', function ($scope, $http, $cookies, $rootScope, $window) {
        let email = $cookies.get('email');
        $scope.formData = {};
        let owner;
        let isConnected = $cookies.get('isConnected');
        if(isConnected)
            $rootScope.isConnected = true;
        else
            $rootScope.isConnected = false;
        $http.get(`http://localhost:3000/user/${email}`)
            .then(res => {
                owner = res.data[0]._id;
                $cookies.put('userId', owner);
                $http.get(`http://localhost:3000/user/todoGroups/${res.data[0]._id}`)
                    .then(response => {
                        $scope.todoGroup = response.data;
                    })
                    .catch(errors => {
                        console.log('Error: ' + errors);
                    });
            })
            .catch(error => {
                console.log(error);
            });

        $scope.ajouterTG = function () {
            $http.post(`http://localhost:3000/todoGroup/create/${owner}`, $scope.formData)
                .then(res => {
                    $window.location.reload();
                })
                .catch(error => {
                    console.log(error);
                });
        }

        $scope.supprimerTG = function (id) {
            if(confirm('T\'es sûr de vouloir supprimer ta liste de tâche ?'))
                $http.delete(`http://localhost:3000/todoGroup/delete/${id}`)
                    .then(res => {
                        $window.location.reload();
                    })
                    .catch(error => {
                        console.log(error);
                    });
        }
    });
