var app = angular.module("pritvApp");

app.factory("peliculas", function ($resource) {
  return $resource("http://api-privtv.rhcloud.com/peliculas/:id_pelicula", { id_pelicula: "@id_pelicula" }, {
    get: {
      method: "GET",
      isArray: true
    }
  })
})

app.factory("generoPelicula", function ($resource) {
    return $resource("http://api-privtv.rhcloud.com/pelicula-generos/:id_pelicula", //la url donde queremos consumir
        { id_pelicula: "@id_pelicula" }, //aquí podemos pasar variables que queramos pasar a la consulta
        //a la función get le decimos el método, y, si es un array lo que devuelve
        //ponemos isArray en true
        { get: { method: "GET", isArray: true }
    })
})

app.factory("actoresPelicula", function ($resource) {
    return $resource("http://api-privtv.rhcloud.com/pelicula-actores/:id_pelicula", //la url donde queremos consumir
        { id_pelicula: "@id_pelicula" }, //aquí podemos pasar variables que queramos pasar a la consulta
        //a la función get le decimos el método, y, si es un array lo que devuelve
        //ponemos isArray en true
        { get: { method: "GET", isArray: true }
    })
})

app.factory("directoresPelicula", function ($resource) {
    return $resource("http://api-privtv.rhcloud.com/pelicula-directores/:id_pelicula", //la url donde queremos consumir
        { id_pelicula: "@id_pelicula" }, //aquí podemos pasar variables que queramos pasar a la consulta
        //a la función get le decimos el método, y, si es un array lo que devuelve
        //ponemos isArray en true
        { get: { method: "GET", isArray: true }
    })
})

app.factory("logCliente", function ($http, $location, sesionesControl, mensajesFlash, $rootScope) {
    var cacheSession = function (id) {
        sesionesControl.set("clienteLogin", true);
        sesionesControl.set("id_cliente", id);
    }
    var unCacheSession = function () {
        sesionesControl.unset("clienteLogin");
        sesionesControl.unset("id_cliente");
    }
    return {
      //funcion para iniciar la sesion del cliente
      login: function (email, password) {
        return $http({
                url: 'http://api-privtv.rhcloud.com/validar-cliente',
                method: "POST",
                data : "email_login="+email+"&password_login="+password,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data, status, headers, config) {
              if (status == 200) {
                $rootScope.logueado = true;
                $rootScope.loading = false;
                //si todo ha ido bien limpiamos los mensajes flash
                mensajesFlash.clear();
                //creamos la sesión con el email del cliente
                cacheSession(data[0].idCliente);
                //redireccionamos a mostrar seleccionar un usuario
                $location.path("/seleccionar-usuario/"+data[0].idCliente);
              }
            }).error(function(error, status, headers, config) {
                if (status == 401) {
                  $rootScope.loading = false;
                  console.log("Error: "+error+". Status: "+status);
                  mensajesFlash.show("La autentificación ha fallado, ha introducido datos erróneos.");
                } else if(status == -1) {
                  $rootScope.loading = false;
                  console.log("Error: "+error+". Status: "+status);
                  mensajesFlash.show("No se ha podido establecer la conexión a internet.");
                } else {
                  $rootScope.loading = false;
                  console.log("Error: "+error+". Status: "+status);
                  mensajesFlash.show("Error: "+error+". Status: "+status);
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
      return $resource("http://api-privtv.rhcloud.com/users/cliente/:id_cliente", //la url donde queremos consumir
          { id_cliente: idCliente }, //aquí podemos pasar variables que queramos pasar a la consulta
          //a la función get le decimos el método, y, si es un array lo que devuelve
          //ponemos isArray en true
          { get: { method: "GET", isArray: true }
      })
    },
    getUser: function (idUsuario) {
      return $resource("http://api-privtv.rhcloud.com/users/:id_usuario", //la url donde queremos consumir
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

//esto simplemente es para lanzar un mensaje si el login falla, se puede extender para darle más uso
app.factory("mensajesFlash", function($rootScope){
    return {
        show : function (message) {
            $rootScope.flash = message;
        },
        clear : function(){
            $rootScope.flash = "";
        }
    }
});

app.factory("subtitulos", function ($resource) {
  return $resource("http://api-privtv.rhcloud.com/peliculas/:id_pelicula/subtitulos", //la url donde queremos consumir
      { id_pelicula: "@id_pelicula"  },
      { get: { method: "GET", isArray: true }
  })
})

app.factory("reproducciones", function ($resource, $http) {
  return $resource("http://api-privtv.rhcloud.com/peliculas/reproduccion/:id_pelicula",
      { id_pelicula: "@id_pelicula" },
      {
         post: {
           method: "POST"
         }
      })
})

app.factory("generos", function ($resource) {
  return $resource("http://api-privtv.rhcloud.com/generos/:id_genero",
      { id_genero: "@id_genero" },
      { get: { method: "GET", isArray: true }
    })
})

app.factory("cliente", function ($resource) {
  return $resource("http://api-privtv.rhcloud.com/clientes/:id_cliente",
      { id_cliente: "@id_cliente" },
      { get: { method: "GET", isArray: true }
    })
})

app.factory("cliente_basicos", function ($resource) {
  return $resource("http://api-privtv.rhcloud.com/admin/clientes/basicos/:id_cliente",
        { id_cliente: "@id_cliente" },
        { update: { method: "PUT" }
      })
})
