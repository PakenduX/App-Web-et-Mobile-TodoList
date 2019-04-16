angular.module('starter.controllers', [])

/**
 * Controller de la connexion
 */
    .controller('signInCtrl', function ($scope, $http, $window, $rootScope, $state) {
      $scope.formData = {
          email: '',
          password: ''
      };
  $scope.userSignIn = function(){
    $http.post('http://mamadembele.fr:3000/signIn', $scope.formData)
      .then(function(res) {
        if(res.data.errors !== undefined)
          $scope.errors = res.data.errors;
        else if(res.data.status === 'error')
          $scope.error = res.data.message;
        else{
          window.localStorage.setItem('email', $scope.formData.email);
          $rootScope.isConnected = true;
          window.localStorage.setItem('isConnected', true);
          $state.go('tab.chats');
        }
      })
      .catch(function(error){
        console.log('Error: ' + error);
      });
  };

})
    /**
     * Controller de la liste des tâches
     */
.controller('todoGroupCtrl', function ($scope, $http, $rootScope, $window, $ionicPopup, $state) {

  let email = window.localStorage.getItem('email');
  $scope.formData = {};
  let owner;

  $http.get(`http://mamadembele.fr:3000/user/${email}`)
    .then(res => {
      owner = res.data[0]._id;
      window.localStorage.setItem('userId', owner);
      $http.get(`http://mamadembele.fr:3000/user/todoGroups/${res.data[0]._id}`)
        .then(response => {
          $scope.todoGroup = response.data;
            if($rootScope.todoTriggered)
                $rootScope.todoTriggered = false;
        })
        .catch(errors => {
          console.log('Error: ' + errors);
        });
    })
    .catch(error => {
      console.log(error);
    });

  $scope.ajouterTG = function () {
    $http.post(`http://mamadembele.fr:3000/todoGroup/create/${owner}`, $scope.formData)
      .then(res => {
          $state.go($state.current, {}, { reload : true });
      })
      .catch(error => {
        console.log(error);
      });
  };

  $scope.supprimerTG = function (id) {
    if (confirm('T\'es sûr de vouloir supprimer ta liste de tâche ?'))
      $http.delete(`http://mamadembele.fr:3000/todoGroup/delete/${id}`)
        .then(res => {
            $state.go($state.current, {}, { reload : true });
        })
        .catch(error => {
          console.log(error);
        });
  };

  $scope.goToTodos = function(id, nom) {
      $rootScope.todoTriggered = true;
      $state.go('tab.todo', { 'todoGroupId': id, 'todoGroupNom': nom });
  };

    /**
     * Pop-up utilisé pour la modification de la liste de tâche
     */
  $scope.showPopup = function (id) {
    $scope.data = {};

    var myPopup = $ionicPopup.show({
      template: '<input type="text" class="form-control mb-4" ng-model="data.nom">',
      title: 'Saisis le nouveau nom',
      scope: $scope,
      buttons: [
        {text: 'Annuler'},
        {
          text: '<b>Modifier</b>',
          type: 'button-positive',
          onTap: function (e) {
              $http.put(`http://mamadembele.fr:3000/todoGroup/update/${id}`, $scope.data)
                  .then(res => {
                      $state.go($state.current, {}, { reload : true });
                  })
                  .catch(error => {
                      console.log(error);
                  });
          }
        }
      ]
    });

    myPopup.then(function (res) {
      console.log('Tapped!', res);
    });


  };

})
/**
 * Controller de la tâche
 */
.controller('todoCtrl', function ($scope, $http, $stateParams, $rootScope, $window, $state, $ionicPopup) {
    $scope.todoGroupNom = $stateParams.todoGroupNom;
    $scope.formData = {};
    let groupId = $stateParams.todoGroupId;
    $http.get(`http://mamadembele.fr:3000/todos/${groupId}`)
        .then(res => {
            $scope.todos = res.data;
        })
        .catch(error => {
            console.log(error);
        });

    $scope.ajouterTodo = function () {
        $http.post(`http://mamadembele.fr:3000/todo/create/${window.localStorage.getItem('userId')}/${groupId}`, $scope.formData)
            .then(res => {
                $scope.formData = {};
                $state.go($state.current, {}, { reload : true });
            })
            .catch(error => {
                console.log(error);
            });
    };

    $scope.supprimerTodo = function (id) {
        if(confirm('T\'es sûr de vouloir supprimer ta tâche ?'))
            $http.delete(`http://mamadembele.fr:3000/todo/delete/${id}`)
                .then(res => {
                    $state.go($state.current, {}, { reload : true });
                })
                .catch(error => {
                    console.log(error);
                });
    };

    $scope.modifierTodo = function (id) {
        if($scope.formData.done === undefined)
            $scope.formData.done = false;

        $http.put(`http://mamadembele.fr:3000/todo/update/${id}`, $scope.formData)
            .then(res => {
                $state.go($state.current, {}, { reload : true });
            })
            .catch(error => {
                console.log(error);
            });
    };

    $scope.showPopup = function (id, done) {
        console.log(done);
        $scope.formData = {};
        console.log($scope.formData);

        var myPopup = $ionicPopup.show({
            template: '<div class="mx-3">\n' +
                '                            <div class="md-form mb-5">\n' +
                '                                <input type="text" id="defaultForm-email" class="form-control validate" ng-model="formData.text" placeholder="Saisis le texte de la tâche">\n' +
                '                            </div>\n' +
                '\n' +
                '                            <div class="custom-control custom-switch">\n' +
                '                                <input type="checkbox" class="custom-control-input" id="customSwitch1" ng-model="formData.done" ng-checked="formData.done">\n' +
                '                                <label class="custom-control-label" for="customSwitch1">Terminée</label>\n' +
                '                            </div>\n' +
                '\n' +
                '                        </div>',
            title: 'Saisis le nouveau nom',
            scope: $scope,
            buttons: [
                {text: 'Annuler'},
                {
                    text: '<b>Modifier</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        $http.put(`http://mamadembele.fr:3000/todo/update/${id}`, $scope.formData)
                            .then(res => {
                                $state.go($state.current, {}, {reload: true});
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                }
            ]
        });

        myPopup.then(function (res) {
            console.log('Tapped!', res);
        });


    };
})
    .controller('signUpCtrl', function ($scope, $http, $window, $rootScope, $state) {
        $scope.formData = {};
        $scope.userSignUp = () => {
            $http.post('http://mamadembele.fr:3000/signUp', $scope.formData)
                .then(res => {
                    if(res.data.errors !== undefined){
                        $scope.errors = res.data.errors;
                    }else
                        $state.go('tab.dash');

                })
                .catch(error => {
                    console.log('Error: ' + error);
                });
        };
    })
    .controller('logoutCtrl', function ($rootScope, $state) {
        $rootScope.isConnected = false;
        $rootScope.todoTriggered = false;
        $state.go('tab.dash');
        window.location.reload();
    });
