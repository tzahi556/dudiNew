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
        //this.countAllCredits = _countAllCredits.bind(this);
        this.countCommitmentLessons = _countCommitmentLessons.bind(this);
        this.countPaidLessons = _countPaidLessons.bind(this);
        //this.countPaidMonths = _countPaidMonths.bind(this);
        //this.countExpenses = _countExpenses.bind(this);
        this.initLessons = _initLessons.bind(this);
        this.setPaid = _setPaid.bind(this);
        this.getStatusIndex = _getStatusIndex.bind(this);
        this.hide = _hide.bind(this);
        this.countTotal = _countTotal.bind(this);
        //    this.countSherit = _countSherit.bind(this);
        this.onShow = _onShow.bind(this);
        // this.getIfExpensiveInMas = _getIfExpensiveInMas.bind(this);
        this.disablBtn = false;

        this.IsHiyuvInHashlama = 0;


        this.getLessonsDateNoPaid = _getLessonsDateNoPaid.bind(this);
        this.scope.$on('pay.show', this.onShow);

        function _onShow(event, selectedStudent, selectedPayValue) {

          
            //  this.paySum = selectedPayValue;
            this.disablBtn = false;
            this.totalExpenses = 0;


           
          
            this.unpaidLessons = selectedPayValue;
          
            if (this.unpaidLessons > 0) {

                this.colorForTotal = "blue";
            } else {
                this.colorForTotal = "red";
            }

            this.monthlyBalance = 0;
            this.payWin = false;

           

         
          
            // alert(this.studentDataById(80).FirstName);


            this.usersService.getUser(selectedStudent).then(function (user) {

                this.user = user;
               // this.expenses = this.usersService.getUserExpensesByUserId(selectedStudent);
                this.usersService.getUserExpensesByUserId(selectedStudent).then(function (exe) {
                    this.expenses = exe;
                }.bind(this));

                this.usersService.getPaymentsByUserId(selectedStudent).then(function (pm) {
                    this.payments = pm;
                }.bind(this));

                this.initPaymentForm();


            }.bind(this));

            this.lessonsService.getLessons(selectedStudent).then(function (res) {

                this.lessons = res;
                this.countPaidLessons();
                this.usersService.getUserCommitmentsByUserId(selectedStudent).then(function (resCommit) {
                    this.commitments = resCommit;
                    this.countCommitmentLessons();
                    this.initLessons();
                }.bind(this));
                
            }.bind(this));



          





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

        function _initLessons() {

          

            this.lessons = this.lessons.sort(function (a, b) {
                if (a.start > b.start)
                    return 1;
                if (a.start < b.start)
                    return -1;
                return 0;
            });



            this.creditPaidLessons = this.paidLessons; + this.commitmentLessons;

            this.creditPaidMonth = this.paidMonths;

            this.results = [];
            this.newPrice = 0;
            for (var i in this.lessons) {


                // שיעור השלמה
                if (this.lessons[i].statuses[0].IsComplete == "4") {

                    this.lessons[i].statuses[0].Status = "attended";
                }
                if (this.lessons[i].statuses[0].IsComplete == "3") {
                    this.lessons[i].statuses[0].Status = "notAttended";
                }


                if (this.lessons[i].statuses[0].IsComplete < 6) {


                    var res = this.setPaid(this.lessons[i]);
                    this.lessons[i].paid = res[0];
                    //  this.lessons[i].disable = (this.lessons[i].lessonpaytype == 1) ? false : true;
                    this.lessons[i].lessprice = eval(res[1]);

                    // אם השיעור התלמיד הגיע
                    if (res[2]) {

                        this.newPrice += eval(res[1]);

                    }



                }
            }
        }

        function _getStatusIndex(lesson) {
            for (var i in lesson.statuses) {
                if (lesson.statuses[i].StudentId == this.user.Id) {
                    return i;
                }
            }
        }

        function _setPaid(lesson) {

            var Price = this.user.Cost;

            //for (var i in this.payments) {
            //    var month = this.payments[i].month;
            //    var untilmonth = this.payments[i].untilmonth;
            //    if (this.payments[i].month
            //        && !this.payments[i].canceled
            //        ) {
            //        if (!untilmonth) untilmonth = month;

            //        var diffMonth = (moment(untilmonth).startOf('month')).diff(moment(month).startOf('month'), 'months', true);
            //        if (diffMonth == 0) {
            //            diffMonth++;
            //        }

            //        // ביטלתי
            //        //else {
            //        //    if (parseInt(moment(this.payments[i].Date).format('YYYYMMDD')) < parseInt(moment("20190331").format('YYYYMMDD')))
            //        //        diffMonth++;
            //        //}

            //        for (var j = 0; j < diffMonth; j++) {
            //            if ((moment(month).add(j, 'M')).format('YYYYMM') == moment(lesson.start).format('YYYYMM')) {

            //                return [true, (lesson.lessprice) ? lesson.lessprice : Price, false, true];

            //            }

            //        }

            //    }

            //    //   return [false, Price];
            //}


            //completionReq

            var studentsStatus = lesson.statuses[this.getStatusIndex(lesson)].Status;  //|| (['completion'].indexOf(studentsStatus) != -1 && lesson.IsComplete==4)
            if (['attended', 'notAttendedCharge'].indexOf(studentsStatus) != -1) {

                this.attendedLessons = this.attendedLessons || 0;
                this.attendedLessons++;

                if (lesson.lessonpaytype == 1) {


                    if (this.creditPaidLessons-- > 0) {

                        return [true, (lesson.lessprice || lesson.lessprice == 0) ? lesson.lessprice : Price, true];
                    }
                    else {
                        return [false, (lesson.lessprice || lesson.lessprice == 0) ? lesson.lessprice : Price, true];
                    }


                }
                else {


                    var monthOnly = moment(lesson.start).format("YYYYMM");
                    if (this.results.indexOf(monthOnly) == -1) {
                        this.results.push(monthOnly);

                        if (this.creditPaidMonth-- > 0) {
                            return [true, (lesson.lessprice || lesson.lessprice == 0) ? lesson.lessprice : Price, true];
                        }
                        else {
                            return [false, (lesson.lessprice || lesson.lessprice == 0) ? lesson.lessprice : Price, true];
                        }
                    } else
                        if (this.creditPaidMonth >= 0) {
                            return [true, (lesson.lessprice || lesson.lessprice == 0) ? lesson.lessprice : Price, false];

                        }

                }

            }

            return [false, (lesson.lessprice || lesson.lessprice == 0) ? lesson.lessprice : Price, false];
        }

        function _initPaymentForm() {

            this.farmsService.getFarm(this.user.Farm_Id).then(function (farm) {
               
                if (farm === null) return;
                this.farm = farm;
                this.showNewPayment = false;
                this.newPayment = {};
                this.newPayment.api_key = this.farm.Meta.api_key;
                this.newPayment.ua_uuid = this.farm.Meta.ua_uuid;
                this.newPayment.api_email = this.farm.Meta.api_email;
                if (this.user.Farm_Id != 46) {
                    this.newPayment.isMasKabala = true;
                } else {
                    this.newPayment.isMasKabala = false;
                    this.newPayment.isKabala = true;
                }

                this.IsHiyuvInHashlama = this.farm.IsHiyuvInHashlama;
                this.newPayment.Date = new Date();
                this.newPayment.Price = this.user.Cost;
                this.newPayment.IsAshrai = this.farm.Meta.IsAshrai;
                this.newPayment.IsToken = this.farm.Meta.IsToken;
                this.newPayment.Price = this.user.Cost;
                if ($scope.paymentForm != null) {
                    $scope.paymentForm.$setPristine();
                }
            }.bind(this));




        }

        function _countTotal() {

            self.newPayment.InvoiceSum = 0;
            self.newPayment.InvoiceDetails = '';
            if (self.newPayment.lessons || self.newPayment.month) {

               
                if (self.user.PayType == 'lessonCost') {
                    self.newPayment.InvoiceSum += self.newPayment.lessons * self.user.Cost;
                    // self.newPayment.InvoiceDetails += ((this.farm.Meta.IsRekivaTipulitInKabala && self.user.Style == "treatment") ? "רכיבה טיפולית - " : "") + self.newPayment.lessons + ' שיעורים ' + ((this.farm.Meta.IsDateInKabala) ? ("," + this.getLessonsDateNoPaid(self.newPayment.lessons)) : "");// "," + this.getLessonsDateNoPaid(self.newPayment.lessons);  //only for dev

                    if (this.farm.Meta.IsRekivaTipulitInKabala) {

                        if (self.user.Style == "treatment") {
                            // var styleObject = sharedValues.styles.filter(x => x.id == self.user.Style);   //this.getStyleObjectfromSharedValue
                            self.newPayment.InvoiceDetails += " תשלום עבור " + self.newPayment.lessons + " טיפולי רכיבה "; //((this.farm.Meta.IsDateInKabala) ? ("," + this.getLessonsDateNoPaid(self.newPayment.lessons)) : "");
                        }
                        if (self.user.Style == "phizi") {
                            // var styleObject = sharedValues.styles.filter(x => x.id == self.user.Style);   //this.getStyleObjectfromSharedValue
                            self.newPayment.InvoiceDetails += " תשלום עבור " + self.newPayment.lessons + " טיפולי פיזותרפיה "; //((this.farm.Meta.IsDateInKabala) ? ("," + this.getLessonsDateNoPaid(self.newPayment.lessons)) : "");
                        }

                    }

                    if (this.farm.Meta.IsDateInKabala) {

                        self.newPayment.InvoiceDetails += "," + this.getLessonsDateNoPaid(self.newPayment.lessons);

                    }







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

                        self.newPayment.InvoiceSum += self.user.Cost * ((diffMonth == 0) ? 1 : diffMonth);
                        self.newPayment.InvoiceDetails += 'חודש ' + moment(self.newPayment.month).format('DD/MM/YYYY') + ' עד חודש ' + moment(self.newPayment.untilmonth).format('DD/MM/YYYY');

                    }
                    if (!self.newPayment.untilmonth && self.newPayment.month) {
                        self.newPayment.InvoiceSum += self.user.Cost;
                        self.newPayment.InvoiceDetails += 'חודש ' + moment(self.newPayment.month).format('DD/MM/YYYY');
                    }

                }
            }
            if (this.expenses !== undefined) {
                for (var expense of this.expenses.filter(function (expense) { return expense.Checked && expense.Price != expense.Sum })) {

                    self.newPayment.InvoiceSum += expense.Price + ((!expense.ZikuySum) ? 0 : expense.ZikuySum) - ((!expense.Sum) ? 0 : expense.Sum);
                    self.newPayment.InvoiceDetails += ', ' + expense.Details;
                }
            }

        }

        function _getLessonsDateNoPaid(LessonsPaidCounter) {

            if (!LessonsPaidCounter || LessonsPaidCounter == 0) return "";
            var results = "תאריכי שיעורים- ";
            var TotalPAID = this.creditPaidLessons;

            for (var i in this.lessons) {

                if (!this.lessons[i].paid && this.lessons[i].lessprice && this.lessons[i].lessprice > 0) {

                    var studentsStatusObj = this.lessons[i].statuses[this.getStatusIndex(this.lessons[i])];
                    var CurrentStatus = studentsStatusObj.Status;


                    // במידה ומדובר בחווה שהחיוב הוא רק בעת הדרוש שיעור השלמה 
                    //if ((studentsStatusObj.IsComplete == "4" || studentsStatusObj.IsComplete == "6") && this.IsHiyuvInHashlama == 1) {

                    //    this.lessons[i].paid = false;
                    //}
                    if (CurrentStatus == 'completionReq' || (this.IsHiyuvInHashlama == 1 && (studentsStatusObj.IsComplete == "4" || studentsStatusObj.IsComplete == "6"))) continue;
                    var IsPast = parseInt(moment(this.lessons[i].start).format('YYYYMMDD')) < parseInt(moment().format('YYYYMMDD'));


                    if (
                        LessonsPaidCounter > 0 &&
                        (!IsPast || ['attended', 'notAttendedCharge', 'completionReqCharge'].indexOf(CurrentStatus) != -1)

                    ) {
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

        //איבנט בעת שינוי סכום חשבונית מאתחל את כמות השיעורים בהתאם לסכום
        function _countTotalByInvoiceSum() {

            self.newPayment.InvoiceDetails = "";
            var TempExpenses = 0;
            if (this.user.Expenses !== undefined) {
                for (var expense of this.user.Expenses.filter(function (expense) { return !expense.Paid && expense.Checked })) {
                    TempExpenses += expense.Price;
                }
            }
            self.newPayment.lessons = 0;

            if (self.user.PayType == 'lessonCost') {

                var TempSum = this.Sherit + self.newPayment.InvoiceSum - TempExpenses; //- this.totalExpense;
                ////מקרה שקסדה עולה 120 שח ושילמתי 80 שיעדכן שיש לי 80 ש"ח עודף
                if (TempExpenses > 0 && self.newPayment.InvoiceSum < TempExpenses) {
                    self.newPayment.lessons += 0;
                    return;
                }

                if (TempSum < 0) return;

                //הסכום גדול קח את ההפרש לעודף
                var DivisionRemainder = TempSum % self.user.Cost;
                self.newPayment.lessons += (TempSum - DivisionRemainder) / self.user.Cost;

            }

            if (self.newPayment.lessons)
                self.newPayment.InvoiceDetails += ((this.farm.IsRekivaTipulitInKabala && self.user.Style == "treatment") ? "רכיבה טיפולית - " : "") + self.newPayment.lessons + ' שיעורים ' + ((this.farm.IsDateInKabala) ? ("," + this.getLessonsDateNoPaid(self.newPayment.lessons)) : "");
            if (this.user.Expenses !== undefined) {
                for (var expense of this.user.Expenses.filter(function (expense) { return !expense.Paid && expense.Checked })) {

                //self.newPayment.InvoiceSum += expense.Price;
                    self.newPayment.InvoiceDetails += ', ' + expense.Details + ', ';
                }
            }
        }

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

            var UserTypePaid = this.user.PayType;
            this.newPayment.customer_name = (this.user.Organzion ? (this.user.Organzion + "-") : "") + this.user.FirstName + ' ' + this.user.LastName;
            this.newPayment.customer_email = this.user.AnotherEmail;
            this.newPayment.customer_address = this.user.Address;
            this.newPayment.UserId = this.user.Id;

            // הגדרות בשביל מס' לקוח
            this.newPayment.customer_crn = this.user.IdNumber;
            this.newPayment.c_accounting_num = this.user.ClientNumber;

            // הוספת טאג 
            this.newPayment.tag_id = this.tag_id;


            this.newPayment.isZikuy = false;


            this.newPayment.comment =
                'מס לקוח: ' + (this.user.ClientNumber || "") +
                ', ת.ז.: ' + (this.user.IdNumber || "");


            var newPayment = angular.copy(this.newPayment);
            newPayment.cc_type_name = this.getccTypeName(this.newPayment.cc_type);
            newPayment.doc_type = "MasKabala";// this.getRealDocType(newPayment);//(newPayment.isMasKabala) ? "MasKabala" : ((newPayment.isKabala || newPayment.isKabalaTroma) ? "Kabala" : "");

            var TempSum = newPayment.InvoiceSum;

           



            if (newPayment.isMasKabala) {


                $http.post(sharedValues.apiUrl + 'invoices/sendInvoice/', newPayment).then(function (response) {


                    if (response.data == "-1") {
                        alert('לא ניתן להנפיק מסמך , תעודת זהות קיימת במערכת');
                        return;
                    }
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

                    //if (this.newPayment.payment_type == 'tokenBuy') {

                    //    if (!response.data.success) {

                    //        alert("תקלה בחיוב הטוקן!");
                    //        return;
                    //    }

                    //    this.newPayment.payment_type = 'token';
                    //}

                    //if (response.data.errMsg) {

                    //    alert("תקלה בהפקת חשבוניות!");
                    //    return;
                    //}




                    newPayment.InvoiceNum = response.data.doc_number;
                    newPayment.InvoicePdf = response.data.pdf_link;
                    newPayment.doc_uuid = response.data.doc_uuid;




                    this.expenses.map(function (expense) {
                        if (expense.Checked && expense.Price != expense.Sum) { //&& !expense.Paid !צחי הוריד בינתיים

                            expense.Paid = newPayment.InvoiceNum;
                            expense.Sum = (!expense.Sum) ? 0 : expense.Sum;

                            var Diff = expense.Price - expense.Sum;

                            if (TempSum >= Diff) {

                                expense.Sum = expense.Sum + Diff;
                                TempSum = TempSum - Diff;
                            } else {
                                expense.Sum = expense.Sum + TempSum;
                                TempSum = 0;

                            }

                        }
                    });
                    this.payments = this.payments || [];
                   // if (newPayment.isZikuy) newPayment.InvoiceSum = newPayment.InvoiceSum * -1;
                    this.payments.push(newPayment);
                   // this.createNewPayment(newPayment);
                    this.submit();

                    this.initPaymentForm();
                    this.countAllCredits();
                }.bind(this));
            }

            else {

                this.payments = this.payments || [];
                this.expenses.map(function (expense) {
                    if (expense.Checked && expense.Price != expense.Sum) { //&& !expense.Paid !צחי הוריד בינתיים
                        expense.Paid = newPayment.InvoiceNum;
                        expense.Sum = (!expense.Sum) ? 0 : expense.Sum;
                        var Diff = expense.Price - expense.Sum;

                        if (TempSum >= Diff) {

                            expense.Sum = expense.Sum + Diff;
                            TempSum = TempSum - Diff;
                        } else {
                            expense.Sum = expense.Sum + TempSum;
                            TempSum = 0;

                        }

                    }
                });
                if (newPayment.isZikuy) newPayment.InvoiceSum = newPayment.InvoiceSum * -1;
                this.payments.push(newPayment);
               // this.createNewPayment(newPayment);
                this.submit();

                this.initPaymentForm();
                this.countAllCredits();
            }


        }

        function _submit() {
            this.studentid = null;
         
            usersService.updateUserMultiTables(this.user, this.payments, [], [], this.expenses,[],[],[]).then(function (user) {
              
                this.user = user;
               
                this.closeCallback("", "");
                alert('נשמר בהצלחה');
            }.bind(this));

          
          
        }
    }








})();