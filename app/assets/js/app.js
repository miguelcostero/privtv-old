//Declaramos nuestra aplicación de AngulaJS
angular.module("pritvApp", ["ngResource", "ngRoute", "ngSanitize",
			"com.2fdevs.videogular",
			"com.2fdevs.videogular.plugins.controls",
			"com.2fdevs.videogular.plugins.overlayplay",
      "com.2fdevs.videogular.plugins.buffering",
			"com.2fdevs.videogular.plugins.poster"])
  .config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        controller: "loginController",
        templateUrl: "templates/login.html"
      })
      .when("/peliculas", {
        controller: "ListarPeliculasController",
        templateUrl: "templates/listar_peliculas.html"
      })
      .when("/pelicula/:id_pelicula", {
        controller: "DetallesPeliculaController",
        templateUrl: "templates/detalles.html"
      })
      .when("/seleccionar-usuario/:id_cliente", {
        controller: "SeleccionarUsuarioController",
        templateUrl: "templates/seleccionar-usuario.html"
      })
      .when("/reproductor/:id_pelicula", {
        controller: "ReproductorController",
        templateUrl: "templates/reproductor.html"
      })
      .when("/configuracion", {
        controller: "ConfigController",
        templateUrl: "templates/admin/index.html"
      })
      .when("/configuracion/password", {
        controller: "ConfigController",
        templateUrl: "templates/admin/password.html"
      })
      .when("/configuracion/suscripcion", {
        controller: "ConfigController",
        templateUrl: "templates/admin/suscripcion.html"
      })
      .otherwise("/")
  })
