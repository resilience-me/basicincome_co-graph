/* this service encapsulates a vaultClient instance */

var module = angular.module('app');

module.service('$vaultClient', ['$rootScope', function($scope)
{
    
  this.vaultClient = new ripple2.VaultClient();
    
}]);