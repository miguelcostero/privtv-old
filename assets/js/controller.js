var app = angular.module("pritvApp");

//con dataResource inyectamos la factoría
app.controller("ListarPeliculasController", function ($scope, peliculas, generoPelicula, $rootScope, logUsuarios, logCliente, sesionesControl) {
    //datosResource lo tenemos disponible en la vista gracias a $scope
    $scope.sort = "";
    $rootScope.loading = true;
    $rootScope.logueado = true;

    //info cuenta cliente
    $rootScope.logout = function () {
      logUsuarios.userChange();
      logCliente.logout();
      $rootScope.logueado = false;
    };

    var obtnerGeneros = function (pelicula) {
      for (var i = 0; i < pelicula.length; i++) {
        pelicula[i]._generos = generoPelicula.get({}, { "id_pelicula":pelicula[i].idPelicula });
      }
        return pelicula;
    }

    $scope.Peliculas = peliculas.get(function () {
      obtnerGeneros($scope.Peliculas);
      $rootScope.loading = false;
    });

    $scope.cambio = function () {
      $rootScope.loading = true;

      if ($scope.sort == 1) {
        $scope.Peliculas = _.sortBy($scope.Peliculas, 'numReproducciones').reverse();
      } else if ($scope.sort == 2) {
        $scope.Peliculas = _.sortBy($scope.Peliculas, 'fecha_hora_publicacion').reverse();
      } else if ($scope.sort == 3) {

      } else if ($scope.sort == 4) {
        $scope.Peliculas = _.sortBy($scope.Peliculas, 'nombre');
      } else if ($scope.sort == 5) {

      }

      $rootScope.loading = false;
    };
});

app.controller("loginController", function ($scope, $location, logCliente, $rootScope, sesionesControl) {
  $scope.user_form = {};

  if (sesionesControl.get("clienteLogin")) {
    $location.path("/seleccionar-usuario/"+sesionesControl.get("email_cliente"));
  } else {
    $scope.login = function() {
      $rootScope.loading = true;
      logCliente.login($scope.user_form.email, $scope.user_form.password);
    };
  }
});

app.controller("DetallesPeliculaController", function ($scope, $sce, $routeParams, $rootScope, peliculas, generoPelicula, actoresPelicula, directoresPelicula, sesionesControl) {
  $rootScope.loading = true;
  $rootScope.logueado = true;
  $scope.usuario_activo = sesionesControl.get("idUsuario");
  $scope.pelicula = peliculas.get({}, { "id_pelicula":$routeParams.id_pelicula }, function () {
    for (var i = 0; i < $scope.pelicula.length; i++) {
      var obtnerGeneros = function (id) {
          return generoPelicula.get({}, { "id_pelicula":id });
      }
      var obtnerActores = function (id) {
          return actoresPelicula.get({}, { "id_pelicula":id });
      }
      var obtnerDirectores = function (id) {
          return directoresPelicula.get({}, { "id_pelicula":id });
      }
      $scope.pelicula[i].generos =  obtnerGeneros($scope.pelicula[i].idPelicula);
      $scope.pelicula[i].actores =  obtnerActores($scope.pelicula[i].idPelicula);
      $scope.pelicula[i].directores =  obtnerDirectores($scope.pelicula[i].idPelicula);
      $scope.pelicula[i].videoUrl = $sce.trustAsResourceUrl($scope.pelicula[i].movie_source);
      $rootScope.loading = false;
    }
  });
});

app.controller("SeleccionarUsuarioController", function ($scope, $routeParams, $rootScope, logUsuarios, $location, sesionesControl) {

  $scope.iniciar = function (id_usuario) {
    sesionesControl.set("usuarioLogin", true);
    sesionesControl.set("idUsuario", id_usuario);
  }

  if (sesionesControl.get("usuarioLogin")) {
    $location.path("/peliculas/usuario/"+sesionesControl.get("idUsuario"));
  } else {
    $scope.usuarios = logUsuarios.getAllUsers($routeParams.email_cliente).get(function () {
      $rootScope.loading = false;
    });
  }
});

app.controller("ReproductorController", function ($scope, $routeParams, $rootScope, peliculas, $sce, subtitulosPelicula) {

  $scope.interface = {};

  $scope.atras = "1";

  $scope.$on('$videoReady', function videoReady() {
    $scope.interface.options.setAutoplay(true);
    $scope.interface.sources.add("http://localhost/privtv/peliculas/1/1.mp4");
    console.log("cargando");
  });
});
