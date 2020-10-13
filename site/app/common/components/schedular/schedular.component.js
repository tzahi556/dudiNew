(function () {

    var app = angular.module('app');

    app.component('schedular', {
        templateUrl: 'app/common/components/schedular/schedular.template.html',
        controller: SchedularController,
        bindings: {
            studentidmatrot: '=',
            selectedpayvalue: "=",
            students: '<',
            closeCallback: '<',
            deleteCallback: '<',
            //horses: '<',
            groups: '<',
        }
    });

    function SchedularController($scope, usersService, horsesService, lessonsService, farmsService, sharedValues, $http, notificationsService) {

        this.lessonsService = lessonsService;
        this.usersService = usersService;
        this.horsesService = horsesService;
        var self = this;
        this.scope = $scope;
        this.notificationsService = notificationsService;
        this.hide = _hide.bind(this);
        this.close = _close.bind(this);

        this.onShow = _onShow.bind(this);
        this.mode = 1;

        this.lessonId = 0;
        this.resourceId = 0;

        this.isDateMoreToday = _isDateMoreToday.bind(this);
        this.role = localStorage.getItem('currentRole');
        //notificationsService.getMessagesList().then(function (res) {
        //    this.scope.messages = res;

        this.getInstructorName = _getInstructorName.bind(this);
        this.getDayOfWeek = _getDayOfWeek.bind(this);
        //  this.prevLess = _prevLess.bind(this);
        this.openTask = _openTask.bind(this);
        this.isExec = _isExec.bind(this);

        this.addHorseToList = _addHorseToList.bind(this);
        this.removeHorse = _removeHorse.bind(this);
        this.savePirzul = _savePirzul.bind(this);


        this.scope.$on('schedular.show', this.onShow);

        function _isExec(schedular) {
            var obj = {
                Id: schedular.Id,
                IsExe: schedular.IsExe

            }






            this.lessonsService.getSetSchedularTask(this.lessonId, this.resourceId, obj, "4").then(function (res) {


                // this.schedulars = res;
                //this.closeCallback(null);
                //alert("המשימה נשמרה בהצלחה!");


            }.bind(this));

        }

        function _openTask(type) {
            if (type == 0) {
                this.newSchedular = [];
                this.newSchedular.Id = 0;
                this.newSchedular.Title = "";
                this.newSchedular.Desc = "";
                this.newSchedular.EveryDay = false;
                this.newSchedular.EveryWeek = false;
                this.newSchedular.EveryMonth = false;
                this.newSchedular.EndDate = "";
                this.affectChildren = false;

            } else {



                this.newSchedular = [];
                this.newSchedular.Id = type.Id;
                this.newSchedular.Title = type.Title;
                this.newSchedular.Desc = type.Desc;
                this.newSchedular.EveryDay = type.EveryDay;
                this.newSchedular.EveryWeek = type.EveryWeek;
                this.newSchedular.EveryMonth = type.EveryMonth;
                this.newSchedular.EndDate = moment(type.EndDate).startOf('day').toDate();
                this.affectChildren = false;

            }






            $('#modal').modal('show');

        }


        function _isDateMoreToday(date) {

            if (moment(date) > moment()) return true;

            return false;
        }




        function _onShow(event, lesson) {





            this.selectedStudentSchedular = lesson;

            this.lessonId = lesson.id;
            this.resourceId = lesson.resourceId;

            this.lessonsService.getSetSchedularTask(lesson.id, lesson.resourceId, null, 0).then(function (res) {

                if (res[0]) {
                    res = res[0];
                    this.newSchedular = [];
                    this.newSchedular.Id = res.Id;
                    this.newSchedular.Title = res.Title;
                    this.newSchedular.Desc = res.Desc;
                    this.newSchedular.EveryDay = res.EveryDay;
                    this.newSchedular.EveryWeek = res.EveryWeek;
                    this.newSchedular.EveryMonth = res.EveryMonth;

                    this.newSchedular.EndDate = moment(res.EndDate).startOf('day').toDate();
                    this.newSchedular.Days = res.Days;
                    this.affectChildren = false;
                } else {

                    this.newSchedular = [];
                    this.newSchedular.Id = 0;
                    this.newSchedular.Days = 0;

                    this.newSchedular.Title = "";
                    this.newSchedular.Desc = "";
                    this.newSchedular.EveryDay = false;
                    this.newSchedular.EveryWeek = false;
                    this.newSchedular.EveryMonth = false;
                    this.newSchedular.EndDate = "";
                    this.affectChildren = false;


                }
                // this.schedulars = res;


            }.bind(this));

          

            this.horsesService.getHorses().then(function (hss) {
                this.horses = hss;

                this.horsesService.getSetPirzulHorse(0, this.lessonId, null).then(function (res) {
                    this.horseslists = res;
                    for (var i in this.horseslists) {

                        this.horseslists[i].SusName = this.horses.filter(x => x.Id == this.horseslists[i].HorseId)[0].Name;
                        this.horseslists[i].PrevIsDo = this.horseslists[i].IsDo;

                    }


                }.bind(this));


            }.bind(this));



          


            this.horsesService.getSetHorseGroupsHorses(1).then(function (res) {

                this.horsegroupshorses = res;

            }.bind(this));


            //horsegroupshorses: function (horsesService) {
            //    return horsesService.getSetHorseGroupsHorses(1);
            //},



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

            this.closeCallback(null);
            // if ($(event.target).is('.event-background')) {
            this.selectedStudentSchedular = null;
            //}

            //if ($(event.target).is('.event-background') || $(event.target).is('.btnClose')) {
            //    this.studentid = null;
            //}
        }




        function _close(schedular, type) {


            if (this.newSchedular.EndDate) this.newSchedular.EndDate.setHours(this.newSchedular.EndDate.getHours() + 3);

            var obj = {
                Id: this.newSchedular.Id,
                Title: this.newSchedular.Title,
                Desc: this.newSchedular.Desc,
                EveryDay: this.newSchedular.EveryDay,
                EveryWeek: this.newSchedular.EveryWeek,
                EveryMonth: this.newSchedular.EveryMonth,
                EndDate: this.newSchedular.EndDate,



                Days: this.newSchedular.Days,
                AffectChildren: this.affectChildren
            }






            this.lessonsService.getSetSchedularTask(this.lessonId, this.resourceId, obj, type).then(function (res) {



                if (res[0] && res[0].Id == -1) {

                    var DateTafus = res[0].Title;//     moment().format('DD/MM/YYYY HH:mm');


                    //    alert("המערכת יצרה משימות עד לתאריך - " + DateTafus + ", מדריך תפוס בתאריך זה ");


                } else {
                    // this.schedulars = res;
                    //  alert("המשימה נשמרה בהצלחה!");
                }


                this.closeCallback(null);

                this.selectedStudentSchedular = null;

            }.bind(this));




            // 

        }

        //******************************************* פירזול ***************************

        function _addHorseToList(type) {
            //הוספת סוס
            if (type == 1) {

                this.horseslists.push({ SusName: this.newHorse.Name, Id: 0, Cost: this.newHorse.ShoeingCost, isDo: false, HorseId: this.newHorse.Id, LessonId: this.lessonId});
            }

            //הוספת קבוצה
            if (type == 2) {

               
                var horselist = this.horsegroupshorses.filter(x => x.HorseGroupsId == this.newGroup.Id);
                var groupName = this.groups.filter(x => x.Id == this.newGroup.Id)[0].Name;
                for (var i in horselist) {

                    var currentHorse = this.horses.filter(y => y.Id == horselist[i].HorseId);
                    if (currentHorse.length > 0) {

                        this.horseslists.push({ SusName: currentHorse[0].Name, Id: 0, Cost: currentHorse[0].ShoeingCost, isDo: false, HorseId: currentHorse[0].Id, LessonId: this.lessonId, GroupName: groupName});
                    }
                }

            }
        }

        function _removeHorse(horse) {
            //הוספת סוס
            for (var i in this.horseslists) {
                if (this.horseslists[i] == horse) {
                    this.horseslists.splice(i, 1);
                }
            }
        }

        function _savePirzul() {
            this.horsesService.getSetPirzulHorse(1, this.lessonId, this.horseslists).then(function (res) {

                this.closeCallback(null);
                this.selectedStudentSchedular = null;

            }.bind(this));


        }





    }


})();