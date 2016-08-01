var app = angular.module("pritvApp");

app.factory('isEmailAvailable', function($q, $http) {
  return function(email) {
    var deferred = $q.defer();

    $http.get('http://api-privtv.rhcloud.com/admin/clientes/' + email).then(function(res) {
      // Found the user, therefore not unique.
      if (res.data == 'true') {
        deferred.reject();
      } else {
        deferred.resolve();
      }
    });

    return deferred.promise;
  }
});

app.factory('isEmailAvailableEdit', function($q, $http, sesionesControl) {
  return function(email) {
    var deferred = $q.defer();

    $http.get('http://api-privtv.rhcloud.com/admin/clientes/' + email + '/id/'+ sesionesControl.get("id_cliente")).then(function(res) {
      // Found the user, therefore not unique.
      if (res.data == 'true') {
        deferred.reject();
      } else {
        deferred.resolve();
      }
    });

    return deferred.promise;
  }
});

app.factory('nuevoCliente', function ($resource) {
  return $resource("http://api-privtv.rhcloud.com/clientes/nuevo", {} , { nuevo: { method: "POST" }});
});
