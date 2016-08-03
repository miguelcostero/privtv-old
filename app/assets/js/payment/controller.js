var app = angular.module("pritvApp");

app.controller("PaymentController", function ($scope, $rootScope, $location, $stateParams, sesionesControl, cliente, PaymentFactory, Pagos, Flash) {
  $rootScope.loading = true;
  $scope.hoy = moment().format("YYYY-MM");

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
    $scope.editar = data[0];
    $scope.editar.fecha_exp_tarjeta = $scope.data_pagos.fecha_exp_tarjeta = new Date(data[0].fecha_exp_tarjeta);

    if (moment(data[0].fecha_exp_tarjeta, "YYYY-MM").diff(moment(), "months") >= 0) {
      $scope.data_pagos.invalida = false;
    } else {
      $scope.data_pagos.invalida = true;
    }
  })

  Pagos.get({ id_cliente: sesionesControl.get("id_cliente") }, {}, function (data) {
    if (_.some(data, function(o) { return _.has(o, "msg"); })) {
      $scope.noPays = data[0].msg;
    } else {
      $scope.pagos = data;
    }
  })

  $scope.actualizar = function () {
    PaymentFactory.editar({id_detalle_pago: $scope.editar.iddetalles_pago_cliente}, { datos: $scope.editar }, function (data) {
      Flash.create('success', 'Se han guardado sus cambios satisfactoriamente.');
      $scope.data_pagos = data[0];
      $scope.data_pagos.fecha_exp_tarjeta = new Date(data[0].fecha_exp_tarjeta);
    })
  }


})
