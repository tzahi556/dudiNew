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
            horses: '<'
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
        this.addShoeing = _addShoeing.bind(this);
        this.removeShoeing = _removeShoeing.bind(this);
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
        this.uploadFile = _uploadFile.bind(this);
        this.removeFile = _removeFile.bind(this);
        this.vaccinations = sharedValues.vaccinations;
        this.uploadsUri = sharedValues.apiUrl + '/uploads/'
        this.scope = $scope;

        $scope.$on('submit', function (event, args) {
            if (confirm('האם לשמור שינוים')) {
                this.submit();
            }
        }.bind(this));

        // init
        this.initHorse = function () {
            this.horse.Meta = this.horse.Meta || {};
            this.horse.Meta.BirthDate = moment(this.horse.Meta.BirthDate).startOf('day').toDate();
            this.horse.Meta.PensionStartDate = moment(this.horse.Meta.PensionStartDate).startOf('day').toDate();
            this.initNewTreatment();
            this.initNewVaccination();
            this.initNewShoeing();
            this.initNewPregnancy();
            this.initNewPregnancyState();

            this.horse.Meta.Active = this.horse.Meta.Active || 'active';

            // set default farm
            if (this.farms.length == 1) {
                this.horse.Farm_Id = this.horse.Farm_Id || this.farms[0].Id;
            }
        }.bind(this);
        this.initHorse();

        function _addTreatment() {
            this.horse.Meta.Treatments = this.horse.Meta.Treatments || [];
            this.horse.Meta.Treatments.push(this.newTreatment);
            this.initNewTreatment();
        }

        function _removeTreatment(treatment) {
            for (var i in this.horse.Meta.Treatments) {
                if (this.horse.Meta.Treatments[i] == treatment) {
                    this.horse.Meta.Treatments.splice(i, 1);
                }
            }
        }

        function _initNewTreatment() {
            this.horse.Meta.Treatments = this.horse.Meta.Treatments || [];
            this.newTreatment = {};
            this.newTreatment.Date = new Date();
            if ($scope.treatmentForm != null) {
                $scope.treatmentForm.$setPristine();
            }
        }

        function _uploadFile(file) {
            this.horse.Meta.Files = this.horse.Meta.Files || [];
            if (file) {
                this.horse.Meta.Files.push(file);
            }
        }

        function _removeFile(file) {
            filesService.delete(file).then(function () {
                this.horse.Meta.Files.splice(this.horse.Meta.Files.indexOf(file), 1);
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

            notificationsService.createNotification({
                entityType: 'horse', entityId: this.horse.Id, group: 'pregnancy', farmId: this.horse.Farm_Id,
                text: angular.isUndefined(this.newPregnancyState.State) || this.horse.Meta.Active == 'notActive' ? null : this.newPregnancyState.State.name + ' עבור סוס: ' + this.horse.Name,
                date: this.newPregnancyState.Date ? moment(this.newPregnancyState.Date).format('YYYY-MM-DD') : null
            });
        }

        function _addShoeingNotification() {

            var horseBirthDate = this.horse.Meta.BirthDate;
            var shoeingDate = null;
            var hasLastShoeing = (typeof (this.horse.Meta.Shoeings) !== "undefined" && this.horse.Meta.Shoeings.length > 0);
            var first = moment(horseBirthDate).add(sharedValues.shoeing.first, 'days');

            if (hasLastShoeing) {
                this.horse.Meta.Shoeings = this.horse.Meta.Shoeings.sort(function (a, b) {
                    if (new Date(a.Date) > new Date(b.Date))
                        return 1;
                    else if (new Date(a.Date) < new Date(b.Date))
                        return -1;
                    else
                        return 0;
                });
                var lastShoeing = this.horse.Meta.Shoeings[this.horse.Meta.Shoeings.length - 1];
                shoeingDate = moment(lastShoeing.Date).add(sharedValues.shoeing.interval, 'days');
            }
            else if (this.isFuture(first)) {
                shoeingDate = first;
            }

            var text = shoeingDate ? 'נדרש פרזול עבור סוס: ' + this.horse.Name : null;
            notificationsService.createNotification({
                entityType: 'horse', entityId: this.horse.Id, group: 'shoeing', farmId: this.horse.Farm_Id,
                text: this.horse.Meta.Active == 'notActive' ? null : text,
                date: shoeingDate ? shoeingDate.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
            });
        }

        function _addVaccineNotification(vaccineName, notificationMessage) {

            var horseBirthDate = this.horse.Meta.BirthDate;
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
                text: this.horse.Meta.Active == 'notActive' ? null : text,
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
            this.horse.Meta.Vaccinations = this.horse.Meta.Vaccinations || [];
            this.horse.Meta.Vaccinations.sort(function (a, b) {
                if (new Date(a.Date) > new Date(b.Date))
                    return 1;
                else if (new Date(a.Date) < new Date(b.Date))
                    return -1;
                else
                    return 0;
            });
            for (var i in this.horse.Meta.Vaccinations) {
                if (this.horse.Meta.Vaccinations[i].Type == id) {
                    lastVaccination.age = Math.ceil(moment.duration(moment(this.horse.Meta.Vaccinations[i].Date).diff(this.horse.Meta.BirthDate)).asDays());
                    lastVaccination.times++;
                    lastVaccination.date = this.horse.Meta.Vaccinations[i].Date;
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
            horsesService.getHorse(pregnancy.Surrogate.Id).then(function (horse) {
                if (horse.Meta.Pregnancies.length > 0) {
                    horse.Meta.Pregnancies[horse.Meta.Pregnancies.length - 1].Finished = true;
                }
                var startDate = pregnancy.States[pregnancy.States.length - 1].Date;
                horse.Meta.Pregnancies.push({
                    Date: startDate,
                    Father: pregnancy.Father,
                    Mother: { Id: this.horse.Id, Name: this.horse.Name },
                    Finished: false,
                    States: [{ Date: startDate, State: sharedValues.pregnancyStatesSurrogateMother[0] }]
                });
                horsesService.updateHorse(horse);
                this.submit();
            }.bind(this));
        }

        function _stopPregnancy() {
            if (this.horse.Meta.Pregnancies.length > 0) {
                var pregnancy = this.horse.Meta.Pregnancies[this.horse.Meta.Pregnancies.length - 1];
                pregnancy.Finished = true;
            }
        }

        function _pregnancyStatus(pregnancy) {
            pregnancyStates = this.getStates(pregnancy);
            if (pregnancy.States[pregnancy.States.length - 1].State.id == pregnancyStates[pregnancyStates.length - 1].id && pregnancy.Finished) {
                return 'success';
            }
            else if (pregnancy.Finished) {
                return 'danger';
            }
        }

        function _addPregnancyState() {
            var pregnancy = this.horse.Meta.Pregnancies[this.horse.Meta.Pregnancies.length - 1];
            pregnancyStates = this.getStates(pregnancy);
            pregnancy.States.push(this.newPregnancyState);
            if (pregnancy.States[pregnancy.States.length - 1].State.id == pregnancyStates[pregnancyStates.length - 1].id) {
                pregnancy.Finished = true;
                if (pregnancy.IsSurrogate && pregnancy.Surrogate.Id != this.horse.Id) {
                    this.addSurrogatePregnancy(pregnancy);
                }
            }
            this.initNewPregnancyState();
        }

        function _removePregnancyState() {
            var pregnancy = this.horse.Meta.Pregnancies[this.horse.Meta.Pregnancies.length - 1];
            pregnancy.States.splice(pregnancy.States.length - 1, 1);
            this.initNewPregnancyState();
        }

        function _initNewPregnancyState() {
            var pregnancy = this.horse.Meta.Pregnancies[this.horse.Meta.Pregnancies.length - 1];
            this.newPregnancyState = {};
            if (pregnancy) {
                pregnancyStates = this.getStates(pregnancy);
                for (var i in pregnancyStates) {
                    if (pregnancyStates[i].id == pregnancy.States[pregnancy.States.length - 1].State.id) {
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

        function _initNewVaccination() {
            this.newVaccination = {};
            this.newVaccination.Date = new Date();
            if ($scope.vaccinationForm != null) {
                $scope.vaccinationForm.$setPristine();
            }
        }

        function _initNewShoeing() {
            this.newShoeing = {};
            this.newShoeing.Date = new Date();
            if ($scope.shoeingForm != null) {
                $scope.shoeingForm.$setPristine();
            }
        }

        function _addVaccination() {
            this.horse.Meta.Vaccinations = this.horse.Meta.Vaccinations || [];
            this.horse.Meta.Vaccinations.push(this.newVaccination);
            this.initNewVaccination();
        }

        function _removeVaccination(vaccination) {
            for (var i in this.horse.Meta.Vaccinations) {
                if (this.horse.Meta.Vaccinations[i] == vaccination) {
                    this.horse.Meta.Vaccinations.splice(i, 1);
                }
            }
        }

        function _initNewPregnancy() {
            this.horse.Meta.Pregnancies = this.horse.Meta.Pregnancies || [];
            this.newPregnancy = {};
            this.newPregnancy.Date = new Date();
            this.newPregnancy.Finished = false;
            if ($scope.pregnancyForm != null) {
                $scope.pregnancyForm.$setPristine();
            }
        }

        function _addPregnancy() {
            this.horse.Meta.Pregnancies = this.horse.Meta.Pregnancies || [];
            this.stopPregnancy();
            pregnancyStates = this.getStates(this.newPregnancy);
            var startDate = this.newPregnancy.Date;
            this.newPregnancy.States = [{ Date: startDate, State: pregnancyStates[0] }];
            this.horse.Meta.Pregnancies.push(this.newPregnancy);
            this.initNewPregnancy();
            this.initNewPregnancyState();
        }

        function _removePregnancy(pregnancy) {
            for (var i in this.horse.Meta.Pregnancies) {
                if (this.horse.Meta.Pregnancies[i] == pregnancy) {
                    this.horse.Meta.Pregnancies.splice(i, 1);
                }
            }
            this.initNewPregnancyState();
        }

        function _addShoeing() {
            this.horse.Meta.Shoeings = this.horse.Meta.Shoeings || [];
            this.horse.Meta.Shoeings.push(this.newShoeing);
            this.initNewShoeing();
        }

        function _removeShoeing(shoeing) {
            for (var i in this.horse.Meta.Shoeings) {
                if (this.horse.Meta.Shoeings[i] == shoeing) {
                    this.horse.Meta.Shoeings.splice(i, 1);
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