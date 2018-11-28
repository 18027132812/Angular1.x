
var app = angular.module("app", ["ui.router"]);
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/page1");
  $stateProvider
  .state('page1', {
    url: '/page1',
    templateUrl: './views/page1.html',
    controller: 'PageCtrl1'
  })
  .state('page2', {
    url: '/page2',
    templateUrl: './views/page2.html',
    controller: 'PageCtrl2'
  })
});

app.factory('vv', function($rootScope,$http, $q, $state) {
  var factory = {};
  factory.getData = function(endpoint, params, method) {
    if (!window.localStorage.username) {
      console.log('no-localStorage');
      $state.go('page2');
    }
    var defer = $q.defer();
    if (method == 'GET') {
      $http({
        url: '/web-operation/proxy' + endpoint,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: params,
        timeout: 15000
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (data, status, config) {
        defer.reject(data);
      });
    } else {
      $http({
        url: 'http://' + endpoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: params,
        timeout: 15000
      }).success(function (data) {
        defer.resolve(data);
      }).error(function (data, status, config) {
        defer.reject(data);
      });
    };
    return defer.promise;
  }
  return factory;
});

app.controller('PageCtrl1', function ($scope, $http, vv) {
  console.log('page1')
  vv.getData('127.0.0.1/api/index.php', {a: 1, b: 2}).then(function (res) {
    console.log(res)
  })
});

app.controller('PageCtrl2', ['$scope', function ($scope) {
  console.log('page2')
}]);

