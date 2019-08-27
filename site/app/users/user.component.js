(function () {

    var app = angular.module('app');

    app.filter('sysAdminOnly', function () {
        return function (roles) {
            var isSysAdmin = localStorage.getItem('currentRole') == "sysAdmin";
            if (isSysAdmin) { return roles; }

            var returnRoles = [];
            for (var i in roles) {
                if (!roles[i].sysAdminOnly) {
                    returnRoles.push(roles[i]);
                }
            }
            return returnRoles;
        }
    });

    app.component('user', {
        templateUrl: 'app/users/user.template.html',
        controller: UserController,
        bindings: {
            user: '<',
            farms: '<'
        }
    });

    function UserController(usersService, $scope, $state) {
        this.scope = $scope;
        this.submit = _submit.bind(this);
        this.roles = usersService.roles;
        this.delete = _delete.bind(this);
        this.selfEdit = angular.fromJson(localStorage.getItem('authorizationData')).userName == this.user.Email;

        this.initUser = function () {
            // set default farm

           
            if (this.farms.length == 1 && this.user.Role != 'sysAdmin') {
                this.user.Farm_Id = this.user.Farm_Id || this.farms[0].Id;
            }
        }.bind(this);
        this.initUser();

        function _submit() {
            if (this.scope.userForm.$valid) {
                usersService.updateUser(this.user).then(function (user) {
                    this.user = user;
                    this.initUser();
                    alert('נשמר בהצלחה');
                }.bind(this));
            }
        }

        function _delete() {
            if (confirm('האם למחוק את המשתמש?')) {
                usersService.deleteUser(this.user.Id).then(function (res) {
                    $state.go('users');
                });
            }
        }
    }

})();