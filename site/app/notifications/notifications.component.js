(function () {
    var app = angular.module('app');

    app.component('notifications', {
        templateUrl: 'app/notifications/notifications.template.html',
        controller: NotificationsController,
        bindings: {
            notifications: '<'
        }
    });

    function NotificationsController($scope, $rootScope, $state, notificationsService) {
        this.redirect = _redirect.bind(this);
        this.isSysAdmin = localStorage.getItem("currentRole") == "sysAdmin";
        this.role = localStorage.getItem("currentRole");
        this.delete = _delete.bind(this);
        this.update = _update.bind(this);
        this.reloadCheckUnCheck = _reloadCheckUnCheck.bind(this);
        this.getifOneCheck = _getifOneCheck.bind(this);
        this.deleteALL = _deleteALL.bind(this);
        this.refreshData = _refreshData.bind(this);
        this.filteredItems = [];


        function _refreshData() {
            this.filteredItems = this.notifications;
        }
        

        function _deleteALL() {
            

            var Checkednotifications = [];
            for (var i in this.filteredItems) {
                if (this.filteredItems[i].Show)
                { Checkednotifications.push(this.filteredItems[i]) };
            }


            var currentThis = this;
            notificationsService.deleteAllNotification(Checkednotifications).then(function (res) {
                currentThis.notifications = res;
            });
           
        }

        
        function _getifOneCheck() {

            for (var i in this.notifications) {


                if (this.notifications[i].Show) return true;

            }

            return false;
        }




        function _reloadCheckUnCheck() {

            for (var i in this.notifications) {

                this.notifications[i].Show = $scope.selectAll;

            }
        }

        function _delete(id) {
            notificationsService.deleteNotification(id).then(function () {
                location.reload();
            });
        }

        function _update(notification) {
            notificationsService.updateDetails(notification.Id, notification.Details);
        }

        function _redirect(notification) {
            if (notification.EntityType) {
                $state.go(notification.EntityType, { id: notification.EntityId });
            }
        }
    }

})();