(function () {
    var app = angular.module('app');

    app.filter('surrogateHorse', function () {
        return function (horses, horse) {
            var newHorses = [];
            for (var i in horses) {
                if (horses[i].Id != horse.Id && horses[i].Meta.Gender == 'female') {
                    newHorses.push(horses[i]);
                }
            }
            return newHorses;
        }
    });

    app.component('horse', {
        templateUrl: 'app/horses/horse.template.html',
        controller: HorseController,
        bindings: {
            horse: '<',
            farms: '<',
            horses: '<',

            files: '<',
            hozefiles: '<',
            pundekautfiles: '<',
            treatments: '<',
            vaccinations: '<',
            shoeings: '<',
            tilufings: '<',
            pregnancies: '<',
            pregnanciesstates: '<',
            inseminations: '<',
        }
    });


    function HorseController($scope, horsesService, $state, sharedValues, notificationsService, filesService) {

        var self = this;

        this.submit = _submit.bind(this);
        this.delete = _delete.bind(this);
        this.initNewVaccination = _initNewVaccination.bind(this);
        this.addVaccination = _addVaccination.bind(this);
        this.removeVaccination = _removeVaccination.bind(this);
        this.initNewShoeing = _initNewShoeing.bind(this);
        this.initNewTilufing = _initNewTilufing.bind(this);
        this.addShoeing = _addShoeing.bind(this);
        this.addTiluf = _addTiluf.bind(this);
        this.removeShoeing = _removeShoeing.bind(this);
        this.removeTiluf = _removeTiluf.bind(this);
        this.initNewPregnancy = _initNewPregnancy.bind(this);
        this.addPregnancy = _addPregnancy.bind(this);
        this.removePregnancy = _removePregnancy.bind(this);
        this.initNewPregnancyState = _initNewPregnancyState.bind(this);
        this.addPregnancyState = _addPregnancyState.bind(this);
        this.removePregnancyState = _removePregnancyState.bind(this);
        this.pregnancyStatus = _pregnancyStatus.bind(this);
        this.stopPregnancy = _stopPregnancy.bind(this);
        this.addSurrogatePregnancy = _addSurrogatePregnancy.bind(this);
        this.getStates = _getStates.bind(this);
        this.createNotifications = _createNotifications.bind(this);
        this.getLastVaccination = _getLastVaccination.bind(this);
        this.isFuture = _isFuture.bind(this);
        this.addVaccineNotification = _addVaccineNotification.bind(this);
        this.addShoeingNotification = _addShoeingNotification.bind(this);
        this.addPregnancyNotification = _addPregnancyNotification.bind(this);
        this.addTreatment = _addTreatment.bind(this);
        this.removeTreatment = _removeTreatment.bind(this);
        this.initNewTreatment = _initNewTreatment.bind(this);


        this.addInsemination = _addInsemination.bind(this);
        this.removeInsemination = _removeInsemination.bind(this);
        this.initNewInsemination = _initNewInsemination.bind(this);
        

        this.uploadFile = _uploadFile.bind(this);
        this.uploadFileHoze = _uploadFileHoze.bind(this);
        this.uploadFilePundekaut = _uploadFilePundekaut.bind(this);

        this.uploadFileTreatment = _uploadFileTreatment.bind(this);
        this.uploadFileVaccination = _uploadFileVaccination.bind(this);
        this.uploadFileShoeings = _uploadFileShoeings.bind(this);
        this.uploadFileTilufings = _uploadFileTilufings.bind(this);
    

        this.removeFile = _removeFile.bind(this);
        this.vaccinationsHorse = sharedValues.vaccinations;
        this.uploadsUri = sharedValues.apiUrl + '/uploads/'
        this.scope = $scope;

        //$scope.$on('submit', function (event, args) {
        //    if (confirm('האם לשמור שינוים')) {
        //        this.submit();
        //    }
        //}.bind(this));

        // init

        this.getStatesByFind = _getStatesByFind.bind(this);
        this.getCurrentPreg = _getCurrentPreg.bind(this);

        function _getCurrentPreg() {

           
            var CurrentId = this.pregnancies[this.pregnancies.length-1].Id;
            var ObjArray = this.pregnanciesstates.filter(x => x.HorsePregnanciesId === CurrentId);

            return ObjArray;

          
        }

        

        function _getStatesByFind(id,index) {

            var ObjArray = this.pregnanciesstates.filter(x => x.HorsePregnanciesId === id);

            if (index==0)
                return this.pregnanciesstates.filter(x => x.HorsePregnanciesId === id)[0];

            if (index == -1)
                return this.pregnanciesstates.filter(x => x.HorsePregnanciesId === id)[ObjArray.length - 1];
        }



        this.initHorse = function () {

            //var fff = this.pregnancies || [];
            //alert(fff.length);

            this.horse.Meta = this.horse.Meta || {};
            this.horse.BirthDate = moment(this.horse.BirthDate).startOf('day').toDate();
            this.horse.PensionStartDate = moment(this.horse.PensionStartDate).startOf('day').toDate();

            this.horse.ArrivedDate = moment(this.horse.ArrivedDate).startOf('day').toDate();
            this.horse.OutDate = moment(this.horse.OutDate).startOf('day').toDate();
          
            this.initNewTreatment();
            this.initNewVaccination();
            this.initNewShoeing();
            this.initNewTilufing();

            this.initNewPregnancy();
            this.initNewPregnancyState();

            this.initNewInsemination();

            this.horse.Meta.Active = this.horse.Meta.Active || 'active';

            // set default farm
            if (this.farms.length == 1) {
                this.horse.Farm_Id = this.horse.Farm_Id || this.farms[0].Id;
            }
        }.bind(this);
        this.initHorse();

        function _addTreatment() {
            this.treatments = this.treatments || [];
            this.treatments.push(this.newTreatment);
            this.initNewTreatment();
        }

        function _removeTreatment(treatment) {
            for (var i in this.treatments) {
                if (this.treatments[i] == treatment) {
                    this.treatments.splice(i, 1);
                }
            }
        }

        function _initNewTreatment() {
            this.horse.treatments = this.horse.treatments || [];
            this.newTreatment = {};
            this.newTreatment.Date = new Date();
            this.newTreatment.Name = "";
            this.newTreatment.Cost = "";
            this.newTreatment.Discount = "";
            this.newTreatment.FileName = "";

            if ($scope.treatmentForm != null) {
                $scope.treatmentForm.$setPristine();
            }
        }


        function _initNewInsemination() {
            this.insemination = this.insemination || [];
            this.newInsemination = {};
            this.newInsemination.HalivaDate = new Date();
           
            this.newInsemination.PregnanciesHorseId = "";

            if ($scope.inserForm != null) {
                $scope.inserForm.$setPristine();
            }
        }



        function _addInsemination() {
            this.inseminations = this.inseminations || [];
            this.inseminations.push(this.newInsemination);
            this.initNewInsemination();
        }

        function _removeInsemination(insemination) {
            for (var i in this.inseminations) {
                if (this.inseminations[i] == insemination) {
                    this.inseminations.splice(i, 1);
                }
            }
        }


        function _uploadFileTreatment(file) {

            this.newTreatment.FileName = file;
        }

        function _uploadFileVaccination(file) {

            this.newVaccination.FileName = file;
        }

        function _uploadFileShoeings(file) {

            this.newShoeing.FileName = file;
        }

        function _uploadFileTilufings(file) {

            this.newTiluf.FileName = file;
        }





        function _uploadFile(file) {
           
            this.files = this.files || [];
            if (file) {
                var Obj = { "Id": 0, "HorseId": this.horse.Id, "FileName": file};
                this.files.push(Obj);
              
            }
        }

        function _uploadFileHoze(file) {

            this.hozefiles = this.hozefiles || [];
            if (file) {
                var Obj = { "Id": 0, "HorseId": this.horse.Id, "FileName": file };
                this.hozefiles.push(Obj);

            }
        }

        function _uploadFilePundekaut(file) {

            this.pundekautfiles = this.pundekautfiles || [];
            if (file) {
                var Obj = { "Id": 0, "HorseId": this.horse.Id, "FileName": file };
                this.pundekautfiles.push(Obj);

            }
        }



        function _removeFile(file,type) {
            filesService.delete(file).then(function () {
                if(type==1)
                for (var i in this.files) {
                 
                    if (this.files[i].FileName == file) {
                       
                        this.files.splice(i, 1);
                        break;
                    }
                    }

                if (type == 2)
                    for (var i in this.hozefiles) {

                        if (this.hozefiles[i].FileName == file) {

                            this.hozefiles.splice(i, 1);
                            break;
                        }
                    }

                if (type == 3)
                    for (var i in this.pundekautfiles) {

                        if (this.pundekautfiles[i].FileName == file) {

                            this.pundekautfiles.splice(i, 1);
                            break;
                        }
                    }

               
            }.bind(this));
        }

        function _createNotifications() {
            this.addPregnancyNotification();
            this.addShoeingNotification();
            this.addVaccineNotification('flu', 'חיסון שפעת עבור סוס: ');
            this.addVaccineNotification('nile', 'חיסון קדחת הנילוס עבור סוס: ');
            this.addVaccineNotification('tetanus', 'חיסון טטנוס עבור סוס: ');
            this.addVaccineNotification('rabies', 'חיסון כלבת עבור סוס: ');
            this.addVaccineNotification('herpes', 'חיסון הרפס עבור סוס: ');
            this.addVaccineNotification('worming', 'תילוע עבור סוס: ');
        }

        function _addPregnancyNotification() {
            var horseBirthDate = this.horse.Meta.BirthDate;

            var IsPregnancyStop = false;
            try {
                var pregnancy = this.horse.Meta.Pregnancies[this.horse.Meta.Pregnancies.length - 1];
                IsPregnancyStop = pregnancy.Finished;

            } catch (e) {


            }


            notificationsService.createNotification({
                entityType: 'horse', entityId: this.horse.Id, group: 'pregnancy', farmId: this.horse.Farm_Id,
                text: IsPregnancyStop || angular.isUndefined(this.newPregnancyState.State) || this.horse.Meta.Active == 'notActive' ? null : this.newPregnancyState.State.name + ' עבור סוס: ' + this.horse.Name,
                date: this.newPregnancyState.Date ? moment(this.newPregnancyState.Date).format('YYYY-MM-DD') : null
            });
        }

        function _addShoeingNotification() {

            var horseBirthDate = this.horse.BirthDate;
            var shoeingDate = null;
            var hasLastShoeing = (typeof (this.shoeings) !== "undefined" && this.shoeings.length > 0);
            var first = moment(horseBirthDate).add(sharedValues.shoeing.first, 'days');

            if (hasLastShoeing) {
                this.shoeings = this.shoeings.sort(function (a, b) {
                    if (new Date(a.Date) > new Date(b.Date))
                        return 1;
                    else if (new Date(a.Date) < new Date(b.Date))
                        return -1;
                    else
                        return 0;
                });
                var lastShoeing = this.shoeings[this.shoeings.length - 1];
                shoeingDate = moment(lastShoeing.Date).add(sharedValues.shoeing.interval, 'days');
            }
            else if (this.isFuture(first)) {
                shoeingDate = first;
            }

            var text = shoeingDate ? 'נדרש פרזול עבור סוס: ' + this.horse.Name : null;
            notificationsService.createNotification({
                entityType: 'horse', entityId: this.horse.Id, group: 'shoeing', farmId: this.horse.Farm_Id,
                text: this.horse.Active == 'notActive' ? null : text,
                date: shoeingDate ? shoeingDate.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
            });
        }

        function _addVaccineNotification(vaccineName, notificationMessage) {

            var horseBirthDate = this.horse.BirthDate;
            var horseAge = moment().diff(moment(horseBirthDate), 'years');
            var vaccine = _getVaccination(vaccineName);
            var lastVaccination = this.getLastVaccination(vaccineName);
            var vaccineDate = null;
            var first = vaccine.first ? moment(horseBirthDate).add(vaccine.first, 'days') : null;
            var second = vaccine.second ? first.add(vaccine.second, 'days') : null;
            var interval = vaccine.interval;

            if (vaccineName == 'worming') {
                interval = horseAge >= 2 ? vaccine.interval2 : vaccine.interval1;
            }

            if (this.isFuture(first) && lastVaccination.times < 1) {
                vaccineDate = first;
            } else if (this.isFuture(second) && lastVaccination.times < 2) {
                vaccineDate = second;
            } else if (lastVaccination.times > 0) {
                vaccineDate = moment(lastVaccination.date).add(interval, 'days');
            }

            var text = vaccineDate ? notificationMessage + this.horse.Name : null;
            notificationsService.createNotification({
                entityType: 'horse', entityId: this.horse.Id, group: vaccineName, farmId: this.horse.Farm_Id,
                text: this.horse.Active == 'notActive' ? null : text,
                date: vaccineDate ? vaccineDate.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
            });
        }

        function _isFuture(event) {
            return moment(event).isAfter(moment());
        }

        function _getVaccination(id) {
            for (var i in sharedValues.vaccinations) {
                if (sharedValues.vaccinations[i].id == id) {
                    return sharedValues.vaccinations[i];
                }
            }
        }

        function _getLastVaccination(id) {
            var lastVaccination = {};
            lastVaccination.times = 0;
            this.vaccinations = this.vaccinations || [];
            this.vaccinations.sort(function (a, b) {
                if (new Date(a.Date) > new Date(b.Date))
                    return 1;
                else if (new Date(a.Date) < new Date(b.Date))
                    return -1;
                else
                    return 0;
            });
            for (var i in this.vaccinations) {
                if (this.horse.Meta.Vaccinations[i].Type == id) {
                    lastVaccination.age = Math.ceil(moment.duration(moment(this.horse.Meta.Vaccinations[i].Date).diff(this.horse.Meta.BirthDate)).asDays());
                    lastVaccination.times++;
                    lastVaccination.date = this.vaccinations[i].Date;
                }
            }
            return lastVaccination;
        }

        function _getStates(pregnancy) {

          
            if (pregnancy.IsSurrogate) {
                pregnancyStates = sharedValues.pregnancyStatesSurrogate;
            }
            else if (pregnancy.Mother != null) {
                pregnancyStates = sharedValues.pregnancyStatesSurrogateMother;
            }
            else {
                pregnancyStates = sharedValues.pregnancyStates;
            }
            return pregnancyStates;
        }

        function _addSurrogatePregnancy(pregnancy) {

            pregnancy.SurrogateId = pregnancy.Surrogate.Id;
            pregnancy.SurrogateName = pregnancy.Surrogate.Name;

            //horsesService.getHorse(pregnancy.Surrogate.Id,1).then(function (horse) {
              
            //    if (horse.pregnancies.length > 0) {
            //        horse.pregnancies[horse.pregnancies.length - 1].Finished = true;
            //    }
            //    var startDate = this.getStatesByFind(pregnancy.Id,-1).Date;
            //    horse.pregnancies.push({
            //        Date: startDate,
            //        Father: pregnancy.Father,
            //        Mother: { Id: this.horse.Id, Name: this.horse.Name },
            //        Finished: false,
            //        States: [{ Date: startDate, State: sharedValues.pregnancyStatesSurrogateMother[0] }]
            //    });
            //    horsesService.updateHorse(horse);
            //    this.submit();
            //}.bind(this));
        }

        function _stopPregnancy() {
            if (this.pregnancies.length > 0) {
                var pregnancy = this.pregnancies[this.pregnancies.length - 1];
                pregnancy.Finished = true;
            }
        }

        function _pregnancyStatus(pregnancy) {

            pregnancyStates = this.getStates(pregnancy);
          
            if (this.getStatesByFind(pregnancy.Id, -1).StateId == pregnancyStates[pregnancyStates.length - 1].id && pregnancy.Finished) {
                return 'success';
            }
            else if (pregnancy.Finished) {
                return 'danger';
            }
        }

        function _addPregnancyState() {

            var pregnancy = this.pregnancies[this.pregnancies.length - 1];
            pregnancyStates = this.getStates(pregnancy);


          //  pregnancy.States.push(this.newPregnancyState);
            var Statenew = { Date: this.newPregnancyState.Date, StateId: this.newPregnancyState.State.id, HorseId: this.Id, HorsePregnanciesId: pregnancy.Id, name: this.newPregnancyState.State.name };


            this.pregnanciesstates.push(Statenew);

            if (this.getStatesByFind(pregnancy.Id,-1).StateId == pregnancyStates[pregnancyStates.length - 1].id) {
                pregnancy.Finished = true;
                if (pregnancy.IsSurrogate && pregnancy.SurrogateId != this.horse.Id) {
                    this.addSurrogatePregnancy(pregnancy);
                }
            }
            this.initNewPregnancyState();
        }

        function _removePregnancyState() {
            var pregnancy = this.pregnancies[this.pregnancies.length - 1];
            this.pregnanciesstates.splice(this.pregnanciesstates.length-1, 1);
            this.initNewPregnancyState();
        }


        function _initNewVaccination() {
            this.newVaccination = {};
            this.newVaccination.Date = new Date();

            this.newVaccination.Type = "";
            this.newVaccination.Name = "";
            this.newVaccination.Cost = "";
            this.newVaccination.Discount = "";
            this.newVaccination.FileName = "";

            if ($scope.vaccinationForm != null) {
                $scope.vaccinationForm.$setPristine();
            }
        }

        function _initNewShoeing() {
            this.newShoeing = {};
            this.newShoeing.Date = new Date();

            this.newShoeing.ShoerName = "";
            this.newShoeing.Name = "";
            this.newShoeing.Cost = "";
            this.newShoeing.Discount = "";
            this.newShoeing.FileName = "";
            if ($scope.shoeingForm != null) {
                $scope.shoeingForm.$setPristine();
            }
        }

        function _initNewTilufing() {
            this.newTiluf = {};
            this.newTiluf.Date = new Date();
            this.newTiluf.ShoerName = "";
            this.newTiluf.Name = "";
            this.newTiluf.Cost = "";
            this.newTiluf.Discount = "";
            this.newShoeing.FileName = "";
            if ($scope.tilufForm != null) {
                $scope.tilufForm.$setPristine();
            }
        }

        function _addVaccination() {
            this.vaccinations = this.vaccinations || [];
            this.vaccinations.push(this.newVaccination);
            this.initNewVaccination();
        }

        function _removeVaccination(vaccination) {
            for (var i in this.vaccinations) {
                if (this.vaccinations[i] == vaccination) {
                    this.vaccinations.splice(i, 1);
                }
            }
        }

        function _initNewPregnancy() {
            this.pregnancies = this.pregnancies || [];
            this.newPregnancy = {};
            this.newPregnancy.Date = new Date();
            this.newPregnancy.Finished = false;
            this.newPregnancy.Id = 0;
            this.newPregnancy.Father = "";
            this.newPregnancy.IsSurrogate = false;

            if ($scope.pregnancyForm != null) {
                $scope.pregnancyForm.$setPristine();
            }
        }


        function _initNewPregnancyState() {
          
            var pregnancy = this.pregnancies[this.pregnancies.length - 1];
            this.newPregnancyState = {};
            if (pregnancy) {
                pregnancyStates = this.getStates(pregnancy);
                for (var i in pregnancyStates) {
                    if (pregnancyStates[i].id == this.getStatesByFind(pregnancy.Id,-1).StateId) {
                        this.newPregnancyState.State = pregnancyStates[++i];
                        if (this.newPregnancyState.State != null) {
                           
                            this.newPregnancyState.Date = moment(pregnancy.Date).add(this.newPregnancyState.State.day, 'day').toDate();
                        }
                        break;
                    }
                }
            }
            if ($scope.pregnancyStateForm != null) {
                $scope.pregnancyStateForm.$setPristine();
            }
        }

        function _addPregnancy() {
           
            this.pregnancies = this.pregnancies || [];
            this.stopPregnancy();
           
            pregnancyStates = this.getStates(this.newPregnancy);
            var startDate = this.newPregnancy.Date;

            var Statenew = { Date: startDate, StateId: pregnancyStates[0].id, HorseId: this.Id, HorsePregnanciesId: 0, name: pregnancyStates[0].name};

           
            this.pregnanciesstates.push(Statenew);

           // this.newPregnancy.States = [{ Date: startDate, State: pregnancyStates[0] }];
           // this.horse.Meta.Pregnancies.push(this.newPregnancy);

            this.pregnancies.push(this.newPregnancy);
            this.initNewPregnancy();
            this.initNewPregnancyState();
        }

        function _removePregnancy(pregnancy) {
            for (var i in this.pregnancies) {
                if (this.pregnancies[i] == pregnancy) {
                    this.pregnancies.splice(i, 1);
                }
            }
            this.initNewPregnancyState();
        }

        function _addShoeing() {
            this.shoeings = this.shoeings || [];
            this.shoeings.push(this.newShoeing);
            this.initNewShoeing();
        }

        function _removeShoeing(shoeing) {
            for (var i in this.shoeings) {
                if (this.shoeings[i] == shoeing) {
                    this.shoeings.splice(i, 1);
                }
            }
        }

        function _addTiluf() {
            this.tilufings = this.tilufings || [];
            this.tilufings.push(this.newTiluf);
            this.initNewTilufing();
        }

        function _removeTiluf(tiluf) {
            for (var i in this.tilufings) {
                if (this.tilufings[i] == tiluf) {
                    this.tilufings.splice(i, 1);
                }
            }
        }




        function _submit() {

            if ($scope.horseForm.$valid) {
                horsesService.updateHorse(this.horse).then(function (horse) {
                    var origId = this.horse.Id;
                    this.horse = horse;
                    this.createNotifications();
                    this.initHorse();
                    alert('נשמר בהצלחה');
                }.bind(this));
            }
        }

        function _delete() {
            if (confirm('האם למחוק את הסוס?')) {
                horsesService.deleteHorse(this.horse.Id).then(function () {
                    $state.go('horses');
                });
            }
        }
    }
})();