﻿(function () {

    var app = angular.module('app');

    app.service('horsesService', HorsesService);

    function HorsesService(sharedValues, $http, $q) {


        this.getHorses = _getHorses;
        this.getHorsesForLessons = _getHorsesForLessons;
        this.getIfHorseWork = _getIfHorseWork;
        this.getHorse = _getHorse;
        this.updateHorse = _updateHorse;
        this.deleteHorse = _deleteHorse;
        this.getSusut = _getSusut;
        this.getHorsesReport = _getHorsesReport;
        

        this.updateHorseMultiTables = _updateHorseMultiTables;

        this.insertnewpregnancie = _insertnewpregnancie;


        function _insertnewpregnancie(newpregnancie,isBuild) {
          
            var deferred = $q.defer();
          
            $http.post(sharedValues.apiUrl + 'horses/insertnewpregnancie/' + isBuild, newpregnancie).then(function (res) {
                var horse = res.data;
              
                deferred.resolve(horse);
            });
            return deferred.promise;
        }





        function _getSusut() {

            var deferred = $q.defer();

            $http.get(sharedValues.apiUrl + 'horses/getSusut' ).then(function (res) {
                var horses = res.data;
                deferred.resolve(horses);
            });
            return deferred.promise;
        }



        function _updateHorseMultiTables(horse, files, hozefiles, pundekautfiles, treatments,
            vaccinations, shoeings, tilufings, pregnancies, pregnanciesstates, inseminations,hozims) {


            var dataobj = [horse, files, hozefiles, pundekautfiles, treatments,
                vaccinations, shoeings, tilufings, pregnancies, pregnanciesstates, inseminations, hozims];
            var deferred = $q.defer();
            $http.post(sharedValues.apiUrl + 'horses/updateHorseMultiTables', angular.toJson(dataobj)).then(function (res) {

                var horse = res.data;
                deferred.resolve(horse);
            });
            return deferred.promise;

        }


      

        function _getHorsesReport(type) {

            var deferred = $q.defer();

            $http.get(sharedValues.apiUrl + 'horses/getHorsesReport' + "/" + type).then(function (res) {

                var horses = res.data;


                deferred.resolve(horses);
            });
            return deferred.promise;
        }

        function _getHorses(includeDeleted) {

            var deferred = $q.defer();

            $http.get(sharedValues.apiUrl + 'horses/gethorses' + (includeDeleted ? '/' + includeDeleted : '')).then(function (res) {

                var horses = res.data;
              

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
                  //  horses[i].Meta = JSON.parse(horses[i].Meta);

                    if (horses[i].Active != "active" || horses[i].Ownage != "school") {

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
            //if (id == 0) {
            //    $http.get(sharedValues.apiUrl + 'horses/newhorse/').then(function (res) {
            //        deferred.resolve(res.data);
            //    });
            //}
            //else {

           
            $http.get(sharedValues.apiUrl + 'horses/gethorse/' + id + '/' + type).then(function (res) {
                    
                    var horse = res.data;

                    deferred.resolve(horse);
                });
           // }
            return deferred.promise;
        }

        function _updateHorse(horse) {
            var deferred = $q.defer();
           
            $http.post(sharedValues.apiUrl + 'horses/updatehorse', horse).then(function (res) {
                var horse = res.data;
              
                horse.BirthDate = horse.BirthDate != '' ? new Date(horse.BirthDate) : null;
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