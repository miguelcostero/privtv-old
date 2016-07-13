var app = angular.module("pritvApp");

app.controller("SingUpController", function ($scope, $rootScope, planes) {
  $scope.formData = {};
  $scope.years = [];

  planes.get({}, {}, function (data) {
    $scope.planes = data;
  });

  var myDate = new Date();
  var year = myDate.getFullYear();
  for(var i = year; i < 2046; i++) {
    $scope.years.push({"year": i});
  }

/*
  if ($scope.formData.profile.nombre && $scope.formData.profile.apellido && $scope.formData.profile.email && $scope.formData.profile.fecha_nacimiento && $scope.formData.profile.direccion && $scope.formData.profile.telefono && $scope.formData.subscription.id_tipo_suscripcion  && $scope.formData.subscription.nombre && $scope.formData.subscription.descripcion && $scope.formData.subscription.monto_mensual && $scope.formData.subscription.num_usuarios && $scope.formData.payment.tipo && $scope.formData.payment.card && $scope.formData.payment.cvv && $scope.formData.payment.vencimiento && $scope.formData.user.nickname && $scope.formData.user.bio && $scope.formData.user.imagen) {

    $scope.formValidate = true;
  } else {
    $scope.formValidate = false;
  } */
});
