angular.module("todoApp")
    .controller("todoCtrl", ["$http", function($http) {
            var vm = this;

            vm.markAsComplete = function(todoItem){
              removeTodo(todoItem.id);
            };

            vm.addTodoItem = function(){
              addTodo(vm.itemData);
              vm.itemData = "";
            };

            vm.getItems = function() {
              $http.get('/todo/api/todoitems')
                .success(function(data) {
                  vm.todoData = data;
                  console.log(data);
                })
                .error(function(error) {
                  console.log('Error: ' + error);
                });
            };

            var addTodo = function(requestData) {
              $http.post('/todo/api/todoitems', {text: requestData})
                .success(function(data) {
                  vm.todoData = data;
                  console.log(data);
                })
                .error(function(error) {
                  console.log('Error: ' + error);
                });
            };

            var removeTodo = function(todoID) {
              $http.delete('/todo/api/todoitems/' + todoID)
                .success(function(data) {
                  vm.todoData = data;
                  console.log(data);
                })
                .error(function(data) {
                  console.log('Error: ' + data);
                });
            };



            var activate = function() {
                vm.getItems();
            };

            activate();

        }
    ]);
