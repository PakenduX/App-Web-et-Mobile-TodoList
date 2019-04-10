'use strict';

/**
 * @ngdoc function
 * @name pkssApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pkssApp
 */
angular.module('Todo')
    .controller('todoCtrl', function ($scope, $http, $cookies, $routeParams, $rootScope, $window) {
        $scope.todoGroupNom = $routeParams.todoGroupNom;
        $scope.formData = {};
        let groupId = $routeParams.todoGroupId;
        let isConnected = $cookies.get('isConnected');
        if(isConnected)
            $rootScope.isConnected = true;
        else
            $rootScope.isConnected = false;
        $http.get(`http://localhost:3000/todos/${groupId}`)
            .then(res => {
               $scope.todos = res.data;
            })
            .catch(error => {
                console.log(error);
            });

        $scope.ajouterTodo = function () {
            $http.post(`http://localhost:3000/todo/create/${$cookies.get('userId')}/${groupId}`, $scope.formData)
                .then(res => {
                    $scope.formData = {};
                    $window.location.reload();
                })
                .catch(error => {
                    console.log(error);
                });
        };

        $scope.supprimerTodo = function (id) {
            if(confirm('T\'es sûr de vouloir supprimer ta tâche ?'))
                $http.delete(`http://localhost:3000/todo/delete/${id}`)
                    .then(res => {
                        $window.location.reload();
                    })
                    .catch(error => {
                        console.log(error);
                    });
        }

        $scope.modifierTodo = function (id) {
            let data = {
                text: $scope.formData.texte,
                done: $scope.formData.done
            };

            $http.put(`http://localhost:3000/todo/update/${id}`, data)
                .then(res => {
                    console.log(res.data);
                    $window.location.reload();
                })
                .catch(error => {
                    console.log(error);
                });
        }
    });
