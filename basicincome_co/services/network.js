/* this service encapsulates a Ripple-Network instance */


var module = angular.module('app');

module.service('$network', ['$rootScope', function($scope)
{
    this.shout = function(){console.log("SHOUT")}
  this.remote = new ripple2.Remote({
  // see the API Reference for available options
  servers: [ 'wss://s1.ripple.com:443' ]
}).connect();
       
    
}]);

