(function () {

    var app = angular.module('app');

    app.component('lessons', {
        templateUrl: 'app/lessons/lessons.template.html',
        controller: LessonsController,
        bindings: {
            instructors: '<',
            students: '<',
            availablehours: '<',
            horses: '<'
        }
    });

    function LessonsController($scope, $rootScope, $q, lessonsService, notificationsService, $filter) {

        this.lessonsService = lessonsService;
        $rootScope.createNewfromdd = _eventCreate.bind(this);
        this.scope = $scope;

        this.isSysAdmin = localStorage.getItem("currentRole") == "sysAdmin";

        this.startDate = this.startDate || moment().format('YYYY-MM-DD');
        this.endDate = this.endDate || moment().add(1, 'day').format('YYYY-MM-DD');

        this.lessons = this.lessons || [];
        this.selectedLesson = null;
        this.resources = [];
        this.backgroundEvents = [];
        this.eventClick = _eventClick.bind(this);
        this.eventChange = _eventChange.bind(this);
        this.eventCreate = _eventCreate.bind(this);
        this.eventClose = _eventClose.bind(this);
        this.eventDelete = _eventDelete.bind(this);
        this.updateLesson = _updateLesson.bind(this);
        this.getLessonById = _getLessonById.bind(this);
        this.reloadLessons = _reloadLessons.bind(this);
        this.reloadLessonsComplete = _reloadLessonsComplete.bind(this);

        this.createChildEvent = _createChildEvent.bind(this);
        this.changeChildEvent = _changeChildEvent.bind(this);
        this.reloadCalendarData = _reloadCalendarData.bind(this);
        this.reloadCheckUnCheck = _reloadCheckUnCheck.bind(this);

        this.getIfLessonPrevExist = _getIfLessonPrevExist.bind(this);

        this.customDate = _customDate.bind(this);

        this.initResources = _initResources.bind(this);
        this.filterLessonsBySelectedInstructors = _filterLessonsBySelectedInstructors.bind(this);
        this.createNotifications = _createNotifications.bind(this);
        this.modalClick = _modalClick.bind(this);
        this.NewLesIds = 0;
        this.getCounter = _getCounter.bind(this);

        this.searchDate = new Date();

        this.role = localStorage.getItem('currentRole');
        //   this.FarmInstractorPolicy = localStorage.getItem('FarmInstractorPolicy');




        //alert(this.students.length);
        // this.resourcesIds = "0";
        // set all instructors checkboxes checked

        //var visibleInstructors = sessionStorage.getItem('visibleInstructors') ? angular.fromJson(sessionStorage.getItem('visibleInstructors')) : {};




        // this.reloadCalendarData();

        //  this.filteredLessons = this.filterLessonsBySelectedInstructors();

        this.reloadLessonsComplete();

        function _customDate() {

            $('.calendar').fullCalendar('gotoDate', this.searchDate);

        }

        this.scope.$on('calendar.viewRender', function (event, params) {

            var view = $('.calendar').fullCalendar('getView');
            // debugger
            //  alert("The view's title is " + view.title);

          //  alert();

            this.startDate = moment(params.startDate).format('YYYY-MM-DD');

            this.endDate = moment(params.endDate).format('YYYY-MM-DD');

            this.searchDate = new Date(params.startDate);


            if (!this.isSysAdmin) {


                for (var i in this.instructors) {

                    if (view.type != "agendaDay") {
                        this.instructors[i].Show = this.instructors[i].Shvoi;
                    } else {

                        var CurrentDayInWeek = this.searchDate.getDay();
                        for (var j in this.availablehours) {
                            if (this.availablehours[j].resourceId == this.availablehours[j].UserId && this.availablehours[j].UserId == this.instructors[i].Id && CurrentDayInWeek == this.availablehours[j].dow) {

                                this.instructors[i].Show = true;
                                break;
                            } else {

                                this.instructors[i].Show = false;
                            }

                        }
                    }
                    if (this.instructors.length == 1)
                        this.instructors[i].Show = true;

                }

            }

            this.reloadLessons();
            this.reloadCalendarData();

        }.bind(this));


        $scope.makeDrop = function (newEvent, currentStudentId) {

            if (newEvent && newEvent.target.className.indexOf("fc-draggable dvDragElement") == -1) {


                $rootScope.statuses = [{ "StudentId": currentStudentId, "Status": "completion", "Details": "", "IsComplete": 2 }];
                $rootScope.students = [(currentStudentId)];



                var $el = $(newEvent.target);

                var event = jQuery.Event('mousedown', {
                    which: 1,
                    pageX: newEvent.pageX,
                    pageY: newEvent.pageY,
                })

                $el.trigger(event);

                event = jQuery.Event('mouseup', {
                    which: 1,
                    pageX: newEvent.pageX,
                    pageY: newEvent.pageY,
                })
                $el.trigger(event);


                $scope.$ctrl.reloadLessonsComplete();


            }
        }

        //$rootScope.$watch('noNetwork', function (newValue) {


        //    $(".hadPeami").hide();
        //    if (newValue && newValue.target.className.indexOf("fc-draggable dvDragElement") == -1) {
        //        alert();


        //        var Dragid = $rootScope.studentIdDrag;
        //        $rootScope.statuses = [{ "StudentId": Dragid, "Status": "completion", "Details": "", "IsComplete": 2 }];
        //        $rootScope.students = [(Dragid)];

        //        var $el = $(newValue.target);

        //        var event = jQuery.Event('mousedown', {
        //            which: 1,
        //            pageX: newValue.pageX,
        //            pageY: newValue.pageY,
        //        })

        //        $el.trigger(event);

        //        event = jQuery.Event('mouseup', {
        //            which: 1,
        //            pageX: newValue.pageX,
        //            pageY: newValue.pageY,
        //        })
        //        $el.trigger(event);

        //    }

        //});

        function _getCounter(type) {
            var Count = 0;

            for (var i in this.students) {

                if (!this.students[i].Deleted && this.students[i].Active == type) {
                    Count++;
                }
            }

            return Count;

        }

        function _createNotifications(event, action) {
            var FarmId = null;
            for (var i in this.instructors) {
                if (this.instructors[i].Id == event.resourceId) {
                    FarmId = this.instructors[i].Farm_Id;
                }
            }
            notificationsService.createNotification({
                entityType: 'lessons', entityId: event.resourceId, group: 'change', farmId: FarmId,
                text: 'שיעור בתאריך: ' + moment(event.start).format('DD/MM/YYYY HH:mm') + ' ' + (action == 'create' ? 'נוצר' : (action == 'delete') ? 'נמחק' : 'עודכן'),
                date: moment().format('YYYY-MM-DD'),
                deletable: true
            }).then(function () {
                notificationsService.getNotifications().then(function (data) {
                    $rootScope.$broadcast('notificationsNav.refresh', data.length)
                });
            });
        }

        function _reloadCalendarData() {
          
            var view = $('.calendar').fullCalendar('getView');
            if (view.type != "agendaDay") {

                for (var i in this.instructors) {

                   

                    this.instructors[i].Shvoi = this.instructors[i].Show;
                }

            }
          
            //for (var i in this.instructors) {

            //    visibleInstructors[this.instructors[i].Id] = this.instructors[i].Show;
            //}
            //sessionStorage.setItem('visibleInstructors', angular.toJson(visibleInstructors));

            this.initResources();
            this.scope.$broadcast('calendar.reloadEvents', this.filterLessonsBySelectedInstructors());
            this.scope.$broadcast('calendar.reloadBackgroundEvents', this.backgroundEvents);
            this.scope.$broadcast('calendar.reloadResources', this.resources);
        }

        function _reloadCheckUnCheck() {

            for (var i in this.instructors) {


                this.instructors[i].Show = $scope.selectAll;
                // visibleInstructors[this.instructors[i].Id] = this.instructors[i].Show;

            }


            //sessionStorage.setItem('visibleInstructors', angular.toJson(visibleInstructors));
            this.initResources();
            this.scope.$broadcast('calendar.reloadEvents', this.filterLessonsBySelectedInstructors());
            this.scope.$broadcast('calendar.reloadBackgroundEvents', this.backgroundEvents);
            this.scope.$broadcast('calendar.reloadResources', this.resources);
        }

        function _filterLessonsBySelectedInstructors() {
            //alert(this.resourcesIds);
            //alert(this.lessons.length);
            ////031668957
            //var diffMonth = (moment(this.endDate)).diff(moment(this.startDate), 'months', true);
            //   if (this.resources.length == 0) return [];

            var returnLessons = [];

            for (var i in this.lessons) {
                for (var x in this.resources) {
                    if (this.lessons[i].resourceId == this.resources[x].id) {

                        if (this.lessons[i].start > this.endDate) {


                            this.lessons[i] = this.getIfLessonPrevExist(this.lessons[i], returnLessons);// moment(this.lessons[i].start).add(-7, 'day');
                            if (!this.lessons[i]) continue;
                        }

                        returnLessons.push(this.lessons[i]);
                        break;
                    }
                }
            }


            return returnLessons;
        }

        function _getIfLessonPrevExist(lesson, returnLessons) {

            var prevStartDate = moment(lesson.start).add(-7, 'day').format('YYYY-MM-DDTHH:mm:ss');
            var prevEndDate = moment(lesson.end).add(-7, 'day').format('YYYY-MM-DDTHH:mm:ss');
            var resourceId = lesson.resourceId;

            for (var i in returnLessons) {
                var startLesDate = moment(returnLessons[i].start).format('YYYY-MM-DDTHH:mm:ss');
                var endLesDate = moment(returnLessons[i].end).format('YYYY-MM-DDTHH:mm:ss');

                if (resourceId != returnLessons[i].resourceId) continue;

                if (



                    (
                     (prevStartDate >= startLesDate
                     &&
                     prevStartDate < endLesDate)
                     ||
                     (prevEndDate > startLesDate
                     &&
                     prevEndDate <= endLesDate)
                     ||
                      (prevStartDate < startLesDate
                     &&
                     prevEndDate > endLesDate)

                    )

                    ) {

                    return "";
                }
            }

            lesson.start = moment(lesson.start).add(-7, 'day').format('YYYY-MM-DDTHH:mm:ss');
            lesson.end = moment(lesson.end).add(-7, 'day').format('YYYY-MM-DDTHH:mm:ss');

            lesson.title = "ניתן להכניס חד פעמי";
            lesson.students = [];
            lesson.statuses = [];
            this.NewLesIds--;
            lesson.id = this.NewLesIds;
            lesson.prevId = -1;
            return lesson;

        }

        function _initResources() {
            this.backgroundEvents = [];
            this.resources = [];
            //   this.resourcesIds = "0";

            for (var i in this.instructors) {


                if (this.instructors[i].Show) {

                    //  this.resourcesIds += "," + this.instructors[i].Id;

                    this.resources.push({
                        id: this.instructors[i].Id,
                        title: this.instructors[i].FirstName + ' ' + this.instructors[i].LastName,
                        eventColor: this.instructors[i].EventsColor,
                        eventTextColor: '#000'
                    });


                    var avArray = [];

                    for (var j in this.availablehours) {
                        if (this.availablehours[j].UserId == this.instructors[i].Id) {
                            avArray.push(this.availablehours[j]);


                        }
                    }


                    this.backgroundEvents = this.backgroundEvents.concat(avArray);

                    for (var e in this.backgroundEvents) {
                        if (!this.backgroundEvents[e]) {
                            this.backgroundEvents.splice(e, 1);
                            break;
                        }
                        this.backgroundEvents[e].rendering = 'background';
                    }
                }
            }
        }

        function _eventClose(event, lessonsQty) {

            if (event.isFromChangePhone) {
                this.eventChange(event);

            }
                //debugger
            else if (event) {

                this.updateLesson(event);
                this.createChildEvent(event, lessonsQty);
            }
            else {
                this.reloadLessons();

            }
        }

        function _eventDelete(event, deleteChildren) {

            this.createNotifications(event, 'delete');

            if (confirm('האם למחוק את האירוע?')) {
                var deleteChildren = deleteChildren || false;
                this.lessonsService.deleteLesson(event.id, deleteChildren).then(function (res) {
                    this.reloadLessons();
                    $scope.$ctrl.reloadLessonsComplete();
                }.bind(this));
            }
        }

        function _createChildEvent(parentEvent, lessonsQty) {

            if (lessonsQty > 0) {
                var newEvent = {
                    id: 0,
                    prevId: parentEvent.id,
                    start: moment(parentEvent.start).add(7, 'days').format('YYYY-MM-DDTHH:mm:ss'),
                    end: moment(parentEvent.end).add(7, 'days').format('YYYY-MM-DDTHH:mm:ss'),
                    resourceId: parentEvent.resourceId,
                    students: parentEvent.students,
                };


                this.lessonsService.updateLesson(newEvent, false, lessonsQty).then(function (res) {

                    if (res.Error) {

                        var DateTafus = moment(res.Error).format('DD/MM/YYYY HH:mm');
                        alert("המערכת יצרה שיעורים עד לתאריך - " + DateTafus + ", מדריך תפוס בתאריך זה ");
                        return;
                    }
                    this.createChildEvent(res, --lessonsQty);
                }.bind(this));
            }
            else {
                this.reloadLessons();
            }
        }

        function _eventChange(event) {

            $('#modal').modal('show');
            this.eventToChange = event;
        }

        function _modalClick(changeChildren) {

            if (this.eventToChange) {


                var event = this.eventToChange;
                this.eventToChange = null;


                this.lessonsService.updateLesson(event, changeChildren).then(function () {
                    this.createNotifications(event, 'update');
                    this.reloadLessons();
                }.bind(this));
            }
        }

        function _changeChildEvent(parentEvent) {
            var nextPrevId = parentEvent.id;
            var promises = [];
            for (var i in this.lessons) {
                if (this.lessons[i].prevId == nextPrevId) {
                    this.lessons[i].start = moment(parentEvent.start).add(7, 'days').format('YYYY-MM-DDTHH:mm:ss');
                    this.lessons[i].end = moment(parentEvent.end).add(7, 'days').format('YYYY-MM-DDTHH:mm:ss');
                    this.lessons[i].resourceId = parentEvent.resourceId;
                    this.lessons[i].students = parentEvent.students;
                    nextPrevId = this.lessons[i].id;
                    var parentEvent = this.getLessonById(nextPrevId);
                    promises.push(this.lessonsService.updateLesson(this.lessons[i]));
                }
            }
            return $q.all(promises);
        }

        function _eventClick(event, jsEvent) {

            var elemId = jsEvent.target.id;
            if (elemId) {

                //debugger
                //var payValue = $("#" + elemId).html().replace(")", "").replace("(", "").replace("&#x200E;", "");
                // //var t = $.trim($("#" + elemId).html().replace("(", '').replace(")", ''));
                //alert(eval(payValue));
                this.selectedPayValue = $("#" + elemId).text();
                this.selectedStudent = elemId.replace("dvPaid_", "");//this.getLessonById(event.id);


                this.scope.$broadcast('pay.show', this.selectedStudent, this.selectedPayValue);
            }
            else {
                //for event
                this.selectedLesson = this.getLessonById(event.id);
                // debugger
                //alert(this.resources[0].Farm_Id);
                this.scope.$broadcast('event.show', this.selectedLesson, this.instructors[0]);
            }
        }

        function _eventCreate(start, end, jsEvent, view, resource) {

            if ($rootScope.students && $rootScope.students.length > 0) {

                for (var i in this.lessons) {

                    if (resource.id == this.lessons[i].resourceId &&
                        (
                         this.lessons[i].start == start.toISOString() ||
                         this.lessons[i].end == end.toISOString() ||
                         (moment(start.toISOString()) < moment(this.lessons[i].end) && moment(start.toISOString()) > moment(this.lessons[i].start))
                        )

                        ) {
                        //alert(1);
                        start = this.lessons[i].start;
                        end = this.lessons[i].end;
                        break;
                        // return this.lessons[i];
                    }

                }

            }



            var event = {
                id: 0,
                start: start,
                end: end,
                resourceId: resource.id,
                statuses: $rootScope.statuses,
                students: $rootScope.students
            };

            $rootScope.statuses = [];
            $rootScope.students = [];
            //if ($rootScope.statuses) {

            //    event = {
            //        id: 0,
            //        start: start.toISOString(),
            //        end: end.toISOString(),
            //        resourceId: resource.id,
            //      //  statuses: $rootScope.statuses,
            //        students: $rootScope.students
            //    };

            //    $rootScope.statuses = null;

            //}


            this.createNotifications(event, 'create');

            this.updateLesson(event);
        }

        function _updateLesson(event) {

            this.lessonsService.updateLesson(event).then(function (res) {

                this.reloadLessons();
            }.bind(this));
        }

        function _reloadLessons() {



            //  

            var fakendDate = moment(this.endDate).add(6, 'day').format('YYYY-MM-DD');
            this.lessonsService.getLessons(null, this.startDate, fakendDate, null).then(function (lessons) {

                this.lessons = lessons;
                // בדיקת היתכנות הורדה
                this.scope.$broadcast('calendar.reloadEvents', this.filterLessonsBySelectedInstructors());
                setupTooltip();


            }.bind(this));



        }

        function _reloadLessonsComplete() {




            var fakendDate = moment(this.endDate).add(6, 'day').format('YYYY-MM-DD');


            // להביא את ההשלמות
            this.lessonsService.getLessons(null, this.startDate, fakendDate, true).then(function (lessons) {

                this.lessonsCompletelength = lessons.length;

                lessons = $filter('orderBy')(lessons, 'InstructorName');
                var lessonsGroupBy = [];
                var prevInstructor = "";
                for (var i in lessons) {

                    if (lessons[i].InstructorName != prevInstructor) {

                        var newData = angular.copy(lessons[i]);
                        newData.isInstructor = 1;
                        lessonsGroupBy.push(newData);

                        lessons[i].isInstructor = 0;
                        lessonsGroupBy.push(lessons[i]);
                        prevInstructor = lessons[i].InstructorName;
                    }
                    else {
                        lessons[i].isInstructor = 0;
                        lessonsGroupBy.push(lessons[i]);


                    }

                }


                this.lessonsComplete = lessonsGroupBy;
                // this.scope.$broadcast('calendar.reloadEvents', this.filterLessonsBySelectedInstructors());
                //  setupTooltip();
            }.bind(this));
        }

        function setupTooltip() {
            $(document).ready(function () {
                $('.fc-event').each(function () {

                    var title = $(this).find('.fc-title').text();
                    $(this).attr('title', title);
                });
            });
        }

        function _getLessonById(id) {
            for (var i in this.lessons) {
                if (this.lessons[i].id == id) {
                    return this.lessons[i];
                }
            }
        }
    }

})();