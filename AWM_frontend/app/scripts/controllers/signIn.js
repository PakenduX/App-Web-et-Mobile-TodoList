'use strict';

angular.module('Todo')
  .controller('signInCtrl', function ($scope, $cookies, $http, $window, $rootScope) {
      $scope.formData = {};
      $scope.userSignIn = () => {
          $http.post('http://mamadembele.fr:3000/signIn', $scope.formData)
              .then(res => {
                  if(res.data.errors !== undefined)
                      $scope.errors = res.data.errors;
                  else if(res.data.status === 'error')
                      $scope.error = res.data.message;
                  else{
                      $cookies.put('email', $scope.formData.email);
                      $rootScope.isConnected = true;
                      $cookies.put('isConnected', true);
                      $window.location.href = '#!/todoGroup';
                  }
              })
              .catch(error => {
                  console.log('Error: ' + error);
              });
      };
  });
