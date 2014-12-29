var module = angular.module('app')

    module.factory('MongoDB', function ($mongolabResourceHttp) {
      
    return $mongolabResourceHttp('I changed angular-mongolab.js, use Project.collection instead, see below');
});

  module.controller('mongoCtrl', ['$scope', '$MongoDB',
    function ($scope, $MongoDB)
  {
    
    
     
    }]);
