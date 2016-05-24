var app = angular.module("pritvApp");

//de esta forma tan sencilla consumimos con $resource en AngularJS
app.factory("peliculasPopulares", function ($resource) {
    return $resource("http://api-privtv.rhcloud.com/peliculas-populares", //la url donde queremos consumir
        {}, //aquí podemos pasar variables que queramos pasar a la consulta
        //a la función get le decimos el método, y, si es un array lo que devuelve
        //ponemos isArray en true
        { get: { method: "GET", isArray: true }
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

app.factory("peliculaDetalles", function ($resource) {
  return $resource("http://api-privtv.rhcloud.com/peliculas/:id_pelicula", //la url donde queremos consumir
      { id_pelicula: "@id_pelicula" }, //aquí podemos pasar variables que queramos pasar a la consulta
      //a la función get le decimos el método, y, si es un array lo que devuelve
      //ponemos isArray en true
      { get: { method: "GET", isArray: true }
  })
})

app.factory("peliculasNuevas", function ($resource) {
  return $resource("http://api-privtv.rhcloud.com/peliculas-nuevas", //la url donde queremos consumir
      {}, //aquí podemos pasar variables que queramos pasar a la consulta
      //a la función get le decimos el método, y, si es un array lo que devuelve
      //ponemos isArray en true
      { get: { method: "GET", isArray: true }
  })
})

app.factory("peliculasPorNombre", function ($resource) {
  return $resource("http://api-privtv.rhcloud.com/peliculas-alfabeticamente", //la url donde queremos consumir
      {}, //aquí podemos pasar variables que queramos pasar a la consulta
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
    var cacheSession = function (email) {
        sesionesControl.set("clienteLogin", true);
        sesionesControl.set("email_cliente", email);
    }
    var unCacheSession = function () {
        sesionesControl.unset("clienteLogin");
        sesionesControl.unset("email_cliente");
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
                $rootScope.loading = false;
                //si todo ha ido bien limpiamos los mensajes flash
                mensajesFlash.clear();
                //creamos la sesión con el email del cliente
                cacheSession(email);
                //redireccionamos a mostrar la lista de peliculas
                $location.path("/seleccionar-usuario/"+email);
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
    getAllUsers: function (emailCliente) {
      return $resource("http://api-privtv.rhcloud.com/getusers/:email_cliente", //la url donde queremos consumir
          { email_cliente: emailCliente }, //aquí podemos pasar variables que queramos pasar a la consulta
          //a la función get le decimos el método, y, si es un array lo que devuelve
          //ponemos isArray en true
          { get: { method: "GET", isArray: true }
      })
    },
    getUser: function (idUsuario) {
      return $resource("http://api-privtv.rhcloud.com/getuser/:id_usuario", //la url donde queremos consumir
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

app.factory("subtitulosPelicula", function ($resource) {
  return $resource("http://api-privtv.rhcloud.com/peliculas/:id_pelicula/subtitulos", //la url donde queremos consumir
      { id_pelicula: "@id_pelicula" },
      { get: { method: "GET", isArray: true }
  })
})
