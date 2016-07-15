var app = angular.module("pritvApp");

app.controller("SingUpController", function($scope, $rootScope, planes, generos) {
    $scope.formData = {};
    $scope.formValidate = {
        "profile": false,
        "user": false, 
        "subscription": false,
        "payment": false
    }

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

    $scope.comprobarProfile = function () {
        
    }

    //PROCESAR FORMULARIO DE REGISTRO
    $scope.processForm = function () {
        
    }
});
