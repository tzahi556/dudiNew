(function () {

    var app = angular.module('app');

    app.component('pay', {
        templateUrl: 'app/common/components/pay/pay.template.html',
        controller: PayController,
        bindings: {
            studentid: '=',
            selectedpayvalue: "=",
            students: '<',
            closeCallback: '<',
            deleteCallback: '<'
        }
    });

    function PayController($scope, usersService, lessonsService, farmsService, sharedValues, $http) {

        var self = this;
        this.scope = $scope;
        this.usersService = usersService;
        this.farmsService = farmsService;
        this.sharedValues = sharedValues;
        this.lessonsService = lessonsService;
        this.initPaymentForm = _initPaymentForm.bind(this);
      //  this.countExpenses = _countExpenses.bind(this);

        this.countTotalByInvoiceSum = _countTotalByInvoiceSum.bind(this);
        this.addPayment = _addPayment.bind(this);
        this.submit = _submit.bind(this);
        this.studentDataById = _studentDataById.bind(this);
        this.countAllCredits = _countAllCredits.bind(this);
        this.countCommitmentLessons = _countCommitmentLessons.bind(this);
        this.countPaidLessons = _countPaidLessons.bind(this);
        this.countPaidMonths = _countPaidMonths.bind(this);
        this.countExpenses = _countExpenses.bind(this);
        this.initLessons = _initLessons.bind(this);
        this.setPaid = _setPaid.bind(this);
        this.getStatusIndex = _getStatusIndex.bind(this);
        this.hide = _hide.bind(this);
        this.countTotal = _countTotal.bind(this);
        this.countSherit = _countSherit.bind(this);
        this.onShow = _onShow.bind(this);
        this.getIfExpensiveInMas = _getIfExpensiveInMas.bind(this);
        this.disablBtn = false;
        this.getLessonsDateNoPaid = _getLessonsDateNoPaid.bind(this);
        this.scope.$on('pay.show', this.onShow);
       
        function _onShow(event, selectedStudent, selectedPayValue) {
          //  this.paySum = selectedPayValue;
            this.disablBtn = false;
            this.totalExpenses = 0;
            this.unpaidLessons = 0;
            this.monthlyBalance = 0;

            this.payWin = false;

            this.usersService.getUser(selectedStudent).then(function (user) {
                this.user = user;

                this.initPaymentForm();
                
                this.countAllCredits();

            }.bind(this));



        }

        function _countAllCredits(isFromSave) {

         
            // this.initLessons();
            this.lessonsService.getLessons(this.user.Id).then(function (lessons) {
               

                this.totalExpenses = 0;
                this.unpaidLessons = 0;
                this.monthlyBalance = 0;
                this.lessons = lessons;
                this.countCommitmentLessons();
                this.countPaidLessons();
               
                this.countExpenses();
                this.countPaidMonths();
                this.countSherit();
                this.initLessons();
               
             
                // unpaid lessons
                //חוב על שיעורים
                if (this.user.Meta.PayType == 'lessonCost') {

                  
                    if (this.creditPaidLessons < 0) {

                        this.unpaidLessons = this.creditPaidLessons * this.user.Meta.Cost + this.Sherit;
                    }
                    else {

                        this.unpaidLessons = this.creditPaidLessons * this.user.Meta.Cost + this.Sherit;
                    }
                }


                var AccountStatus = this.totalExpenses * -1 + this.unpaidLessons + this.monthlyBalance;
                this.colorForTotal = (AccountStatus < 0) ? "red" : "blue";

                if (isFromSave) {

                    this.user.Role = 'student';
                    this.user.Email = this.user.Meta.IdNumber;
                    this.user.Password = this.user.Meta.IdNumber;

                   
                    this.user.AccountStatus = AccountStatus;

                    usersService.updateUser(this.user).then(function (user) {

                        this.user = user;
                        this.closeCallback("", "");
                        // this.createNotifications();
                        // this.initStudent();
                        alert('נשמר בהצלחה');





                    }.bind(this));
                    this.studentid = null;

                }


            }.bind(this));

           
         
            
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

        // התחייבות
        function _countCommitmentLessons() {

            var commitments = this.user.Meta.Commitments || [];
            var total = 0;
            var totalThisYear = 0;
            for (var i in commitments) {
                total += commitments[i].Qty;
                var isThisYear = moment(commitments[i].Date).format('YYYY') == moment().format('YYYY');
                if (isThisYear) {
                    totalThisYear += commitments[i].Qty;
                }
            }
            this.commitmentLessons = total;
            this.commitmentLessonsThisYear = totalThisYear;
        }

        function _countPaidLessons() {
            var payments = this.user.Meta.Payments || [];
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

            var payments = this.user.Meta.Payments || [];
            var results = [];
            var sum = 0;
            var paid = 0;
            var totalExpenOut = 0;
            for (var i in payments) {
                if (payments[i].month && !payments[i].canceled) {

                    paid += payments[i].InvoiceSum;
                    var month = moment(payments[i].month).format('MM-YYYY');

                    if (results.indexOf(month) == -1) {

                        var untilmonth = moment(payments[i].untilmonth).format('MM-YYYY');

                        if (payments[i].untilmonth && payments[i].untilmonth != payments[i].month) {
                            var diffMonth = (moment(payments[i].untilmonth).startOf('month')).diff(moment(payments[i].month).startOf('month'), 'months', true);
                            if (diffMonth == 0) {
                                diffMonth++;
                            } else {
                                if (parseInt(moment(payments[i].Date).format('YYYYMMDD')) < parseInt(moment("20190331").format('YYYYMMDD'))) diffMonth++;
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
                else if (!payments[i].lessons && !payments[i].canceled) {
                    totalExpenOut += payments[i].InvoiceSum;

                }
            }

         
            var totalOnlyMonth = (this.user.Meta.PayType == 'lessonCost') ? 0 : (this.totalExpensesAll - totalExpenOut);
            this.paidMonths = results.length;

            this.monthlyBalance = paid - totalOnlyMonth - sum;
        }
        //function _countPaidMonths() {
        //    var payments = this.user.Meta.Payments || [];
        //    var results = [];
        //    var sum = 0;
        //    var paid = 0;
        //    for (var i in payments) {
        //        if (payments[i].month && !payments[i].canceled) {
        //            paid += payments[i].InvoiceSum;
        //            var month = moment(payments[i].month).format('MM-YYYY');
        //            if (results.indexOf(month) == -1) {
        //                results.push(month);
        //                sum += payments[i].Price;
        //            }
        //        }
        //    }
        //    this.paidMonths = results.length;
        //    this.monthlyBalance = paid - sum;
        //}

        function _getIfExpensiveInMas(InvoiceNum) {

            for (var i in this.user.Meta.Payments) {

                if (!this.user.Meta.Payments[i].canceled &&
                    (this.user.Meta.Payments[i].InvoiceNum == InvoiceNum || InvoiceNum.toString() == "true") &&
                    parseInt(moment(this.user.Meta.Payments[i].Date).format('YYYYMMDD')) > parseInt(moment(sharedValues.DateModify).format('YYYYMMDD'))

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
            for (var i in this.user.Meta.Expenses) {
                var exp = this.user.Meta.Expenses[i];
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
            var payments = this.user.Meta.Payments || [];

            for (var i in payments) {

                if (!payments[i].month && !payments[i].canceled && parseInt(moment(payments[i].Date).format('YYYYMMDD')) > parseInt(moment(sharedValues.DateModify).format('YYYYMMDD'))) {
                    total += payments[i].InvoiceSum;
                    // if (payments[i].lessons) {

                    if (!payments[i].Price)
                        payments[i].Price = this.user.Meta.Cost;

                    if (payments[i].lessons)
                        totalLessons += (payments[i].Price * payments[i].lessons);
                    // }

                }
            }

            this.Sherit = total - this.totalExpensesAll - totalLessons;

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
            if (this.Sherit >= this.user.Meta.Cost) {
                this.paidLessons++;
                this.Sherit = this.Sherit - this.user.Meta.Cost;
            }

            this.creditPaidLessons = this.paidLessons + this.commitmentLessons;
            var results = [];

            for (var i in this.lessons) {

                var res = this.setPaid(this.lessons[i]);
                this.lessons[i].paid = res[0];


                if (this.user.Meta.PayType != 'lessonCost') {

                    var monthCurrent = moment().format("YYYYMM");
                    var monthOnly = moment(this.lessons[i].start).format("YYYYMM");

                    if (results.indexOf(monthOnly) == -1) {


                        if (this.lessons[i].paid && monthOnly > monthCurrent)
                            this.monthlyBalance += this.user.Meta.Cost;
                        if (!this.lessons[i].paid && monthOnly <= monthCurrent)
                            this.monthlyBalance -= this.user.Meta.Cost;

                        //else
                        //    this.monthlyBalance-=this.user.Meta.Cost;


                        results.push(monthOnly);
                    }

                }


                // this.lessons[i].lessPrice = res[1];
            }


           

        }

        function _setPaid(lesson) {

            //var IsMach = false;
            var Price = this.user.Meta.Cost;

            for (var i in this.user.Meta.Payments) {

                var month = this.user.Meta.Payments[i].month;
                var untilmonth = this.user.Meta.Payments[i].untilmonth;
                if (this.user.Meta.Payments[i].month
                    && !this.user.Meta.Payments[i].canceled
                    // && moment(this.user.Meta.Payments[i].month).format('YYYYMM') == moment(lesson.start).format('YYYYMM')
                    ) {
                    if (!untilmonth) untilmonth = month;
                    //  var diffMonth = (moment(untilmonth)).diff(moment(month), 'months', true);

                    var diffMonth = (moment(untilmonth).startOf('month')).diff(moment(month).startOf('month'), 'months', true);
                    if (diffMonth == 0) {
                        diffMonth++;
                    } else {
                        if (parseInt(moment(this.user.Meta.Payments[i].Date).format('YYYYMMDD')) < parseInt(moment("20190331").format('YYYYMMDD'))) diffMonth++;
                    }


                    for (var j = 0; j < diffMonth; j++) {
                        if ((moment(month).add(j, 'M')).format('YYYYMM') == moment(lesson.start).format('YYYYMM'))
                            return [true, Price];
                    }
                    //return true;
                }
            }

            if (['attended', 'notAttendedCharge', 'completionReq'].indexOf(lesson.statuses[this.getStatusIndex(lesson)].Status) != -1) {
                this.attendedLessons = this.attendedLessons || 0;
                this.attendedLessons++;
                if (this.creditPaidLessons-- > 0) {
                    return [true, Price];
                }

            }
            return [false, Price];
        }

        function _getStatusIndex(lesson) {
            for (var i in lesson.statuses) {
                if (lesson.statuses[i].StudentId == this.user.Id) {
                    return i;
                }
            }
        }



        function _initPaymentForm() {
            this.farmsService.getFarm(this.user.Farm_Id).then(function (farm) {

                if (farm.Meta === null) return;
                this.farm = farm;
                this.showNewPayment = false;
                this.newPayment = {};
                this.newPayment.api_key = this.farm.Meta.api_key;
                this.newPayment.api_email = this.farm.Meta.api_email;
                this.newPayment.isMasKabala = true;
                this.newPayment.Date = new Date();
                this.newPayment.Price = this.user.Meta.Cost;
                this.newPayment.IsAshrai = this.farm.Meta.IsAshrai;
                this.newPayment.IsToken = this.farm.Meta.IsToken;
                this.newPayment.Price = this.user.Meta.Cost;
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
                    self.newPayment.InvoiceDetails += ((this.farm.Meta.IsRekivaTipulitInKabala && self.user.Meta.Style == "treatment") ? "רכיבה טיפולית - " : "") + self.newPayment.lessons + ' שיעורים ' + ((this.farm.Meta.IsDateInKabala) ? ("," + this.getLessonsDateNoPaid(self.newPayment.lessons)) : "");

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

                        self.newPayment.InvoiceSum += self.user.Meta.Cost * ((diffMonth == 0) ? 1 : diffMonth);
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

                var TempSum = this.Sherit  + self.newPayment.InvoiceSum - TempExpenses; //- this.totalExpense;
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


        //function _countExpenses() {
        //    var total = 0;
        //    for (var i in this.user.Meta.Expenses) {
        //        if (!this.user.Meta.Expenses[i].Paid)
        //            total += this.user.Meta.Expenses[i].Price;
        //    }


        //    this.totalExpenses = total;
        //}

        function _hide(event) {

            if ($(event.target).is('.event-background') || $(event.target).is('.btnClose')) {
                this.studentid = null;
            }
        }



        function _studentDataById(studentId) {
            for (var i in this.students) {
                if (this.students[i].Id == studentId) {
                    return this.students[i];
                }
            }
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


            //  this.newPayment.payment_type = 'ashrai'; Last = {"secretTransactionId": "50bb8100-4a37-4002-9eab-b10a96e12b99"}
        }


        function _addPayment() {
            this.disablBtn = true;
            var UserTypePaid = this.user.Meta.PayType;
            this.newPayment.customer_name = this.user.FirstName + ' ' + this.user.LastName;
            this.newPayment.customer_email = this.user.Meta.AnotherEmail;
            this.newPayment.customer_address = this.user.Meta.Address;
            this.newPayment.comment =
                'מס לקוח: ' + (this.user.Meta.ClientNumber || "") +
                ', ת.ז.: ' + (this.user.Meta.IdNumber || "");



            var newPayment = angular.copy(this.newPayment);
            newPayment.cc_type_name = this.getccTypeName(this.newPayment.cc_type);




            if (newPayment.isMasKabala || newPayment.isKabala || newPayment.isKabalaTroma) {

                $http.post(sharedValues.apiUrl + 'invoices/sendInvoice/', newPayment).then(function (response) {

                    if (this.newPayment.payment_type == 'ashrai') {

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
                            var payWind = window.open(response.data.url, "Upload Chapter content", "width=600,height=600" + ",top=" + top + ",left=" + left);

                            var timer = setInterval(function () {
                                if (payWind.closed) {
                                    $scope.$ctrl.payWin = false;
                                    clearInterval(timer);

                                    $scope.$ctrl.winPayClose();
                                    // this.winPayClose();

                                }
                            }, 1000);


                        }
                        return;

                    }

                    if (response.data.errMsg) {
                        alert("תקלה בהפקת חשבוניות!");
                        return;
                    }


                    newPayment.InvoiceNum = response.data.doc_number;
                    newPayment.InvoicePdf = response.data.pdf_link;

                    this.user.Meta.Expenses.map(function (expense) {
                        if (expense.Checked && !expense.Paid) {
                            expense.Paid = newPayment.InvoiceNum;

                        }
                    });

                    this.user.Meta.Payments = this.user.Meta.Payments || [];
                    this.user.Meta.Payments.push(newPayment);
                    this.initPaymentForm();
                    this.countAllCredits(true);
                   // this.submit();

                }.bind(this));
            } else {

                this.user.Meta.Payments = this.user.Meta.Payments || [];
                //  newPayment.ExpenseSum = 0;

                this.user.Meta.Expenses.map(function (expense) {
                    if (expense.Checked && !expense.Paid) {
                        expense.Paid = newPayment.InvoiceNum;

                    }
                });

                this.user.Meta.Payments.push(newPayment);



                this.initPaymentForm();
                this.countAllCredits(true);
               // this.submit();
            }
        }

        function _submit() {

            //this.studentId = null;

            //this.user.Role = 'student';
            //this.user.Email = this.user.Meta.IdNumber;
            //this.user.Password = this.user.Meta.IdNumber;


            //this.user.AccountStatus = this.totalExpenses * -1 + this.unpaidLessons + this.monthlyBalance;
          
          
            //var totalFromExpenses = 0;
            //var totalFromExpensesMinus = 0;

            //usersService.updateUser(this.user).then(function (user) {

            //    this.user = user;
            //    this.closeCallback("", "");
            //    // this.createNotifications();
            //    // this.initStudent();
            //    alert('נשמר בהצלחה');

               



            //}.bind(this));
            //this.studentid = null;
        }
    }








})();