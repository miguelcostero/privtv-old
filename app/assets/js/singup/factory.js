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
