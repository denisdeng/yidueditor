'use strict';

/* Controllers */
var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('PhoneListCtrl', ['$http', '$scope', 'Phone', '$stateParams',
    function($http, $scope, Phone, $stateParams) {
        //$scope.phones ='this is the test file';
        $scope.orderProp = 'age';
        $http.get('phones/phones.json').success(function(response) {
            console.log(response);
            $scope.phones = response;
            
        });
        //$scope.obj = {name:'motorola',snippet:'Experience'}
        /*$scope.matchName = function(query) {
          return function(phone) { return phone.name.match(query); }
        };*/
    }
]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$stateParams', 'Phone',
    function($scope, $stateParams, Phone) {
        console.log($stateParams);
        $scope.phone = Phone.get({ phoneId: $stateParams.phoneId }, function(phone) {
            $scope.mainImageUrl = phone.images[0];
        });

        $scope.setImage = function(imageUrl) {
            $scope.mainImageUrl = imageUrl;
        };
    }
]);
