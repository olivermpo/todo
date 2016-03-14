angular.module('todoApp').config(function($stateProvider, $urlRouterProvider) {
  // /$urlRouterProvider.otherwise("/todoList");
  $urlRouterProvider.otherwise("todoList");

  $stateProvider.state('todoList', {
    url: "/todoList",
    templateUrl: "/templates/todoList.html",
    controller: "todoCtrl as vm"
  });
});
