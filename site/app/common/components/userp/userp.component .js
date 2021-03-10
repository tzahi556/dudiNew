(function () {

    var app = angular.module('app');

    app.component('userp', {
        templateUrl: 'app/common/components/userp/userp.template.html',///closeToken.html',
        controller: UserpayController,
        bindings: {
            users: '<'
        }
    });

    //http://localhost:51517/#/userp?aaaa=1&aaa=46165&bbb=11393478&ccc=333
    function UserpayController(usersService, lessonsService, farmsService, $scope, sharedValues, $http) {

        var self = this;
        this.usersService = usersService;
        this.lessonsService = lessonsService;
        this.farmsService = farmsService;
        this.addPayment = _addPayment.bind(this);

        var UserId = getUrlParameter("aaa");
        var LessonId = getUrlParameter("bbb");
        var Sum = getUrlParameter("ccc");

        this.payWin = false;


        this.TiyulCost = "";
        this.TiyulCounts = "";
        this.TiyulTel = "";
        this.TiyulMail = "";
        this.TiyulMazmin = "";
        this.TiyulCostSend = "";
        this.IsOk = false;

        this.lessonsService.updateTiyulLists(LessonId, null).then(function (tiyuls) {

           
            this.tiyullists = tiyuls;


            this.TiyulCost = tiyuls[0].TiyulCost;
            this.TiyulCounts = tiyuls[0].TiyulCounts;
            this.TiyulTel = tiyuls[0].TiyulTel;
            this.TiyulMail = tiyuls[0].TiyulMail;
            this.TiyulMazmin = tiyuls[0].TiyulMazmin;
            this.TiyulCostSend = tiyuls[0].TiyulCostSend;

            this.usersService.getUser(UserId).then(function (user) {
                this.user = user;
                this.TiyulType = user.FirstName + " " + user.LastName;

                this.farmsService.getFarm(user.Farm_Id).then(function (farm) {


                    if (farm.Meta === null) return;
                    this.farm = farm;
                    this.newPayment = {};
                   
                    this.newPayment.doc_type = "MasKabala";
                    this.newPayment.isMasKabala = true;
                    this.newPayment.payment_type = "ashrai";

                    this.newPayment.InvoiceSumFakeZikuy = null;
                    this.newPayment.api_key = this.farm.Meta.api_key;
                    this.newPayment.ua_uuid = this.farm.Meta.ua_uuid;
                    this.newPayment.api_email = this.farm.Meta.api_email;
                    this.newPayment.InvoiceDetailsArray = [];
                    this.newPayment.Date = new Date();
                    this.newPayment.Price = this.user.Cost;
                    this.newPayment.IsAshrai = this.farm.Meta.IsAshrai;
                    this.newPayment.IsToken = this.farm.Meta.IsToken;


                }.bind(this));


            }.bind(this));

        }.bind(this));

        function _addPayment() {

            this.disablBtn = true;

            var UserTypePaid = this.user.PayType;
            this.newPayment.customer_name = this.TiyulMazmin;
            this.newPayment.customer_email = this.TiyulMail;
            this.newPayment.customer_address = "";
            this.newPayment.UserId = this.user.Id;



            
            this.newPayment.InvoiceSum = this.TiyulCostSend;
            this.newPayment.InvoiceDetails = " תשלום עבור " + this.TiyulType + " - " + this.TiyulMazmin;
          


            var newPayment = angular.copy(this.newPayment);





            $http.post(sharedValues.apiUrl + 'invoices/sendInvoice/', newPayment).then(function (response) {


                if (response.data == "-1") {
                    alert('לא ניתן להנפיק מסמך , תעודת זהות קיימת במערכת');
                    return;
                }
                if (response.data == "-2") {
                    alert('לא ניתן להזין זיכוי על חשבוניות מסוג שונה');
                    return;
                }




                if (newPayment.payment_type == 'ashrai') {

                    if (response.data.errMsg) {
                        alert("תקלה בסליקת האשראי!");
                        return;
                    }

                    // מאחר וזה פוסט אני מעדכן את השדות שלא יאבדו לי
                    //this.newPayment.InvoiceSum = newPayment.InvoiceSum;
                    //this.newPayment.InvoiceDetails = newPayment.InvoiceDetails;

                    //this.newPayment.InvoiceDetailsArray = newPayment.InvoiceDetailsArray;


                    this.ksys_token = response.data.secretTransactionId;
                    var top = 0;
                    top = top > 0 ? top / 2 : 0;
                    var left = window.screen.width - 600;
                    left = left > 0 ? left / 2 : 0;
                    if (response.data.url && !this.payWin) {
                        this.payWin = true;
                        var payWind = window.open(response.data.url, "Upload Chapter content", "width=600,height=600" + ",top=" + top + ",left=" + left);
                        //response.data.url אמת


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



                if (response.data.errMsg) {

                    alert("תקלה בהפקת חשבוניות!");
                    return;
                }


               

                this.newPayment.InvoiceNum = response.data.doc_number;
                this.newPayment.InvoicePdf = response.data.pdf_link;
                this.newPayment.doc_uuid = response.data.doc_uuid;

                this.submit();





            }.bind(this));





        }

        this.winPayClose = function () {


            if (this.newPayment.payment_type == 'ashrai') {
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
                        this.newPayment.isSlika = true;
                        this.newPayment.lessons = 1;


              
                       


                        this.addPayment();

                    } else {

                        // alert("תקלה בחיוב כרטיס אשראי");
                        this.newPayment.payment_type = 'ashrai';
                    }



                }.bind(this));
            }

          

            this.disablBtn = false;
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

        this.submit = function () {


            this.payments = [];
            this.payments.push(this.newPayment);



            this.usersService.updateUserMultiTables(this.user, this.payments, [], [], [], [], [], [], [], []).then(function (user) {

                //if (user.FirstName == "Error") {
                //    alert('שגיאה בעת עדכון תלמיד , בדוק אם קיימת תעודת זהות במערכת');
                //    //user.FirstName = "";
                //    return;
                //}
              //  window.open(this.newPayment.InvoicePdf, "Upload Chapter content", "width=600,height=600" + ",top=200,left=200");
                this.IsOk = true;



                //alert('נשמר בהצלחה');

            }.bind(this));

        }



    }


    var getUrlParameter = function getUrlParameter(sParam) {

        var sPageURL = window.location.href,
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

})();