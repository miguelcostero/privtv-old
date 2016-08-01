var app = angular.module("pritvApp");

app.factory("PaymentFactory", function ($resource) {
  return $resource("http://" + api_url + "/clientes/:id_cliente/pagos", { id_cliente: "@id_cliente" }, {
    get: {
      method: "GET", isArray: true
    }
  })
})
