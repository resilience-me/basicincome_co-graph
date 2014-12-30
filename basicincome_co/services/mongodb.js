var module = angular.module('app')


 module.factory('MongoDB', function ($mongolabResourceHttp) {
      
    return $mongolabResourceHttp();
});

angular.module('app').service('$MongoDB', ['$rootScope', 'MongoDB', function ($scope, MongoDB) {
  




    MongoDB.get_database(function(data){
    
    $scope.database = data
    console.log(data)})
    
    
  var type = "safety_net_pathway"
  
  
this.type1 = function(){
  type = "safety_net_pathway"  
  console.log(type)
}

this.type2 = function(){
  type = "dividend_pathway"  
}

    
this.getpathways = function(address, callback){
  $scope.address = address
  MongoDB.collection(address)
  console.log("thiss"+type)
 
  MongoDB.query({ type: type }).then(function(data){
$scope.pathways = data
console.log("thiss"+JSON.stringify(data))
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
console.log("this"+data[0].total_amount)
callback(data)

  });
  
}




}]);


 






