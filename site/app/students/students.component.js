(function () {

    var app = angular.module('app');

    app.component('students', {
        templateUrl: 'app/students/students.template.html',
        controller: StudentsController,
        bindings: {
            users: '<',
            horsevetrinars: '<',
            farms: '<',
        }
    });

    function StudentsController(usersService, lessonsService, horsesService, $scope, sharedValues, $http) {
       
        this.role = localStorage.getItem('currentRole');
        
        var self = this;
        this.sharedValues = sharedValues;
        this.usersService = usersService;
        this.horsesService = horsesService;
        this.upload = _upload.bind(this);
        this.changeStatus = _changeStatus.bind(this);
        this.getCounter = _getCounter.bind(this);
        this.getFarmName = _getFarmName.bind(this);
        this.getFilerArray = _getFilerArray.bind(this);
        this.openModal = _openModal.bind(this);
        this.action = _action.bind(this);
        this.getHebStyleHMO = _getHebStyleHMO.bind(this);
        this.activeStudent = 0;
        this.notActiveStudent = 0;
        this.pensionStudent = 0;
        this.pensionStudentNotActive = 0;

        
        this.getCounter();


        function _getHebStyleHMO(type,id) {
      
            if (type == 1 && id) {

              
                return this.sharedValues.styles.filter(x => x.id == id)[0].name;
            }

            if (type == 2 && id) {

              
                return this.sharedValues.HMOs.filter(x => x.id == id)[0].name;
            }


            return "";

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

                var newhorsevetrinars = { Id: 0, FarmIdAdd: this.newhorsevetrinars.FarmId, UserId: -1 };
                this.horsevetrinars.push(newhorsevetrinars);
                this.newhorsevetrinars.FarmId = "";



            }


            // שמירה
            if (type == 3) {

                var thisCtrl = this;
                this.horsesService.getHorseVetrinars(this.horsevetrinars,'1').then(function (res) {

                    thisCtrl.usersService.getUsers('student').then(function (res) {
                        thisCtrl.users = res;
                        thisCtrl.getCounter();
                    }.bind(this));
                    


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
           

            $("#modalHavotstudent").modal("show");

        }
      
        function _changeStatus(type) {

            //אם נדרש מעבר ללא פעיל
            if (type == 1) {
                for (var i in this.users) {
                   
                    if (this.users[i].IsSelected) {
                       
                        this.users[i].Active = "notActive";
                        this.users[i].IsSelected = false;
                        delete this.users[i].IsSelected;
                        var userClone = angular.copy(this.users[i]);
                        this.usersService.updateUser(userClone).then(function (user) {

                            //this.users[i] = user;
                            //this.users=this.users.sort();
                           
                        }.bind(this));
                    }
                }
            }


            if (type == 2) {
                for (var i in this.users) {

                    if (this.users[i].IsSelected2) {
                        this.users[i].Active = "active";
                        this.users[i].IsSelected2 = false;
                        delete this.users[i].IsSelected2;
                        var userClone = angular.copy(this.users[i]);
                        this.usersService.updateUser(userClone).then(function (user) {
                      
                            //this.users[i] = user;
                            //this.users=this.users.sort();
                        }.bind(this));
                    }
                }
            }
        }


        function _getCounter() {
            this.pensionStudent = 0;
            this.pensionStudentNotActive = 0;
            this.activeStudent = 0;
            this.notActiveStudent = 0;
            for (var i in this.users) {


                if (this.users[i].Style == 'horseHolder' && this.users[i].Active == 'active') {
                    this.pensionStudent++;
                }
                else if (this.users[i].Style == 'horseHolder' && this.users[i].Active == 'notActive') {
                    this.pensionStudentNotActive++;
                }


                else if (this.users[i].Active == 'active') {
                    this.activeStudent++;
                }
                else {

                    this.notActiveStudent++;
                }
                 
            }

            

        }
        



        function _upload() {
            function handleFile(e) {

                var files = e.target.files;
                var i, f;
                for (i = 0; i != files.length; ++i) {
                    f = files[i];
                    var reader = new FileReader();
                    var name = f.name;
                    reader.onload = function (e) {
                        var data = e.target.result;
                        var workbook;
                        workbook = XLSX.read(data, { type: 'binary' });
                       
                        var students = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);




                        students.map(function (student) {

                           
                            student.Id = 0;
                            student.Email = student.id;
                            student.Password = student.id;
                            student.Role = 'student';
                            student.FirstName = student.firstName;
                            student.LastName = student.lastName;
                            student.BirthDate= moment(student.birthDate).toDate();
                            student.Active= 'active';
                            student.ParentName= student.fatherName;
                            student.ParentName2= student.motherName;
                            student.Address= student.address;
                            student.PhoneNumber= student.phone1;
                            student.PhoneNumber2= student.phone2;
                            student.AnotherEmail= student.email;
                            student.IdNumber= student.id;
                            student.Style= student.style;
                            student.HMO= student.hmo;
                            student.TeamMember= student.teamMember;
                            student.Cost= student.cost && !isNaN(student.cost) ? parseFloat(student.cost) : 0;
                            student.PayType = student.payType;
                        });



                        usersService.importUsers(students).then(function () {
                            location.reload();
                        }.bind(this));

                    };
                    reader.readAsBinaryString(f);
                }
            }
            var input = $('<input type="file" style="display:none;">');
            $('body').append(input);
            $(input).on('change', handleFile);
            $(input).click();
        }
        //this.scope = $scope;
        //this.lessonsService = lessonsService;
        //this.usersService = usersService;
        //this.countCommitmentLessons = _countCommitmentLessons.bind(this);
        //this.countPaidLessons = _countPaidLessons.bind(this);
        //this.countPaidMonths = _countPaidMonths.bind(this);
        //this.countExpenses = _countExpenses.bind(this);
        //this.initLessons = _initLessons.bind(this);
        //this.setPaid = _setPaid.bind(this);
        //this.getStatusIndex = _getStatusIndex.bind(this);
        //this.setStatus = _setStatus.bind(this);
        //this.countSherit = _countSherit.bind(this);
        //this.getIfExpensiveInMas = _getIfExpensiveInMas.bind(this);
        //this.getLessonsData = _getLessonsData.bind(this);



        //function _countCommitmentLessons() {
        //    var commitments = this.user.Meta.Commitments || [];
        //    var total = 0;
        //    var totalThisYear = 0;
        //    for (var i in commitments) {
        //        total += commitments[i].Qty;
        //        var isThisYear = moment(commitments[i].Date).format('YYYY') == moment().format('YYYY');
        //        if (isThisYear) {
        //            totalThisYear += commitments[i].Qty;
        //        }
        //    }
        //    this.commitmentLessons = total;
        //    this.commitmentLessonsThisYear = totalThisYear;
        //}


        //function _countPaidLessons() {
        //    var payments = this.user.Meta.Payments || [];
        //    var totalLessons = 0;
        //    var totalLessonsThisYear = 0;
        //    for (var i in payments) {
        //        if (payments[i].lessons && !payments[i].canceled) {
        //            totalLessons += payments[i].lessons
        //            if (moment(payments[i].Date).format('YYYY') == moment().format('YYYY')) {
        //                totalLessonsThisYear += payments[i].lessons;
        //            }
        //        }
        //    }


        //    this.paidLessons = totalLessons;
        //    this.paidLessonsThisYear = totalLessonsThisYear;

        //}

        //function _countPaidMonths() {
        //    var payments = this.user.Meta.Payments || [];
        //    var results = [];
        //    var sum = 0;
        //    var paid = 0;
        //    for (var i in payments) {
        //        if (payments[i].month && !payments[i].canceled) {
        //            paid += payments[i].InvoiceSum;
        //            var month = moment(payments[i].month).format('MM-YYYY');
        //            if (results.indexOf(month) == -1) {
        //                results.push(month);
        //                sum += payments[i].Price;
        //            }
        //        }
        //    }
        //    this.paidMonths = results.length;
        //    this.monthlyBalance = paid - sum;
        //}

        //function _getIfExpensiveInMas(InvoiceNum) {

        //    for (var i in this.user.Meta.Payments) {

        //        if (!this.user.Meta.Payments[i].canceled &&
        //            (this.user.Meta.Payments[i].InvoiceNum == InvoiceNum || InvoiceNum.toString() == "true") &&
        //            parseInt(moment(this.user.Meta.Payments[i].Date).format('YYYYMMDD')) > parseInt(moment(sharedValues.DateModify).format('YYYYMMDD'))

        //        ) {
        //            return true;
        //        }

        //    }

        //    return false;

        //}

        ////הוצאות אחרות
        //function _countExpenses() {
        //    var total = 0;
        //    this.totalExpensesAll = 0;
        //    for (var i in this.user.Meta.Expenses) {
        //        var exp = this.user.Meta.Expenses[i];
        //        if (!exp.Paid) {
        //            total += exp.Price;

        //        }
        //        else {


        //            if (this.getIfExpensiveInMas(exp.Paid))
        //                this.totalExpensesAll += exp.Price;

        //        }



        //    }


        //    this.totalExpenses = total;



        //}

        //function _countSherit() {


        //    var total = 0;
        //    var totalLessons = 0;
        //    this.Sherit = 0;
        //    var payments = this.user.Meta.Payments || [];
        //    //
        //    for (var i in payments) {

        //        if (!payments[i].canceled && parseInt(moment(payments[i].Date).format('YYYYMMDD')) > parseInt(moment(sharedValues.DateModify).format('YYYYMMDD'))) {
        //            total += payments[i].InvoiceSum;
        //            if (payments[i].lessons) {

        //                totalLessons += (payments[i].Price * payments[i].lessons);
        //            }


        //        }
        //    }

        //    this.Sherit = total - this.totalExpensesAll - totalLessons;

        //}

        //function _initLessons() {

        //    this.lessons = this.lessons.sort(function (a, b) {
        //        if (a.start > b.start)
        //            return 1;
        //        if (a.start < b.start)
        //            return -1;
        //        return 0;
        //    });

        //    this.creditPaidLessons = this.paidLessons + this.commitmentLessons;
        //    for (var i in this.lessons) {

        //        this.lessons[i].paid = this.setPaid(this.lessons[i]);
        //    }





        //}

        //function _getStatusIndex(lesson) {
        //    for (var i in lesson.statuses) {
        //        if (lesson.statuses[i].StudentId == this.user.Id) {
        //            return i;
        //        }
        //    }
        //}

        //function _setStatus(lesson) {
        //    return parseInt(moment(lesson.start).format('YYYYMMDD')) < parseInt(moment().format('YYYYMMDD')) && this.isNullOrEmpty(lesson.statuses[this.getStatusIndex(lesson)].Status);
        //}

        //function _setPaid(lesson) {

        //    for (var i in this.user.Meta.Payments) {
        //        if (this.user.Meta.Payments[i].month && !this.user.Meta.Payments[i].canceled && moment(this.user.Meta.Payments[i].month).format('YYYYMM') == moment(lesson.start).format('YYYYMM')) {
        //            return true;
        //        }
        //    }
        //    if (['attended', 'notAttendedCharge'].indexOf(lesson.statuses[this.getStatusIndex(lesson)].Status) != -1) {
        //        this.attendedLessons = this.attendedLessons || 0;
        //        this.attendedLessons++;
        //        if (this.creditPaidLessons-- > 0) {
        //            return true;
        //        }

        //    }
        //    return false;
        //}



        //function _getLessonsData(user) {

        //    $http.get(sharedValues.apiUrl + 'lessons/getLessons/', { params: { studentId: user.Id, startDate: "", endDate: "" } }).success(function (res) {


        //        $scope.$broadcast('kaka', res, user);
        //    }).error(function (data) { console.log("The request isn't working"); });
        //}


        //this.scope.$on('kaka', function (event, params, user) {

        //    this.totalExpenses = 0;
        //    this.unpaidLessons = 0;
        //    this.monthlyBalance = 0;

        //    this.lessons = params;
        //    this.user = user;
        //    this.countCommitmentLessons();
        //    this.countPaidLessons();
        //    this.countPaidMonths();
        //    this.countExpenses();
        //    this.initLessons();
        //    this.countSherit();

        //    ////חוב על שיעורים
        //    if (this.user.Meta.PayType == 'lessonCost') {

        //        this.unpaidLessons = this.creditPaidLessons * this.user.Meta.Cost + this.Sherit;

        //    }
        //    var userTotal = this.totalExpenses * -1 + this.unpaidLessons + this.monthlyBalance;

        //    if (userTotal != 0) {

        //        // alert(this.user.FirstName + this.user.LastName + " : " + userTotal);

        //        this.user.Role = 'student';
        //        this.user.Email = this.user.Meta.IdNumber;
        //        this.user.Password = this.user.Meta.IdNumber;
        //        this.user.AccountStatus = userTotal;


        //        var totalFromExpenses = 0;
        //        var totalFromExpensesMinus = 0;





        //        usersService.updateUser(this.user).then(function (user) {

        //            this.user = user;
        //            //   this.createNotifications();
        //            // this.initStudent();
        //            //   alert('נשמר בהצלחה');

        //            //  this.closeCallback("", "");



        //        }.bind(this));


        //    }




        //}.bind(this));


        //for (var i in this.users) {
        //    if (this.users[i].Meta.Active == 'active') {
        //        this.getLessonsData(this.users[i]);
        //    }
        //}


    }




})();