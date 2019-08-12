(function () {
    var app = angular.module('app');

    app.component('farms', {
        templateUrl: 'app/farms/farms.template.html',
        controller: FarmsController,
        bindings: {
            farms: '<'
        }
    });

    function FarmsController() {
       
    }

})();