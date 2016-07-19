var app = angular.module("pritvApp");

app.controller("SingUpController", function($scope, $rootScope, $state, planes, generos, nuevoCliente) {
    $scope.$state = $state;
    $scope.formData = {};
    $scope.years = [];
    $scope.resumen = true;
    $scope.finalizado = false;

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

    $scope.fecha_maxima = moment().subtract(18, "years").format("YYYY-MM-DD");

    //PROCESAR FORMULARIO DE REGISTRO
    $scope.processForm = function () {
        $rootScope.loading = true;

        let registro_data = $scope.formData;
        registro_data.profile.password = md5($scope.formData.profile.password);

        nuevoCliente.nuevo({}, {registro: registro_data}, function (data) {
            $rootScope.loading = false;
            $scope.resumen = false;
            $scope.finalizado = true;
        })
    }
});
