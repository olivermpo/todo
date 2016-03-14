angular.module('todoApp', ["ui.router"])

.controller('mainController', function($scope, $http) {
  $scope.formData = {};
  $scope.todoData = {};
})
;
