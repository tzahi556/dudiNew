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
        this.delete = _delete.bind(this);
        this.update = _update.bind(this);

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