(function () {

    var app = angular.module('app');

    app.component('comments', {
        templateUrl: 'app/common/components/comments/comments.template.html',
        controller: CommentsController,
        bindings: {
            studentid: '=',
            selectedpayvalue: "=",
            students: '<',
            closeCallback: '<',
            deleteCallback: '<'
        }
    });

    function CommentsController($scope, usersService, lessonsService, farmsService, sharedValues, $http, notificationsService) {

        var self = this;
        this.scope = $scope;
        this.notificationsService = notificationsService;
        this.hide = _hide.bind(this);
        this.close = _close.bind(this);



        notificationsService.getMessagesList().then(function (res) {
            this.scope.messages = res;
        


        }.bind(this));


        //this.scope.messages = [
        //    { name: 'צחי חזן' },
        //    { name: 'עדי חזן' },
        //    { name: 'שילה חזן' },
        //    { name: 'מיכל חזן' }

        //];

        this.scope.$on('comments.show', this.onShow);

        function _onShow(event, selectedStudent) {




            //  alert(selectedStudent)
            //  this.paySum = selectedPayValue;

            //this.totalExpenses = 0;
            //this.unpaidLessons = 0;
            //this.monthlyBalance = 0;

            //this.payWin = false;

            //this.usersService.getUser(selectedStudent).then(function (user) {
            //    this.user = user;

            //    this.initPaymentForm();

            //    this.countAllCredits();

            //}.bind(this));



        }



        function _hide() {
            // if ($(event.target).is('.event-background')) {
            this.studentid = null;
            //}

            //if ($(event.target).is('.event-background') || $(event.target).is('.btnClose')) {
            //    this.studentid = null;
            //}
        }

        function _close(list) {

            var returnmessages = [];
            angular.forEach(list, function (value, key) {
                if (list[key].selected == list[key].Desc) {

                    // alert(list[key].selected);
                    returnmessages.push(list[key].selected);
                }
            });
           
            this.closeCallback(returnmessages);
            this.studentid = null;

        }




    }


})();