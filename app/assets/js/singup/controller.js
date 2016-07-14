var app = angular.module("pritvApp");

app.controller("SingUpController", function($scope, $rootScope, planes, generos) {
    $scope.formData = {};
    $scope.years = [];

    planes.get({}, {}, function(data) {
        $scope.planes = data;
    });

    generos.get({}, {}, function (data) {
        $scope.generos = data;
    })

    var myDate = new Date();
    var year = myDate.getFullYear();
    for (var i = year; i < 2046; i++) {
        $scope.years.push({ "year": i });
    }

});
