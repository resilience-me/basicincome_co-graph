var module = angular.module('app')


 module.factory('MongoDB', function ($mongolabResourceHttp) {
      
    return $mongolabResourceHttp();
});

angular.module('app').service('$MongoDB', ['$rootScope', 'MongoDB', function ($scope, MongoDB) {
  

    MongoDB.get_database(function(data){
    
    $scope.database = data
    console.log(data)})
    
    
    
this.getpathways = function(address, callback){
  MongoDB.collection(address)
  
  MongoDB.query({ type: "safety_net_pathway" }).then(function(data){
$scope.pathways = data
callback(data)

  });
  
}

this.get_consumption_outside_network = function(address, callback){
  MongoDB.collection(address)
  
  MongoDB.query({ type: "consumption_outside_network" }).then(function(data){
$scope.consumption_outside_network = data
callback(data)

  });
  
}



this.get_tax_blob = function(address, callback){
  MongoDB.collection(address)
  
  MongoDB.query({ type: "tax_blob" }).then(function(data){
$scope.tax_blob = data
callback(data)

  });
  
}




}]);


 






