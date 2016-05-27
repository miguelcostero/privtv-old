var app = angular.module("pritvApp");

//con dataResource inyectamos la factoría
app.controller("ListarPeliculasController", function ($scope, $location, peliculas, generoPelicula, $rootScope, logUsuarios, logCliente, sesionesControl) {
    //datosResource lo tenemos disponible en la vista gracias a $scope
    $scope.sort = "";
    $rootScope.loading = true;
    $rootScope.logueado = true;

    //info cuenta cliente
    $rootScope.logout = function () {
      logUsuarios.userChange();
      logCliente.logout();
      $rootScope.logueado = false;
      $location.path("/");
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

    $scope.buscador = {
      active: false,
      abrirBuscador: function () {
        if ($scope.buscador.active === true) {
          $scope.buscador.active = false;
        } else {
          $scope.buscador.active = true;
        }
      }
    }

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
    $location.path("/peliculas/");
  } else {
    $scope.usuarios = logUsuarios.getAllUsers($routeParams.email_cliente).get(function () {
      $rootScope.loading = false;
    });
  }
});

//controlador del reproductor
app.controller("ReproductorController", function ($scope, $routeParams, $rootScope, peliculas, $sce, subtitulos, $location) {
  $rootScope.loading = true;
  $scope.subactual = "";

  var controller = this;
  controller.API = null;

  controller.onPlayerReady = function(API) {
    controller.API = API;
  };

  controller.onCompleteVideo = function() {
    controller.isCompleted = true;

    $location.path("/pelicula/"+$routeParams.id_pelicula);
  };

  //resource para obtener datos de la pelicula
  peliculas.get({}, { "id_pelicula":$routeParams.id_pelicula }, function (response) {
    //guardamos el id de la pelicula para el bton de regresar
    $scope.idPelicula = response[0].idPelicula;

    //resource para obtener los subtitulos de la pelicula
    subtitulos.get({}, { "id_pelicula": $scope.idPelicula }, function (subs) {
      var sub = [];
      var i = 0;

      //recorremos la respuesta del resource con forEach
      subs.forEach(elem => {
        let defecto = false;

        //si es la primaera iteracion ponemos como default al primer subtitulo
        if (i === 0) {
          defecto = true;
        } else {
          defecto = false;
        }

        //creamos el objeto que incluye la info de los subtitulos
        sub[i] = {
          src: elem.ruta,
          kind: "captions",
          srclang: elem.srclang,
          label: elem.idioma,
          default: defecto
        };
        i++;
      });

      $scope.subtitulos = {
        actual: null,
        subs: sub
      };

      //metodo para cambiar subtitulos
      controller.changeTrack = function () {
        //desactivamos el idioma actual
        sub[_.findKey(sub, {default: true})].default = false;
        //activamos el solicitado
        sub[_.findKey(sub, {srclang: $scope.subtitulos.actual})].default = true;
      }

      //cargamos la información al reproductor
      controller.config = {
        preload: "auto",
        sources: [
          {src: $sce.trustAsResourceUrl(response[0].movie_source), type: "video/mp4"}
        ],
        tracks: sub,
        autoPlay: true,
        theme: "./assets/components/videogular-themes-default/videogular.css",
        plugins: {
          controls: {
            autoHide: true,
            autoHideTime: 1500
          }
        }
      };

      $rootScope.loading = false;
    });
  });
});
