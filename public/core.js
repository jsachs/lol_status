// public/core.js
var lolStatus = angular.module('lolStatus', [])
    .config(function($httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });

lolStatus.controller("shardsController", function($scope, $http) {

    $scope.regions = {};

    $http.get('http://status.leagueoflegends.com/shards')
    .success(function(data, status, headers, config) {
        $scope.shards = data;
        console.log(data);
        regionsController();
    })
    .error(function(data, status, headers, config) {
        console.log('Error: ' + data);
    });

    function regionsController() {
        $scope.shards.forEach(function(shard) {
            $http.get('http://status.leagueoflegends.com/shards/' + shard.slug)
            .success(function(data, status, headers, config) {
                $scope.regions[shard.slug] = data;
                console.log(data);
            })
            .error(function(data, status, headers, config) {
                console.log('Error (' + shard.slug + '):' + data);
            })
        }
    )};

});

lolStatus.controller('contactController', function ($scope, $http) {

    $scope.result = 'hidden'
    $scope.resultMessage;
    $scope.formData; //formData is an object holding the name, email, subject, and message
    $scope.submitButtonDisabled = false;
    $scope.submitted = false; //used so that form errors are shown only after the form has been submitted
    $scope.regions = [
        { id: 1, name: 'na' },
        { id: 2, name: 'euw' },
        { id: 3, name: 'eune' },
        { id: 4, name: 'lan' },
        { id: 5, name: 'las' },
        { id: 6, name: 'br' },
        { id: 7, name: 'tr' },
        { id: 8, name: 'ru' },
        { id: 9, name: 'oce' }
  ];

    $scope.submit = function(contactform) {
        $scope.submitted = true;
        $scope.submitButtonDisabled = true;
        if (contactform.$valid) {
            $http({
                method  : 'POST',
                url     : '/signup',
                data    : $.param($scope.formData),  //param method from jQuery
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  //set the headers so angular passing info as form data (not request payload)
            }).success(function(data){
                console.log(data);
            }).error(function(data){
                console.log("Error:" + data);
            });
        } else {
            console.log("Error, invalid form.")
        }
    }
});
