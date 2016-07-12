var app = angular.module("pritvApp");
var md5 = require('md5');

app.controller("ListarPeliculasController", function ($scope, $location, peliculas, generoPelicula, $rootScope, logUsuarios, logCliente, sesionesControl, generos) {
    //datosResource lo tenemos disponible en la vista gracias a $scope
    $scope.sort = "";
    $rootScope.loading = true;

    if (sesionesControl.get("clienteLogin")) {
      if (!sesionesControl.get("usuarioLogin") || !$rootScope.usuario) {
        $location.path("/seleccionar-usuario/"+sesionesControl.get("id_cliente"));
      }
    } else {
      $location.path("/");
    }

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
    const lista_peliculas = obtnerGeneros($scope.Peliculas);

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
      $scope.generos = {};
      $scope.generos.isActive = false;

      if ($scope.sort == 1) {
        $scope.Peliculas = _.sortBy(lista_peliculas, 'numReproducciones').reverse();
      } else if ($scope.sort == 2) {
        $scope.Peliculas = _.sortBy(lista_peliculas, 'fecha_hora_publicacion').reverse();
      } else if ($scope.sort == 3) {
        generos.get(function (data) {
          $scope.generos = {
            isActive: true,
            datos: data
          }
        })

        $scope.segun_genero = function (opt) {
          $scope.Peliculas = peliculas_genero(opt);
        }

      } else if ($scope.sort == 4) {
        $scope.Peliculas = _.sortBy(lista_peliculas, 'nombre');
      } else if ($scope.sort == 5) {

      }

      $rootScope.loading = false;
    };

    var peliculas_genero = function (genero) {
      let pelis = [];
      let j = 0;
      for (var i = 0; i < lista_peliculas.length; i++) {
        let has = _.groupBy(lista_peliculas[i]._generos, { Nombre: genero });
        if (_.has(has, 'true')) {
          pelis[j] = lista_peliculas[i];
          j++;
        }
      }
      return pelis;
    }
});

app.controller("loginController", function ($scope, $rootScope, $location, logCliente, $rootScope, sesionesControl) {
  $scope.user_form = {};

  if (sesionesControl.get("clienteLogin")) {
    $location.path("/seleccionar-usuario/"+sesionesControl.get("id_cliente"));
  } else {
    $scope.login = function() {
      $rootScope.loading = true;
      logCliente.login($scope.user_form.email, $scope.user_form.password);
    };
  }
});

app.controller("DetallesPeliculaController", function ($scope, $sce, $stateParams, $rootScope, $location, peliculas, generoPelicula, actoresPelicula, directoresPelicula, sesionesControl, reproducciones) {
  $rootScope.loading = true;

  if (sesionesControl.get("clienteLogin")) {
    if (!sesionesControl.get("usuarioLogin") || !$rootScope.usuario) {
      $location.path("/seleccionar-usuario/"+sesionesControl.get("id_cliente"));
    }
  } else {
    $location.path("/");
  }

  $scope.agregar_vista = function () {
    reproducciones.post({ "id_pelicula":$stateParams.id_pelicula }, { datos: {
        id_usuario: sesionesControl.get("idUsuario"),
        id_cliente: sesionesControl.get("id_cliente")
      }
   })
  }

  peliculas.get({}, { "id_pelicula":$stateParams.id_pelicula }, function (data) {
    $scope.pelicula = data[0];
    var obtnerGeneros = function (id) {
        return generoPelicula.get({}, { "id_pelicula":id });
    }
    var obtnerActores = function (id) {
        return actoresPelicula.get({}, { "id_pelicula":id });
    }
    var obtnerDirectores = function (id) {
        return directoresPelicula.get({}, { "id_pelicula":id });
    }
    $scope.pelicula.generos =  obtnerGeneros(data[0].idPelicula);
    $scope.pelicula.actores =  obtnerActores(data[0].idPelicula);
    $scope.pelicula.directores =  obtnerDirectores(data[0].idPelicula);
    $scope.pelicula.videoUrl = $sce.trustAsResourceUrl(data[0].movie_source);
    $rootScope.loading = false;
  });
});

app.controller("SeleccionarUsuarioController", function ($scope, $stateParams, $rootScope, logCliente, logUsuarios, $location, sesionesControl) {
  $rootScope.loading = true;

  $scope.usuarios = logUsuarios.getAllUsers($stateParams.id_cliente).get(function () {
    $rootScope.loading = false;
  });

  $scope.iniciar = function (id_usuario) {
    logUsuarios.getUser(id_usuario).get(function (data) {
      $rootScope.usuario = data[0];

      sesionesControl.set("usuarioLogin", true);
      sesionesControl.set("idUsuario", id_usuario);

      //info cuenta cliente
      $rootScope.logout = function () {
        logUsuarios.userChange();
        logCliente.logout();
        $location.path("/");
      };

      $rootScope.cambiarUsuario = function () {
        logUsuarios.userChange();
        $location.path("/seleccionar-usuario/"+sesionesControl.get("id_cliente"));
      }

      $location.path("/peliculas");
    });
  }
});

//controlador del reproductor
app.controller("ReproductorController", function ($scope, $stateParams, $rootScope, peliculas, $sce, subtitulos, $location) {
  $rootScope.loading = true;
  $scope.subactual = "";

  var controller = this;
  controller.API = null;

  controller.onPlayerReady = function(API) {
    controller.API = API;
  };

  controller.onCompleteVideo = function() {
    controller.isCompleted = true;

    $location.path("/pelicula/"+$stateParams.id_pelicula);
  };

  //resource para obtener datos de la pelicula
  peliculas.get({}, { "id_pelicula":$stateParams.id_pelicula }, function (response) {
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
        theme: "./assets/css/vendor.css",
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

app.controller("ConfigController", function ($scope, $timeout, $rootScope, $location, sesionesControl, logUsuarios, cliente, cliente_basicos, cliente_password, suscripcion, planes) {
  $rootScope.loading = true;
    if (sesionesControl.get("clienteLogin")) {
      if (!sesionesControl.get("usuarioLogin") || !$rootScope.usuario) {
        $location.path("/seleccionar-usuario/"+sesionesControl.get("id_cliente"));
      }
    } else {
      $location.path("/");
    }

    $scope.hoy = moment().format("YYYY-MM-DD");
    $scope.limpiar_msg = function () {
      $scope.msg = "";
    }

    suscripcion.get({ id_cliente: sesionesControl.get("id_cliente") }, function (data) {
      $scope.suscripcion = data[0];
    });

    planes.get({}, {}, function (data) {
      $scope.planes = data;
    });

    cliente.get({}, { id_cliente: sesionesControl.get("id_cliente") }, function (data) {
      $scope.cliente = data[0];

      $scope.nuevo = {
        email:  $scope.cliente.email,
        nombre:  $scope.cliente.nombre,
        apellido:  $scope.cliente.apellido,
        fecha_nacimiento:  moment($scope.cliente.fecha_nacimiento).toDate(),
        telefono:  $scope.cliente.telefono,
        direccion:  $scope.cliente.direccion,

      };
      $rootScope.loading = false;
    });

    $scope.cambios_cuenta = function () {
      $rootScope.loading = true;
      var info = {
        email: $scope.nuevo.email,
        nombre: $scope.nuevo.nombre,
        apellido: $scope.nuevo.apellido,
        fecha_nacimiento: moment($scope.nuevo.fecha_nacimiento).format('YYYY-MM-DD'),
        telefono: $scope.nuevo.telefono,
        direccion: $scope.nuevo.direccion
      };

      cliente_basicos.update({ id_cliente: sesionesControl.get("id_cliente") }, {datos: info}, function (data) {
        cliente.get({}, { id_cliente: sesionesControl.get("id_cliente") }, function (data) {
          $scope.cliente = data[0];
          $rootScope.loading = false;
          $scope.msg = "Se ha actualizado correctamente sus datos.";
        });
      })
    };

    $scope.cambiar_password = function () {
      $rootScope.loading = true;

      var formulario = {
        old: md5(document.getElementById("old_pass").value),
        new: md5(document.getElementById("new_pass").value),
        new2: md5(document.getElementById("new_pass_confirm").value)
      }

      if (formulario.new === formulario.new2) {
        if (formulario.old === $scope.cliente.password) {
          cliente_password.cambiar({ id_cliente: sesionesControl.get("id_cliente") }, {password: formulario.new}, function (data) {
            cliente.get({}, { id_cliente: sesionesControl.get("id_cliente") }, function (data) {
              $scope.cliente = data[0];
              $scope.msg = "Se ha actualizado con éxito su contraseña.";
              document.getElementById("old_pass").value = "";
              document.getElementById("new_pass").value = "";
              document.getElementById("new_pass_confirm").value = "";
            });
          });
        } else {
          $scope.msg = "La contraseña actual es incorrecta.";
        }
      } else {
        $scope.msg = "Las nuevas contraseñas no coinciden.";
      }
      $rootScope.loading = false;
    }

    $scope.cambiar_plan = function (id_plan) {
      $rootScope.loading = true;
      if (window.confirm("¿Esta  seguro que desea cambiar su tipo de suscripción?")) {
        suscripcion.cambiar_plan({ id_cliente: sesionesControl.get("id_cliente"), id_suscripcion: id_plan }, {}, function (data) {
          suscripcion.get({ id_cliente: sesionesControl.get("id_cliente") }, function (data) {
            $scope.suscripcion = data[0];
            $scope.msg = "Se ha cambiado su suscripción satisfactóriamente.";
            $rootScope.loading = false;
          });
        })
      }
    }

});
