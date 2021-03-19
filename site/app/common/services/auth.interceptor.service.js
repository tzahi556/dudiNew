(function () {
	var app = angular.module('app');

	app.service('authInterceptorService', AuthInterceptorService);

	function AuthInterceptorService($q, $location) {

		this.request = _request;
		this.responseError = _responseError;

		function _request(config) {

			config.headers = config.headers || {};

			var authData = localStorage.getItem('authorizationData');
			if (authData) {
				authData = angular.fromJson(authData);
				config.headers.Authorization = 'Bearer ' + authData.token;
			}

			return config;
		}

		function _responseError(rejection) {

			if (rejection.status === 401) {

				if (location.href.indexOf("userp") != -1) {
					
					var userplink = location.href.substring(location.href.indexOf("userp"));
					location.href = '#/login/' + userplink;

				} else { 
					$location.path('/login/');
				}
				//$location.path('#/login/dfdfdf=hjhjh/');
			}

			return $q.reject(rejection);
		}
	}

})();