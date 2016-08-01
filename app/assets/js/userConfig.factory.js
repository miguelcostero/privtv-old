var app = angular.module("pritvApp");

app.factory("usuariosFactory", function ($resource) {
	return $resource("http://" + api_url + "/admin/usuarios/:id_usuario/clientes/:id_cliente",
    { id_usuario: "@id_pelicula", id_cliente: "@id_pelicula" }, {
      get: { method: "GET", isArray: true },
      delete: { method: "DELETE", isArray: true },
      nuevo: { method: "POST", isArray: true },
      editar: { method: "PUT", isArray: true }
    })
})

app.factory("suscripcionCliente", function ($resource) {
    return $resource("http://" + api_url + "/admin/clientes/:id_cliente/suscripcion",
    { id_cliente: "@id_cliente" }, {
      get: { method: "GET", isArray: true }
    })
})
