(function ($) {

    var app = angular.module('app');

    app.component('commonOperations', {
        controller: CommonOperations,
        template: '<div></div>'
    });

    function CommonOperations($scope, horsesService, usersService) {
        $scope.$on('commonOperations', function () {
            // list of operations
        });
    }

})(jQuery);