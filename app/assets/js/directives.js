var app = angular.module("pritvApp");

app.directive("goBackButton",
		[function() {
			return {
				restrict: "E",
				require: "^videogular",
        scope: {
          idpelicula: "="
        },
        templateUrl: "./templates/directives/gobackbutton.html",
        link: function(scope, elem, attrs, API) {
					scope.API = API;
				}
			}
		}
	]);

app.directive('setParentActive', ['$location', function($location) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, controller) {
      var classActive = attrs.setParentActive || 'active',
          path = attrs.ngHref.replace('#', '');
      scope.location = $location;
      scope.$watch('location.path()', function(newPath) {
        if (path == newPath) {
          element.parent().addClass(classActive);
        } else {
          element.parent().removeClass(classActive);
        }
      })
    }
  }
}]);


app.directive('uiSrefIf', function($compile) {
    return {
        link: function($scope, $element, $attrs) {

            var uiSrefVal = $attrs.uiSrefVal,
                uiSrefIf  = $attrs.uiSrefIf;

            $element.removeAttr('ui-sref-if');
            $element.removeAttr('ui-sref-val');



            $scope.$watch(
                function(){
                    return $scope.$eval(uiSrefIf);
                },
                function(bool) {
                    if (bool) {

                        $element.attr('ui-sref', uiSrefVal);
                    } else {

                        $element.removeAttr('ui-sref');
                        $element.removeAttr('href');
                    }
                    $compile($element)($scope);
                }
            );
        }
    };
});
