var module = angular.module('app')


 

angular.module('app').service('SwitchColor', ['$rootScope', function ($scope) {
  

this.shift = function(){
if($scope.network_type !='Dividend Pathways'){
$scope.myStyle = {'fill' : COLOR_TABLE[(COLOR_TABLE.hasOwnProperty(cur)?cur:'SAF')][0][1] }
console.log(COLOR_TABLE[(COLOR_TABLE.hasOwnProperty(cur)?cur:'SAF')][0][1])
	console.log(JSON.stringify($scope.myStyle) + "haha")

}
else {
	$scope.myStyle = {'fill' : COLOR_TABLE[(COLOR_TABLE.hasOwnProperty(cur)?cur:'DIV')][0][1] }
	console.log(JSON.stringify($scope.myStyle) + "haha")
}

}


}]);


 






