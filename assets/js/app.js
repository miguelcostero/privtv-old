//para hacer uso de $resource debemos colocarlo al crear el modulo
angular.module("pritvApp", ["ngResource", "ngRoute"])
  .config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        controller: "loginController",
        templateUrl: "templates/login.html"
      })
      .when("/peliculas/usuario/:id_usuario", {
        controller: "ListarPeliculasController",
        templateUrl: "templates/listar_peliculas.html"
      })
      .when("/pelicula/:id_pelicula", {
        controller: "DetallesPeliculaController",
        templateUrl: "templates/detalles.html"
      })
      .when("/seleccionar-usuario/:email_cliente", {
        controller: "SeleccionarUsuarioController",
        templateUrl: "templates/seleccionar-usuario.html"
      })
      .otherwise("/")
  })
