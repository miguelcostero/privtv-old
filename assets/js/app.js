//para hacer uso de $resource debemos colocarlo al crear el modulo
var app = angular.module("privtv", ["ngResource"]);

//con dataResource inyectamos la factoría
app.controller("appController", function ($scope, $http, dataResource) {
    //datosResource lo tenemos disponible en la vista gracias a $scope
    $scope.datosResource = dataResource.get();
})

//de esta forma tan sencilla consumimos con $resource en AngularJS
app.factory("dataResource", function ($resource) {
    return $resource("http://api-privtv.rhcloud.com/main/getempleados/bbfa29a387567a26a34ba1e5d871f722", //la url donde queremos consumir
        {}, //aquí podemos pasar variables que queramos pasar a la consulta
        //a la función get le decimos el método, y, si es un array lo que devuelve
        //ponemos isArray en true
        { get: { method: "GET", isArray: true }
    })
})
