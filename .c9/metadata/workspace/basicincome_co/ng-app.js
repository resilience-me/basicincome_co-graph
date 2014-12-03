{"filter":false,"title":"ng-app.js","tooltip":"/basicincome_co/ng-app.js","undoManager":{"mark":64,"position":64,"stack":[[{"group":"doc","deltas":[{"start":{"row":0,"column":0},"end":{"row":36,"column":4},"action":"insert","lines":["var app = angular.module('rp', ['ng', 'ngRoute', 'angularSpinner', 'mongolabResourceHttp']);","","","app.config(['$routeProvider',","  function($routeProvider) {","    $routeProvider.","      when('/', {templateUrl: 'login.html', controller: 'AppCtrl'}).","      when('/wallet', {templateUrl: 'wallet.html', controller: 'WalletCtrl'}).","      when('/charts', {templateUrl: 'charts.html', controller: 'ChartsCtrl'}).","      when('/account', {templateUrl: 'account.html', controller: 'AppCtrl'}).","      when('/about', {templateUrl: 'about.html', controller: 'AppCtrl'}).","","      otherwise({redirectTo: '/'","      });","  }]);","","// a factory for MongoLabs API","","app.constant('MONGOLAB_CONFIG',{API_KEY:'_5sK-6UJIaR72iqjdI0lHAo7l90nA9yp', DB_NAME:'awesome_box'});","","","","app.controller('AppCtrl', ['$scope',","    function ($scope) {","    ","","$scope.logout = function(){","  window.location.assign(\"http://basicincome.co\")","}","      ","","","    }]);","    ","    ","    ","    "]}]}],[{"group":"doc","deltas":[{"start":{"row":3,"column":0},"end":{"row":15,"column":0},"action":"remove","lines":["app.config(['$routeProvider',","  function($routeProvider) {","    $routeProvider.","      when('/', {templateUrl: 'login.html', controller: 'AppCtrl'}).","      when('/wallet', {templateUrl: 'wallet.html', controller: 'WalletCtrl'}).","      when('/charts', {templateUrl: 'charts.html', controller: 'ChartsCtrl'}).","      when('/account', {templateUrl: 'account.html', controller: 'AppCtrl'}).","      when('/about', {templateUrl: 'about.html', controller: 'AppCtrl'}).","","      otherwise({redirectTo: '/'","      });","  }]);",""]}]}],[{"group":"doc","deltas":[{"start":{"row":2,"column":0},"end":{"row":3,"column":0},"action":"remove","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":39},"end":{"row":0,"column":46},"action":"remove","lines":["ngRoute"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":39},"end":{"row":0,"column":40},"action":"remove","lines":["'"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":38},"end":{"row":0,"column":39},"action":"remove","lines":["'"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":37},"end":{"row":0,"column":38},"action":"remove","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":36},"end":{"row":0,"column":37},"action":"remove","lines":[","]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":39},"end":{"row":0,"column":53},"action":"remove","lines":["angularSpinner"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":38},"end":{"row":0,"column":40},"action":"remove","lines":["''"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":37},"end":{"row":0,"column":38},"action":"remove","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":36},"end":{"row":0,"column":37},"action":"remove","lines":[","]}]}],[{"group":"doc","deltas":[{"start":{"row":13,"column":0},"end":{"row":16,"column":6},"action":"remove","lines":["$scope.logout = function(){","  window.location.assign(\"http://basicincome.co\")","}","      "]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":0},"end":{"row":13,"column":0},"action":"remove","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":0},"end":{"row":13,"column":0},"action":"remove","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":4},"end":{"row":12,"column":0},"action":"remove","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":0},"end":{"row":12,"column":1},"action":"insert","lines":["$"]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":1},"end":{"row":12,"column":2},"action":"insert","lines":["s"]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":2},"end":{"row":12,"column":3},"action":"insert","lines":["c"]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":3},"end":{"row":12,"column":4},"action":"insert","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":4},"end":{"row":12,"column":5},"action":"insert","lines":["p"]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":5},"end":{"row":12,"column":6},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":6},"end":{"row":12,"column":7},"action":"insert","lines":["."]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":7},"end":{"row":12,"column":8},"action":"insert","lines":["h"]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":8},"end":{"row":12,"column":9},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":9},"end":{"row":12,"column":10},"action":"insert","lines":["j"]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":10},"end":{"row":12,"column":11},"action":"insert","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":11},"end":{"row":12,"column":12},"action":"insert","lines":["="]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":12},"end":{"row":12,"column":13},"action":"insert","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":13},"end":{"row":12,"column":15},"action":"insert","lines":["\"\""]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":14},"end":{"row":12,"column":15},"action":"insert","lines":["h"]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":15},"end":{"row":12,"column":16},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":16},"end":{"row":12,"column":17},"action":"insert","lines":["h"]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":17},"end":{"row":12,"column":18},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":18},"end":{"row":12,"column":19},"action":"insert","lines":["h"]}]}],[{"group":"doc","deltas":[{"start":{"row":12,"column":19},"end":{"row":12,"column":20},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":36},"end":{"row":0,"column":60},"action":"remove","lines":[", 'mongolabResourceHttp'"]}]}],[{"group":"doc","deltas":[{"start":{"row":2,"column":0},"end":{"row":2,"column":1},"action":"insert","lines":["/"]}]}],[{"group":"doc","deltas":[{"start":{"row":2,"column":1},"end":{"row":2,"column":2},"action":"insert","lines":["/"]}]}],[{"group":"doc","deltas":[{"start":{"row":2,"column":2},"end":{"row":2,"column":3},"action":"insert","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":2,"column":3},"end":{"row":2,"column":27},"action":"insert","lines":[", 'mongolabResourceHttp'"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":27},"end":{"row":0,"column":28},"action":"remove","lines":["p"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":26},"end":{"row":0,"column":27},"action":"remove","lines":["r"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":26},"end":{"row":0,"column":27},"action":"insert","lines":["a"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":27},"end":{"row":0,"column":28},"action":"insert","lines":["p"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":28},"end":{"row":0,"column":29},"action":"insert","lines":["p"]}]}],[{"group":"doc","deltas":[{"start":{"row":2,"column":3},"end":{"row":2,"column":27},"action":"remove","lines":[", 'mongolabResourceHttp'"]}]}],[{"group":"doc","deltas":[{"start":{"row":0,"column":37},"end":{"row":0,"column":61},"action":"insert","lines":[", 'mongolabResourceHttp'"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":4},"end":{"row":12,"column":0},"action":"insert","lines":["\t$scope.test()",""]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":17},"end":{"row":11,"column":18},"action":"remove","lines":[")"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":16},"end":{"row":11,"column":17},"action":"remove","lines":["("]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":16},"end":{"row":11,"column":17},"action":"insert","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":17},"end":{"row":11,"column":18},"action":"insert","lines":["="]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":18},"end":{"row":11,"column":19},"action":"insert","lines":[" "]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":19},"end":{"row":11,"column":20},"action":"insert","lines":["f"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":20},"end":{"row":11,"column":21},"action":"insert","lines":["u"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":21},"end":{"row":11,"column":22},"action":"insert","lines":["n"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":22},"end":{"row":11,"column":23},"action":"insert","lines":["c"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":23},"end":{"row":11,"column":24},"action":"insert","lines":["t"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":24},"end":{"row":11,"column":25},"action":"insert","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":25},"end":{"row":11,"column":26},"action":"insert","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":26},"end":{"row":11,"column":27},"action":"insert","lines":["n"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":27},"end":{"row":11,"column":29},"action":"insert","lines":["()"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":29},"end":{"row":11,"column":30},"action":"insert","lines":["{"]}]}],[{"group":"doc","deltas":[{"start":{"row":11,"column":30},"end":{"row":11,"column":31},"action":"insert","lines":["}"]}]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":11,"column":0},"end":{"row":12,"column":0},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1417613442750,"hash":"77873fe0c1189a72e4cea7a0116a12521359f307"}