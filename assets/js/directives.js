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
