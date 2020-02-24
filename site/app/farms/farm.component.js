(function () {
    var app = angular.module('app');

    app.component('farm', {
        templateUrl: 'app/farms/farm.template.html',
        controller: FarmController,
        bindings: {
            farm: '<'
        }
    });

    function FarmController($scope, farmsService, $state) {

        var self = this;
        this.submit = _submit.bind(this);
        this.delete = _delete.bind(this);

        function init() {
            self.farm.Meta = self.farm.Meta || {};
            self.farm.Meta.StartDate = self.farm.Meta.StartDate ? new Date(self.farm.Meta.StartDate) : null;
            self.farm.Meta.EndDate = self.farm.Meta.EndDate ? new Date(self.farm.Meta.EndDate) : null;
            self.farm.IsHiyuvInHashlama = (self.farm.IsHiyuvInHashlama) ? self.farm.IsHiyuvInHashlama.toString() : "0";

        }

        init();

        function _submit() {
            if ($scope.farmForm.$valid) {
                farmsService.updateFarm(this.farm).then(function (farm) {
                    this.farm = farm;
                    init();
                    alert('נשמר בהצלחה');
                }.bind(this));
            }
        }

        function _delete() {
            if (confirm('האם למחוק את החווה?')) {
                farmsService.deleteFarm(this.farm.Id).then(function () {
                    $state.go('farms');
                });
            }
        }
    }

})();