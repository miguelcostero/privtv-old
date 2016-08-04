var app = angular.module("pritvApp");

app.controller("defaultersController", function ($scope, $rootScope, $state, $stateParams, Pagos, PaymentFactory, suscripcion, Flash) {
  let idCliente = $stateParams.id_cliente;
  let hoy = moment();

  Pagos.get({ id_cliente: idCliente }, {}, function (data) {
    $scope.pagos = data;
    $scope.ultimo_pago = moment(data[data.length -1].fecha_hora);
    $scope.diferencia = hoy.diff($scope.ultimo_pago, "months");
  })

  PaymentFactory.get({ id_cliente: idCliente }, {}, function (data) {
    $scope.datosPago = data[0];
  })

  suscripcion.get({ id_cliente: idCliente }, {}, function (data) {
    $scope.suscripcion = data[0];
    $scope.montoTotal = $scope.suscripcion.monto_mensual * $scope.diferencia;
  })

  $scope.realizar_pago = function () {
    let toSend = {
      montoTotal: $scope.montoTotal,
      idCliente: idCliente,
      prox_pago: new Date(moment().add(1, 'months'))
    }

    Pagos.pay({}, { datos: toSend }, function (data) {
      $scope.datos = data;
      Flash.create('success', 'Se ha procesado correctamente el pago.');
      $state.go("login", {}, {reload:true});
    })
  }
});
