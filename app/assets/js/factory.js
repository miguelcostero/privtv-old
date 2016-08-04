var app = angular.module("pritvApp");

app.factory("peliculas", function ($resource) {
  return $resource("http://" + api_url + "/peliculas/:id_pelicula", { id_pelicula: "@id_pelicula" }, {
    get: {
      method: "GET",
      isArray: true
    }
  })
})

app.factory("generoPelicula", function ($resource) {
    return $resource("http://" + api_url + "/pelicula-generos/:id_pelicula", //la url donde queremos consumir
        { id_pelicula: "@id_pelicula" }, //aquí podemos pasar variables que queramos pasar a la consulta
        //a la función get le decimos el método, y, si es un array lo que devuelve
        //ponemos isArray en true
        { get: { method: "GET", isArray: true }
    })
})

app.factory("actoresPelicula", function ($resource) {
    return $resource("http://" + api_url + "/pelicula-actores/:id_pelicula", //la url donde queremos consumir
        { id_pelicula: "@id_pelicula" }, //aquí podemos pasar variables que queramos pasar a la consulta
        //a la función get le decimos el método, y, si es un array lo que devuelve
        //ponemos isArray en true
        { get: { method: "GET", isArray: true }
    })
})

app.factory("directoresPelicula", function ($resource) {
    return $resource("http://" + api_url + "/pelicula-directores/:id_pelicula", //la url donde queremos consumir
        { id_pelicula: "@id_pelicula" }, //aquí podemos pasar variables que queramos pasar a la consulta
        //a la función get le decimos el método, y, si es un array lo que devuelve
        //ponemos isArray en true
        { get: { method: "GET", isArray: true }
    })
})

app.factory("logCliente", function ($http, sesionesControl, Flash, $rootScope, morosidad) {
    var unCacheSession = function () {
        sesionesControl.unset("clienteLogin");
        sesionesControl.unset("id_cliente");
    }
    return {
      //funcion para iniciar la sesion del cliente
      login: function (email, password) {
        return $http({
                url: 'http://' + api_url + '/validar-cliente',
                method: "POST",
                data : "email_login="+email+"&password_login="+password,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data, status, headers, config) {
              if (status == 200) {
                //verificamos si el cliente se encuentra suspendido
                if (data[0].suspendido === "false") {
                  //verificamos morosidad del cliente
                  morosidad.verificar(data[0].idCliente);
                } else {
                  $rootScope.loading = false;
                  Flash.create('danger', 'Esta cuenta se encuentra suspendida.');
                }
              }
            }).error(function(error, status, headers, config) {
                if (status == 401) {
                  $rootScope.loading = false;
                  console.log("Error: "+error+". Status: "+status);
                  Flash.create('danger', 'Su correo electrónico y/o contraseña son inválidos.');
                } else if(status == -1) {
                  $rootScope.loading = false;
                  console.log("Error: "+error+". Status: "+status);
                  Flash.create('danger', 'No se ha podido establecer la conexión a internet.');
                } else if (status >= 500) {
                  $rootScope.loading = false;
                  console.log("Error: "+error+". Status: "+status);
                  Flash.create('danger', 'Priv.TV esta presentando problemas internos actualmente, por favor intente de nuevo más tarde.');
                } else {
                  $rootScope.loading = false;
                  console.log("Error: "+error+". Status: "+status);
                  Flash.create('danger', "Error: "+error+". Status: "+status);
                }
            })
      },
      //función para cerrar la sesión del cliente
      logout : function() {
          return unCacheSession();
      },
      //función que comprueba si la sesión clienteLogin almacenada en sesionStorage existe
      isLoggedIn : function(){
          return sesionesControl.get("clienteLogin");
      }
    }
})

//factory con el control de sesion
app.factory("sesionesControl", function() {
    return {
    	  //obtenemos una sesión //getter
        get : function(key) {
            return sessionStorage.getItem(key)
        },
        //creamos una sesión //setter
        set : function(key, val) {
            return sessionStorage.setItem(key, val)
        },
        //limpiamos una sesión
        unset : function(key) {
            return sessionStorage.removeItem(key)
        }
    }
});

app.factory("logUsuarios", function ($resource, sesionesControl) {
  var unCacheSession = function () {
      sesionesControl.unset("usuarioLogin");
      sesionesControl.unset("idUsuario");
  }

  return {
    getAllUsers: function (idCliente) {
      return $resource("http://" + api_url + "/users/cliente/:id_cliente", //la url donde queremos consumir
          { id_cliente: idCliente }, //aquí podemos pasar variables que queramos pasar a la consulta
          //a la función get le decimos el método, y, si es un array lo que devuelve
          //ponemos isArray en true
          { get: { method: "GET", isArray: true }
      })
    },
    getUser: function (idUsuario) {
      return $resource("http://" + api_url + "/users/:id_usuario", //la url donde queremos consumir
          { id_usuario: idUsuario },
          { get: { method: "GET", isArray: true }
      })
    },
    userChange: function () {
      return unCacheSession();
    },
    isLoggedIn: function () {
      return sesionesControl.get("usuarioLogin");
    }
  }
});

app.factory("subtitulos", function ($resource) {
  return $resource("http://" + api_url + "/peliculas/:id_pelicula/subtitulos", //la url donde queremos consumir
      { id_pelicula: "@id_pelicula"  },
      { get: { method: "GET", isArray: true }
  })
})

app.factory("reproducciones", function ($resource, $http) {
  return $resource("http://" + api_url + "/peliculas/reproduccion/:id_pelicula",
      { id_pelicula: "@id_pelicula" },
      {
         post: {
           method: "POST"
         }
      })
})

app.factory("generos", function ($resource) {
  return $resource("http://" + api_url + "/generos/:id_genero",
      { id_genero: "@id_genero" },
      { get: { method: "GET", isArray: true }
    })
})

app.factory("cliente", function ($resource) {
  return $resource("http://" + api_url + "/clientes/:id_cliente",
      { id_cliente: "@id_cliente" },
      { get: { method: "GET", isArray: true }
    })
})

app.factory("cliente_basicos", function ($resource) {
  return $resource("http://" + api_url + "/admin/clientes/basicos/:id_cliente",
        { id_cliente: "@id_cliente" },
        { update: { method: "PUT" }
      })
})

app.factory("cliente_password", function ($resource) {
  return $resource("http://" + api_url + "/admin/clientes/:id_cliente/password",
        { id_cliente: "@id_cliente" },
        { cambiar: { method: "PATCH" }
      })
})

app.factory("suscripcion", function ($resource) {
  return $resource("http://" + api_url + "/admin/clientes/:id_cliente/suscripcion/:id_suscripcion",
      { id_cliente: "@id_cliente" },
      { get: { method: "GET", isArray: true },
        cambiar_plan: { method: "PATCH" }
    })
})

app.factory("planes", function ($resource) {
  return $resource("http:/" + api_url + "/admin/planes/:id_plan",
      {
        id_plan: "@id_plan"
      }, {
        get: { method: "GET", isArray: true }
      })
})

app.factory("morosidad", function ($http, $state, $rootScope, Flash, sesionesControl) {
  return {
    verificar: function (idC) {
      return $http({
        url: 'http://' + api_url + '/clientes/'+ idC +'/moroso',
        method: "GET"
      }).success((data, status, headers, config) => {
        let ultimo_pago = moment(data.fecha_hora);
        let hoy = moment();
        let diferencia = hoy.diff(ultimo_pago, "months");

        if (diferencia > 0) {
          $rootScope.loading = false;
          $state.go("defaulters", { id_cliente: idC }, { reload:true });
        } else {
          $rootScope.logueado = true;
          $rootScope.loading = false;
          sesionesControl.set("clienteLogin", true);
          sesionesControl.set("id_cliente", idC);
          $state.go('users-login', { id_cliente: idC }, {reload:true});
        }
      }).error((error, status, headers, config) => {
        console.log(error);
      })
    }
  }
})
