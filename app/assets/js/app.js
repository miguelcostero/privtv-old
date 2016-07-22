//Declaramos nuestra aplicación de AngulaJS
angular.module("pritvApp", ["ngResource", "ui.router", "ngSanitize",
			"com.2fdevs.videogular",
			"com.2fdevs.videogular.plugins.controls",
			"com.2fdevs.videogular.plugins.overlayplay",
      "com.2fdevs.videogular.plugins.buffering",
			"com.2fdevs.videogular.plugins.poster",
      "ngMessages"])
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
      .state("singup", {
        url: "/singup",
        controller: "SingUpController",
        templateUrl: "templates/singup/index.html"
      })
      .state("singup.profile", {
        url: "/profile",
        templateUrl: "templates/singup/profile.html"
      })
      .state("singup.subscription", {
        url: "/subscription",
        templateUrl: "templates/singup/subscription.html"
      })
      .state("singup.payment", {
        url: "/payment",
        templateUrl: "templates/singup/payment.html"
      })
      .state("singup.user", {
        url: "/user",
        templateUrl: "templates/singup/user.html"
      })
      .state("singup.final", {
        url: "/final",
        templateUrl: "templates/singup/final.html"
      })
      //usuarios config
      .state("user", {
        url: "/admin/user",
        controller: "UserController",
        templateUrl: "templates/user/index.html"
      })
      .state("user.home", {
        url: "/home",
        templateUrl: "templates/user/home.html"
      })
      .state("user.new", {
        url: "/new", 
        templateUrl: "templates/user/new.html"
      })
    $urlRouterProvider.otherwise("/");
  })
