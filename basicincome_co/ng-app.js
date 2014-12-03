var app = angular.module('app', ['ng', 'mongolabResourceHttp']);

// 
// a factory for MongoLabs API

app.constant('MONGOLAB_CONFIG',{API_KEY:'_5sK-6UJIaR72iqjdI0lHAo7l90nA9yp', DB_NAME:'awesome_box'});



app.controller('AppCtrl', ['$scope',
    function ($scope) {
    	$scope.test = function(){}

$scope.hej = "hehehe"
    }]);
    
    
    
    