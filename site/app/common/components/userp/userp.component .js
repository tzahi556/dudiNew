(function () {
  
    var app = angular.module('app');

    app.component('userp', {
        templateUrl: 'app/common/components/userp/userp.template.html',///closeToken.html',
        controller: UserpayController,
        bindings: {
            users: '<'
        }
    });

    function UserpayController(usersService, lessonsService, $scope, sharedValues, $http) {
      
        var self = this;
        this.usersService = usersService;
        debugger


        var UserId = getUrlParameter("aaa");
        this.usersService.getUser(UserId).then(function (user) {
           
            this.user = user;
            this.user.cc_token = getUrlParameter("cc_token");
            this.user.cc_type_id = getUrlParameter("cc_type_id");
            this.user.cc_type_name = getUrlParameter("cc_type_name");
            this.user.cc_4_digits = getUrlParameter("cc_4_digits");
            this.user.cc_payer_name = getUrlParameter("cc_payer_name");
            this.user.cc_payer_id = getUrlParameter("cc_payer_id");
            this.user.cc_expire_month = getUrlParameter("cc_expire_month");
            this.user.cc_expire_year = getUrlParameter("cc_expire_year");


            this.usersService.updateUser(this.user).then(function (user) {
              
                window.close();
            



            }.bind(this));




        }.bind(this));

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