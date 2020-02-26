(function ($) {

    var app = angular.module('app');

    app.component('calendar', {
        template: '<div class="calendar"></div>',
        controller: CalendarController,
        bindings: {
            events: '<',
            backgroundEvents: '<',
            resources: '<',
            eventChangeCallback: '< eventChange',
            eventClickCallback: '< eventClick',
            eventCreateCallback: '< eventCreate',
            pastEditEnabled: '< pastEdit',
            view: '@'
        }
    });

    function CalendarController($element, $scope, $rootScope) {



        this.viewRender = _viewRender.bind(this);
        this.eventResize = _eventResize.bind(this);
        this.eventDrop = _eventDrop.bind(this);
        this.eventClick = _eventClick.bind(this);
        this.eventSelect = _eventSelect.bind(this);
        this.reloadEvents = _reloadEvents.bind(this);
        this.reloadResources = _reloadResources.bind(this);
        this.loadResources = _loadResources.bind(this);
        this.loadEvents = _loadEvents.bind(this);


        this.pastEditEnabled = this.pastEditEnabled || true;
        this.calendar = $($element).children('.calendar')[0];
        this.scope = $scope;
        this.currentView = "";


        //alert($rootScope.IsInstructorBlock);

        this.scope.$on('calendar.reloadEvents', function (event, events) {

            this.events = events;
            this.reloadEvents();





        }.bind(this));

        this.scope.$on('calendar.reloadBackgroundEvents', function (event, backgroundEvents) {

            this.backgroundEvents = backgroundEvents;
            this.reloadEvents();
            //  alert(12);
        }.bind(this));

        this.scope.$on('calendar.reloadResources', function (event, resources) {
            this.resources = resources;
            this.reloadResources();
        }.bind(this));

        $(window).scroll(function (e) {

            $(this).off("scroll");
            // event.stopPropagation();
            //   return false;
            //if ($(this).scrollTop() == 0) {
            //    alert();
            //}
        });

        $('.calendar').fullCalendar('destroy');
        $(this.calendar).fullCalendar({
            header: {
                right: 'today next,prev',
                center: 'title',
                left: 'month,agendaWeek,agendaDay'
            },
            buttonText: {
                month: 'חודש',
                agendaWeek: 'שבוע',
                agendaDay: 'יום'
            },

            titleFormat: 'DD/MM/YYYY ddd',
            weekends: true,
            hiddenDays: [7],
            schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
            groupByResource: false,
            groupByDateAndResource: true,

            lang: 'he',
            isRTL: true,

            defaultView: this.view || 'agendaWeek',





            selectHelper: true,
            editable: true,
            slotEventOverlap: true,
            slotDuration: '00:15:00',
            slotLabelInterval: '00:15:00',
            slotLabelFormat: 'HH:mm',
            allDaySlot: false,

            height: 600,//($rootScope.isPhone)?450:600,//600

            minTime: '08:00',
            maxTime: '24:00',

            events: this.loadEvents.bind(this),
            resourceOrder: 'id',
            resources: this.loadResources.bind(this),

            eventClick: this.eventClick.bind(this),
            select: this.eventSelect.bind(this),

            eventDrop: this.eventDrop.bind(this),
            viewRender: this.viewRender.bind(this),

            //************* בשביל מדריכים ללא הרשאה
            //eventStartEditable: false,
           // eventResize: false,
            //selectable: false,
            eventDurationEditable: !$rootScope.IsInstructorBlock,

            eventStartEditable: !$rootScope.IsInstructorBlock,
            eventResize: this.eventResize.bind(this),
            selectable: !$rootScope.IsInstructorBlock,

            //******************************
            eventResizeStart: function (event, element) {

                if (($rootScope.isPhone)) {

                    $('html, body,.fc-time-grid-container').css({
                        overflow: 'hidden',
                        height: 'auto'
                    });
                }



            }.bind(this),

            eventDragStart: function (event, element) {
                //   alert();
                if (($rootScope.isPhone)) {

                    $('html, body,.fc-time-grid-container').css({
                        overflow: 'hidden'

                    });
                }



            }.bind(this),

            eventDragStop: function (event, element) {

                $('html, body.fc-time-grid-container').css({
                    overflow: 'auto',
                    height: 'auto'
                });


            }.bind(this),

            eventResizeStop: function (event, element) {

                $('html, body').css({
                    overflow: 'auto',
                    height: 'auto'
                });


            }.bind(this),



            eventRender: function (event, element) {

              
              
                if (event.rendering != "background" && event.statuses && event.statuses.length > 0) {

                    var countCompletionReq = 0;
                    
                    for (var i in event.statuses) {

                      
                      
                        //בלי סטטוס
                        if (!event.statuses[i].Status || event.statuses[i].Status == '') {

                            $(element).addClass('warning-icon');
                        }
                        //לא הגיע 
                        else if (event.statuses[i].Status == 'notAttended') {
                            $(element).addClass('notarrive-icon');
                        }

                        //לא הגיע לא לחייב
                        else if (event.statuses[i].Status == 'notAttendedDontCharge') {

                            $(element).addClass('redvi2-icon');
                        }

                        //לא הגיע  לחייב
                        else if (event.statuses[i].Status == 'notAttendedCharge') {

                            $(element).addClass('redvi-icon');
                        }

                        // שמו אותו  כאן אבל עדיין לא הגיע
                        else if (event.statuses[i].Status == 'completion' && (event.statuses[i].IsComplete == 3 || event.statuses[i].IsComplete == 5)) {
                            $(element).addClass('returnred-iconfloat');
                        }

                        // שמו אותו איפה שהוא והגיע 
                        else if (event.statuses[i].Status == 'completion' && (event.statuses[i].IsComplete == 4 || event.statuses[i].IsComplete == 6)) {
                            $(element).addClass('returngreen-iconfloat');
                        }

                        ////  במידה ויש דרוש שיעור השלמה על ההשלמה
                        //// כנראה מיותר
                        //else if (event.statuses[i].Status == 'completionReq' && event.statuses[i].IsComplete == 5) {

                        //    $(element).addClass('returngreen-icon');
                        //}

                        // הוגדר שהוא צריך שיעור השלמה
                        else if ((event.statuses[i].Status == 'completionReq' || event.statuses[i].Status == 'completionReqCharge' ) && event.statuses[i].IsComplete == 1) {
                           
                            //$(element).css("background-color", "lightGray").css("border-color", "gray");
                            $(element).addClass('returnred-icon');
                            countCompletionReq++;

                         
                        }

                        // שמו לו שיעור השלמה איפה שהוא
                        else if ((event.statuses[i].Status == 'completionReq' || event.statuses[i].Status == 'completionReqCharge') && event.statuses[i].IsComplete == 2) {
                           //$(element).css("background-color", "lightGray").css("border-color", "gray");
                          
                            $(element).addClass('returngreen-icon');
                            countCompletionReq++;
                        }

                        else {
                            $(element).addClass('approve-icon');
                        }


                    }


                    //if (event.statuses && event.statuses.length == 2 && countCompletionReq == 1) {
                         
                    //    // event.statuses[i].Status == 'completionReq'

                    //}

                    if (event.statuses && countCompletionReq == event.statuses.length) {
                        $(element).css("background-color", "lightGray").css("border-color", "gray");

                        // במידה ויש רק שיעור השלמה תעלים את הכלס כדי שלא יעלים אותו
                        var title = $(element).find("div div.fc-title");
                        $(title).text($(title).text().replace(/sp_completionReq/gi, "sp_empty"));
                        $(title).text($(title).text().replace(/sp_completionReqCharge/gi, "sp_empty"));
                      

                    } else {
                      
                        $(element).removeClass('returnred-icon');
                        $(element).removeClass('returngreen-icon');
                    }
                   

                    // שיעור אחרון
                    if (event.PrevNext == 1) {
                        $(element).css({
                            "border-color": "#cc0000",
                            "border-width": "3px",
                            "border-style": "solid"
                        });

                    }




                }

                // מעדכן איידי לכל אירוע בשביל הגרירה
                if (event.id) {
                    $(element).attr("main_id", event.id);
                }

                //if (event.title == "ניתן להכניס חד פעמי") {
                //    $(element).css("color", "white").css("background", "gray").css("border-color", "Silver");
                //    $(element).addClass("hadPeami");
                //} else


                if (event.horsenames && event.horsenames.length > 0) {

                    var horsenames = "";
                    var prefix = "";
                    for (var i = 0; i < event.horsenames.length; i++) {
                        if (i != 0) prefix = ",";
                        horsenames = horsenames + prefix + event.horsenames[i];
                    }


                    $(element).find(".fc-time span").css("float", "right").before("<span class='spHorse'> (" + horsenames + ")  </span>");
                }



            }.bind(this)

        });

      $(".addedCalender").prependTo(".fc-right");


        //Scroll To End 



    }



    function HideMultipleHadPeami(element) {


        var elementStart = $(element).find(".fc-time").attr("data-start");
        var elementSibilng = $(element).siblings();

        var elementNext = $($(elementSibilng)[1]);
        if (elementNext) {
            var elementNextStart = $(elementNext).find(".fc-time").attr("data-start");
            if (elementStart == elementNextStart && $(element).attr("class").indexOf('hadPeami') > -1) {
                $(element).hide();
            }
            if (elementStart == elementNextStart && $(elementNext).attr("class").indexOf('hadPeami') > -1) {
                $(elementNext).hide();
            }
        }



        var elementPrev = $($(elementSibilng)[0]);
        if (elementPrev) {
            var elementPrevStart = $(elementPrev).find(".fc-time").attr("data-start");
            if (elementStart == elementPrevStart && $(element).attr("class").indexOf('hadPeami') > -1) {
                $(element).hide();
            }
            if (elementStart == elementPrevStart && $(elementPrev).attr("class").indexOf('hadPeami') > -1) {
                $(elementPrev).hide();
            }

        }

    }

    function _viewRender(view, element) {


        this.scope.$emit('calendar.viewRender', { startDate: view.start, endDate: view.end });
        this.reloadEvents();





    }

    function _eventResize(event) {


        this.eventChangeCallback(event);
        this.reloadEvents();
        this.scope.$apply();
    }

    function _eventDrop(event) {

     

        this.eventChangeCallback(event);
        this.reloadEvents();
        this.scope.$apply();


    }

    function _eventClick(event, jsEvent) {

        //if (!jsEvent.target.id) {
        this.eventClickCallback(event, jsEvent);
        this.reloadEvents();
        this.scope.$apply();


        //}
    }

    function _eventSelect(start, end, jsEvent, view, resource) {

        if (!this.pastEditEnabled && moment(start).isBefore(new Date())) {
            alert('תחילת שיעור לא יכולה להיות בעבר');
        }
        else {
            this.eventCreateCallback(start, end, jsEvent, view, resource);
        }
        $(this.calendar).fullCalendar('unselect');
        this.reloadEvents();
        this.scope.$apply();
    }

    function _reloadEvents() {



        $(this.calendar).fullCalendar('refetchEvents');

        $(".fc-title").each(function () {

            var currentElement = $(this).text();
           
            
            $(this).html(currentElement);

            $(this).find(".sp_completionReq").remove();
            $(this).find(".sp_completionReqCharge").remove();
        });





    }

    function _reloadResources() {
        $(this.calendar).fullCalendar('refetchResources');
        $(".fc-title").each(function () {
            var currentElement = $(this).text();

            $(this).html(currentElement);

        });






        //  הקוד הבא בשביל ליצור גלילה אנכית אם יש יותר מ6 מדריכים במסך
        var resCount = this.resources.length;
        // alert(22);
        if (resCount > 6) {
            //var view = $('.calendar').fullCalendar('getView');
            var setWidth = resCount * 16.66666666;

            $(".fc-view.fc-agendaDay-view.fc-agenda-view").css("width", setWidth + "%");
            //$(".fc-view.fc-agendaWeek-view.fc-agenda-view").css("width", setWidth + "%");
            //$(".fc-view.fc-month-view.fc-basic-view").css("width", setWidth + "%");
            $(".fc-view-container").scrollLeft(5000);
            //if (view.type != this.currentView) {

            //    $(".fc-view-container").scrollLeft(5000);
            //    this.currentView = view.type;

            //}

        } else {
            $(".fc-view.fc-agendaDay-view.fc-agenda-view").css("width", "100%");
            //$(".fc-view.fc-agendaWeek-view.fc-agenda-view").css("width", "100%");
            //$(".fc-view.fc-month-view.fc-basic-view").css("width", "100%");

        }







    }

    function _loadResources(callback) {
        callback(this.resources);

    }

    function _loadEvents(start, end, timezone, callback) {

        callback(this.events.concat(this.backgroundEvents || []));

    }

})(jQuery);