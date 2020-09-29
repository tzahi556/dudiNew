(function () {
    var app = angular.module('app');

    app.component('horses', {
        templateUrl: 'app/horses/horses.template.html',
        controller: HorsesController,
        bindings: {
            horses: '<',
            horsevetrinars: '<',
            farms: '<',
        }
    });

    function HorsesController(horsesService) {

        this.horsesService = horsesService;
        this.getTotal = _getTotal.bind(this);
        this.openModal = _openModal.bind(this);
        this.role = localStorage.getItem('currentRole');
        this.getFarmName = _getFarmName.bind(this);
        this.getFilerArray = _getFilerArray.bind(this);

        this.action = _action.bind(this);

    }




    function _action(type, horsevetrinar) {

        //הסרה
        if (type == 1) {
            for (var i in this.horsevetrinars) {
                if (this.horsevetrinars[i] == horsevetrinar) {
                    this.horsevetrinars.splice(i, 1);
                }
            }

        }

        // הוספה של חווה
        if (type == 2) {

            var newhorsevetrinars = { Id: 0, FarmIdAdd: this.newhorsevetrinars.FarmId}
            this.horsevetrinars.push(newhorsevetrinars);
            this.newhorsevetrinars.FarmId = "";

           

        }


        // שמירה
        if (type == 3) {

            var thisCtrl = this;
            this.horsesService.getHorseVetrinars(this.horsevetrinars).then(function (res) {

                thisCtrl.horsesService.getHorses().then(function (res) {
                    thisCtrl.horses = res;
                }.bind(this));
               // .horses = thisCtrl.horsesService.getHorses();


            }.bind(this));
        }

      
    }

    function _getFilerArray() {

        var res = [];

        for (var i in this.farms) {

            if (this.horsevetrinars.filter(x => x.FarmIdAdd == this.farms[i].Id).length > 0) continue;

            res.push(this.farms[i]);

            //for (var x in this.horsevetrinars) {

            //    if (this.farms[i].Id == this.horsevetrinars[x].FarmIdAdd) continue;

            //}


            // if (this.farms[i].Id == FarmId) return this.farms[i].Name;
        }

        return res;


    }

    function _getFarmName(FarmId) {

        for (var i in this.farms) {

            if (this.farms[i].Id == FarmId) return this.farms[i].Name;
        }


    }

    function _openModal() {


        $("#modalHavot").modal("show");

    }

    function _getTotal(type) {
        if (type == 0)
            return this.horses.filter(x => x.HorseLocation != 'outer' && x.Active != "notActive").length;
        else if (type == 1)
            return this.horses.filter(x => x.HorseLocation != 'outer' && x.Active == "notActive").length;
        else
            return this.horses.filter(x => x.HorseLocation == 'outer').length;

    }




})();