(function () {
    var app = angular.module('app');

    app.component('horses', {
        templateUrl: 'app/horses/horses.template.html',
        controller: HorsesController,
        bindings: {
            horses: '<'
        }
    });

    function HorsesController() {

    }

})();