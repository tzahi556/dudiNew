(function () {
    var app = angular.module('app');

    app.component('farmmanager', {
        templateUrl: 'app/farms/farmmanager.template.html',
        controller: FarmmanagerController,
        bindings: {
            farmmanager: '<',
            farminstructors: '<',

        }
    });
    app.filter('dateRangeClalit', function () {

        return dateRangeFilter;

        function dateRangeFilter(items, from, to) {
            var results = [];
            var fromDate = moment(from).format('YYYYMMDD');
            var toDate = moment(to).format('YYYYMMDD');
            for (var i in items) {
                var startDate = moment(items[i].HalivaDate).format('YYYYMMDD');

                if (startDate >= fromDate && startDate <= toDate) {
                    results.push(items[i]);
                }
            }
            return results;
        }
    });
    function FarmmanagerController($scope, farmsService, $state) {


        var self = this;
        this.farmsService = farmsService;
        this.SaveData = _SaveData.bind(this);
        this.delete = _delete.bind(this);

        this.addNewTag = _addNewTag.bind(this);
        this.removeTags = _removeTags.bind(this);
        this.initNewTags = _initNewTags.bind(this);

        this.role = localStorage.getItem('currentRole');
        function init() {
            //  alert();
            //   alert(self.farminstructors.length);

            //self.farm.Meta = self.farm.Meta || {};
            //self.farm.Meta.StartDate = self.farm.Meta.StartDate ? new Date(self.farm.Meta.StartDate) : null;
            //self.farm.Meta.EndDate = self.farm.Meta.EndDate ? new Date(self.farm.Meta.EndDate) : null;
            //self.farm.IsHiyuvInHashlama = (self.farm.IsHiyuvInHashlama) ? self.farm.IsHiyuvInHashlama.toString() : "0";

            //self.initNewTags();

        }

        init();


        this.dateFromClalit = moment().add(-5, 'months').toDate();
        this.dateToClalit = moment().add(1, 'months').toDate();

        function _SaveData(type) {

            if (type == 1) {

                this.farmsService.setMangerInstructorFarm(this.farminstructors).then(function (farm) {

                    alert('נשמר בהצלחה');
                }.bind(this));


            }



            if (type == 2) {
              
                this.farmsService.setMangerFarm(this.farmmanager).then(function (farm) {

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



        function _initNewTags() {

            self.farm.Meta.farmTags = self.farm.Meta.farmTags || [];
            self.newfarmTag = null;

            //if ($scope.newHorseForm != null) {
            //    $scope.newHorseForm.$setPristine();
            //}
        }

        function _addNewTag() {


            //for (var i in this.userhorses) {
            //    if (this.userhorses[i].HorseId == this.newHorse.Id) {
            //        return false;
            //    }
            //}

            self.farm.Meta.farmTags.push({ tag_name: self.newfarmTag.tag_name, tag_id: self.newfarmTag.tag_id });
            //self.newFarmTags.tag_name = "";
            //self.newFarmTags.tag_id = "";
            self.initNewTags();
        }

        function _removeTags(tag) {
            var farmTags = self.farm.Meta.farmTags;
            for (var i in farmTags) {
                if (farmTags[i].tag_id == tag.tag_id && farmTags[i].tag_name == tag.tag_name) {
                    farmTags.splice(i, 1);
                }
            }
        }
    }

})();