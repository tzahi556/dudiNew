(function () {

    var app = angular.module('app');

    app.filter('filterRoles', function (usersService) {
        return function (users) {
            var returnUsers = [];
            for (var i in users) {
                if (showInUsers(users[i].Role)) {
                    returnUsers.push(users[i]);
                }
            }
            return returnUsers;
        }

        function showInUsers(role) {
            var roles = usersService.roles;
            for (var i in roles) {
                if (roles[i].id == role && roles[i].showInUsers) {
                    return true;
                }
            }
            return false;
        }
    });

    app.component('users', {
        templateUrl: 'app/users/users.template.html',
        controller: UsersController,
        bindings: {
            users: '<',
            farms: '<'
        }
    });

    function UsersController(usersService) {
        this.getFarmName = _getFarmName.bind(this);
        this.roles = usersService.roles;

        function _getFarmName(id) {
            for (var i in this.farms) {
                if (this.farms[i].Id == id) {
                    return this.farms[i].Name;
                }
            }
        }
    }

})();