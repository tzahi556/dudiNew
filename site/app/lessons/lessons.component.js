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
        this.customFont = _customFont.bind(this);

        this.initResources = _initResources.bind(this);
        this.filterLessonsBySelectedInstructors = _filterLessonsBySelectedInstructors.bind(this);
        this.createNotifications = _createNotifications.bind(this);
        this.modalClick = _modalClick.bind(this);
        this.NewLesIds = 0;
        this.getCounter = _getCounter.bind(this);
        this.modalAppendClick2 = _modalAppendClick2.bind(this);

        this.getLessonByStartAndResource = _getLessonByStartAndResource.bind(this);
        this.getLessonsByInstructorAndTime = _getLessonsByInstructorAndTime.bind(this);

        

        this.printLessons = _printLessons.bind(this);
        this.searchDate = new Date();
        this.lessToDrop = "";

        this.role = localStorage.getItem('currentRole');
        this.subrole = localStorage.getItem('currentSubRole');
        //   this.FarmInstractorPolicy = localStorage.getItem('FarmInstractorPolicy');
        this.activeStudent = 0;
        this.notActiveStudent = 0;
        this.pensionStudent = 0;

        this.getCounter();


        this.IsInstructorBlock = $rootScope.IsInstructorBlock;
        // this.resourcesIds = "0";
        // set all instructors checkboxes checked

        //var visibleInstructors = sessionStorage.getItem('visibleInstructors') ? angular.fromJson(sessionStorage.getItem('visibleInstructors')) : {};

        this.viewCalenderType = "agendaDay";
        this.setExex = _setExex.bind(this);

        // this.reloadCalendarData();
      

        function _printLessons() {






            var prevInstructorId = "";
            var HeaderTemplate = "<table width='100%' border='1' dir='rtl' style='border-collapse:collapse; table-layout:fixed;' ><tr><th style='width:5%'>שעה</th>";
            var BodyTemplate = "";


            var InstructArray = [];

            for (var i in this.instructors) {

                if (prevInstructorId != this.instructors[i].Id) {

                    if (this.instructors[i].Show) {

                      
                        HeaderTemplate += "<th style=''>" + this.instructors[i].FirstName + " " + this.instructors[i].LastName + "</th>";
                        InstructArray.push(this.instructors[i].Id);


                    }

                    prevInstructorId = this.instructors[i].Id;

                  //  BodyTemplate += "<tr><td>9:00</td><td>אלון שוסטר </br> </td></tr>";

                }


                
               // this.getLessonsByInstructorAndTime(prevInstructorId, "7:15")
              




            }


            var quarterHours = ["00", "15", "30", "45"];
            var times = [];
            for (var i = 7; i < 24; i++) {
                for (var j = 0; j < 4; j++) {
                    var hour = i.toString();
                    if (i < 10)
                        hour = "0" + hour;

                    var CurrentTime = hour + ":" + quarterHours[j];

                    BodyTemplate += "<tr><td>" + CurrentTime + "</td>";


                    for (var m in InstructArray) {

                        var CurrentLessons = this.lessons.filter(x => moment(x.start).format("HH:mm") == CurrentTime && x.resourceId == InstructArray[m]);


                       
                        //    , range = moment().range(startDate, endDate);

                        //range.contains(date); 



                        if (CurrentLessons.length != 0) {
                          
                            var startDate = moment(CurrentLessons[0].start)
                                , endDate = moment(CurrentLessons[0].end)

                           
                            var diffMiniuts = (endDate.startOf('minute')).diff(startDate.startOf('minute'), 'minutes', true);
                            
                            var lessonTime = diffMiniuts / 15;


                            var currentInstructor = this.instructors.filter(n => n.Id == InstructArray[m]);


                            BodyTemplate += "<td valign='top' class='dvLesson'  rowspan='" + lessonTime + "' style='text-align:right;background:" + currentInstructor[0].EventsColor +"'>" + this.getLessonsByInstructorAndTime(CurrentLessons[0]) + "</td>";
                        } else {


                            var time = moment(this.searchDate).toDate();  // This will return a copy of the Date that the moment uses

                            time.setHours(i);
                            time.setMinutes(quarterHours[j]);
                          
                            
                            var Tafus = this.lessons.filter(x => moment(x.start) < time && moment(x.end) > time && x.resourceId == InstructArray[m]);
                            if(Tafus.length==0)
                            BodyTemplate += "<td></td>";

                        }
                        
                    }


                    BodyTemplate += "</tr>";

                    
                }
            }


            var self = this;
            $.get('app/lessons/Report.html?sssd=' + new Date(), function (text) {
                text = text.replace("@FromDate", moment(self.searchDate).format('DD/MM/YYYY'));
                text = text.replace("@TableLessons", HeaderTemplate + BodyTemplate + "</table>");
               // text = text.replace("@TableLessons", CurrentHtml);
                var blob = new Blob([text], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                });


                saveAs(blob, " לוח שיעורים " + new Date() + ".html");

            });

        }


        function _getLessonsByInstructorAndTime(less) {



           var starttime = moment(less.start).format("HH:mm");
           var endtime = moment(less.end).format("HH:mm");
           var res = "<div>";

            res += "<div class='dvTime'>" + starttime + "-" + endtime +"</div>";

            for (var i in less.students) {

                for (var x in this.students) {

                    if (less.students[i] == this.students[x].Id) {

                       
                        var status = less.statuses.filter(n => n.StudentId == this.students[x].Id);
                        var statusName = "";
                        if (status.length > 0) {
                           
                            switch (status[0].Status) {

                                case 'attended':
                                    statusName = 'הגיע'
                                    break;
                                case 'notAttended':
                                    statusName = 'לא הגיע'
                                    break;
                                case 'notAttendedCharge':
                                    statusName = 'לא הגיע לחייב'
                                    break;
                                case 'notAttendedDontCharge':
                                    statusName = 'לא הגיע לא לחייב'
                                    break;
                                case 'completionReq':
                                case 'completionReqCharge':
                                    statusName = 'השלמה'
                                    break;
                                default:
                                    statusName = '';
                                    break;

                              
                            }


                            if (status[0].Status == 'completion') {
                                if ((status.IsComplete == 4)) {
                                    statusName = 'הגיע';
                                }

                                if ((status.IsComplete == 6)) {
                                    statusName = 'לא הגיע לחייב'
                                }


                                if ((status.IsComplete == 3)) {
                                    statusName = 'לא הגיע'
                                }

                               

                            }

                          //  statusName =(status[0].Status);

                        }

                        res += this.students[x].FirstName + " " + this.students[x].LastName +"<div class='dvStatus'>" + statusName+"</div>" +  "</br>";
                    }
                }

            }

            return res + "</div>";

        }

        
        function _setExex() {
            alert();
        }


        function _customFont(size) {





            var ExistHeight = $('.fc-slats td').css("height").replace('px', '');

            var HeightRow = (Math.floor(eval(ExistHeight)) + size);


            $.cookie("HeightRow", HeightRow, { expires: 10000 });

            // $('.fc-slats td').css("height", eval(ExistHeight) + size + "px");

            $("<style type='text/css'> .fc-slats td{ height: " + HeightRow + "px !important;} </style>").appendTo("head");

            this.reloadCalendarData();
            //  this.scope.$broadcast('calendar.reloadEvents', this.filterLessonsBySelectedInstructors());
            //  this.scope.$broadcast('calendar.reloadBackgroundEvents', this.backgroundEvents);
            //  this.scope.$broadcast('calendar.reloadResources', this.resources);

        }



        function _customDate() {
            if (this.searchDate) {
                if (this.searchDate.getFullYear() > 2000)
                    $('.calendar').fullCalendar('gotoDate', this.searchDate);
            }

        }

        this.scope.$on('calendar.viewRender', function (event, params) {



            if ($.cookie("HeightRow")) {

                $("<style type='text/css'> .fc-slats td{ height: " + $.cookie("HeightRow") + "px !important;} </style>").appendTo("head");

            }





            var view = $('.calendar').fullCalendar('getView');
            this.viewCalenderType = view.type;

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
            this.reloadLessonsComplete();

        }.bind(this));

        $scope.makeDrop = function (newEvent, currentStudentId) {

            if (newEvent && newEvent.target.className.indexOf("fc-draggable dvDragElement") == -1) {


                $rootScope.statuses = [{ "StudentId": currentStudentId, "Status": "completion", "Details": "", "IsComplete": 2 }];
                $rootScope.students = [(currentStudentId)];

                $scope.$ctrl.lessToDrop = "";

                var $el = $(newEvent.target);


                var main_idelem = $($el).closest("a");
                var main_id = $(main_idelem).attr("main_id");
                if (main_id) {

                    $scope.$ctrl.lessToDrop = $scope.$ctrl.getLessonById(main_id);

                    $scope.$ctrl.lessToDrop.students.push(currentStudentId);
                    $scope.$ctrl.lessToDrop.statuses.push({ "StudentId": currentStudentId, "Status": "completion", "Details": "", "IsComplete": 2 });

                    $('#myModalLabel').text(' כיצד תרצי להוסיף את התלמיד? ');
                    $('#dvAppendHad').text(' הוסף תלמיד באופן חד פעמי ');
                    $('#dvAppendTz').text(' הוסף תלמיד לצמיתות ');
                    $('#modalAppend2').modal('show');
                    // alert($el[0].className);


                    return;
                }
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
        // פונקציה שמוסיפה תלמיד מגרירה של השלמה
        function _modalAppendClick2(onlyMultiple) {

            $rootScope.statuses = [];
            $rootScope.students = [];
            var lt = $scope.$ctrl.lessToDrop;
            if (onlyMultiple) $scope.$ctrl.lessToDrop.onlyMultiple = 1;
            $scope.$ctrl.updateLesson(lt);

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

            // במידה והשיעור שנוצר הוא 15 שעה להעביר לחצי שעה זה הדיפולט
            if (moment(end).diff(start, 'minutes', true) < 16) {
                end = moment(end).add('m', 15);
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



            this.createNotifications(event, 'create');

            this.updateLesson(event);
        }

        function _getCounter() {

            for (var i in this.students) {

                if (this.students[i].Deleted == 1) continue;

                if (this.students[i].Style == 'horseHolder') {
                    this.pensionStudent++;
                }
                else if (this.students[i].Active == 'active') {
                    this.activeStudent++;
                }
                else {

                    this.notActiveStudent++;
                }

            }



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
            // בדיקה אם אפשר להסתדר בלי זה
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




            var returnLessons = [];

            for (var i in this.lessons) {
                for (var x in this.resources) {
                    if (this.lessons[i].resourceId == this.resources[x].id) {

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


            if (this.role == "stableman" || this.role == "worker") {
              

                for (var i = this.instructors.length - 1; i >= 0; i--) {
                    if (this.instructors[i].IsMazkirut != 1) {
                        this.instructors.splice(i, 1);
                    }
                }

            }



            for (var i in this.instructors) {


               

                if (this.instructors[i].Show) {

                    

                    this.resources.push({
                        id: this.instructors[i].Id,
                        title: this.instructors[i].FirstName + ' ' + this.instructors[i].LastName,
                        eventColor: this.instructors[i].EventsColor,
                        eventTextColor: '#000',
                        IsMazkirut: this.instructors[i].IsMazkirut
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

            if (event && event.isFromChangePhone) {
                this.eventChange(event);

            }
            //
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



            var tempevent = this.getLessonByStartAndResource(moment(event.start).format('YYYY-MM-DDTHH:mm:ss'), moment(event.end).format('YYYY-MM-DDTHH:mm:ss'), event.resourceId);
            if (!tempevent) {
                this.eventToChange = event;
                $('#modal').modal('show');
            }
            else {


                for (var i in event.students) {
                    tempevent.students.push(event.students[i]);
                    tempevent.statuses.push(event.statuses[i]);
                }

                this.lessonsService.deleteLesson(event.id, false).then(function (res) {
                    this.reloadLessons();

                }.bind(this));


                this.eventToChange = tempevent;
                this.eventToChange.onlyMultiple = 0;
                this.modalClick(false);


            }
        }

        function _modalClick(changeChildren) {


            if (this.eventToChange) {

                if (this.eventToChange.IsMazkirut == "1" && changeChildren) {

                    alert("לא ניתן להזיז אירועים עתידיים של משימות חוזרות");
                    return;
                }

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


                this.selectedPayValue = $("#" + elemId).text();
                this.selectedStudent = elemId.replace("dvPaid_", "");//this.getLessonById(event.id);


                this.scope.$broadcast('pay.show', this.selectedStudent, this.selectedPayValue);
            }
            else {
                //for event
                if (event.IsMazkirut == "1") {

                    if (jsEvent.target.tagName == "INPUT") {
                        if (event.details.indexOf("@simbol") == "-1") {
                            event.details = event.details.replace("checked", "@simbol");
                        } else {
                            event.details = event.details.replace("@simbol", "checked");
                        }

                        this.updateLesson(event);

                    } else {
                        this.selectedStudentSchedular = event;
                        this.scope.$broadcast('schedular.show', this.selectedStudentSchedular, this.instructors[0]);
                    }

                }

                else {
                    this.selectedLesson = this.getLessonById(event.id);
                    this.scope.$broadcast('event.show', this.selectedLesson, this.instructors[0]);
                }
            }
        }

        function _updateLesson(event) {

            this.lessonsService.updateLesson(event).then(function (res) {

                this.reloadLessons();
                this.reloadLessonsComplete();
            }.bind(this));
        }

        function _reloadLessons() {



            //  צחי שינה הוריד עוד יום
            var fakendDate = moment(this.endDate).add(-1, 'days').format('YYYY-MM-DD');//moment(this.endDate).add(6, 'day').format('YYYY-MM-DD');

            this.lessonsService.getLessons(null, this.startDate, fakendDate, null).then(function (lessons) {

                this.lessons = lessons;

                // בדיקת היתכנות הורדה
                this.scope.$broadcast('calendar.reloadEvents', this.filterLessonsBySelectedInstructors());
                setupTooltip();


            }.bind(this));



        }

        function _reloadLessonsComplete() {




            var fakendDate = this.endDate;//moment(this.endDate).add(6, 'day').format('YYYY-MM-DD');


            // להביא את ההשלמות
            this.lessonsService.getLessons(null, this.startDate, fakendDate, true).then(function (lessons) {

                this.lessonsComplete = [];
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


        function _getLessonByStartAndResource(start, end, resourceId) {

            for (var i in this.lessons) {
                if (this.lessons[i].start == start && this.lessons[i].end == end && this.lessons[i].resourceId == resourceId) {
                    return this.lessons[i];
                }
            }

            return null;
        }
    }

})();