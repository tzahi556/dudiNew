(function () {

    var app = angular.module('app');

    app.component('event', {
        templateUrl: 'app/common/components/event/event.template.html',
        controller: EventController,
        bindings: {
            event: '=',
            students: '<',
            closeCallback: '<',
            deleteCallback: '<'
        }
    });

    function EventController($scope, lessonsService, sharedValues, usersService) {
        this.usersService = usersService;
        this.scope = $scope;
        this.lessonsService = lessonsService;
        this.sharedValues = sharedValues;
        this.affectChildren = false;

        this.addStudentToEvent = _addStudentToEvent.bind(this);
        this.removeStudentFromEvent = _removeStudentFromEvent.bind(this);
        this.openComments = _openComments.bind(this);

        this.createNewStudent = _createNewStudent.bind(this);
        this.studentDataById = _studentDataById.bind(this);
        this.copyStatuses = _copyStatuses.bind(this);
        this.onShow = _onShow.bind(this);
        this.close = _close.bind(this);
        this.delete = _delete.bind(this);
        this.hide = _hide.bind(this);
        this.commentClose = _commentClose.bind(this);
        this.createStudentClose = _createStudentClose.bind(this);
        
        this.changeStudentstatus = _changeStudentstatus.bind(this);

        this.scope.$on('event.show', this.onShow);
    }


    function _changeStudentstatus(studentId) {


        //for (var i in this.changeLessonsStudent) {

        //    if (this.changeLessonsStudent[i].StudentId == studentId) {

        //        this.changeLessonsStudent[i].ChangeStatus = this.statuses[studentId];
        //    }
        //}


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

    function _onShow(event, selectedLesson, studentTemplate) {

      
        this.studentTemplate = studentTemplate;
        this.copyStatuses(false, selectedLesson.statuses);

        var role = localStorage.getItem('currentRole');


        if (role == "sysAdmin" || role == "farmAdmin") {
          
            for (var i in this.sharedValues.lessonStatuses) {
             
                this.sharedValues.lessonStatuses[i].hide = false;

                if (selectedLesson.students.length==0)
                    this.sharedValues.lessonStatuses[i].hide = false;

                else if (this.isComplete[selectedLesson.statuses[0].StudentId] > 2 && i > 1)
                    this.sharedValues.lessonStatuses[i].hide = true;

            }

        }



        var isPastEvent = moment(selectedLesson.start).isBefore(new Date());
        this.readOnly = isPastEvent;
        this.lessonsQty = 0;
        this.affectChildren = false;

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
                this.event.statuses.push({ StudentId: i, Status: this.statuses[i], Details: this.statusDetails[i], IsComplete: this.isComplete[i] });
            }
        }
        else {
            this.statuses = [];
            this.statusDetails = [];
            this.isComplete = [];
            for (var i in statuses) {
               
             
                this.statuses[statuses[i].StudentId] = getRightStatus(statuses[i]);
                this.statusDetails[statuses[i].StudentId] = statuses[i].Details;
                this.isComplete[statuses[i].StudentId] = statuses[i].IsComplete;
            }
        }
    }

    function getRightStatus(statuses) {

        var res = statuses.Status;

        if (statuses.IsComplete == 4)
            res = "attended";

        if (statuses.IsComplete == 3)
            res = "notAttended";
        if(statuses.IsComplete == 5)
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
        this.event.students.push(studentId);
        //for (var i in selectedLesson.statuses) {

      //  this.changeLessonsStudent.push({ StudentId: studentId, SourceStatus: null, ChangeStatus: null});

        //}

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
    }

    function _openComments(studentId) {

        this.selectedStudent = studentId;

        //  this.scope.$broadcast('comments.show', this.selectedStudent);
        //   alert(studentId);
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