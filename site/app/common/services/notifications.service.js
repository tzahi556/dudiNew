(function () {

    var app = angular.module('app');

    app.service('notificationsService', NotificationsService);

    function NotificationsService(sharedValues, $http, $q) {
        this.getNotifications = _getNotifications;
        this.createNotification = _createNotification;
        this.deleteNotification = _deleteNotification;
        this.updateDetails = _updateDetails;
        this.getMessagesList = _getMessagesList;

        function _createNotification(notification) {
            return $http.post(sharedValues.apiUrl + 'notifications/createNotification', notification);
        }

        function _deleteNotification(id) {
            return $http.get(sharedValues.apiUrl + 'notifications/deleteNotification/' + id);
        }

        function _updateDetails(id, details) {
            return $http.post(sharedValues.apiUrl + 'notifications/updateDetails/', { id: id, details: details });
        }

        function _getNotifications() {
          
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'notifications/getNotifications').then(function (res) {
                deferred.resolve(res.data);
              
            });
            return deferred.promise;
        }

        function _getMessagesList() {
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'notifications/getMessagesList').then(function (res) {
                deferred.resolve(res.data);
            });
            return deferred.promise;
        }
    }

})();