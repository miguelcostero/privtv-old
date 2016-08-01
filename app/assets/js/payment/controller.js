var app = angular.module("pritvApp");

app.controller("PaymentController", function ($scope, $rootScope, $location, sesionesControl, cliente, PaymentFactory) {
  $rootScope.loading = true;

  if (sesionesControl.get("clienteLogin")) {
    if (!sesionesControl.get("usuarioLogin") || !$rootScope.usuario) {
      $location.path("/seleccionar-usuario/"+sesionesControl.get("id_cliente"));
    }
  } else {
    $location.path("/");
  }

  cliente.get({}, { id_cliente: sesionesControl.get("id_cliente") }, function (data) {
    $scope.cliente = data[0];
    $rootScope.loading = false;
  });

  PaymentFactory.get({ id_cliente: sesionesControl.get("id_cliente") }, {}, function (data) {
    $scope.data_pagos = data[0];
  })
})
