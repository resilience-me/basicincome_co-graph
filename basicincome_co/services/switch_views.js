var module = angular.module('app')


 

angular.module('app').service('SwitchViews', ['$rootScope', function ($scope) {
  


  var type
  //dividend pathways or safety net pathways ??
 
  if($scope.switcher !== true){ 
    type ="safety_net_pathway"    
}else type ="dividend_pathway"    
console.log("thiss"+$scope.switcher)
console.log("thiss"+type)




}]);


 






