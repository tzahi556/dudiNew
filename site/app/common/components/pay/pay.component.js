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
        //this.countCommitmentLessons = _countCommitmentLessons.bind(this);
        //this.countPaidLessons = _countPaidLessons.bind(this);
        //this.countPaidMonths = _countPaidMonths.bind(this);
        //this.countExpenses = _countExpenses.bind(this);
        // this.initLessons = _initLessons.bind(this);
        // this.setPaid = _setPaid.bind(this);
        // this.getStatusIndex = _getStatusIndex.bind(this);
        this.hide = _hide.bind(this);
        this.countTotal = _countTotal.bind(this);
        //    this.countSherit = _countSherit.bind(this);
        this.onShow = _onShow.bind(this);
        // this.getIfExpensiveInMas = _getIfExpensiveInMas.bind(this);
        this.disablBtn = false;




        //  this.getLessonsDateNoPaid = _getLessonsDateNoPaid.bind(this);
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



            //this.usersService.getUserExpensesByUserId(selectedStudent).then(function (exe) {

            //    this.expenses = exe;
            //}.bind(this));

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




        }



        function _initPaymentForm() {

            this.farmsService.getFarm(this.user.Farm_Id).then(function (farm) {
               
                if (farm === null) return;
                this.farm = farm;
                this.showNewPayment = false;
                this.newPayment = {};
                this.newPayment.api_key = this.farm.Meta.api_key;
                this.newPayment.api_email = this.farm.Meta.api_email;
                this.newPayment.isMasKabala = true;
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
                    self.newPayment.InvoiceDetails += ((this.farm.IsRekivaTipulitInKabala && self.user.Style == "treatment") ? "רכיבה טיפולית - " : "") + self.newPayment.lessons + ' שיעורים ' + ((this.farm.IsDateInKabala) ? ("," + this.getLessonsDateNoPaid(self.newPayment.lessons)) : "");

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

                        self.newPayment.InvoiceSum += self.user.Cost * ((diffMonth == 0) ? 1 : diffMonth);
                        self.newPayment.InvoiceDetails += 'חודש ' + moment(self.newPayment.month).format('DD/MM/YYYY') + ' עד חודש ' + moment(self.newPayment.untilmonth).format('DD/MM/YYYY');

                    }
                    if (!self.newPayment.untilmonth && self.newPayment.month) {
                        self.newPayment.InvoiceSum += self.user.Cost;
                        self.newPayment.InvoiceDetails += 'חודש ' + moment(self.newPayment.month).format('DD/MM/YYYY');
                    }

                }
            }
            if (self.expenses !== undefined) {
                for (var expense of this.expenses.filter(function (expense) { return !expense.Paid && expense.Checked })) {
                    self.newPayment.InvoiceSum += expense.Price;
                    self.newPayment.InvoiceDetails += ', ' + expense.Details;
                }
            }

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
            this.newPayment.customer_name = this.user.FirstName + ' ' + this.user.LastName;
            this.newPayment.customer_email = this.user.AnotherEmail;
            this.newPayment.customer_address = this.user.Address;
            this.newPayment.comment =
                'מס לקוח: ' + (this.user.ClientNumber || "") +
                ', ת.ז.: ' + (this.user.IdNumber || "");



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

                    this.expenses.map(function (expense) {
                        if (expense.Checked && !expense.Paid) {
                            expense.Paid = newPayment.InvoiceNum;

                        }
                    });


                    this.payments = this.payments || [];
                    this.payments.push(newPayment);
                    this.initPaymentForm();
                    //  this.countAllCredits(true);
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
                // this.countAllCredits(true);
                 this.submit();
            }
        }

        function _submit() {
           
            usersService.updateUserMultiTables(this.user, this.payments, [], [], this.expenses, [], []).then(function (user) {
                this.user = user;
             
                alert('נשמר בהצלחה');
            }.bind(this));

          
            //this.studentId = null;

            //this.user.Role = 'student';
            //this.user.Email = this.user.IdNumber;
            //this.user.Password = this.user.IdNumber;


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