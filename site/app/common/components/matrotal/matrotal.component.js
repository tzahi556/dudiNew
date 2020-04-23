(function () {

    var app = angular.module('app');

    app.component('matrotal', {
        templateUrl: 'app/common/components/matrotal/matrotal.template.html',
        controller: MatrotalController,
        bindings: {
            studentidmatrot: '=',
            selectedpayvalue: "=",
            students: '<',
            closeCallback: '<',
            deleteCallback: '<'
        }
    });

    function MatrotalController($scope, usersService, lessonsService, farmsService, sharedValues, $http, notificationsService) {

        this.lessonsService = lessonsService;
        this.usersService = usersService;
        var self = this;
        this.scope = $scope;
        this.notificationsService = notificationsService;
        this.hide = _hide.bind(this);
        this.close = _close.bind(this);

        this.onShow = _onShow.bind(this);
        this.mode = 1;
       
        this.isDateMoreToday = _isDateMoreToday.bind(this);

        //notificationsService.getMessagesList().then(function (res) {
        //    this.scope.messages = res;
        
        this.getInstructorName = _getInstructorName.bind(this);
        this.getDayOfWeek = _getDayOfWeek.bind(this);


        //}.bind(this));

        function _isDateMoreToday(date) {
          
            if (moment(date) > moment()) return true;

            return false;
        }
       

        this.scope.$on('matrolal.show', this.onShow);

        function _onShow(event, selectedStudent, mode, user, lessonId) {

           
            this.mode = mode;
            this.user = user;
         

          
            this.usersService.getUsers(['instructor', 'profAdmin'], true).then(function (instr) {
                this.instructors = instr;

            }.bind(this));


            this.lessonsService.getLessons(this.user.Id).then(function (less) {

                var tempLessons = [];
                for (var i = 0; i < less.length; i++) {
                   
                    if (less[i].id == lessonId) {

                        less[i].title = "שיעור נוכחי";
                        tempLessons.push(less[i]);
                       
                        if (less[i - 1]) {

                            tempLessons.push(less[i - 1]);
                            less[i-1].title = "שיעור קודם";
                        }

                    }
                       
                }

                this.lessons = tempLessons;
               

            }.bind(this));



        }

        function _getDayOfWeek(day) {
            var newDate = new Date(day);
            var CurrentDay = newDate.getDay();
            if (CurrentDay == 0) return "א'";
            if (CurrentDay == 1) return "ב'";
            if (CurrentDay == 2) return "ג'";
            if (CurrentDay == 3) return "ד'";
            if (CurrentDay == 4) return "ה'";
            if (CurrentDay == 5) return "ו'";
            if (CurrentDay == 6) return "ש'";

            return newDate.getDay();
        }


        function _getInstructorName(id) {
            for (var i in this.instructors) {
                if (this.instructors[i].Id == id) {
                    return this.instructors[i].FirstName + " " + this.instructors[i].LastName;
                }
            }
        }



        function _hide() {

           
            // if ($(event.target).is('.event-background')) {
            this.studentidmatrot = null;
            //}

            //if ($(event.target).is('.event-background') || $(event.target).is('.btnClose')) {
            //    this.studentid = null;
            //}
        }

        function _close(lesson) {

            
            //studentId: studentId, lessonId: lessonId

            var lessnStatus = [];

            lesson.statuses[0].lessonId = lesson.id;
            lesson.statuses[0].studentId = lesson.students[0];
            lessnStatus.push(lesson.statuses[0]);
            this.lessonsService.updateStudentLessonsStatuses(lessnStatus).then(function (res) {
                                  
                alert("המשוב עבור השיעור נשמר בהצלחה!");       
             }.bind(this));

           
            this.studentidmatrot = null;

        }




    }


})();