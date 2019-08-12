(function () {

    var app = angular.module('app');

    app.service('farmsService', FarmsService);

    function FarmsService(sharedValues, $http, $q) {
        this.getFarms = _getFarms;
        this.getFarm = _getFarm;
        this.updateFarm = _updateFarm;
        this.deleteFarm = _deleteFarm;

        function _getFarms(includeDeleted) {
            var deferred = $q.defer();

        
            $http.get(sharedValues.apiUrl + 'farms/getfarms' + (includeDeleted ? '/' + includeDeleted : '')).then(function (res) {
                var farms = res.data;
                for (var i in farms) {
                    farms[i].Meta = JSON.parse(farms[i].Meta);
                }
                deferred.resolve(farms);
            });
            return deferred.promise;
        }

        function _getFarm(id) {
            var deferred = $q.defer();
            if (id == 0) {
                $http.get(sharedValues.apiUrl + 'farms/newfarm/').then(function (res) {
                    deferred.resolve(res.data);
                });
            }
            else {
                $http.get(sharedValues.apiUrl + 'farms/getfarm/' + id).then(function (res) {
                    var farm = res.data;
                    farm.Meta = angular.fromJson(farm.Meta);
                    deferred.resolve(farm);
                });
            }
            return deferred.promise;
        }

        function _updateFarm(farm) {
            var deferred = $q.defer();
            farm.Meta = angular.toJson(farm.Meta);
            $http.post(sharedValues.apiUrl + 'farms/updatefarm', farm).then(function (res) {
                var farm = res.data;
                farm.Meta = angular.fromJson(farm.Meta);
                deferred.resolve(farm);
            });
            return deferred.promise;
        }

        function _deleteFarm(id) {
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'farms/deleteFarm/' + id).then(function (res) {
                deferred.resolve();
            });
            return deferred.promise;
        }

    }

})();