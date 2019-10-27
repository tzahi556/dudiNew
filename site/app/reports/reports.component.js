(function () {
    var app = angular.module('app');

    app.component('reports', {
        templateUrl: 'app/reports/reports.template.html',
        controller: ReportsController,
    });

    function ReportsController(usersService, lessonsService, horsesService, sharedValues, $q,$rootScope) {
        var self = this;
        self.studentsReport = _studentsReport;
        self.lessonsReport = _lessonsReport;
        self.horsesReport = _horsesReport;
        self.ReportManger = _ReportManger;
        self.getInstructorCounter = _getInstructorCounter;
        self.reports = [
            { name: 'רשימת תלמידים כולל פרטים', callback: self.studentsReport },
            { name: 'רשימת שיעורים', callback: self.lessonsReport },
            { name: 'רשימת סוסים + טיפולים עתידיים', callback: self.horsesReport }
        ]

       

        function _ReportManger() {
        
           


            $.get('app/reports/Report.html?sdsdsd=' + new Date(), function (text) {
              
                var CurrentDate = self.fromDate;
                if (!CurrentDate) CurrentDate = new Date();


                var Month = CurrentDate.getMonth() + 1;
                var Year = CurrentDate.getFullYear();

                if (Month < 10) Month = "0" + Month;


                text = text.replace("@ReportDate", Month + "/" + Year);
                text = text.replace("@NameHava", $rootScope.farmName);

                usersService.report("1", Month + "_" + Year).then(function (res) {
                   
                   
                    text = text.replace("@ActiveUser", res[0].ActiveUser);
                    text = text.replace("@notActiveUser", res[0].notActiveUser);
                    text = text.replace("@instructorUser", res[0].instructorUser);


                    usersService.report("2", Month + "_" + Year).then(function (res) {

                        var HtmlTable="";
                        var ExistInstructor = [];

                        for (var i = 0; i < res.length; i++)
                        {
                         
                            if (ExistInstructor.indexOf(res[i].Id) == "-1") {
                                ExistInstructor.push(res[i].Id);

                                HtmlTable += "<tr><td style='text-align:right'>" + res[i].FullName + "</td><td >" + self.getInstructorCounter(res[i].Id, res, "DayInMonth")
                                                                            + "</td><td>" + self.getInstructorCounter(res[i].Id, res, "HourNumber")
                                                                            + "</td><td>" + self.getInstructorCounter(res[i].Id, res, "Attend")
                                                                            + "</td><td>" + self.getInstructorCounter(res[i].Id, res, "NotAttend")
                                                                            + "</td><td>" + self.getInstructorCounter(res[i].Id, res, "NotAttendCharge")
                                                                            + "</td><td>" + self.getInstructorCounter(res[i].Id, res, "NoStatus") + "</td></tr>";


                            }
                         
                        }


                        text = text.replace("@TableInstructor", HtmlTable);




                        var blob = new Blob([text], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                        });


                        saveAs(blob, "Leads " + new Date() + ".xls");

                    });




                  

                });


               
              

             
            });

        
            
        }


        function _getInstructorCounter(Id,res,type) {

            if (type == "DayInMonth") {
                var DateExist = [];
                var counter = 0;
                for (var i = 0; i < res.length; i++) {

                    if (DateExist.indexOf(res[i].OnlyDate) == "-1" && Id == res[i].Id ) {

                        if (res[i].Status == "attended" || res[i].Status == "notAttendedCharge" ||
                           (res[i].Status == "completion" && (res[i].IsComplete == 4 || res[i].IsComplete == 6))
                            )
                        {
                            DateExist.push(res[i].OnlyDate);
                            counter++;
                        }

                    }


                }

                
                return (counter == 0) ? "" : counter.toString();

            }

            if (type == "HourNumber") {
                var DateExist = [];
                var counter = 0;
                for (var i = 0; i < res.length; i++) {

                    if (DateExist.indexOf(res[i].Start) == "-1" && Id == res[i].Id) {

                        if (res[i].Status == "attended" || res[i].Status == "notAttendedCharge" ||
                           (res[i].Status == "completion" && (res[i].IsComplete == 4 || res[i].IsComplete == 6))
                            )
                        {
                            DateExist.push(res[i].Start);
                            counter += res[i].Diff;
                        }

                    }


                }

               
                return (counter == 0) ? "" : (counter / 60).toString();

            }

            if (type == "Attend") {
               
                var counter = 0;
                for (var i = 0; i < res.length; i++) {

                    if (Id == res[i].Id) {

                        if (res[i].Status == "attended" || (res[i].Status == "completion" && res[i].IsComplete == 4))
                        {
                         
                            counter ++;
                        }

                    }


                }


                return (counter == 0) ? "" : counter.toString();

            }

            if (type == "NotAttend") {

                var counter = 0;
                for (var i = 0; i < res.length; i++) {

                    if (Id == res[i].Id) {

                        if (res[i].Status == "notAttended" || res[i].Status == "notAttendedDontCharge" || (res[i].Status == "completion" && res[i].IsComplete == 3)) {

                            counter++;
                        }

                    }


                }


                return (counter == 0) ? "" : counter.toString();

            }

            if (type == "NotAttendCharge") {

                var counter = 0;
                for (var i = 0; i < res.length; i++) {

                    if (Id == res[i].Id) {

                        if (res[i].Status == "notAttendedCharge" || (res[i].Status == "completion" && res[i].IsComplete == 6)) {

                            counter++;
                        }

                    }


                }


                return (counter == 0) ? "" : counter.toString();

            }

            if (type == "NoStatus") {
             
                var counter = 0;
                for (var i = 0; i < res.length; i++) {

                    if (Id == res[i].Id) {

                        if ((res[i].IsComplete == 0 && !res[i].Status) || (res[i].Status == "completion" && res[i].IsComplete == 5)) {

                            counter++;
                        }

                    }


                }

               // if (counter > 0) alert(counter);
                return (counter == 0) ? "" : counter.toString();

            }

        }


        function _studentsReport() {
            usersService.getUsers('student').then(function (students) {
                var data = [];
                data.push([
                    'מס לקוח',
                    'פעיל',
                    'ת.ז.',
                    'שם פרטי',
                    'שם משפחה',
                    'כתובת',
                    'טלפון',
                    'טלפון 2',
                    'אימייל',
                    'הורה 1',
                    'הורה 2',
                    'תאריך לידה',
                    'סגנון רכיבה',
                    'חבר נבחרת',
                    'קופ״ח',
                    'סוג תשלום',
                    'עלות',
                ]);
                students.forEach(function (student) {
                    data.push([
                        student.ClientNumber,
                        student.Active,
                        student.IdNumber,
                        student.FirstName,
                        student.LastName,
                        student.Address,
                        student.PhoneNumber,
                        student.PhoneNumber2,
                        student.AnotherEmail,
                        student.ParentName,
                        student.ParentName2,
                        student.BirthDate ? new Date(student.BirthDate) : null,
                        student.Style,
                        student.TeamMember,
                        student.HMO,
                        student.PayType,
                        student.Cost,
                    ]);
                });
                _getReport(data);
            });
        }

        function _horsesReport() {
            horsesService.getHorses().then(function (horses) {
                var data = [];
                data.push([
                    'פעיל',
                    'שם',
                    'גזע',
                    'מין',
                    'בעלים',
                    'אב סוס',
                    'אם סוס',
                    'שיוך סוס',
                    'הערות',
                    'תאריך לידה',
                    'אוכל בוקר',
                    'אוכל בוקר',
                    'אוכל צהריים',
                    'אוכל צהריים',
                    'אוכל ערב',
                    'אוכל ערב',
                    'חיסון שפעת',
                    'חיסון קדחת הנילוס',
                    'חיסון טטנוס',
                    'חיסון כלבת',
                    'חיסון הרפס',
                    'תילוע',
                    'פירזול',
                ]);
                horses.forEach(function (horse) {
                    data.push([
                        horse.Meta.Active,
                        horse.Name,
                        horse.Meta.Race,
                        horse.Meta.Gender,
                        horse.Meta.Owner,
                        horse.Meta.Father,
                        horse.Meta.Mother,
                        horse.Meta.Ownage,
                        horse.Meta.Details,
                        horse.Meta.BirthDate ? new Date(horse.Meta.BirthDate) : null,
                        horse.Meta.Food && horse.Meta.Food.Morning1 ? horse.Meta.Food.Morning1 : null,
                        horse.Meta.Food && horse.Meta.Food.Morning2 ? horse.Meta.Food.Morning2 : null,
                        horse.Meta.Food && horse.Meta.Food.Lunch1 ? horse.Meta.Food.Lunch1 : null,
                        horse.Meta.Food && horse.Meta.Food.Lunch2 ? horse.Meta.Food.Lunch2 : null,
                        horse.Meta.Food && horse.Meta.Food.Dinner1 ? horse.Meta.Food.Dinner1 : null,
                        horse.Meta.Food && horse.Meta.Food.Dinner2 ? horse.Meta.Food.Dinner2 : null,
                        _getVaccineDate('flu', horse),
                        _getVaccineDate('nile', horse),
                        _getVaccineDate('tetanus', horse),
                        _getVaccineDate('rabies', horse),
                        _getVaccineDate('herpes', horse),
                        _getVaccineDate('worming', horse),
                        _getShoeingDate(horse)
                    ]);
                });
                _getReport(data);
            });
        }

        function _lessonsReport() {

            function getUser(id) {
                var student = {};
                for (var user of self.users) {
                    if (user.Id == id) {
                        student = user;
                        break;
                    }
                }
                return student;
            }

            function getName(id) {
                var student = getUser(id);
                return student.FirstName + " " + student.LastName;
            }

            var deferred = $q.defer();
            var tasks = [];

            tasks.push(usersService.getUsers('student'));
            tasks.push(usersService.getUsers('instructor'));
            tasks.push(usersService.getUsers('profAdmin'));
         

            $q.all(tasks).then(function (users) {

                self.users = users.reduce(function (acc, value) { return acc.concat(value); });

                lessonsService.getLessons(null, self.fromDate, self.toDate).then(function (lessons) {
                    var data = [];
                    data.push([
                        'מס לקוח',
                        'ת.ז.',
                        'מתאריך',
                        'עד תאריך',
                        'שם מדריך',
                        'שם תלמיד',
                        'סטטוס',
                        'קופת חולים',
                        'עלות'
                    ]);



                    //alert(lessons[0].resourceId);
                    //alert(getName(lessons[0].resourceId));

                    for (var lesson of lessons) {
                    
                        for (var status of lesson.statuses) {
                            var instructorName = getName(lesson.resourceId);
                            var student = getUser(status.StudentId);
                            if (student) {
                                var studentName = student.FirstName + " " + student.LastName;
                                var studentClientNumber = student.ClientNumber || "";
                                var studentIdNumber = student.IdNumber;
                                var studentHMO = student.HMO;
                                var studentCost = student.Cost;

                                if (instructorName && studentName) {
                                    data.push([
                                        studentClientNumber,
                                        studentIdNumber,
                                        new Date(lesson.start),
                                        new Date(lesson.end),
                                        instructorName,
                                        studentName,
                                        status.Status,
                                        studentHMO,
                                        studentCost,
                                    ]);
                                }
                            }
                        }
                    }
                    debugger;
                    _getReport(data);
                });
            })

            // usersService.getUsers('student').then(function (students) {
            //     self.users = self.users || [];
            //     self.users = self.users.concat(students);
            //     usersService.getUsers('instructor').then(function (instructors) {
            //         self.users = self.users.concat(instructors);
            //         lessonsService.getLessons(null, self.fromDate, self.toDate).then(function (lessons) {
            //             var data = [];
            //             data.push([
            //                 'מתאריך',
            //                 'עד תאריך',
            //                 'שם מדריך',
            //                 'שם תלמיד',
            //                 'סטטוס',
            //             ]);
            //             for (var lesson of lessons) {
            //                 for (var status of lesson.statuses)
            //                     data.push([
            //                         new Date(lesson.start),
            //                         new Date(lesson.end),
            //                         getName(lesson.resourceId),
            //                         getName(status.StudentId),
            //                         status.Status,
            //                     ]);
            //             }
            //             _getReport(data);
            //         });
            //     });
            // });
        }

        function _getShoeingDate(horse) {

            var horseBirthDate = horse.Meta.BirthDate;
            var shoeingDate = null;
            var hasLastShoeing = (typeof (horse.Meta.Shoeings) !== "undefined" && horse.Meta.Shoeings.length > 0);
            var first = moment(horseBirthDate).add(sharedValues.shoeing.first, 'days');

            if (hasLastShoeing) {
                horse.Meta.Shoeings = horse.Meta.Shoeings.sort(function (a, b) {
                    if (new Date(a.Date) > new Date(b.Date))
                        return 1;
                    else if (new Date(a.Date) < new Date(b.Date))
                        return -1;
                    else
                        return 0;
                });
                var lastShoeing = horse.Meta.Shoeings[horse.Meta.Shoeings.length - 1];
                shoeingDate = moment(lastShoeing.Date).add(sharedValues.shoeing.interval, 'days');
            }
            else if (_isFuture(first)) {
                shoeingDate = first;
            }

            return shoeingDate ? shoeingDate.toDate() : null;
        }

        function _getVaccineDate(vaccineName, horse) {
            var horseBirthDate = horse.Meta.BirthDate;
            var horseAge = moment().diff(moment(horseBirthDate), 'years');
            var vaccine = _getVaccination(vaccineName);
            var lastVaccination = _getLastVaccination(vaccineName, horse);
            var vaccineDate = null;
            var first = vaccine.first ? moment(horseBirthDate).add(vaccine.first, 'days') : null;
            var second = vaccine.second ? first.add(vaccine.second, 'days') : null;
            var interval = vaccine.interval;

            if (vaccineName == 'worming') {
                interval = horseAge >= 2 ? vaccine.interval2 : vaccine.interval1;
            }

            if (_isFuture(first) && lastVaccination.times < 1) {
                vaccineDate = first;
            } else if (_isFuture(second) && lastVaccination.times < 2) {
                vaccineDate = second;
            } else if (lastVaccination.times > 0) {
                vaccineDate = moment(lastVaccination.date).add(interval, 'days');
            }

            return vaccineDate ? vaccineDate.toDate() : null;

            function _getVaccination(id) {
                for (var i in sharedValues.vaccinations) {
                    if (sharedValues.vaccinations[i].id == id) {
                        return sharedValues.vaccinations[i];
                    }
                }
            }

            function _getLastVaccination(id, horse) {
                var lastVaccination = {};
                lastVaccination.times = 0;
                if (horse.Meta.Vaccinations) {
                    horse.Meta.Vaccinations.sort(function (a, b) {
                        if (new Date(a.Date) > new Date(b.Date))
                            return 1;
                        else if (new Date(a.Date) < new Date(b.Date))
                            return -1;
                        else
                            return 0;
                    });
                    for (var i in horse.Meta.Vaccinations) {
                        if (horse.Meta.Vaccinations[i].Type == id) {
                            lastVaccination.age = Math.ceil(moment.duration(moment(horse.Meta.Vaccinations[i].Date).diff(horse.Meta.BirthDate)).asDays());
                            lastVaccination.times++;
                            lastVaccination.date = horse.Meta.Vaccinations[i].Date;
                        }
                    }
                }
                return lastVaccination;
            }
        }

        function _isFuture(event) {
            return moment(event).isAfter(moment());
        }

        function _getReport(rows) {
            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }

            var data = rows;

            var ws_name = "SheetJS";

            var wscols = [];

            /*console.log("Sheet Name: " + ws_name);
            console.log("Data: "); for (var i = 0; i != data.length; ++i) console.log(data[i]);
            console.log("Columns :"); for (i = 0; i != wscols.length; ++i) console.log(wscols[i]);*/

            /* dummy workbook constructor */
            function Workbook() {
                if (!(this instanceof Workbook)) return new Workbook();
                this.SheetNames = [];
                this.Sheets = {};
            }
            var wb = new Workbook();

            /* TODO: date1904 logic */
            function datenum(v, date1904) {
                if (date1904) v += 1462;
                var epoch = Date.parse(v);
                return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
            }
            /* convert an array of arrays in JS to a CSF spreadsheet */
            function sheet_from_array_of_arrays(data, opts) {
                var ws = {};
                var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
                for (var R = 0; R != data.length; ++R) {
                    for (var C = 0; C != data[R].length; ++C) {
                        if (range.s.r > R) range.s.r = R;
                        if (range.s.c > C) range.s.c = C;
                        if (range.e.r < R) range.e.r = R;
                        if (range.e.c < C) range.e.c = C;
                        var cell = { v: data[R][C] };
                        if (cell.v == null) continue;
                        var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

                        /* TEST: proper cell types and value handling */
                        if (typeof cell.v === 'number') cell.t = 'n';
                        else if (typeof cell.v === 'boolean') cell.t = 'b';
                        else if (cell.v instanceof Date) {
                            cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                            cell.v = datenum(cell.v);
                        }
                        else cell.t = 's';
                        ws[cell_ref] = cell;
                    }
                }

                /* TEST: proper range */
                if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
                return ws;
            }
            var ws = sheet_from_array_of_arrays(data);

            /* TEST: add worksheet to workbook */
            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = ws;

            /* TEST: column widths */
            ws['!cols'] = wscols;

            var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary', cellStyles: true });
            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "report.xlsx");
        }
    }
})();