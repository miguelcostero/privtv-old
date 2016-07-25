var app = angular.module("pritvApp");

app.controller("UserController", function ($scope, $rootScope, $location, sesionesControl, suscripcionCliente, cliente, logUsuarios, usuariosFactory, Flash, generos) {
	$rootScope.loading = true;
    $scope.formData = {};
    $scope.enableNuevoUsuario = true;

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
    });

    //usuarios
    logUsuarios.getAllUsers(sesionesControl.get("id_cliente")).get(function (data) {
    	$scope.users = data;
        $rootScope.loading = false;
        var num_usuarios_actual = _.size(data);
        suscripcionCliente.get({ id_cliente: sesionesControl.get("id_cliente") }, {}, function (data) {
            var num_usuarios_suscripcion = data[0].num_usuarios;

            if (num_usuarios_actual >= num_usuarios_suscripcion) {
                $scope.enableNuevoUsuario = false;
            }
        });
    });

    //generos
    generos.get({}, {}, function (data) {
        $scope.generos = data;
    });

    //eliminar usuario
    $scope.eliminar_usuario = function (idUsuario) {
    	if (window.confirm("¿Desea eliminar este usuario?")) {
            $rootScope.loading = true;
            usuariosFactory.delete({ id_usuario: idUsuario, id_cliente: sesionesControl.get("id_cliente") }, {}, function (data) {
                $rootScope.loading = false;
                $scope.users = data;
                Flash.create('success', 'Se he eliminado correctamente el usuario.');
            })
    	}
    }

    //crear un nuevo usuario
    $scope.nuevo = function () {
        $rootScope.loading = true;
        usuariosFactory.nuevo({ id_cliente: sesionesControl.get("id_cliente") }, { registro: $scope.formData.user }, function (data) {
            $rootScope.loading = false;
            $scope.users = data;
            Flash.create('success', 'Se ha creado el nuevo cliente exitosamente.');
        });
    }
})

app.controller("editUserController", function ($scope, $rootScope, $stateParams, $state, usuariosFactory, Flash) {
    $rootScope.loading = true;
    $scope.idUsuario = $stateParams.userID;

    usuariosFactory.get({ id_usuario: $scope.idUsuario }, {}, function (data) {
        $rootScope.loading = false;
        $scope.data = data[0];

        $scope.data.gustos = _.map(data, function(data) {
            return {"idGenero": data.idGenero, "nombre": data.nombre};
        });
    });

    $scope.editar = function () {
        $rootScope.loading = true;
        usuariosFactory.editar({ id_usuario: $stateParams.userID }, { datos: $scope.data }, function (data) {
            $rootScope.loading = false;
            $scope.users = data;
            Flash.create('success', 'Se han guardado correctamente sus cambios.');
            $state.go("user.home");
        });
    }
})
