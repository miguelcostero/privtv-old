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

app.directive('validNumber', function() {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      if(!ngModelCtrl) {
        return;
      }

      ngModelCtrl.$parsers.push(function(val) {
        if (angular.isUndefined(val)) {
            var val = '';
        }
        var clean = val.replace( /[^0-9]+/g, '');
        if (val !== clean) {
          ngModelCtrl.$setViewValue(clean);
          ngModelCtrl.$render();
        }
        return clean;
      });

      element.bind('keypress', function(event) {
        if(event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  };
});
