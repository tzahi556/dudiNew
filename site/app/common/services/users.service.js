(function () {

    var app = angular.module('app');

    app.service('usersService', UsersService);

    function UsersService(sharedValues, $http, $q) {
        this.getUsers = _getUsers;
        this.getUser = _getUser;
        this.updateUser = _updateUser;
        this.updateUserMultiTables = _updateUserMultiTables;
        this.importUsers = _importUsers;
        this.deleteUser = _deleteUser;
        this.getUserIdByEmail = _getUserIdByEmail;
        this.roles = _roles();
        this.getUserExpensesByUserId = _getUserExpensesByUserId;

        this.getPaymentsByUserId = _getPaymentsByUserId;
        this.getUserUserhorsesByUserId = _getUserUserhorsesByUserId;
        this.getUserFilesByUserId = _getUserFilesByUserId;
        this.getUserCommitmentsByUserId = _getUserCommitmentsByUserId;
        this.getUserUserMakavByUserId = _getUserUserMakavByUserId;
        
        this.getAvailablehours = _getAvailablehours;
        this.getTransferData = _getTransferData;

        this.report = _report;
        this.reportHMO = _reportHMO;
        

        function _getUsers(role, includeDeleted) {
            var deferred = $q.defer();
          
            $http.get(sharedValues.apiUrl + 'users/getusers' + (role ? '/' + role : '') + (includeDeleted ? '/' + includeDeleted : '')).then(function (res) {
                

              
                var users = res.data;
             
                
                //for (var i in users) {
                //    users[i].Meta = JSON.parse(users[i].Meta);
                //}

               
                deferred.resolve(users);
              
            });

            
            return deferred.promise;
        }

        function _getUser(id) {
            var deferred = $q.defer();
            if (id == 0) {
                $http.get(sharedValues.apiUrl + 'users/newuser/').then(function (res) {
                    res.data.Meta = {};
                    deferred.resolve(res.data);
                });
            }
            else {
                $http.get(sharedValues.apiUrl + 'users/getuser/' + (id || '')).then(function (res) {
                    var user = res.data;
                   
                    // הישן
                    //var user = res.data;
                    //user.Meta = angular.fromJson(user.Meta);



                    deferred.resolve(user);
                });
            }
            return deferred.promise;
        }

        function _getPaymentsByUserId(id) {
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'users/getpaymentsbyuserid/' + (id || '')).then(function (res) {
              
                var user = res.data;
                
                deferred.resolve(user);
            });
            return deferred.promise;
        }




        function _getAvailablehours(id) {

          
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'users/getAvailablehours/' + (id || '')).then(function (res) {
                var user = res.data;

                deferred.resolve(user);
            });
            return deferred.promise;
        }

        

        function _getUserUserhorsesByUserId(id) {
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'users/getuseruserhorsesbyuserid/' + (id || '')).then(function (res) {
                var user = res.data;
                 
                deferred.resolve(user);
            });
            return deferred.promise;
        }

        function _getUserFilesByUserId(id) {
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'users/getuserfilesbyuserid/' + (id || '')).then(function (res) {
                var user = res.data;
              
                deferred.resolve(user);
            });
            return deferred.promise;
        }

        function _getUserCommitmentsByUserId(id) {
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'users/getusercommitmentsbyuserid/' + (id || '')).then(function (res) {
                var user = res.data;
             
                deferred.resolve(user);
            });
            return deferred.promise;
        }

        function _getUserExpensesByUserId(id) {
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'users/getuserexpensesbyuserid/' + (id || '')).then(function (res) {
                var user = res.data;
              
                deferred.resolve(user);
            });
            return deferred.promise;
        }

        function _getUserUserMakavByUserId(id) {
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'users/getuserusermakavbyuserid/' + (id || '')).then(function (res) {
                var user = res.data;

                deferred.resolve(user);
            });
            return deferred.promise;
        }

        function _updateUser(user) {
           
            var deferred = $q.defer();
         //   user.Meta = angular.toJson(user.Meta);
           
            $http.post(sharedValues.apiUrl + 'users/updateuser', user).then(function (res) {
             
                var user = res.data;
              //  user.Meta = angular.fromJson(user.Meta);
                deferred.resolve(user);
            });
            return deferred.promise;
        }

        function _updateUserMultiTables(user, payments, files, commitments, expenses, userhorses, availablehours,makav,checks) {
          
          
            var dataobj = [user, payments, files, commitments, expenses, userhorses, availablehours, makav, checks];
            var deferred = $q.defer();
           // user.Meta = "";//angular.toJson(user.Meta);

          

            $http.post(sharedValues.apiUrl + 'users/updateusermultitables', angular.toJson(dataobj)).then(function (res) {

                var user = res.data;
             //   user.Meta = angular.fromJson(user.Meta);
                deferred.resolve(user);
            });
            return deferred.promise;

        }

        //function _importUsers(users) {
        //    
        //    for (var user of users) {
        //        user.Meta = angular.toJson(user.Meta);
        //    }
        //    $http.post(sharedValues.apiUrl + 'users/importusers', users).then(function () {
        //        deferred.resolve();
        //    });
        //    return deferred.promise;
        //}
        function _importUsers(users) {
            var deferred = $q.defer();
            $http.post(sharedValues.apiUrl + 'users/importusers', users).then(function () {
                deferred.resolve();
            });
            return deferred.promise;
        }


        function _deleteUser(id) {
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'users/deleteUser/' + id).then(function (res) {
                deferred.resolve();
            });
            return deferred.promise;
        }

        function _getUserIdByEmail(email) {
            return $http.get(sharedValues.apiUrl + 'users/getUserIdByEmail/' + email + '/');
        }

        function _roles() {
            return sharedValues.roles;
        }

        function _report(type, fromDate, toDate) {
         
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'users/getReport/' + type + "/" + fromDate + "/" + toDate).then(function (res) {
                var data = res.data;

                deferred.resolve(data);
            });
            return deferred.promise;
        }
        function _reportHMO(fromDate, toDate) {
         
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'users/getReportHMO/' + fromDate + "/" + toDate).then(function (res) {
                var data = res.data;

                deferred.resolve(data);
            });
            return deferred.promise;
        }


        function _getTransferData(insructorId, dow,date) {
       
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'users/getTransferData/' + insructorId + "/" + dow + "/" + date).then(function (res) {
                var data = res.data;
              
                deferred.resolve(data);
            });
            return deferred.promise;
        }








    }

})();