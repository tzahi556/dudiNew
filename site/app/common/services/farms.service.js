﻿(function () {

    var app = angular.module('app');

    app.service('farmsService', FarmsService);

    function FarmsService(sharedValues, $http, $q) {
        this.getFarms = _getFarms;
        this.getFarm = _getFarm;
        this.updateFarm = _updateFarm;
        this.deleteFarm = _deleteFarm;
        this.getMangerFarm = _getMangerFarm;
        this.getMangerInstructorFarm = _getMangerInstructorFarm;
        this.setMangerInstructorFarm = _setMangerInstructorFarm;
        this.setMangerFarm = _setMangerFarm;

        this.getFarmsMainUser = _getFarmsMainUser;
        this.getKlalitHistoris = _getKlalitHistoris;


        function _getKlalitHistoris(farmId, startDate, endDate, type, klalitId) {


          
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'farms/getKlalitHistoris/', { params: { farmId: farmId, startDate: startDate, endDate: endDate, type: type, klalitId:klalitId } }).then(function (res) {

                deferred.resolve(res.data);
            });

            return deferred.promise;
        }






        function _getFarmsMainUser(farmId) {
            var deferred = $q.defer();


            $http.get(sharedValues.apiUrl + 'farms/getFarmsMainUser/' + farmId ).then(function (res) {
                var user = res.data;
                
                deferred.resolve(user);
            });
            return deferred.promise;
        }
        

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


        function _getMangerFarm() {
            var deferred = $q.defer();


            $http.get(sharedValues.apiUrl + 'farms/getMangerFarm').then(function (res) {
                var farmmanger = res.data;
               
                deferred.resolve(farmmanger);
            });
            return deferred.promise;
        }
        function _getMangerInstructorFarm() {
            var deferred = $q.defer();


            $http.get(sharedValues.apiUrl + 'farms/getMangerInstructorFarm').then(function (res) {
               
                var farminstructors = res.data;

                deferred.resolve(farminstructors);
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


        function _setMangerInstructorFarm(farminstructors) {
            var deferred = $q.defer();
          
            $http.post(sharedValues.apiUrl + 'farms/setMangerInstructorFarm', farminstructors).then(function (res) {
                var farm = res.data;
            
                deferred.resolve(farm);
            });
            return deferred.promise;
        }


        function _setMangerFarm(farmmanger) {
            var deferred = $q.defer();
          
            $http.post(sharedValues.apiUrl + 'farms/setMangerFarm', farmmanger).then(function (res) {
                var farm = res.data;
            
                deferred.resolve(farm);
            });
            return deferred.promise;
        }






    }

})();