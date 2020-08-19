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

        this.getTotal = _getTotal.bind(this);

    }

    function _getTotal(type) {
        if (type==1)
            return this.horses.filter(x => x.HorseLocation != 'outer').length;
        else
            return this.horses.filter(x => x.HorseLocation == 'outer').length;


    }


    

})();