(function () {
    
    var app = angular.module('app');

    app.component('login', {
        templateUrl: 'app/login/login.template.html',
        controller: LoginController,
        bindings: {
            returnUrl: '<'
        }
    });

    function LoginController(authenticationService, $state) {
        this.login = _login;

        this.userplink = false;

        if (location.href.indexOf("userp") != -1) {
            this.email = "tzahi556@gmail.com";
            this.password = "123";
            this.userplink = true;
            this.login();

        }

       
        function _login() {


           
            authenticationService.login({ userName: this.email, password: this.password }).then(function (res) {
               
                if (location.href.indexOf("userp") != -1) {

                    

                    var userplink = location.href.substring(location.href.indexOf("userp"));
                    location.href = '#/' + userplink;

                }
                else {  
                    
                    location.href = './';
                }
            },
            function (res) {
                alert(res.error_description);
            });
        }
    }

})();