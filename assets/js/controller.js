var app = angular.module("pritvApp");

//con dataResource inyectamos la factoría
app.controller("ListarPeliculasController", function ($scope, $routeParams, peliculasPopulares, generoPelicula, peliculasNuevas, peliculasPorNombre, $rootScope, logUsuarios, logCliente, sesionesControl) {
    //datosResource lo tenemos disponible en la vista gracias a $scope
    $scope.sort = "";
    $rootScope.loading = true;
    $scope.default = 1;

    //información del usuario activo
    var cacheSession = function (idUsuario) {
        sesionesControl.set("usuarioLogin", true);
        sesionesControl.set("idUsuario", idUsuario);
    };
    cacheSession($routeParams.id_usuario);
    $scope.active_user = logUsuarios.getUser($routeParams.id_usuario).get();

    //info cuenta cliente
    $scope.logueado = logCliente.isLoggedIn();
    $scope.logout = function () {
      logUsuarios.userChange();
      logCliente.logout();
    };

    if (_.isEmpty($scope.sort)) {
      $rootScope.loading = true;
      $scope.Peliculas = peliculasPopulares.get(function () {
        for (var i = 0; i < $scope.Peliculas.length; i++) {
          var obtnerGeneros = function (id) {
              return generoPelicula.get({}, { "id_pelicula":id });
          }
          $scope.Peliculas[i].generos =  obtnerGeneros($scope.Peliculas[i].idPelicula);
          $rootScope.loading = false;
        }
      });
    }

    $scope.cambio = function () {
      console.log($scope.sort);
      var index = $scope.sort;
      $rootScope.loading = true;

      if (index == 1) {
        $scope.Peliculas = peliculasPopulares.get(function () {
          for (var i = 0; i < $scope.Peliculas.length; i++) {
            var obtnerGeneros = function (id) {
                return generoPelicula.get({}, { "id_pelicula":id });
            }
            $scope.Peliculas[i].generos =  obtnerGeneros($scope.Peliculas[i].idPelicula);
          }
          $rootScope.loading = false;
        });
      } else if (index == 2) {
        $scope.Peliculas = peliculasNuevas.get(function () {
          for (var i = 0; i < $scope.Peliculas.length; i++) {
            var obtnerGeneros = function (id) {
                return generoPelicula.get({}, { "id_pelicula":id });
            }
            $scope.Peliculas[i].generos =  obtnerGeneros($scope.Peliculas[i].idPelicula);
          }
          $rootScope.loading = false;
        });
      } else if (index == 3) {

      } else if (index == 4) {
        $scope.Peliculas = peliculasPorNombre.get(function () {
          for (var i = 0; i < $scope.Peliculas.length; i++) {
            var obtnerGeneros = function (id) {
                return generoPelicula.get({}, { "id_pelicula":id });
            }
            $scope.Peliculas[i].generos =  obtnerGeneros($scope.Peliculas[i].idPelicula);
          }
          $rootScope.loading = false;
        });
      } else if (index == 5) {

      }
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

app.controller("DetallesPeliculaController", function ($scope, $sce, $routeParams, $rootScope, peliculaDetalles, generoPelicula, actoresPelicula, directoresPelicula, sesionesControl) {
  $rootScope.loading = true;
  $scope.usuario_activo = sesionesControl.get("idUsuario");
  $scope.pelicula = peliculaDetalles.get({}, { "id_pelicula":$routeParams.id_pelicula }, function () {
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
  if (sesionesControl.get("usuarioLogin")) {
    $location.path("/peliculas/usuario/"+sesionesControl.get("idUsuario"));
  } else {
    $scope.usuarios = logUsuarios.getAllUsers($routeParams.email_cliente).get(function () {
      $rootScope.loading = false;
    });
  }
});

app.controller("ReproductorController", function ($scope, $routeParams, $rootScope, peliculaDetalles, $sce, subtitulosPelicula) {
  $rootScope.loading = true;

  $scope.pelicula = peliculaDetalles.get({}, {"id_pelicula": $routeParams.id_pelicula}, function () {
    for (var i = 0; i < $scope.pelicula.length; i++) {
      var subs = {};
      $scope.pelicula[i].videoUrl = $sce.trustAsResourceUrl($scope.pelicula[i].movie_source);
      $scope.pelicula[i].subtitulos = subtitulosPelicula.get({}, { "id_pelicula":$routeParams.id_pelicula });

      for (var j = 0; j < $scope.pelicula[i].subtitulos.length; j++) {
        console.log($scope.pelicula[i].subtitulos[j]);
      }
    }
    $rootScope.loading = false;
  });
});
