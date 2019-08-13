﻿(function () {

    var app = angular.module('app');

    app.component('student', {
        templateUrl: 'app/students/student.template.html',
        controller: StudentController,
        bindings: {
            user: '<',
            farms: '<',
            lessons: '<',
            instructors: '<',
            horses: '<',
            payments: '<',
            files: '<',
            commitments: '<',
            expenses: '<',
            userhorses: '<'

        }
    });

    app.filter('dateRange', function () {

        return dateRangeFilter;

        function dateRangeFilter(items, from, to) {
            var results = [];
            var fromDate = moment(from).format('YYYYMMDD');
            var toDate = moment(to).format('YYYYMMDD');
            for (var i in items) {
                var startDate = moment(items[i].start).format('YYYYMMDD');

                if (startDate >= fromDate && startDate <= toDate) {
                    results.push(items[i]);
                }
            }
            return results;
        }
    });

    app.filter('reverse', function () {
        return function (items) {
            if (items) {
                return items.slice().reverse();
            }
        };
    });

    function StudentController(farmsService, usersService, lessonsService, filesService, sharedValues, $scope, $state, notificationsService, $http) {

        var self = this;
        this.scope = $scope;
        this.farmsService = farmsService;
        this.HMOs = sharedValues.HMOs;
        this.lessonStatuses = sharedValues.lessonStatuses;
        this.styles = sharedValues.styles;
        this.submit = _submit.bind(this);
        this.getInstructorName = _getInstructorName.bind(this);
        this.delete = _delete.bind(this);
        this.addPayment = _addPayment.bind(this);
        this.addCheck = _addCheck.bind(this);
        this.cancelToken = _cancelToken.bind(this);
        this.refundPayment = _refundPayment.bind(this);
        this.removePayment = _removePayment.bind(this);
        this.addCommitment = _addCommitment.bind(this);
        this.removeCommitment = _removeCommitment.bind(this);
        this.changeLessonsStatus = _changeLessonsStatus.bind(this);
        this.countCommitmentLessons = _countCommitmentLessons.bind(this);
        this.countPaidLessons = _countPaidLessons.bind(this);
        this.countPaidMonths = _countPaidMonths.bind(this);

        this.initPaymentForm = _initPaymentForm.bind(this);
        this.initCommitmentForm = _initCommitmentForm.bind(this);
        this.setPaid = _setPaid.bind(this);
        this.getStatusIndex = _getStatusIndex.bind(this);
        this.setStatus = _setStatus.bind(this);
        this.initLessons = _initLessons.bind(this);
        this.countAllCredits = _countAllCredits.bind(this);
        this.isNullOrEmpty = _isNullOrEmpty.bind(this);
        this.createNotifications = _createNotifications.bind(this);
        this.addExpense = _addExpense.bind(this);
        this.initNewExpense = _initNewExpense.bind(this);
        this.removeExpense = _removeExpense.bind(this);
        this.countExpenses = _countExpenses.bind(this);
        this.initNewHorse = _initNewHorse.bind(this);
        this.removeHorse = _removeHorse.bind(this);
        this.addNewHorse = _addNewHorse.bind(this);
        this.uploadsUri = sharedValues.apiUrl + '/uploads/';
        this.removeFile = _removeFile.bind(this);
        this.uploadFile = _uploadFile.bind(this);
        this.isPrepaid = _isPrepaid.bind(this);
        this.countTotal = _countTotal.bind(this);
        this.openComments = _openComments.bind(this);
        this.commentClose = _commentClose.bind(this);
        this.countTotalByInvoiceSum = _countTotalByInvoiceSum.bind(this);
        this.countSherit = _countSherit.bind(this);
        this.openReport = _openReport.bind(this);
        this.filterReportMontlyComments = _filterReportMontlyComments.bind(this);

        this.monthlyReport = _monthlyReport.bind(this);

        this.getIfExpensiveInMas = _getIfExpensiveInMas.bind(this);
        this.payWin = false;

        this.disablBtn = false;
        this.migration = _migration.bind(this);
        this.removeTextDetail = _removeTextDetail.bind(this);
        this.addTextDetail = _addTextDetail.bind(this);

       // this.getIfExpensiveInMas = _getIfExpensiveInMas.bind(this);
        this.getLessonsDateNoPaid = _getLessonsDateNoPaid.bind(this);
        this.getIfanyCheckValid = _getIfanyCheckValid.bind(this);

        function _openComments(statusIndex, lesson) {

            this.selectedStudent = statusIndex;
            this.currentLesson = lesson;
        }

      


        function _openReport(reportdate) {
            // alert(reportdate);

            this.selectedStudentForReport = this.user.Id;
            var instructorId = this.lessons[this.lessons.length - 1].resourceId;
            this.scope.$broadcast('reportMonth.show', this.filterReportMontlyComments(reportdate), this.user.FirstName + " " + this.user.LastName, this.user.Email, this.farm.Name, this.getInstructorName(instructorId));


        }

        function _filterReportMontlyComments(reportdate) {

            //  alert(this.lessons.length);
            var returnComments = [];

            for (var i in this.monthlyReportData) {
                if (moment(this.monthlyReportData[i].Date).format('YYYYMM') == moment(reportdate).format('YYYYMM')) {
                    returnComments.push(this.monthlyReportData[i]);

                }
            }



            return returnComments;
        }

        function _commentClose(returnmessages) {
            if (returnmessages) {
                this.currentLesson.statuses[this.selectedStudent].Details = "";
            }

            for (var i = 0; i < returnmessages.length; i++) {
                this.currentLesson.statuses[this.selectedStudent].Details += returnmessages[i] + "\n";
            }

            if (returnmessages) {

                this.changeLessonsStatus(
                    this.currentLesson.statuses[this.selectedStudent].Status,
                    this.currentLesson.statuses[this.selectedStudent].Details,
                    this.currentLesson.statuses[this.selectedStudent].StudentId,
                    this.currentLesson.id,
                    this.currentLesson.statuses[this.selectedStudent].IsComplete,
                    this.currentLesson,
                    true);
            }

        }

        function _removeTextDetail(detail) {
            for (var d in this.user.Meta.TextDetails) {
                if (this.user.Meta.TextDetails[d] === detail) {
                    this.user.Meta.TextDetails.splice(d, 1);
                }
            }
        }

        function _addTextDetail() {
            this.newTextDetail.Date = new Date();
            this.user.Meta.TextDetails = this.user.Meta.TextDetails || [];
            this.user.Meta.TextDetails.push(angular.copy(this.newTextDetail));
        }

        window.wipeUser = function () {
            var email = prompt('email');
            $http.get(sharedValues.apiUrl + 'users/destroyuser/?email=' + email).then(function (response) {
                console.log(response);
            });
        }

        $scope.$on('submit', function (event, args) {
            if (confirm('האם לשמור שינוים')) {
                this.submit();
            }
        }.bind(this));

        this.dateFrom = moment().add(-1, 'months').toDate();
        this.dateTo = moment().add(1, 'months').toDate();

        // init student
        this.initStudent = function () {

           

          //  this.migration();
            this.initPaymentForm();
            this.initCommitmentForm();
            this.initNewExpense();
            this.initNewHorse();
            this.countAllCredits();
            this.monthlyReport();
            this.user.BirthDate = moment(this.user.BirthDate).startOf('day').toDate();
            this.user.Active = this.user.Active || 'active';

            // set default farm
            if (this.farms.length == 1) {
                this.user.Farm_Id = this.user.Farm_Id || this.farms[0].Id;
            }
        }.bind(this);

        this.initStudent();

        function _migration() {

            if (this.user.Id == 0) return;

            // if is not migrated
            if (this.user.Meta.migration != 'v1') {

                // check if has other expenses
                if (this.user.Meta.Expenses && this.user.Meta.Expenses.length > 0) {
                    alert('migration failed: has expenses');
                    return
                }

                // check if has float payments
                for (var lessonPayment of this.user.Meta.Payments || []) {
                    if ((lessonPayment.InvoiceSum / lessonPayment.Price) % 1 != 0) {
                        alert('migration failed: invoice sum doesn\'t match lesson price');
                        return;
                    }
                }

                // make migration for lessons
                for (var lessonPayment of this.user.Meta.Payments || []) {
                    lessonPayment.lessons = lessonPayment.InvoiceSum / lessonPayment.Price;
                    lessonPayment.InvoiceDetails = lessonPayment.lessons + ' שיעורים';
                }

                // make migration for monthly 
                for (var monthlyPayment of this.user.Meta.MonthlyPayments || []) {
                    monthlyPayment.month = monthlyPayment.Date;
                    this.user.Meta.Payments = this.user.Meta.Payments || [];
                    monthlyPayment.InvoiceDetails = 'חודש ' + moment(monthlyPayment.month).format('MM/YYYY')
                    this.user.Meta.Payments.push(monthlyPayment);
                }

                // end migration
                this.user.Meta.migration = 'v1';
                alert('שדרוג התלמיד הצליח, יש ללחוץ על עדכן');
            }
        }

        function _removeFile(file) {
            filesService.delete(file).then(function () {
                this.files.splice(this.files.indexOf(file), 1);
            }.bind(this));
        }

        function _uploadFile(file) {
            this.user.Meta.Files = this.user.Meta.Files || [];
            if (file) {
                this.user.Meta.Files.push(file);
            }
        }

        function _createNotifications() {
          
            var hmoMessage = '';
            for (var hmo of this.HMOs) {
                if (hmo.id == this.user.Meta.HMO) {
                    if (hmo.maxLessons) {
                        hmoMessage = ', לקוח ' + hmo.name + ' (נוצלו: ' + self.commitmentLessonsThisYear + ' שיעורים מתוך: ' + hmo.maxLessons + ')';
                    }
                }
            }

           
            if (this.user.Meta.PayType == 'lessonCost') {
                // var notificationText = 'יתרת השיעורים של התלמיד ' + this.user.FirstName + ' ' + this.user.LastName + ' נמוכה' + hmoMessage;
                var notificationText = ' התלמיד ' + this.user.FirstName + ' ' + this.user.LastName + ' נמצא בחובה ועליו להסדיר את התשלום '; //+ hmoMessage;
            } else {
                var notificationText = 'יש לגבות תשלום עבור החודש הבא מ' + this.user.FirstName + ' ' + this.user.LastName;
            }

            notificationsService.createNotification({
                entityType: 'student',
                entityId: this.user.Id,
                group: 'balance',
                farmId: this.user.Farm_Id,
                // צחי שינה מ this.creditPaidLessons < 1 ל this.creditPaidLessons < 0
                text: (this.user.Meta.Active == 'active' && this.creditPaidLessons < 0 && this.attendedLessons && this.attendedLessons > 0) || (this.user.Meta.Active == 'active' && this.user.Meta.PayType == 'monthCost') ? notificationText : null,
                date: moment().endOf('month').format('YYYY-MM-DD')
            });

            // text details notification

            

            var detailsText = null;

            var condition1 = true;
            var condition2 = this.user.Meta.Style === "treatment"; //|| this.user.Meta.Style === "privateTreatment";
            var condition3 = moment() > (moment().endOf('month').add(-8, 'day'));
            
         

            for (var i in this.monthlyReportHeader) {
                if (moment(this.monthlyReportHeader[i].Date).format('YYYYMM') == moment().format('YYYYMM')) {
                    condition1 = false;
                    break;
                }
            }

          
            if (condition1 && condition3 && condition2) {
                detailsText = "חסרה הערה חודשית לתלמיד " + this.user.FirstName + " " + this.user.LastName;

            } else {
                detailsText = null;

            }



            notificationsService.createNotification({
                entityType: 'student',
                entityId: this.user.Id,
                group: 'details',
                farmId: this.user.Farm_Id,
                text: detailsText,
                date: moment().format('YYYY-MM-DD')
            });
        }

        function _addExpense() {
            this.user.Meta.Expenses = this.user.Meta.Expenses || [];
            if (this.newExpense.IsPension) {
                this.newExpense.Details = 'פנסיון';
            }


            this.user.Meta.Expenses.push(this.newExpense);
            this.initNewExpense();
            this.countAllCredits();
        }

        function _removeExpense(expense) {
            for (var i in this.user.Meta.Expenses) {
                if (this.user.Meta.Expenses[i] == expense) {
                    this.user.Meta.Expenses.splice(i, 1);
                }
            }
            this.countAllCredits();
        }

        function _initNewExpense() {
            this.user.Meta.Expenses = this.user.Meta.Expenses || [];
            this.newExpense = {};
            this.newExpense.Date = new Date();
            if ($scope.expenseForm != null) {
                $scope.expenseForm.$setPristine();
            }
        }

        function _getIfExpensiveInMas(InvoiceNum) {

            for (var i in this.payments) {

                if (!this.payments[i].canceled &&
                    (this.payments[i].InvoiceNum == InvoiceNum || InvoiceNum.toString() == "true") &&
                    parseInt(moment(this.payments[i].Date).format('YYYYMMDD')) > parseInt(moment(sharedValues.DateModify).format('YYYYMMDD'))

                ) {
                    return true;
                }

            }

            return false;

        }

        //הוצאות אחרות

        function _countExpenses() {

         
           
            var total = 0;
            this.totalExpensesAll = 0;
            for (var i in this.expenses) {
                var exp = this.expenses[i];
                if (!exp.Paid) {
                    total += exp.Price;

                }
                else {


                    if (this.getIfExpensiveInMas(exp.Paid))
                        this.totalExpensesAll += exp.Price;

                }



            }


            this.totalExpenses = total;



        }

        function _countSherit() {
            

            var total = 0;
            var totalLessons = 0;
            this.Sherit = 0;
            var payments = this.payments || [];
           
            for (var i in payments) {

                if (!payments[i].month && !payments[i].canceled && parseInt(moment(payments[i].Date).format('YYYYMMDD')) > parseInt(moment(sharedValues.DateModify).format('YYYYMMDD'))) {
                    total += payments[i].InvoiceSum;
                    // if (payments[i].lessons) {

                    if (!payments[i].Price)
                        payments[i].Price = this.user.Cost;

                    if (payments[i].lessons)
                        totalLessons += (payments[i].Price * payments[i].lessons);
                    // }


                }
            }
          
            
            this.Sherit = total - this.totalExpensesAll - totalLessons;

        }

        function _isNullOrEmpty(value) {
            return value == null || value == '';
        }

        function _countAllCredits() {

            this.countCommitmentLessons();
            this.countPaidLessons();
            this.countExpenses();
            this.countPaidMonths();
            
            this.countSherit();
            this.initLessons();
           
            // unpaid lessons
            //חוב על שיעורים
          
            if (this.user.PayType == 'lessonCost') {
               
                //  this.creditPaidLessons = this.paidLessons

                //  if (this.Sherit >= this.user.Meta.Cost)

                //if((this.Sherit - this.totalExpensesAll) >0){

                //    this.creditPaidLessons++;
                //    this.paidLessons++;
                //    this.paidLessonsThisYear++;
                //   // this.Sherit = this.Sherit -this.totalExpensesAll - this.user.Meta.Cost;
                //}
                this.unpaidLessons = this.creditPaidLessons * this.user.Cost +this.Sherit;// (this.Sherit -this.totalExpensesAll - this.user.Meta.Cost);
                //if (this.creditPaidLessons < 0) {

                //    this.unpaidLessons = this.creditPaidLessons * this.user.Meta.Cost + this.Sherit;
                //}
                //else {

                //    this.unpaidLessons = this.creditPaidLessons * this.user.Meta.Cost + this.Sherit;
                //}
            }
        }

        function _initNewHorse() {
           
            this.userhorses = this.userhorses || [];
            this.newHorse = null;
            if ($scope.newHorseForm != null) {
                $scope.newHorseForm.$setPristine();
            }
        }

        function _addNewHorse() {
            for (var i in this.userhorses) {
                if (this.userhorses[i].Id == this.newHorse.Id) {
                    return false;
                }
            }
            this.userhorses = this.userhorses || [];
            this.userhorses.push({ Id: this.newHorse.Id, Name: this.newHorse.Name, PensionPrice: 0 });
            this.initNewHorse();
        }

        function _removeHorse(horse) {
            var horses = this.userhorses;
            for (var i in horses) {
                if (horses[i].Id == horse.Id) {
                    horses.splice(i, 1);
                }
            }
        }

        function _monthlyReport() {
            var LastDate = "";
            this.monthlyReportData = [];
            this.monthlyReportHeader = [];
            var monthlyLessons = this.lessons || [];
            for (var i in monthlyLessons) {

                if (moment(monthlyLessons[i].start).format('YYYYMM') != LastDate && monthlyLessons[i].statuses[0].Details) {

                    LastDate = moment(monthlyLessons[i].start).format('YYYYMM');

                    this.monthlyReportHeader.push({ Date: monthlyLessons[i].start });
                }


                if (monthlyLessons[i].statuses[0].Details) {

                    // alert(monthlyLessons[i].statuses[0].Details);
                    this.monthlyReportData.push({ Date: monthlyLessons[i].start, Details: monthlyLessons[i].statuses[0].Details });


                }

                // var ddd = "dfdfdf";
                // alert(monthlyLessons[i].start);
                //payments.splice(i, 1);
                //break;

            }


        }

        function _getLessonsDateNoPaid(LessonsPaidCounter) {

            if (!LessonsPaidCounter || LessonsPaidCounter == 0) return "";
            var results = "תאריכי שיעורים- ";
            var TotalPAID = this.creditPaidLessons;

            for (var i in this.lessons) {

                if (!this.lessons[i].paid) {

                    var CurrentStatus = this.lessons[i].statuses[this.getStatusIndex(this.lessons[i])].Status;
                    var IsPast = parseInt(moment(this.lessons[i].start).format('YYYYMMDD')) < parseInt(moment().format('YYYYMMDD'));


                    if (LessonsPaidCounter > 0 && (!IsPast || ['attended', 'notAttendedCharge', 'completionReq'].indexOf(CurrentStatus) != -1)) {
                        if (TotalPAID > 0) {
                            TotalPAID--;

                        } else {


                            results += moment(this.lessons[i].start).format('DD/MM/YYYY') + ",  ";
                            LessonsPaidCounter--;

                        }
                    }


                }

            }


            return results;

        }

        function _initLessons() {

         
            this.lessons = this.lessons.sort(function (a, b) {
                if (a.start > b.start)
                    return 1;
                if (a.start < b.start)
                    return -1;
                return 0;
            });

           
         
            // הוספתי למקרה שהשארית יותר גדולה ממחיר שיעור אז תחשיב שיעור
            if (this.Sherit >= this.user.Cost && this.user.Cost>0) {
                this.paidLessons++;
                this.Sherit = this.Sherit - this.user.Cost;

               
            }

            this.creditPaidLessons = this.paidLessons + this.commitmentLessons;
           
            var results=[];
            for (var i in this.lessons){
                
               
                // שיעור השלמה

                if (this.lessons[i].statuses[0].IsComplete == "4") {

                    this.lessons[i].statuses[0].Status = "attended";

                }
                if (this.lessons[i].statuses[0].IsComplete == "3") {

                    this.lessons[i].statuses[0].Status = "notAttended";
                }


                if (this.lessons[i].statuses[0].IsComplete < 3) {
                    var res = this.setPaid(this.lessons[i]);
                    this.lessons[i].paid = res[0];
                }
               

                if(this.user.PayType != 'lessonCost'){
                
                    var monthCurrent = moment().format("YYYYMM");
                    var monthOnly = moment(this.lessons[i].start).format("YYYYMM");

                    if (results.indexOf(monthOnly) == -1) {
                        
                      
                        if(this.lessons[i].paid && monthOnly > monthCurrent)
                            this.monthlyBalance += this.user.Meta.Cost;

                        if (!this.lessons[i].paid && monthOnly <= monthCurrent)
                        {

                            if (['attended', 'notAttendedCharge', 'completionReq'].indexOf(this.lessons[i].statuses[this.getStatusIndex(this.lessons[i])].Status) != -1)
                                 this.monthlyBalance -= this.user.Meta.Cost;
                        }
                        //else
                        //    this.monthlyBalance-=this.user.Meta.Cost;

                      
                        results.push(monthOnly);
                    }

                }


                // this.lessons[i].lessPrice = res[1];
            }


            //alert(this.monthlyBalance);


        }

        function _getStatusIndex(lesson) {
            for (var i in lesson.statuses) {
                if (lesson.statuses[i].StudentId == this.user.Id) {
                    return i;
                }
            }
        }

        function _setStatus(lesson) {
            return parseInt(moment(lesson.start).format('YYYYMMDD')) < parseInt(moment().format('YYYYMMDD')) && this.isNullOrEmpty(lesson.statuses[this.getStatusIndex(lesson)].Status);
        }

        function _setPaid(lesson) {

            //var IsMach = false;
            var Price = this.user.Cost;
          
            for (var i in this.payments) {

                var month = this.payments[i].month;
                var untilmonth = this.payments[i].untilmonth;
                if (this.payments[i].month
                    && !this.payments[i].canceled
                   
                    ) {
                    if (!untilmonth) untilmonth = month;
                   

                    var diffMonth = (moment(untilmonth).startOf('month')).diff(moment(month).startOf('month'), 'months', true);
                    if(diffMonth==0){
                        diffMonth++;
                    }else{
                        if (parseInt(moment(this.payments[i].Date).format('YYYYMMDD')) < parseInt(moment("20190331").format('YYYYMMDD'))) diffMonth++;
                    }



                    for (var j = 0; j < diffMonth; j++) {
                        if ((moment(month).add(j, 'M')).format('YYYYMM') == moment(lesson.start).format('YYYYMM'))
                            return [true, Price];
                    }
                    
                }
            }

            if (['attended', 'notAttendedCharge', 'completionReq'].indexOf(lesson.statuses[this.getStatusIndex(lesson)].Status) != -1) {
                this.attendedLessons = this.attendedLessons || 0;
                this.attendedLessons++;
                if (this.creditPaidLessons-- > 0) {
                    return [true,Price];
                }

            }
            return [false, Price];
        }

        function _initPaymentForm() {

            this.farmsService.getFarm(this.user.Farm_Id).then(function (farm) {


                if (farm.Meta === null) return;
                this.farm = farm;
                this.showNewPayment = false;
                this.newPayment = {};
                this.newPayment.api_key = this.farm.Meta.api_key;
                this.newPayment.api_email = this.farm.Meta.api_email;
                if (this.user.Farm_Id != 46) {
                    this.newPayment.isMasKabala = true;
                } else {

                    this.newPayment.isKabalaTroma = true;
                }
                
                this.newPayment.Date = new Date();
                this.newPayment.Price = this.user.Meta.Cost;
                this.newPayment.IsAshrai = this.farm.Meta.IsAshrai;
                this.newPayment.IsToken = this.farm.Meta.IsToken;
                
                if ($scope.paymentForm != null) {
                    $scope.paymentForm.$setPristine();
                }




            }.bind(this));
        }

        function _countTotal() {
            self.newPayment.InvoiceSum = 0;
            self.newPayment.InvoiceDetails = '';
            if (self.newPayment.lessons || self.newPayment.month) {
                if (self.user.Meta.PayType == 'lessonCost') {
                    self.newPayment.InvoiceSum += self.newPayment.lessons * self.user.Meta.Cost;
                    self.newPayment.InvoiceDetails += ((this.farm.Meta.IsRekivaTipulitInKabala && self.user.Meta.Style == "treatment") ? "רכיבה טיפולית - " : "") + self.newPayment.lessons + ' שיעורים ' + ((this.farm.Meta.IsDateInKabala) ? ("," + this.getLessonsDateNoPaid(self.newPayment.lessons)) : "");// "," + this.getLessonsDateNoPaid(self.newPayment.lessons);  //only for dev

                }
                else {
                    var diffMonth = 1;
                    if (self.newPayment.untilmonth && self.newPayment.month) {
                        
                        diffMonth = (moment(self.newPayment.untilmonth).startOf('month')).diff(moment(self.newPayment.month).startOf('month'), 'months', true);
                        if (diffMonth < 0) {
                            self.newPayment.untilmonth = '';
                            alert("טווח תאריכים שגוי!");
                            return;

                        } 
                        
                        //else {

                        //    diffMonth += 1;


                        //}

                        self.newPayment.InvoiceSum += self.user.Meta.Cost * ((diffMonth==0)?1:diffMonth);
                        self.newPayment.InvoiceDetails += 'חודש ' + moment(self.newPayment.month).format('DD/MM/YYYY') + ' עד חודש ' + moment(self.newPayment.untilmonth).format('DD/MM/YYYY');

                    }
                    if (!self.newPayment.untilmonth && self.newPayment.month) {
                        self.newPayment.InvoiceSum += self.user.Meta.Cost;
                        self.newPayment.InvoiceDetails += 'חודש ' + moment(self.newPayment.month).format('DD/MM/YYYY');
                    }

                }
            }
            if (this.user.Meta.Expenses !== undefined) {
                for (var expense of this.user.Meta.Expenses.filter(function (expense) { return !expense.Paid && expense.Checked })) {

                    self.newPayment.InvoiceSum += expense.Price;
                    self.newPayment.InvoiceDetails += ', ' + expense.Details;
                }
            }

        }

        function _cancelToken() {
           
            this.user.Meta.cc_token = "";

        }

        //איבנט בעת שינוי סכום חשבונית מאתחל את כמות השיעורים בהתאם לסכום
        function _countTotalByInvoiceSum() {

            self.newPayment.InvoiceDetails = "";
            var TempExpenses = 0;
            if (this.user.Meta.Expenses !== undefined) {
                for (var expense of this.user.Meta.Expenses.filter(function (expense) { return !expense.Paid && expense.Checked })) {
                    TempExpenses += expense.Price;
                }
            }

            self.newPayment.lessons = 0;



            if (self.user.Meta.PayType == 'lessonCost') {

                var TempSum = this.Sherit + self.newPayment.InvoiceSum - TempExpenses;
                ////מקרה שקסדה עולה 120 שח ושילמתי 80 שיעדכן שיש לי 80 ש"ח עודף
                if (TempExpenses > 0 && self.newPayment.InvoiceSum < TempExpenses) {
                    self.newPayment.lessons += 0;
                    return;
                }

                if (TempSum < 0) return;
                //הסכום גדול קח את ההפרש לעודף
                var DivisionRemainder = TempSum % self.user.Meta.Cost;
                self.newPayment.lessons += (TempSum - DivisionRemainder) / self.user.Meta.Cost;

            }

            if (self.newPayment.lessons)
               
                self.newPayment.InvoiceDetails += ((this.farm.Meta.IsRekivaTipulitInKabala && self.user.Meta.Style == "treatment") ? "רכיבה טיפולית - " : "") + self.newPayment.lessons + ' שיעורים ' + ((this.farm.Meta.IsDateInKabala) ? ("," + this.getLessonsDateNoPaid(self.newPayment.lessons)) : "");
            if (this.user.Meta.Expenses !== undefined) {
                for (var expense of this.user.Meta.Expenses.filter(function (expense) { return !expense.Paid && expense.Checked })) {

                //self.newPayment.InvoiceSum += expense.Price;
                    self.newPayment.InvoiceDetails += ', ' + expense.Details + ', ';
                }
            }

        }

        //מחיקה
        function _removePayment(payment) {

            var removeApprove = confirm('האם למחוק את החשבונית?');
            if (!removeApprove) return;
            var payments = this.user.Meta.Payments;

            for (var i in payments) {
                if (payments[i].InvoiceNum == payment.InvoiceNum) {
                    payments.splice(i, 1);
                    break;
                }
            }
            this.countAllCredits();
        }

        //זיכוי
        function _refundPayment(payment) {
            var cancelApprove = prompt('כדי לבטל חשבונית, אנא הזן את מספר חשבונית הזיכוי');
            if (!cancelApprove || cancelApprove == '') return;
            var payments = this.user.Meta.Payments;
            payment.canceled = cancelApprove;
            for (var i in this.user.Meta.Expenses) {
                if (this.user.Meta.Expenses[i].Paid == payment.InvoiceNum) {
                    delete this.user.Meta.Expenses[i].Paid;
                    delete this.user.Meta.Expenses[i].Checked;
                }
            }
            this.countAllCredits();
        }

        function _initCommitmentForm() {
            this.newCommitment = {};
            if ($scope.commitmentForm != null) {
                $scope.commitmentForm.$setPristine();
            }
        }

        function _changeLessonsStatus(status, details, studentId, lessonId, isComplete,lesson,isText) {
        
            
            if (!isText && (isComplete == 3 || isComplete == 4))
            {
                //var ind = this.getStatusIndex(lesson);

                if (status != "attended" && status != "notAttended") {

                    alert("בשיעור השלמה ניתן להזין רק אם הגיע \ לא הגיע");
                    //lesson.statuses[0].IsComplete = isComplete;
                    lesson.statuses[0].Status = "completion";
                    this.initLessons();
                    return;
                }

                if (isComplete == 3 && status == "attended") {

                    isComplete = 4;
                }

                if (isComplete == 4 && status == "notAttended") {

                    isComplete = 3;
                }
              
                status = "completion";

                lesson.statuses[0].Status = "completion";
                lesson.statuses[0].IsComplete = isComplete;
            }

          



            this.lessonStatusesToUpdate = this.lessonStatusesToUpdate || [];
            var found = false;
            for (var i in this.lessonStatusesToUpdate) {
                if (this.lessonStatusesToUpdate[i].studentId == studentId && this.lessonStatusesToUpdate[i].lessonId == lessonId) {
                    this.lessonStatusesToUpdate[i].status = status;
                    this.lessonStatusesToUpdate[i].details = details;
                    this.lessonStatusesToUpdate[i].isComplete = isComplete;

                    found = true;
                }
            }
            if (!found) {
                this.lessonStatusesToUpdate.push({ studentId: studentId, lessonId: lessonId, status: status, details: details, isComplete: isComplete });
            }

            this.countAllCredits();
        }

        function _countPaidLessons() {
         
            var payments = this.payments || [];
            var totalLessons = 0;
            var totalLessonsThisYear = 0;
            for (var i in payments) {
                if (payments[i].lessons && !payments[i].canceled) {
                    totalLessons += payments[i].lessons
                    if (moment(payments[i].Date).format('YYYY') == moment().format('YYYY')) {
                        totalLessonsThisYear += payments[i].lessons;
                    }
                }
            }

           
            this.paidLessons = totalLessons;
            this.paidLessonsThisYear = totalLessonsThisYear;
        }

        function _countPaidMonths() {
          
            var payments = this.payments || [];
            var results = [];
            var sum = 0;
            var paid = 0;
            var totalExpenOut = 0;
            for (var i in payments) {
                if (payments[i].month && !payments[i].canceled ) {

                    paid += payments[i].InvoiceSum;
                    var month = moment(payments[i].month).format('MM-YYYY');
                 
                    if (results.indexOf(month) == -1) {

                        var untilmonth = moment(payments[i].untilmonth).format('MM-YYYY');

                        if (payments[i].untilmonth && payments[i].untilmonth != payments[i].month) {
                            var diffMonth = (moment(payments[i].untilmonth).startOf('month')).diff(moment(payments[i].month).startOf('month'), 'months', true);
                            if(diffMonth==0){
                                diffMonth++;
                            }else{
                                if(parseInt(moment(payments[i].Date).format('YYYYMMDD')) < parseInt(moment("20190331").format('YYYYMMDD')))  diffMonth++;
                            }
                            // for (var j = 0; j < diffMonth + 1; j++) {
                            for (var j = 0; j < diffMonth; j++) {
                                results.push(moment(payments[i].month).add(j, 'M'));
                                sum += payments[i].Price;
                            }


                        } else {
                            results.push(month);
                            sum += payments[i].Price;
                        }



                    }
                }
                else if(!payments[i].lessons && !payments[i].canceled){
                   
                    totalExpenOut += payments[i].InvoiceSum;

                }
            }
          
            var totalOnlyMonth = (this.user.PayType == 'lessonCost')?0:(this.totalExpensesAll-totalExpenOut);
            this.paidMonths = results.length;
            this.monthlyBalance = paid - totalOnlyMonth - sum;

           
        }

        // התחייבות
        function _countCommitmentLessons() {
            
            var commitments = this.commitments || [];
           
            var total = 0;
            var totalThisYear = 0;
            for (var i in commitments) {

                if (!commitments[i].Date) { commitments[i].Date = '01/01/2016' };
                total += commitments[i].Qty;
                var isThisYear = moment(commitments[i].Date).format('YYYY') == moment().format('YYYY');
                if (isThisYear) {
                    totalThisYear += commitments[i].Qty;
                }
            }
            this.commitmentLessons = total;
            this.commitmentLessonsThisYear = totalThisYear;
        }

        function _addCommitment() {
            this.commitments = this.commitments || [];
            this.newCommitment.HMO = this.user.Meta.HMO;
            this.newCommitment.Date = this.newCommitment.Date || new Date();
            this.commitments.push(this.newCommitment);
            this.initCommitmentForm();
            this.countAllCredits();
        }

        function _removeCommitment(commitment) {
            var commitments = this.commitments;
            for (var i in commitments) {
                if (commitments[i] == commitment) {
                    commitments.splice(i, 1);
                }
            }
            this.countAllCredits();
        }

        this.getccType = function (ValeType) {

            switch (ValeType) {
                case "Isracart":
                    return "1";
                case "Visa":
                    return "2";
                case "Dainers":
                    return "3";
                case "American express":
                    return "4";
                case "Leumi card":
                    return "6";
                case "Mastercard":
                    return "99";
                default:
                    return "0";
            }

        }

        this.getccTypeName = function (ValeType) {

            switch (ValeType) {
                case "1":
                    return "ישראכרט";
                case "2":
                    return "ויזה";
                case "3":
                    return "דיינרס";
                case "4":
                    return "אמירקן אקספרס";
                case "6":
                    return "לאומי קארד";
                case "99":
                    return "מאסטר קארד";
                default:
                    return "0";
            }

        }

        this.winPayClose = function () {

           // alert(getUrlParameter("http://ynet.co.il?sdsd=1&Shir=3", "Shir"));
       

            if (this.newPayment.payment_type == 'ashrai')
            {
                this.newPayment.payment_type = 'validate';
                this.newPayment.ksys_token = this.ksys_token;
                $http.post(sharedValues.apiUrl + 'invoices/sendInvoice/', this.newPayment).then(function (response) {

                    if (response.data.success) {

                        this.newPayment.payment_type = 'credit card';
                        this.newPayment.cc_number = response.data.cgp_customer_cc_4_digits;
                        this.newPayment.cc_payment_num = response.data.cgp_shva_transacion_id;
                        this.newPayment.cc_num_of_payments = response.data.cgp_num_of_payments;
                        this.newPayment.cc_customer_name = response.data.cgp_customer_name;
                        this.newPayment.cc_deal_type = (response.data.cgp_num_of_payments == 1) ? "1" : "2";// סוג עסקה לבדוק
                        this.newPayment.cc_type = this.getccType(response.data.cgp_customer_cc_name);
                        this.addPayment();

                    } else {

                        // alert("תקלה בחיוב כרטיס אשראי");
                        this.newPayment.payment_type = 'ashrai';
                    }



                }.bind(this));
            }


        

            if (this.newPayment.payment_type == 'token') 
            {
              //  alert("כרטיס אשראי נרשם בהצלחה! מעתה תוכל לחייב בטוקן");
                window.location.reload();

              
            }





            this.disablBtn = false;
        }

        function _addPayment() {
          
            if (this.newPayment.payment_type == 'check') {
                var TotalSumFromChecks = 0;
                for (var i in this.newPayment.Checks) {
                    var checks_bank_name = this.newPayment.Checks[i].checks_bank_name;
                    var checks_number = this.newPayment.Checks[i].checks_number;
                    var checks_date = this.newPayment.Checks[i].checks_date;
                    var checks_sum = this.newPayment.Checks[i].checks_sum;



                    if (checks_bank_name && checks_number && checks_date && checks_sum) {
                        TotalSumFromChecks += eval(checks_sum);
                    } else {

                        this.newPayment.Checks.splice(i, 1);
                    }
              
                }

            
                if (TotalSumFromChecks != this.newPayment.InvoiceSum) {

                    alert("סך כל הצ'קים אינו זהה לסכום לתשלום.");
                    return;
                }

            }


            this.disablBtn = true;

            var UserTypePaid = this.user.PayType;
            this.newPayment.customer_name = this.user.FirstName + ' ' + this.user.LastName;
            this.newPayment.customer_email = this.user.AnotherEmail;
            this.newPayment.customer_address = this.user.Address;
            this.newPayment.UserId = this.user.Id;
            this.newPayment.comment =
                'מס לקוח: ' + (this.user.ClientNumber || "") +
                ', ת.ז.: ' + (this.user.IdNumber || "");
           
          
            // במידה וקיים כבר טוקן על הכרטיס תלמיד תשלום עם טוקן
            if(this.user.Meta.cc_token && this.newPayment.payment_type =='token'){

                this.newPayment.cc_token = this.user.cc_token;
                this.newPayment.cc_type_id= this.user.cc_type_id;
                this.newPayment.cc_type_name= this.user.cc_type_name;
                this.newPayment.cc_4_digits=  this.user.cc_4_digits;
                this.newPayment.cc_payer_name= this.user.cc_payer_name;
                this.newPayment.cc_payer_id= this.user.cc_payer_id;
                this.newPayment.cc_expire_month= this.user.cc_expire_month;
                this.newPayment.cc_expire_year= this.user.cc_expire_year;

                this.newPayment.payment_type = 'tokenBuy';

            }

            var newPayment = angular.copy(this.newPayment);
            newPayment.cc_type_name = this.getccTypeName(this.newPayment.cc_type);

            if (newPayment.isMasKabala || newPayment.isKabala || newPayment.isKabalaTroma) {

                $http.post(sharedValues.apiUrl + 'invoices/sendInvoice/', newPayment).then(function (response) {

                    if (this.newPayment.payment_type == 'ashrai' || this.newPayment.payment_type == 'token') {
                     
                        if (response.data.errMsg) {
                            alert("תקלה בסליקת האשראי!");
                            return;
                        }

                        // מאחר וזה פוסט אני מעדכן את השדות שלא יאבדו לי
                        this.newPayment.InvoiceSum = newPayment.InvoiceSum;
                        this.newPayment.InvoiceDetails = newPayment.InvoiceDetails;
                        this.ksys_token = response.data.secretTransactionId;
                        var top = 0;
                        top = top > 0 ? top / 2 : 0;
                        var left = window.screen.width - 600;
                        left = left > 0 ? left / 2 : 0;
                        if (response.data.url && !this.payWin) {
                            this.payWin = true;

                            //response.data.url
                            //http://localhost:52476/closeToken.html
                            http://localhost:52476/index.html#/closetoken

                           // var testUrl = "http://localhost:52476/index.html#/closetoken?aa=55&UserId="+this.user.Id+"&cc_token=4cf8e168-261e-4613-8d20-000332986b24&cc_type_id=2&cc_type_name=%D7%95%D7%99%D7%96%D7%94+%D7%9B.%D7%90.%D7%9C.&cc_4_digits=0000&cc_payer_name=Card+Owner&cc_payer_id=040617649&cc_expire_month=10&cc_expire_year=2021&success=1";
                            var payWind = window.open(response.data.url, "Upload Chapter content", "width=600,height=600" + ",top=" + top + ",left=" + left);

                            var timer = setInterval(function () {

                            
                                if (payWind.closed) {
                                    
                                    $scope.$ctrl.payWin = false;
                                    clearInterval(timer);
                                    $scope.$ctrl.winPayClose();
                                }
                            }, 1000);


                        }
                        return;

                    }

                    if (this.newPayment.payment_type == 'tokenBuy') {
                       
                        if (!response.data.success) {

                            alert("תקלה בחיוב הטוקן!");
                            return;
                        }
                      
                        this.newPayment.payment_type = 'token';
                    }
                
                    if (response.data.errMsg) {

                        alert("תקלה בהפקת חשבוניות!");
                        return;
                    }


                    newPayment.InvoiceNum = response.data.doc_number;
                    newPayment.InvoicePdf = response.data.pdf_link;

                    this.expenses.map(function (expense) {
                        if (expense.Checked && !expense.Paid) {
                            expense.Paid = newPayment.InvoiceNum;

                        }
                    });

                    this.user.Meta.Payments = this.user.Meta.Payments || [];
                    this.user.Meta.Payments.push(newPayment);
                    this.initPaymentForm();
                    this.countAllCredits();
                    this.submit();

                }.bind(this));
            } else {

                this.payments = this.payments || [];
                //  newPayment.ExpenseSum = 0;
                this.expenses.map(function (expense) {
                    if (expense.Checked && !expense.Paid) {
                        expense.Paid = newPayment.InvoiceNum;

                    }
                });

                this.payments.push(newPayment);

                this.initPaymentForm();
                this.countAllCredits();
                this.submit();
            }
        }

        this.currentCheckindex = 0;
        this.checksCount = 0;
        function _addCheck(action) {
            // 1. הוספת חדש
            if (action == 1) {

                //this.newPayment.Checks = this.newPayment.Checks || [];
                //var Seq = (this.newPayment.Checks.length || 0) + 1;
                //this.newPayment.Checks.push({ seq: Seq, checks_bank_name: this.newPayment.checks_bank_name, checks_number: this.newPayment.checks_number, checks_date: this.newPayment.checks_date, checks_sum: this.newPayment.checks_sum });
                //this.newPayment.checks_number = "";
                //this.newPayment.checks_date = "";
                //this.newPayment.checks_sum = "";
                this.currentCheckindex += 1;
                this.checksCount += 1;
            }
            if (action == 3) {
                this.currentCheckindex -= 1;
                //this.newPayment.checks_bank_name = this.newPayment.Checks[this.currentCheckindex].checks_bank_name;
                //this.newPayment.checks_number = this.newPayment.Checks[this.currentCheckindex].checks_number;
                //this.newPayment.checks_date = this.newPayment.Checks[this.currentCheckindex].checks_date;
                //this.newPayment.checks_sum = this.newPayment.Checks[this.currentCheckindex].checks_sum;
            }
            if (action == 4) {

                //if (this.currentCheckindex + 1 == this.newPayment.Checks.length) {
                //    this.newPayment.checks_number = "";
                //    this.newPayment.checks_date = "";
                //    this.newPayment.checks_sum = "";

                //} else {
                //if (this.newPayment.Checks.length > this.currentCheckindex)
                this.currentCheckindex += 1;
                //this.newPayment.checks_bank_name = this.newPayment.Checks[this.currentCheckindex].checks_bank_name;
                //this.newPayment.checks_number = this.newPayment.Checks[this.currentCheckindex].checks_number;
                //this.newPayment.checks_date = this.newPayment.Checks[this.currentCheckindex].checks_date;
                //this.newPayment.checks_sum = this.newPayment.Checks[this.currentCheckindex].checks_sum;
                // }
            }



        }

        function _getIfanyCheckValid() {
            if (this.newPayment.payment_type == 'check') {

                for (var i in this.newPayment.Checks) {
                    var checks_bank_name = this.newPayment.Checks[i].checks_bank_name;
                    var checks_number = this.newPayment.Checks[i].checks_number;
                    var checks_date = this.newPayment.Checks[i].checks_date;
                    var checks_sum = this.newPayment.Checks[i].checks_sum;

                    if (checks_bank_name && checks_number && checks_date && checks_sum && self.newPayment.InvoiceDetails && self.newPayment.InvoiceSum)
                        return false;

                }

                return true;

            }

            return true;
        }

        function _submit() {


            //alert(this.userhorses.length);

            if ($scope.studentForm.$valid) {
             
                this.user.Role = 'student';
                this.user.Email = this.user.IdNumber;
                this.user.Password = this.user.IdNumber;
                //this.user.AccountStatus = $("#dvAccountStatus").text();
                //this.user.Meta.Sherit = (this.user.Meta.PayType == 'lessonCost') ? this.Sherit : this.monthlyBalance;


                usersService.updateUserMultiTables(this.user, this.userhorses).then(function (user) {
                  
                    lessonsService.updateStudentLessonsStatuses(this.lessonStatusesToUpdate);
                    this.user = user;
                    this.createNotifications();
                    this.initStudent();
                    alert('נשמר בהצלחה');
                }.bind(this));
            }
        }

        function _getInstructorName(id) {
            for (var i in this.instructors) {
                if (this.instructors[i].Id == id) {
                    return this.instructors[i].FirstName + " " + this.instructors[i].LastName;
                }
            }
        }

        function _delete() {
            if (confirm('האם למחוק את התלמיד?')) {
                usersService.deleteUser(this.user.Id).then(function (res) {
                    $state.go('students');
                });
            }
        }

        function _isPrepaid() {
            if (self.user.HMO) {
                for (var hmo of self.HMOs) {
                    if (hmo.id == this.user.HMO && hmo.prePaid)
                        return true;
                }
                return false;
            }
        }
    }

})();
