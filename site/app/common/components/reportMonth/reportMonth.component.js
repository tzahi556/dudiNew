(function () {

    var app = angular.module('app');

    app.component('reportmonth', {
        templateUrl: 'app/common/components/reportMonth/reportMonth.template.html',
        controller: ReportmonthController,
        bindings: {
            studentid: '='
         
        }
    });

    function ReportmonthController($scope, lessonsService, sharedValues, usersService) {
        this.usersService = usersService;
        this.scope = $scope;
     
        this.onShow = _onShow.bind(this);
        this.close = _close.bind(this);
      
        this.hide = _hide.bind(this);
    
        this.printReport = _printReport.bind(this);
        this.scope.$on('reportMonth.show', this.onShow);
    }


   

    function _hide(event) {
        if ($(event.target).is('.event-background')) {
          
            this.studentid = null;

        }
    }

    function _onShow(event, monthlyReportData,userName,userTaz,farmName,instructorName) {


        this.userName = userName;
        this.userTaz = userTaz;
        this.farmName = farmName;
        this.instructorName = instructorName;
        this.monthlyReportData = monthlyReportData;
        //   alert(monthlyReportData.length);
      
    }

  
    function _close() {

       
        this.studentid = null;

    }

       function _printReport() {

       
           $("#dvMain button").hide();

           var innerContents = document.getElementById("dvMain").innerHTML;
               var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
               popupWinindow.document.open();
               popupWinindow.document.write('<html><head>'
                   + '<link rel="stylesheet" type="text/css" href="https://www.giddyup.co.il/node_modules/bootstrap-rtl/dist/css/bootstrap-rtl.min.css" />' 
                   + '<link rel="stylesheet" type="text/css" href="https://www.giddyup.co.il/node_modules/bootstrap/dist/css/bootstrap.css" /> '
                   + '<style>th{text-align:right !important }</style> </head > <body onload="window.print()">' + innerContents + '</html>'
               );
               popupWinindow.document.close();
         
           $("#dvMain button").show();
    }


})();