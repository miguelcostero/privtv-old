//Declaramos nuestra aplicación de AngulaJS
angular.module("pritvApp", ["ngResource", "ui.router", "ngSanitize",
			"com.2fdevs.videogular",
			"com.2fdevs.videogular.plugins.controls",
			"com.2fdevs.videogular.plugins.overlayplay",
      "com.2fdevs.videogular.plugins.buffering",
			"com.2fdevs.videogular.plugins.poster"])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("login", {
        url: "/",
        templateUrl: "templates/login.html",
        controller: "loginController"
      })
      .state("users-login", {
        url: "/seleccionar-usuario/:id_cliente",
        controller: "SeleccionarUsuarioController",
        templateUrl: "templates/seleccionar-usuario.html"
      })
      .state("movies", {
        url: "/peliculas",
        controller: "ListarPeliculasController",
        templateUrl: "templates/listar_peliculas.html"
      })
      .state("movies-details", {
        url: "/pelicula/:id_pelicula",
        controller: "DetallesPeliculaController",
        templateUrl: "templates/detalles.html"
      })
      .state("player", {
        url: "/reproductor/:id_pelicula",
        controller: "ReproductorController",
        templateUrl: "templates/reproductor.html"
      })
      .state("config", {
        url: "/configuracion",
        controller: "ConfigController",
        templateUrl: "templates/admin/index.html"
      })
      .state("config.basico", {
        url: "/basico",
        templateUrl: "templates/admin/basico.html"
      })
      .state("config.password", {
        url: "/password",
        templateUrl: "templates/admin/password.html"
      })
      .state("config.suscripcion", {
        url: "/suscripcion",
        templateUrl: "templates/admin/suscripcion.html"
      })
      .state("SingUp", {
        url: "/singup",
        controller: "SingUpController",
        templateUrl: "templates/singup/index.html"
      })
    $urlRouterProvider.otherwise("/");
  })
