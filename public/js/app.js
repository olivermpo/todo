angular.module('todoApp', [])

.controller('mainController', function($scope, $http) {
    var vm = this;
    $scope.formData = {};
    $scope.todoData = {};

    // Get all todos

    vm.getItems = function() {
    $http.get('/api/todoitems')
        .success(function(data) {
            $scope.todoData = data;
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
      };

    vm.addTodo = function(todoID) {
        $http.post('/api/todoitems', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.todoData = data;
                console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    };

    vm.removeTodo = function(todoID) {
        $http.delete('/api/todoitems/' + todoID)
            .success(function(data) {
                $scope.todoData = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

});
