(function () {
    var app = angular.module('app');

    app.component('notificationsNav', {
        templateUrl: 'app/common/components/notifications/notifications.template.html',
        controller: NotificationsController,
        bindings: {}
    });

    function NotificationsController($scope, notificationsService) {
        this.notifications = 0;
        this.firstTime = true;

        setInterval(function () {
            notificationsService.getNotifications().then(function (data) {
                $scope.$broadcast('notificationsNav.refresh', data.length)
            });
        }, 1000 * 60);

        $scope.$on('notificationsNav.refresh', function (event, data) {
            // צחי הוריד צהלה של סוס בעת הודעה חדשה
            //if (this.notifications < data && !this.firstTime) {
            //    this.alertAudio = new Audio('app/common/components/notifications/alert.mp3');
            //    this.alertAudio.play();
            //}
            this.notifications = data;
            this.firstTime = false;

        }.bind(this));
    }

})();