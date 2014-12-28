var module = angular.module('app')

    module.factory('Project', function ($mongolabResourceHttp) {
      
    return $mongolabResourceHttp('I changed angular-mongolab.js, use Project.collection instead, see below');
});

  module.controller('mongoCtrl', ['$scope', 'Project',
    function ($scope, Project)
  {
    	$scope.test = function(){}

    
    Project.get_database(function(data){
    
    $scope.database = data
    console.log(data)})
    
$scope.getpathways = function(address, callback){
  Project.collection(address)
  
  Project.query({ type: "safety_net_pathway" }).then(function(data){
$scope.pathways = data
callback(data)

  });
  
}

$scope.get_consumption_outside_network = function(address, callback){
  Project.collection(address)
  
  Project.query({ type: "consumption_outside_network" }).then(function(data){
$scope.consumption_outside_network = data
callback(data)

  });
  
}



$scope.get_tax_blob = function(address, callback){
  Project.collection(address)
  
  Project.query({ type: "tax_blob" }).then(function(data){
$scope.tax_blob = data
callback(data)

  });
  
}


     
    }]);
