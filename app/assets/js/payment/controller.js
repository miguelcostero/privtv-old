var app = angular.module("pritvApp");

app.controller("PaymentController", function ($scope, $rootScope, $location, $state, suscripcion, sesionesControl, cliente, PaymentFactory, Pagos, Flash) {
  $rootScope.loading = true;
  $scope.hoy = moment().format("YYYY-MM");

  if (sesionesControl.get("clienteLogin")) {
    if (!sesionesControl.get("usuarioLogin") || !$rootScope.usuario) {
      $location.path("/seleccionar-usuario/"+sesionesControl.get("id_cliente"));
    }
  } else {
    $location.path("/");
  }

  suscripcion.get({ id_cliente: sesionesControl.get("id_cliente") }, function (data) {
    $scope.suscripcion = data[0];


  })

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

      let diferencia = moment().diff(moment(data[data.length -1].fecha_hora), "months");

      $scope.meses_acumulados = diferencia;
      $scope.montoTotal = $scope.suscripcion.monto_mensual * diferencia;

      if (diferencia > 0) {
        if (diferencia > 1) {
          $scope.nextPay = {
            avaible: true,
            pago: new Date(data[data.length -1].prox_pago),
            acumulado: {
              real: true,
              diferencia: diferencia
            }
          }
        } else {
          $scope.nextPay = {
            avaible: true,
            pago: new Date(data[data.length -1].prox_pago)
          }
        }
      } else {
        $scope.nextPay = {
          avaible: false
        }
      }
    }
  })

  $scope.actualizar = function () {
    PaymentFactory.editar({id_detalle_pago: $scope.editar.iddetalles_pago_cliente}, { datos: $scope.editar }, function (data) {
      Flash.create('success', 'Se han guardado sus cambios satisfactoriamente.');
      $scope.data_pagos.iddetalles_pago_cliente = data[0].iddetalles_pago_cliente;
      $scope.data_pagos.codigo_tarjeta = data[0].codigo_tarjeta;
      $scope.data_pagos.ccv_tarjeta = data[0].ccv_tarjeta;
      $scope.data_pagos.nombre_tarjeta = data[0].nombre_tarjeta;
      $scope.data_pagos.direccion_facturacion = data[0].direccion_facturacion;
      $scope.data_pagos.fecha_exp_tarjeta = new Date(data[0].fecha_exp_tarjeta);
      $scope.data_pagos.tipo_tarjeta = data[0].tipo_tarjeta;
    })
  }

  $scope.pagar = function () {

    Pagos.get({ id_cliente: sesionesControl.get("id_cliente") }, {}, function (data) {
      if (_.some(data, function(o) { return _.has(o, "msg"); })) {
        $scope.noPays = data[0].msg;
      } else {
        let diferencia = moment().diff(moment(data[data.length -1].fecha_hora), "months");
        let prox_pagoN = moment(data[data.length - 1].fecha_hora).add((diferencia + 1), "months").format("YYYY-MM-DD");

        let para_enviar = {
          montoTotal: $scope.montoTotal,
          idCliente: $scope.cliente.idCliente,
          prox_pago: prox_pagoN
        }

        Pagos.pay({}, { datos: para_enviar }, function (datos) {
          $scope.pagos = datos;
          $state.go("payment.billing",{}, {reload:true})
          Flash.create('success', 'Se ha procesado el pago correctamente.');
        })
      }
    })
  }
})
