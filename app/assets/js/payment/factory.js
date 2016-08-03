var app = angular.module("pritvApp");

app.factory("PaymentFactory", function ($resource) {
  return $resource("http://" + api_url + "/clientes/:id_cliente/pagos/:id_detalle_pago", { id_cliente: "@id_cliente", id_detalle_pago: "@id_detalle_pago" }, {
    get: {
      method: "GET", isArray: true
    },
    editar: {
      method: "PUT", isArray: true
    }
  })
})

app.factory("Pagos", function ($resource) {
  return $resource("http://"+ api_url + "/pagos/:id_cliente", { id_cliente: "@id_cliente" }, {
    get: {
      method: "GET", isArray: true
    }
  })
})
