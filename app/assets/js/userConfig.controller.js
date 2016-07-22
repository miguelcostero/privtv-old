var app = angular.module("pritvApp");

app.controller("UserController", function ($scope, $rootScope, $location, sesionesControl, cliente, logUsuarios) {
	$rootScope.loading = true;

	//bla bla bla
	if (sesionesControl.get("clienteLogin")) {
      if (!sesionesControl.get("usuarioLogin") || !$rootScope.usuario) {
        $location.path("/seleccionar-usuario/"+sesionesControl.get("id_cliente"));
      }
    } else {
      $location.path("/");
    }

    //cargando info cliente
    cliente.get({}, { id_cliente: sesionesControl.get("id_cliente") }, function (data) {
      $scope.cliente = data[0];
      $rootScope.loading = false;
    });

    //usuarios
    logUsuarios.getAllUsers(sesionesControl.get("id_cliente")).get(function (data) {
    	$scope.users = data;
    });

    $scope.eliminar_usuario = function (id_usuario) {
    	if (window.confirm("¿Desea eliminar este usuario?")) {

    	}
    }


})