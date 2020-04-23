(function () {

    var app = angular.module('app');

    app.component('event', {
        templateUrl: 'app/common/components/event/event.template.html',
        controller: EventController,
        bindings: {
            event: '=',
            students: '<',
            closeCallback: '<',
            deleteCallback: '<',
            horses: '<'
        }
    });

    function EventController($scope, $rootScope, lessonsService, sharedValues, usersService, horsesService) {
        this.usersService = usersService;
        this.horsesService = horsesService;
        this.scope = $scope;
        this.lessonsService = lessonsService;
        this.sharedValues = sharedValues;
        this.affectChildren = false;

        this.addStudentToEvent = _addStudentToEvent.bind(this);
        this.removeStudentFromEvent = _removeStudentFromEvent.bind(this);
        this.openComments = _openComments.bind(this);
        this.openMatrotal = _openMatrotal.bind(this);

        

        this.createNewStudent = _createNewStudent.bind(this);
        this.studentDataById = _studentDataById.bind(this);
        this.copyStatuses = _copyStatuses.bind(this);
        this.onShow = _onShow.bind(this);
        this.close = _close.bind(this);
        this.delete = _delete.bind(this);
        this.hide = _hide.bind(this);
        this.commentClose = _commentClose.bind(this);
        this.createStudentClose = _createStudentClose.bind(this);
        this.changeHorseValidation = _changeHorseValidation.bind(this);
        //  this.tranferDate = "";
        this.changeStudentstatus = _changeStudentstatus.bind(this);
        this.puplateInstructor = _puplateInstructor.bind(this);
        this.puplateTimesInstructor = _puplateTimesInstructor.bind(this);
        this.getStatusofStudent = _getStatusofStudent.bind(this);

        this.transferLesson = _transferLesson.bind(this);
        this.role = localStorage.getItem('currentRole');
        this.isEventHaveChild = false;
        this.onlyMultiple = 0;
        this.modalAppendClick = _modalAppendClick.bind(this);

        this.IsInstructorBlock = $rootScope.IsInstructorBlock;
        this.scope.$on('event.show', this.onShow);
    }


    function _changeStudentstatus(studentId) {


        //for (var i in this.changeLessonsStudent) {

        //    if (this.changeLessonsStudent[i].StudentId == studentId) {

        //        this.changeLessonsStudent[i].ChangeStatus = this.statuses[studentId];
        //    }
        //}


    }

    function _changeHorseValidation(studentId) {
        var HorseId = this.horsesarray[studentId];
        if (HorseId) {

            // alert(this.event.start);

            var res = this.horsesService.getIfHorseWork(HorseId, this.event.start, this.event.end).then(function (res) {


                if (res > 0) {
                    alert("סוס זה כבר עובד בשעה זו... בחר סוס אחר");
                    this.horsesarray[studentId] = null;
                }

            }.bind(this));



        }


    }


    function _createStudentClose(returnStudent) {


        this.students.push(returnStudent);
        this.addStudentToEvent(returnStudent);

    }


    function _commentClose(returnmessages) {


        if (returnmessages) {
            this.statusDetails[this.selectedStudent] = "";

        }

        for (var i = 0; i < returnmessages.length; i++) {
            this.statusDetails[this.selectedStudent] += returnmessages[i] + "\n";
        }

    }



    function _hide(event) {
        if ($(event.target).is('.event-background')) {
            this.selectedStudent = null;
            this.event = null;

        }
    }




    function _transferLesson() {

        // $ctrl.SelectedinstructordTime == 0 || !$ctrl.SelectedinstructordId

        var startHour = ((this.SelectedinstructordTime - 1) * 15 + 480) / 60;
        var endHour = ((this.SelectedinstructordTime - 1) * 15 + 510) / 60;

        var startMinute = (startHour % 1) * 60; //((this.SelectedinstructordTime - 1) * 15 + 480) / 60;
        var endMinute = (endHour % 1) * 60//((this.SelectedinstructordTime - 1) * 15 + 510) / 60;

        this.tranferDate.setHours(startHour, startMinute, 0);
        this.event.start = moment(this.tranferDate.toString()).format("YYYY-MM-DD HH:mm");
        this.tranferDate.setHours(endHour, endMinute, 0);
        this.event.end = moment(this.tranferDate.toString()).format("YYYY-MM-DD HH:mm");
        //
        //this.event.end =
        this.event.resourceId = this.SelectedinstructordId;
        this.event.isFromChangePhone = true;
        this.close();



        //  var dddd = this.event;

        // alert(this.SelectedinstructordTime);


    }

    function _puplateInstructor() {


        this.usersService.getTransferData(0, moment(this.tranferDate).day(), moment(this.tranferDate).format('YYYYMMDD')).then(function (res) {

            this.instructorsWorks = res;

            this.puplateTimesInstructor();

        }.bind(this));
    }

    function _puplateTimesInstructor() {
        this.SelectedinstructordTime = "0";

        if (this.SelectedinstructordId) {

            this.usersService.getTransferData(this.SelectedinstructordId, moment(this.tranferDate).day(), moment(this.tranferDate).format('YYYYMMDD')).then(function (res) {
                this.instructorsWorksTimes = res;

            }.bind(this));
        } else {
            this.instructorsWorksTimes = [];

        }
    }

    function _getStatusofStudent(StudentId) {
        var role = localStorage.getItem('currentRole');


        if (role == "sysAdmin" || role == "farmAdmin") {

            for (var i in this.sharedValues.lessonStatuses) {
                this.sharedValues.lessonStatuses[i].hide = false;


                if (this.isComplete[StudentId] > 2 && i > 2)
                    this.sharedValues.lessonStatuses[i].hide = true;

            }
        }
        return this.sharedValues.lessonStatuses;

        //  alert(StudentId);

    }

    function _onShow(event, selectedLesson, studentTemplate) {
        // debugger
        this.isEventHaveChild = false;
        if (selectedLesson.students.length > 0) this.isEventHaveChild = true;


        this.tranferDate = moment(selectedLesson.start).toDate();
        this.puplateInstructor();
        this.SelectedinstructordId = selectedLesson.resourceId;
        this.SelectedinstructordTime = "0";
        this.instructorsWorksTimes = [];

        this.studentTemplate = studentTemplate;
        this.copyStatuses(false, selectedLesson.statuses);


        var role = localStorage.getItem('currentRole');
        var IsHiyuvInHashlama = localStorage.getItem('IsHiyuvInHashlama');

     
        //this.IsHiyuvInHashlama = this.farm.IsHiyuvInHashlama;
        ////אם לחייב אז תוריד את דרוש שיעור השלמה הרגיל
        if (IsHiyuvInHashlama == 1 && this.sharedValues.lessonStatuses.length>5) {

            this.sharedValues.lessonStatuses.splice(4, 1);

        } else if (this.sharedValues.lessonStatuses.length > 3) {

            this.sharedValues.lessonStatuses.splice(5, 1);
        }


     
        //if (role == "sysAdmin" || role == "farmAdmin") {

        //    for (var i in this.sharedValues.lessonStatuses) {


        //        this.sharedValues.lessonStatuses[i].hide = false;

        //        if (selectedLesson.students.length == 0)
        //            this.sharedValues.lessonStatuses[i].hide = false;

        //        else if (this.isComplete[selectedLesson.statuses[0].StudentId] > 2 && i > 1 && i != 2)
        //            this.sharedValues.lessonStatuses[i].hide = true;

        //    }

        //}



        var isPastEvent = moment(selectedLesson.start).isBefore(new Date());
        this.readOnly = isPastEvent;
        this.lessonsQty = 0;
        this.affectChildren = false;








        //alert(this.horses.length);
        //this.changeLessonsStudent = [];
        //for (var i in selectedLesson.statuses) {

        //    this.changeLessonsStudent.push({ StudentId: selectedLesson.statuses[i].StudentId, SourceStatus: selectedLesson.statuses[i].Status, ChangeStatus: selectedLesson.statuses[i].Status });

        //}
    }

    function _delete() {
        this.deleteCallback(this.event, this.affectChildren);
        this.event = null
    }

    function _copyStatuses(onExit, statuses) {


        if (onExit) {

            this.event.statuses = [];


            for (var i in this.statuses) {

                this.event.statuses.push({ StudentId: i, Status: this.statuses[i], OfficeDetails: this.statusOfficeDetails[i], Details: this.statusDetails[i], IsComplete: this.isComplete[i], HorseId: this.horsesarray[i] });
            }
        }
        else {
            this.statuses = [];
            this.statusDetails = [];
            this.statusOfficeDetails = [];
            this.isComplete = [];
            this.horsesarray = [];

            for (var i in statuses) {


                this.statuses[statuses[i].StudentId] = getRightStatus(statuses[i]);
                this.statusDetails[statuses[i].StudentId] = statuses[i].Details;
                this.statusOfficeDetails[statuses[i].StudentId] = statuses[i].OfficeDetails;
                this.isComplete[statuses[i].StudentId] = statuses[i].IsComplete;
                this.horsesarray[statuses[i].StudentId] = statuses[i].HorseId;

            }
        }
    }

    function getRightStatus(statuses) {

        var res = statuses.Status;

        if (statuses.IsComplete == 4) {

            //   if (res == "attended")
            res = "attended";
            //else
            //    res = "notAttendedCharge";
        }
        if (statuses.IsComplete == 6) {

            //   if (res == "attended")
            res = "notAttendedCharge";
            //else
            //    res = "notAttendedCharge";
        }


        if (statuses.IsComplete == 3)
            res = "notAttended";
        if (statuses.IsComplete == 5)
            res = "";

        return res;
    }

    function filterDeletedStudents(students) {
        var results = [];
        for (var i in students) {
            if (!students[i].Deleted) {
                results.push(students[i]);
            }
        }
        return results;
    }

    function filterStudents(students, filterText) {
        if (!filterText) { return null };
        var results = [];
        for (var i in students) {
            if (!students[i].Deleted && matchAny(students[i].FirstName + ' ' + students[i].LastName, filterText.split(' '))) {
                results.push(students[i]);
            }
        }
        return results;
    }

    function matchAny(text, keywords) {
        var matches = 0;
        for (var i in keywords) {
            if (text.indexOf(keywords[i]) != -1) {
                matches++;
            }
        }
        return matches > 0;
    }

    function _close() {
        // alert(this.event.statuses[0].Status + "  ------ " + this.event.statuses[0].IsComplete);

        // כל זה בשביל לעדכן את הסטטוס בעת שינוי של הגעה
        //for (var i in this.changeLessonsStudent) {

        //    var currentUserId = this.changeLessonsStudent[i].StudentId;
        //    var ChangeStatus = this.changeLessonsStudent[i].ChangeStatus;
        //    var SourceStatus = this.changeLessonsStudent[i].SourceStatus;
        //    if (SourceStatus != ChangeStatus) {
        //        this.usersService.getUser(currentUserId).then(function (user) {
        //            this.user = user;

        //            //רק אם מדובר בשיעור
        //            if (this.user.Meta.PayType == 'lessonCost') {
        //                if ((SourceStatus == null || SourceStatus == "notAttended") && ChangeStatus == "attended") {
        //                    this.user.AccountStatus -= user.Meta.Cost;
        //                }

        //                if (SourceStatus == "attended") {
        //                    this.user.AccountStatus += user.Meta.Cost;
        //                }
        //            }

        //            this.usersService.updateUser(this.user).then(function (user) {


        //                this.copyStatuses(true);
        //                this.closeCallback(this.event, this.lessonsQty > 0 ? this.lessonsQty - 1 : 0);
        //                this.event = null;



        //            }.bind(this));


        //        }.bind(this));


        //    }
        //    else
        //    {
        //        this.copyStatuses(true);
        //        this.closeCallback(this.event, this.lessonsQty > 0 ? this.lessonsQty - 1 : 0);
        //        this.event = null;


        //    }



        //}

        //if (this.changeLessonsStudent.length == 0) {
        //    this.copyStatuses(true);
        //    this.closeCallback(this.event, this.lessonsQty > 0 ? this.lessonsQty - 1 : 0);
        //    this.event = null;
        //}



        this.copyStatuses(true);
        this.closeCallback(this.event, this.lessonsQty > 0 ? this.lessonsQty - 1 : 0);
        this.event = null;



    }

    function _addStudentToEvent(student) {


        var studentId = student.Id;
        this.studentFilter = null;
        if (!angular.isArray(this.event.students)) {
            this.event.students = [];
        }
        for (var i in this.event.students) {
            if (this.event.students[i] == studentId) {
                return;
            }
        }




        if (this.isEventHaveChild) {

            $('#myModalLabel').text(' כיצד תרצי להוסיף את התלמיד? ');
            $('#dvAppendHad').text(' הוסף תלמיד באופן חד פעמי ');
            $('#dvAppendTz').text(' הוסף תלמיד לצמיתות ');
            $('#modalAppend').modal('show');
            //if (confirm(')) {
            //    this.event.onlyMultiple = 1;
            //}
        }

        this.event.students.push(studentId);

        //if (this.isEventHaveChild)
        //    this.isEventChange = true;



        //for (var i in selectedLesson.statuses) {

        //  this.changeLessonsStudent.push({ StudentId: studentId, SourceStatus: null, ChangeStatus: null});

        //}

    }

    function _modalAppendClick(onlyMultiple) {

        if (onlyMultiple) this.event.onlyMultiple = 1;
    }



    function _studentDataById(studentId) {
        for (var i in this.students) {
            if (this.students[i].Id == studentId) {
                return this.students[i];
            }
        }
    }

    function _removeStudentFromEvent(studentId) {
        if (!confirm('האם אתה בטוח?')) { return false; }





        for (var i in this.event.students) {
            if (this.event.students[i] == studentId) {
                this.event.students.splice(i, 1);
            }
        }


        if (this.event.students.length > 0) {

            $('#myModalLabel').text(' כיצד תרצי להסיר את התלמיד? ');
            $('#dvAppendHad').text(' הסרת התלמיד באופן חד פעמי ');
            $('#dvAppendTz').text(' הסרת התלמיד לצמיתות ');



            $('#modalAppend').modal('show');

            //if (confirm('לחץ אישור אם ברצונך להסיר תלמיד זה באופן חד פעמי מהקבוצה , ביטול יסיר אותו מהקבוצה לצמיתות')) {
            //    this.event.onlyMultiple = 1;
            //}
        }



    }

    function _openComments(studentId) {

        this.selectedStudent = studentId;

        //  this.scope.$broadcast('comments.show', this.selectedStudent);
        //   alert(studentId);
    }

    function _openMatrotal(studentId,mode) {

        var user = this.studentDataById(studentId);
        


        this.selectedStudentmatrot = studentId;
        this.mode = mode;

        
        this.scope.$broadcast('matrolal.show', studentId, this.mode, user, this.event.id);
        

    }



    function _createNewStudent(isCreate) {

        this.createStudent = isCreate;
        this.scope.$broadcast('newstudent.show', this.studentTemplate);
    }



    app.filter('filterDeletedStudents', function () {
        return function (students) {
            return filterDeletedStudents(students);
        }
    });

    app.filter('filterStudents', function () {
        return function (students, filterText) {
            return filterStudents(students, filterText);
        };
    });

})();