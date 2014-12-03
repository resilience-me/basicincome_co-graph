var module = angular.module('app')

    module.factory('Project', function ($mongolabResourceHttp) {
      
    return $mongolabResourceHttp('I changed angular-mongolab.js, use Project.collection instead, see below');
});

  module.controller('mongoCtrl', ['$scope', 'Project',
    function ($scope, Project)
  {
    	$scope.test = function(){}

    
    
    
$scope.getpathways = function(address, callback){
  Project.collection(address)
  
  Project.query({ type: "dividend_pathway" }).then(function(data){
$scope.pathways = data
callback(data)

  });
  
}

     
    }]);
