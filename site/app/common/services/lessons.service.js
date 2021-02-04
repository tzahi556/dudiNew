(function () {

    var app = angular.module('app');

    app.service('lessonsService', LessonsService);

    function LessonsService($http, $q, sharedValues, usersService, notificationsService, $rootScope) {
        this.getLessons = _getLessons.bind(this);
        this.updateLesson = _updateLesson.bind(this);
       // this.updateLessonDetails = _updateLessonDetails.bind(this);
        
        this.deleteLesson = _deleteLesson.bind(this);
        this.updateStudentLessonsStatuses = _updateStudentLessonsStatuses.bind(this);
        this.createNotifications = _createNotifications.bind(this);
        this.checkLowCredit = _checkLowCredit.bind(this);
        this.getifLessonsHaveMoreOneRider = _getifLessonsHaveMoreOneRider.bind(this);
        this.deleteOnlyStudentLesson = _deleteOnlyStudentLesson.bind(this);
        this.getSetSchedularTask = _getSetSchedularTask.bind(this);
        this.getSetMonthlyReports = _getSetMonthlyReports.bind(this);

        this.HMOs = sharedValues.HMOs;


        function _getSetMonthlyReports(userId, date, text, type) {
           
            if (!text) text = null;
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'lessons/getSetMonthlyReports/' + userId + '/' + date + '/' + text + '/' + type).then(function (res) {
                deferred.resolve(res.data);
            });
            return deferred.promise;
        }

        function _getifLessonsHaveMoreOneRider(lessonId) {
          
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'lessons/getifLessonsHaveMoreOneRider/' + lessonId).then(function (res) {
                deferred.resolve(res.data);
            });
            return deferred.promise;
        }

        function _createNotifications(lesson) {
            for (var i in lesson.statuses) {
                usersService.getUser(lesson.statuses[i].StudentId).then(function (user) {
                  //  this.checkLowCredit(user);
                }.bind(this));
            }
        }



        

        function _checkLowCredit(user) {
            var paidLessons = 0;
            for (var i in user.Meta.Payments) {
                if (user.Meta.Payments[i].lessons && !user.Meta.Payments[i].canceled)
                    paidLessons += user.Meta.Payments[i].lessons;
            }

            var commitmentLessons = 0;
            for (var i in user.Meta.Commitments) {
                commitmentLessons += user.Meta.Commitments[i].Qty;
            }

            var paidMonths = [];
            for (var i in user.Meta.Payments) {
                if (user.Meta.Payments[i].month && !user.Meta.Payments[i].canceled)
                    paidMonths.push(moment(user.Meta.Payments[i].month).format('MM-YYYY'));
            }

            var lessonsToPay = 0;
            this.getLessons(user.Id).then(function (lessons) {
                for (var i in lessons) {
                    for (var x in lessons[i].statuses) {
                        if (
                            lessons[i].statuses[x].StudentId == user.Id &&
                            ['attended', 'notAttendedCharge'].indexOf(lessons[i].statuses[x].Status) != -1 &&
                            paidMonths.indexOf(moment(lessons[i].start).format('MM-YYYY')) == -1
                        ) {
                            lessonsToPay++;
                        }
                    }
                }

                var commitments = user.Meta.Commitments || [];
                var totalThisYear = 0;
                for (var i in commitments) {
                    var isThisYear = moment(commitments[i].Date).format('YYYY') == moment().format('YYYY');
                    if (isThisYear) {
                        totalThisYear += commitments[i].Qty;
                    }
                }
                var commitmentLessonsThisYear = totalThisYear;

                var hmoMessage = '';
                for (var hmo of this.HMOs) {
                    if (hmo.id == user.Meta.HMO) {
                        if (hmo.maxLessons) {
                            hmoMessage = ', לקוח ' + hmo.name + ' (נוצלו: ' + commitmentLessonsThisYear + ' שיעורים מתוך: ' + hmo.maxLessons + ')';
                        }
                    }
                }

                if (user.Meta.PayType == 'lessonCost') {
                    var notificationText = 'יתרת השיעורים של התלמיד ' + user.FirstName + ' ' + user.LastName + ' נמוכה' + hmoMessage;
                } else {
                    var notificationText = 'יש לגבות תשלום עבור החודש הבא מ' + user.FirstName + ' ' + user.LastName;
                }
                notificationsService.createNotification({
                    entityType: 'student', entityId: user.Id, group: 'balance', farmId: user.Farm_Id,
                    text: ((paidLessons + commitmentLessons - lessonsToPay) <= 1 && lessonsToPay > 0) || (user.Meta.PayType == 'monthCost') ? notificationText : null,
                    date: moment().endOf('month').format('YYYY-MM-DD')
                }).then(function () {
                    notificationsService.getNotifications().then(function (data) {
                        $rootScope.$broadcast('notificationsNav.refresh', data.length)
                    });
                });

            }.bind(this));
        }

        function _getLessons(studentId, startDate, endDate, isFromCompletion) {

           
            studentId = !angular.isUndefined(studentId) ? studentId : '';
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'lessons/getLessons/', { params: { studentId: studentId, startDate: startDate, endDate: endDate, isFromCompletion: isFromCompletion } }).then(function (res) {
              
                deferred.resolve(res.data);
            });

            return deferred.promise;
        }

        function _updateStudentLessonsStatuses(statuses, studentId) {

         
            studentId = !angular.isUndefined(studentId) ? studentId : '';
            var deferred = $q.defer();
            $http.post(sharedValues.apiUrl + 'lessons/updateStudentLessonsStatuses/' + studentId , statuses).then(function (res) {
                deferred.resolve(res.data);
            });
            return deferred.promise;
        }

        function _deleteLesson(lessonId, deleteChildren) {
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'lessons/deleteLesson/' + lessonId + '/' + deleteChildren).then(function (res) {
                deferred.resolve(res.data);
            });
            return deferred.promise;
        }

        function _deleteOnlyStudentLesson(lessonId,userId, deleteChildren) {
            var deferred = $q.defer();
            $http.get(sharedValues.apiUrl + 'lessons/deleteOnlyStudentLesson/' + lessonId + '/' + userId + '/' + deleteChildren).then(function (res) {
                deferred.resolve(res.data);
            });
            return deferred.promise;
        }


        

        function _updateLesson(lesson, changeChildren, lessonsQty) {
         
           
            debugger
            changeChildren = changeChildren || false;
            var deferred = $q.defer();
            $http.post(sharedValues.apiUrl + 'lessons/updateLesson/' + changeChildren + "/" + lessonsQty, lesson).then(function (res) {
               
                this.createNotifications(res.data);
                deferred.resolve(res.data);
            }.bind(this));
            return deferred.promise;
        }

        //function _updateLessonDetails(lesson) {
           
        //    var deferred = $q.defer();
        //    $http.post(sharedValues.apiUrl + 'lessons/updateLessonDetails/', lesson).then(function (res) {
        //        deferred.resolve(res.data);
        //    }.bind(this));
        //    return deferred.promise;
        //}

      //  lessonsService.updateLessonDetails(lesson);



        function _getSetSchedularTask(lessonId, resourceId, schedular,type) {
          
            var deferred = $q.defer();
            $http.post(sharedValues.apiUrl + 'lessons/getSetSchedularTask/' + lessonId + "/" + resourceId + "/" + type  , schedular).then(function (res) {

                deferred.resolve(res.data);
            });

            return deferred.promise;
        }
    }

})();