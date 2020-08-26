(function () {
    var app = angular.module('app');

    app.filter('surrogateHorse', function () {
        return function (horses, horse) {
            var newHorses = [];
            for (var i in horses) {
                if (horses[i].Id != horse.Id && horses[i].Gender == 'female') {
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
            susut: '<',
            hozims: '<',
            instructors: '<',
        }
    });
    app.filter('dateRangeHorse', function () {

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

        this.addHozims = _addHozims.bind(this);
        this.removeHozims = _removeHozims.bind(this);
        this.initNewHozims = _initNewHozims.bind(this);
        this.getHozim = _getHozim.bind(this);



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

        this.getClassForinsemination = _getClassForinsemination.bind(this);

        this.getInseminationTypeName = _getInseminationTypeName.bind(this);



        this.role = localStorage.getItem('currentRole');
        this.subrole = localStorage.getItem('currentSubRole');

        this.removeFile = _removeFile.bind(this);
        this.vaccinationsHorse = sharedValues.vaccinations;

        this.hozimTypes = sharedValues.hozimTypes;

        this.uploadsUri = sharedValues.apiUrl + '/uploads/'
        this.scope = $scope;

        this.isDelete = false;

        $scope.$on('submit', function (event, args) {
            if (!this.isDelete)
           this.submit(true);
        }.bind(this));

        // init

        this.dateFromHorse = moment().add(-5, 'months').toDate();
        this.dateToHorse = moment().add(1, 'months').toDate();


        this.getStatesByFind = _getStatesByFind.bind(this);
        this.getCurrentPreg = _getCurrentPreg.bind(this);

        this.getCurrentHozim = _getCurrentHozim.bind(this);

        this.getTotalHozim = _getTotalHozim.bind(this);

        function _getTotalHozim() {

            var res = { Cost: 0, Sum: 0 };

            var ObjArray = this.inseminations.filter(x => x.HalivaDate != null && moment(x.HalivaDate) <= moment(this.dateToHorse) && moment(x.HalivaDate) >= moment(this.dateFromHorse));
            for (var i in ObjArray) {
                res.Cost += eval(ObjArray[i].Cost);
                res.Sum += eval(ObjArray[i].Sum);
            }


            return res;


        }


        function _getCurrentHozim(hozimId) {



            var ObjArray = this.inseminations.filter(x => x.HozimId === hozimId && x.HalivaDate == null);

            return ObjArray;


        }

        function _getCurrentPreg(pregId) {


            var CurrentId = (pregId) ? pregId : this.pregnancies[this.pregnancies.length - 1].Id;
            var ObjArray = this.pregnanciesstates.filter(x => x.HorsePregnanciesId === CurrentId);

            return ObjArray;


        }
        function _getInseminationTypeName(type) {


            if (!type) return "";
            return this.hozimTypes.filter(x => x.id == type)[0].name;

        }


        function _getClassForinsemination(insemination) {
             
            if (insemination.HalivaDate)
                return 'haliva';

            if (insemination.StatusLeda == 1)
                return 'leda';
            if (insemination.StatusLeda == 2)
                return 'ledaFaild';
        }



        function _getStatesByFind(id, index) {

            var ObjArray = this.pregnanciesstates.filter(x => x.HorsePregnanciesId === id);

            if (index == 0)
                return this.pregnanciesstates.filter(x => x.HorsePregnanciesId === id)[0];

            if (index == -1)
                return this.pregnanciesstates.filter(x => x.HorsePregnanciesId === id)[ObjArray.length - 1];
        }



        this.initHorse = function () {


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

            this.initNewHozims();

            this.horse.Active = this.horse.Active || 'active';

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
            //   this.treatments = this.horse.treatments || [];
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
            //this.newInsemination.HalivaDate = "";
            //this.newInsemination.InseminationDate = "";
            //this.newInsemination.HerionDate = "";
            //this.newInsemination.LedaDate = "";

            this.newInsemination.PregnanciesHorseId = "";

            if ($scope.inserForm != null) {
                $scope.inserForm.$setPristine();
            }
        }



        function _addInsemination() {
            this.inseminations = this.inseminations || [];

            // debugger
            //if (!this.newInsemination.HalivaDate && !this.newInsemination.InseminationDate) {
            //    alert("חובה לבחור תאריך חליבה או הזרעה");
            //    return;



            //}


            //if (!this.newInsemination.PregnanciesHorseId && this.newInsemination.InseminationDate) {
            //    alert("חובה לבחור סוסה להזרעה");
            //    return;
            //}

            //if (this.newInsemination.Cost && this.newInsemination.HalivaDate) {
            //    alert("תשלום רק בהזרעה");
            //    this.newInsemination.Cost = "";
            //    return;
            //}



            if (this.newInsemination.PregnanciesHorseId && this.newInsemination.HalivaDate) {
                alert("לא ניתן לבחור סוסה בזמן חליבה");
                return;
            }


            for (var i in this.susut) {

                if (this.susut[i].Id == this.newInsemination.PregnanciesHorseId) {

                    this.newInsemination.Susa = this.susut[i].Name;
                    this.newInsemination.SusaSiduri = this.susut[i].SeqNumber;
                    this.newInsemination.SusaOwner = this.susut[i].Owner;

                }
            }





            if (this.newInsemination.HalivaDate) this.newInsemination.HalivaDate.setHours(this.newInsemination.HalivaDate.getHours() + 3);    // moment(this.newInsemination.HalivaDate).format('DD/MM/YYYY');
            //if (this.newInsemination.InseminationDate) this.newInsemination.InseminationDate.setHours(this.newInsemination.InseminationDate.getHours() + 3); 
            //if (this.newInsemination.HerionDate) this.newInsemination.HerionDate = moment(this.newInsemination.HerionDate).format('DD/MM/YYYY');
            //if (this.newInsemination.LedaDate) this.newInsemination.LedaDate = moment(this.newInsemination.LedaDate).format('DD/MM/YYYY');

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
                var Obj = { "Id": 0, "HorseId": this.horse.Id, "FileName": file };
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



        function _removeFile(file, type) {
            filesService.delete(file).then(function () {
                if (type == 1)
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
            var horseBirthDate = this.horse.BirthDate;

            var IsPregnancyStop = false;
            try {
                var pregnancy = this.pregnancies[this.pregnancies.length - 1];
                IsPregnancyStop = pregnancy.Finished;

            } catch (e) {


            }


            notificationsService.createNotification({
                entityType: 'horse', entityId: this.horse.Id, group: 'pregnancy', farmId: this.horse.Farm_Id,
                text: IsPregnancyStop || angular.isUndefined(this.newPregnancyState.State) || this.horse.Active == 'notActive' ? null : this.newPregnancyState.State.name + ' עבור סוס: ' + this.horse.Name,
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
                if (this.vaccinations[i].Type == id) {
                    lastVaccination.age = Math.ceil(moment.duration(moment(this.vaccinations[i].Date).diff(this.horse.BirthDate)).asDays());
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


                pregnancyStates = (this.horse.HorseLocation == "outer") ? sharedValues.pregnancyStatesOuter : sharedValues.pregnancyStates;
            }
            return pregnancyStates;
        }

        function _addSurrogatePregnancy(pregnancy) {

            pregnancy.SurrogateId = pregnancy.Surrogate.Id;
            pregnancy.SurrogateName = pregnancy.Surrogate.Name;





            horsesService.getHorse(pregnancy.Surrogate.Id, 1).then(function (horse) {

                var startDate = this.getStatesByFind(pregnancy.Id, -1).Date;

                var pregnancytemp = { Date: startDate, HorseId: horse.Id, Father: pregnancy.Father, Mother: this.horse.Name, MotherId: this.horse.Id, Finished: false };
                // var pregnancystatetemp = [{ HorsePregnanciesId: 0, Date: startDate, HorseId: this.Id, StateId: sharedValues.pregnancyStatesSurrogateMother[0].id, name: sharedValues.pregnancyStatesSurrogateMother[0].name }];
                horsesService.insertnewpregnancie(pregnancytemp, true).then(function (pregnancy) {

                    //var pregnancystatetemp = [{ HorsePregnanciesId: pregnancy.Id, Date: startDate, HorseId: this.Id, StateId: sharedValues.pregnancyStatesSurrogateMother[0].id, name: sharedValues.pregnancyStatesSurrogateMother[0].name }];

                    //horsesService.updateHorseMultiTables(horse, [], [], [], [],
                    //    [], [], [], [], pregnancystatetemp, []).then(function (horse) {

                    //       // alert('נשמר בהצלחה');

                    //    }.bind(this));
                    this.submit();
                }.bind(this));

                //  



                // { Date: this.newPregnancyState.Date, StateId: this.newPregnancyState.State.id, HorseId: this.Id, HorsePregnanciesId: pregnancy.Id, name: this.newPregnancyState.State.name };
                //if (horse.pregnancies.length > 0) {
                //    horse.pregnancies[horse.pregnancies.length - 1].Finished = true;
                //}
                //var startDate = this.getStatesByFind(pregnancy.Id,-1).Date;
                //horse.pregnancies.push({
                //    Date: startDate,
                //    Father: pregnancy.Father,
                //    Mother: { Id: this.horse.Id, Name: this.horse.Name },
                //    Finished: false,
                //    States: [{ Date: startDate, State: sharedValues.pregnancyStatesSurrogateMother[0] }]
                //});
                //horsesService.updateHorse(horse);
                //this.submit();
            }.bind(this));
        }

        function _stopPregnancy() {
            if (this.pregnancies.length > 0) {
                var pregnancy = this.pregnancies[this.pregnancies.length - 1];
                pregnancy.Finished = true;

                var pregnanciesstate = this.pregnanciesstates[this.pregnanciesstates.length - 1];
                pregnanciesstate.Finished = true;

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

            if (this.getStatesByFind(pregnancy.Id, -1).StateId == pregnancyStates[pregnancyStates.length - 1].id) {
                pregnancy.Finished = true;
                if (pregnancy.IsSurrogate && pregnancy.SurrogateId != this.horse.Id) {
                    this.addSurrogatePregnancy(pregnancy);
                }
            }
            this.initNewPregnancyState();
        }

        function _removePregnancyState() {
            var pregnancy = this.pregnancies[this.pregnancies.length - 1];
            this.pregnanciesstates.splice(this.pregnanciesstates.length - 1, 1);




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
                    if (pregnancyStates[i].id == this.getStatesByFind(pregnancy.Id, -1).StateId) {
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

            //debugger
            var pregnancyHozimCount = this.pregnancies.filter(x => x.HozimId.toString() === this.newPregnancy.HozimId);
            var HozimCount = this.hozims.filter(x => x.Id.toString() === this.newPregnancy.HozimId)[0];

            if (HozimCount.Trial == pregnancyHozimCount.length) {

                alert(" עברת את מספר הנסיונות בחוזה ");
                return;

            }


            this.stopPregnancy();
            pregnancyStates = this.getStates(this.newPregnancy);
            var startDate = this.newPregnancy.Date;


            //  alert(this.newPregnancy.HozimId);

            this.newPregnancy.HorseId = this.horse.Id;
            horsesService.insertnewpregnancie(this.newPregnancy, false).then(function (pregnancy) {


                var Statenew = { Date: startDate, StateId: pregnancyStates[0].id, HorseId: this.horse.Id, HorsePregnanciesId: pregnancy.Id, name: pregnancyStates[0].name };
                this.pregnanciesstates.push(Statenew);
                this.newPregnancy.Id = pregnancy.Id;
                this.pregnancies.push(this.newPregnancy);

                this.submit(true);
                this.initNewPregnancy();
                this.initNewPregnancyState();

            }.bind(this));



        }

        function _removePregnancy(pregnancy) {
            for (var i in this.pregnancies) {
                if (this.pregnancies[i] == pregnancy) {
                    this.pregnancies.splice(i, 1);
                }
            }



            var x = this.pregnanciesstates.length;
            while (x--) {


                if (this.pregnanciesstates[x].HorsePregnanciesId == pregnancy.Id) {
                    this.pregnanciesstates.splice(x, 1);
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





        function _addHozims() {
            this.hozims = this.hozims || [];

            this.hozims.push(this.newHozim);
            this.initNewHozims();

            this.submit(true);





            //var self = this;
            //horsesService.getHorse(this.horse.Id, 12).then(function (hozims) {

            //    self.hozims = hozims;
            //}.bind(this));


        }

        function _removeHozims(hozim) {


            
            var pregnancy = this.pregnancies.filter(x => x.HozimId && x.HozimId.toString() === hozim.Id.toString())[0];
            if (pregnancy) {

                var pregnancstate = this.pregnanciesstates.filter(x => x.HorsePregnanciesId === pregnancy.Id)[this.pregnanciesstates.length-1];

                if (pregnancstate.StateId != "insemination") {

                    alert("לא ניתן למחוק חוזה בשלב מתקדם של הריון");
                    return;

                }

            }

            for (var i in this.hozims) {
                if (this.hozims[i] == hozim) {
                    this.hozims.splice(i, 1);
                }
            }
        }

        function _initNewHozims() {
            this.newHozim = {};
            this.newHozim.Date = new Date();

            this.newHozim.Type = "";
            this.newHozim.FatherHorseId = "";
            this.newHozim.Cost = "";
            this.newHozim.CostFather = "";
            this.newHozim.CostHava = "";

            this.newHozim.UserId = "";

            if ($scope.hozimsForm != null) {
                $scope.hozimsForm.$setPristine();
            }
        }

        function _getHozim() {

            for (var i in this.hozims) {

                // if (this.hozims.length>0)debugger
                this.hozims[i].TypeName = this.hozimTypes.filter(x => x.id == this.hozims[i].Type)[0].name;
                this.hozims[i].FatherName = this.horses.filter(x => x.Id == this.hozims[i].FatherHorseId)[0].Name;
                this.hozims[i].Date = moment(this.hozims[i].Date);

            }



            return this.hozims;
        }


        function _submit(isWithoutalert) {
         
            this.horse.BirthDate.setHours(this.horse.BirthDate.getHours() + 3);

            if (this.horse.ArrivedDate)
                this.horse.ArrivedDate.setHours(this.horse.ArrivedDate.getHours() + 3);

            if (this.horse.OutDate)
                this.horse.OutDate.setHours(this.horse.OutDate.getHours() + 3);



            horsesService.updateHorse(this.horse).then(function (horse) {
                this.horse = horse;
                this.initHorse();
                horsesService.updateHorseMultiTables(this.horse, this.files, this.hozefiles, this.pundekautfiles, this.treatments,
                    this.vaccinations, this.shoeings, this.tilufings, this.pregnancies, this.pregnanciesstates, this.inseminations, this.hozims).then(function (hozims) {
                        this.createNotifications();
                        if (!isWithoutalert) alert('נשמר בהצלחה');
                        this.hozims = hozims;

                    }.bind(this));


            }.bind(this));

          









            //if ($scope.horseForm.$valid) {
            //    horsesService.updateHorse(this.horse).then(function (horse) {
            //        var origId = this.horse.Id;
            //        this.horse = horse;
            //        this.createNotifications();
            //        this.initHorse();
            //        alert('נשמר בהצלחה');
            //    }.bind(this));
            //}
        }

        function _delete() {
            if (confirm('האם למחוק את הסוס?')) {

                this.isDelete = true;
                horsesService.deleteHorse(this.horse.Id).then(function () {
                    $state.go('horses');
                });
            }
        }
    }
})();