(function () {

    var app = angular.module('app');

    app.service('horsesService', HorsesService);

    function HorsesService(sharedValues, $http, $q) {


        this.getHorses = _getHorses;
        this.getHorsesForLessons = _getHorsesForLessons;
        this.getIfHorseWork = _getIfHorseWork;
        this.getHorse = _getHorse;
        this.updateHorse = _updateHorse;
        this.deleteHorse = _deleteHorse;


        function _getHorses(includeDeleted) {

            var deferred = $q.defer();

            $http.get(sharedValues.apiUrl + 'horses/gethorses' + (includeDeleted ? '/' + includeDeleted : '')).then(function (res) {

                var horses = res.data;
                for (var i in horses) {
                    horses[i].Meta = JSON.parse(horses[i].Meta);
                }


                deferred.resolve(horses);
            });
            return deferred.promise;
        }





        function _getHorsesForLessons(includeDeleted) {

            var deferred = $q.defer();

            $http.get(sharedValues.apiUrl + 'horses/gethorses' + (includeDeleted ? '/' + includeDeleted : '')).then(function (res) {

                var horses = res.data;
                var reshorses = [];
                for (var i in horses) {
                    horses[i].Meta = JSON.parse(horses[i].Meta);

                    if (horses[i].Meta.Active != "active" || horses[i].Meta.Ownage != "school") {

                        continue;
                    }
                    reshorses.push(horses[i]);

                }




                deferred.resolve(reshorses);
            });
            return deferred.promise;
        }

        function _getIfHorseWork(id, start, end) {

            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'horses/checkifhorsework/', { params: { id: id, start: start, end: end } }).then(function (res) {

                deferred.resolve(res.data);
            });


            return deferred.promise;
        }



        function _getHorse(id, type) {

            var deferred = $q.defer();
            if (id == 0) {
                $http.get(sharedValues.apiUrl + 'horses/newhorse/').then(function (res) {
                    deferred.resolve(res.data);
                });
            }
            else {
                $http.get(sharedValues.apiUrl + 'horses/gethorse/' + id + '/' + type).then(function (res) {
                    var horse = res.data;

                    if (type == 1) {
                        horse.Meta = angular.fromJson(horse.Meta);
                        horse.Meta.BirthDate = horse.Meta.BirthDate != '' ? new Date(horse.Meta.BirthDate) : null;
                    }
                    deferred.resolve(horse);
                });
            }
            return deferred.promise;
        }

        function _updateHorse(horse) {
            var deferred = $q.defer();
            horse.Meta = angular.toJson(horse.Meta);
            $http.post(sharedValues.apiUrl + 'horses/updatehorse', horse).then(function (res) {
                var horse = res.data;
                horse.Meta = angular.fromJson(horse.Meta);
                horse.Meta.BirthDate = horse.Meta.BirthDate != '' ? new Date(horse.Meta.BirthDate) : null;
                deferred.resolve(horse);
            });
            return deferred.promise;
        }

        function _deleteHorse(id) {
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'horses/deleteHorse/' + id).then(function (res) {
                deferred.resolve();
            });
            return deferred.promise;
        }

    }

})();