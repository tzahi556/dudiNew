(function () {

    var app = angular.module('app');

    app.component('student', {
        templateUrl: 'app/students/student.template.html',
        controller: StudentController,
        bindings: {
            user: '<',
            farms: '<',
            lessons: '<',
            instructors: '<',
            horses: '<',
            payments: '<',
            files: '<',
            commitments: '<',
            expenses: '<',
            userhorses: '<',
            students: '<',
            makav: '<'

        }
    });

    app.filter('dateRange', function () {

        return dateRangeFilter;

        function dateRangeFilter(items, from, to) {
            var results = [];
            var fromDate = moment(from).format('YYYYMMDD');
            var toDate = moment(to).format('YYYYMMDD');
            for (var i in items) {
                var startDate = moment(items[i].start).format('YYYYMMDD');

                if (startDate >= fromDate && startDate <= toDate) {
                    results.push(items[i]);
                }
            }
            return results;
        }
    });

    app.filter('reverse', function () {
        return function (items) {
            if (items) {
                return items.slice().reverse();
            }
        };
    });

    function StudentController(farmsService, usersService, lessonsService, filesService, sharedValues, $scope, $rootScope,
        $state, notificationsService, $http, $filter) {

        var self = this;
        this.scope = $scope;
        this.farmsService = farmsService;
        this.state = $state;
        this.HMOs = sharedValues.HMOs;
        this.lessonStatuses = sharedValues.lessonStatuses;
        this.styles = sharedValues.styles;
        this.submit = _submit.bind(this);
        this.getInstructorName = _getInstructorName.bind(this);

        this.delete = _delete.bind(this);
        this.addPayment = _addPayment.bind(this);
        this.addCheck = _addCheck.bind(this);
        this.cancelToken = _cancelToken.bind(this);
        this.refundPayment = _refundPayment.bind(this);
        this.removePayment = _removePayment.bind(this);
        this.addCommitment = _addCommitment.bind(this);
        this.removeCommitment = _removeCommitment.bind(this);
        this.changeLessonsStatus = _changeLessonsStatus.bind(this);
        this.countCommitmentLessons = _countCommitmentLessons.bind(this);
        this.countPaidLessons = _countPaidLessons.bind(this);
        this.countPaidMonths = _countPaidMonths.bind(this);

        this.initPaymentForm = _initPaymentForm.bind(this);
        this.initCommitmentForm = _initCommitmentForm.bind(this);
        this.initMakavForm = _initMakavForm.bind(this);

        this.setPaid = _setPaid.bind(this);
        this.getStatusIndex = _getStatusIndex.bind(this);
        this.setStatus = _setStatus.bind(this);
        this.setStatusZikuy = _setStatusZikuy.bind(this);
        this.initLessons = _initLessons.bind(this);
        this.countAllCredits = _countAllCredits.bind(this);
        this.isNullOrEmpty = _isNullOrEmpty.bind(this);
        this.createNotifications = _createNotifications.bind(this);
        this.addExpense = _addExpense.bind(this);
        this.initNewExpense = _initNewExpense.bind(this);
        this.removeExpense = _removeExpense.bind(this);
        this.countExpenses = _countExpenses.bind(this);
        this.initNewHorse = _initNewHorse.bind(this);
        this.removeHorse = _removeHorse.bind(this);
        this.addNewHorse = _addNewHorse.bind(this);
        this.uploadsUri = sharedValues.apiUrl + '/uploads/';
        this.removeFile = _removeFile.bind(this);
        this.uploadFile = _uploadFile.bind(this);
        this.isPrepaid = _isPrepaid.bind(this);
        this.countTotal = _countTotal.bind(this);
        this.openComments = _openComments.bind(this);
        this.commentClose = _commentClose.bind(this);
        this.countTotalByInvoiceSum = _countTotalByInvoiceSum.bind(this);
        this.countSherit = _countSherit.bind(this);
        this.openReport = _openReport.bind(this);
        this.filterReportMontlyComments = _filterReportMontlyComments.bind(this);
        this.monthlyReport = _monthlyReport.bind(this);
        this.getIfExpensiveInMas = _getIfExpensiveInMas.bind(this);
        this.payWin = false;
        this.disablBtn = false;
        this.migration = _migration.bind(this);
        // this.removeTextDetail = _removeTextDetail.bind(this);
        // this.addTextDetail = _addTextDetail.bind(this);
        this.getLessonsDateNoPaid = _getLessonsDateNoPaid.bind(this);
        this.getIfanyCheckValid = _getIfanyCheckValid.bind(this);
        this.setLessPrice = _setLessPrice.bind(this);
        this.createNewPayment = _createNewPayment.bind(this);
        this.changeLessonsData = _changeLessonsData.bind(this);

        this.getChecsObjList = _getChecsObjList.bind(this);
        this.addMakav = _addMakav.bind(this);
        this.removeMakav = _removeMakav.bind(this);
        this.setMakavDesc = _setMakavDesc.bind(this);
        this.getDayOfWeek = _getDayOfWeek.bind(this);
        this.setCheckboxForClose = _setCheckboxForClose.bind(this);
        this.AddMultipleLessons = _AddMultipleLessons.bind(this);
        this.createChildEvent = _createChildEvent.bind(this);
        this.removeLesson = _removeLesson.bind(this);
        this.modalRemoveAdd = _modalRemoveAdd.bind(this);
        this.getHebrewdocType = _getHebrewdocType.bind(this);
        this.isKabalaToMas = _isKabalaToMas.bind(this);
        this.setshowDivLeave = _setshowDivLeave.bind(this);
        this.printExtention = _printExtention.bind(this);


        this.printLessons = _printLessons.bind(this);
        this.printExcel = _printExcel.bind(this);
        this.printExcelExpensive = _printExcelExpensive.bind(this);

        
        this.getPrint = _getPrint.bind(this);
        this.changeExpense = _changeExpense.bind(this);
        this.setExpensiveZikuy = _setExpensiveZikuy.bind(this);
        this.getExpensesAfterZikuy = _getExpensesAfterZikuy.bind(this);
        
        
        this.show4 = _show4.bind(this);
        this.isDateMoreToday = _isDateMoreToday.bind(this);

        this.getRealDocType = _getRealDocType.bind(this);
        this.IsInstructorBlock = ($rootScope.role == "instructor") ? true : false;    // $rootScope.IsInstructorBlock;

        this.role = $rootScope.role;
        this.newPrice = 0;

        this.IsHiyuvInHashlama = 0;

        this.lessAdd = 1;
        this.typeAddRemove = 0;//0 הוספה 
        this.RemoveLess;       // 1 מחיקה

        this.parentEventStudents;

        this.StudentTotalLessons = 0;

     

      


        function _printExtention() {
            $.get('app/students/ReportExtenion.html?sssd=' + new Date(), function (text) {
                text = text.replace("@StudentName", self.user.FirstName + " " + self.user.LastName);

                var TableExtenion = "";


              

                for (var i in self.expenses) {

                    TableExtenion += "<tr>"
                        + "<td>" + ((self.expenses[i].Id) ? self.expenses[i].Id : "")
                        + "</td><td>" + ((self.expenses[i].ZikuyNumber) ? self.expenses[i].ZikuyNumber : "")
                          + "</td><td>" + moment(self.expenses[i].Date).format('DD/MM/YYYY') 
                          + "</td><td>" + ((self.expenses[i].Details)?self.expenses[i].Details:"")
                        + "</td><td>" + ((self.expenses[i].BeforePrice) ? self.expenses[i].BeforePrice : "")
                        + "</td><td>" + ((self.expenses[i].Discount) ? self.expenses[i].Discount : "")
                          + "</td><td>" + ((self.expenses[i].Price) ? self.expenses[i].Price : "")
                          + "</td><td>" + ((self.expenses[i].Paid) ? self.expenses[i].Paid : "")
                               + "</td><td>" + ((self.expenses[i].Sum)?self.expenses[i].Sum : "") + "</td></tr>";


                }

                text = text.replace("@TableExtenion", TableExtenion);

                var blob = new Blob([text], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                });


                saveAs(blob, " הוצאות אחרות " + new Date() + ".html");

            });

        }

        function _printLessons() {
            if (!this.dateFrom || !this.dateTo) { alert("חובה לבחור תאריכים לדו''ח"); return; }
           

            $.get('app/students/Report.html?sssd=' + new Date(), function (text) {
                text = text.replace("@FromDate", moment(self.dateFrom).format('DD/MM/YYYY')).replace("@ToDate", moment(self.dateTo).format('DD/MM/YYYY'));
                text = text.replace("@StudentName", self.user.FirstName + " " + self.user.LastName);

                var TableLessons = "";


                var datesLessons = $filter('dateRange')(self.lessons, self.dateFrom, self.dateTo);

                for (var i in datesLessons) {
                    
                    var index = (parseInt(i) + 1);


                    TableLessons += "<tr>"
                        + "<td>" + index
                        + "</td><td>" + self.getInstructorName(datesLessons[i].resourceId)
                        + "</td><td>" + self.getPrint(datesLessons[i].horsenames[0])
                        + "</td><td>" + self.getDayOfWeek(datesLessons[i].start) + " " + moment(datesLessons[i].start).format('DD/MM/YYYY')
                        + "</td><td style='text-align:right'>" + self.getPrint(datesLessons[i].statuses[0].Status, 1) + " " + ((datesLessons[i].statuses[0].IsComplete > 2) ? " (משיעור השלמה)" : "")
                        + "</td><td>" + self.getPrint(datesLessons[i].statuses[0].OfficeDetails)
                        + "</td><td>" + self.getPrint(datesLessons[i].lessprice)
                        + "</td><td>" + ((datesLessons[i].paid) ?' שולם ':"") + "</td></tr>";

                   
                }

                text = text.replace("@TableLessons", TableLessons);

                var blob = new Blob([text], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                });


                saveAs(blob, " שיעורים " + new Date() + ".html");

            });


        }


        function _printExcelExpensive() {
           

            var data = [];
            data.push([
                '#',
                'זיכוי',
                'תאריך',
                'תיאור',
                'עלות',
                'הנחה',
                'עלות סופית',
                'שולם',

            ]);

            for (var i in this.expenses) {
               // var index = (parseInt(i) + 1);
                data.push([



                    ((self.expenses[i].Id) ? self.expenses[i].Id : ""),
                    ((self.expenses[i].ZikuyNumber) ? self.expenses[i].ZikuyNumber : ""),
                    moment(self.expenses[i].Date).format('DD/MM/YYYY'),
                    ((self.expenses[i].Details) ? self.expenses[i].Details : ""),
                    ((self.expenses[i].BeforePrice) ? self.expenses[i].BeforePrice : "") ,
                    ((self.expenses[i].Discount) ? self.expenses[i].Discount : ""),
                    ((self.expenses[i].Price) ? self.expenses[i].Price : ""),
                    ((self.expenses[i].Paid) ? self.expenses[i].Paid : ""),
                    ((self.expenses[i].Sum) ? self.expenses[i].Sum : ""), 

                ]);

            }
            _getReport(data);
        }

        function _printExcel() {
            if (!this.dateFrom || !this.dateTo) { alert("חובה לבחור תאריכים לדו''ח"); return; }


          
                var TableLessons = "";


                var datesLessons = $filter('dateRange')(self.lessons, self.dateFrom, self.dateTo);

                var data = [];
                data.push([
                    '#',
                    'שם המדריך',
                    'סוס',
                    'התחלה',
                    'סטטוס',
                    'הערות משרד',
                    'מחיר',
                    'שולם',
                 
                ]);

            for (var i in datesLessons) {
                var index = (parseInt(i) + 1);
                data.push([
                    index,
                    self.getInstructorName(datesLessons[i].resourceId),
                    self.getPrint(datesLessons[i].horsenames[0]),
                    self.getDayOfWeek(datesLessons[i].start) + " " + moment(datesLessons[i].start).format('DD/MM/YYYY'),
                    self.getPrint(datesLessons[i].statuses[0].Status, 1) + " " + ((datesLessons[i].statuses[0].IsComplete > 2) ? " (משיעור השלמה)" : ""),
                    self.getPrint(datesLessons[i].statuses[0].OfficeDetails),
                    self.getPrint(datesLessons[i].lessprice),
                    ((datesLessons[i].paid) ? ' שולם ' : ""),
                  
                ]);

            }
              _getReport(data);
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


       
        function _getPrint(val,type) {
            if (type == 1) {

                for (var i in this.lessonStatuses) {
                    if (this.lessonStatuses[i].id == val)
                        return this.lessonStatuses[i].name;
                }
               



            }
            if (!val) return "";
            else return val;
        }




        function _setshowDivLeave() {

            if (this.user.IsLeave) return true;
            else return false;
        }



        function _show4(ashrai4) {

            alert(ashrai4);
        }

        function _getHebrewdocType(doc_type) {

            if (doc_type == 'Kabala') return 'קבלה';
            if (doc_type == 'MasKabala') return 'חשבונית מס קבלה';
            if (doc_type == 'Mas') return 'חשבונית מס';
            if (doc_type == 'Zikuy') return 'חשבונית זיכוי';

        }


        function _isDateMoreToday(date) {


            // צחי הוסיף פילטר שלא יציג את העבר
            if (moment(date) > moment().add(1, 'day') || moment(date) < moment('2020-05-01')) return true;

            return false;
        }




        function _removeLesson(lesson) {


            this.typeAddRemove = 1;

            this.RemoveLess = lesson;
            $('#myModalLabel').text('האם למחוק גם אירועים עתידיים? ');
            $('#dvAppendHad').text(' הסר שיעור באופן חד פעמי ');
            $('#dvAppendTz').text(' הסר כל השיעורים עתידיים ');
            $('#modalAddRemove').modal('show');







        }

        function _modalRemoveAdd(isTrue) {
            // הוספה
            if (this.typeAddRemove == 0) {

                var lastEvent = this.lessons[this.lessons.length - 1];
                this.createChildEvent(lastEvent, this.lessAdd, isTrue);
                this.initLessons();

            }

            // מחיקה
            if (this.typeAddRemove == 1) {//if(isTrue) // תמחק גם עתידי



                lessonsService.deleteOnlyStudentLesson(this.RemoveLess.id, this.user.Id, isTrue).then(function (res) {
                    this.lessons = res;
                    this.initLessons();
                }.bind(this));




                //var fakendDate = (isTrue) ? moment(this.RemoveLess.start).add(1000, 'day').format('YYYY-MM-DD') : this.RemoveLess.end;
                //lessonsService.getLessons(null, this.RemoveLess.start, fakendDate, null).then(function (lessons) {

                //    for (var i in lessons) {
                //        var index = lessons[i].students.indexOf(this.user.Id);
                //        if ((lessons[i].id == this.RemoveLess.id) || (lessons[i].resourceId == this.RemoveLess.resourceId && index != "-1" && ((isTrue && lessons[i].start > this.RemoveLess.start) || (!isTrue && lessons[i].start == this.RemoveLess.start)))) {

                //           debugger
                //            lessons[i].students.splice(index, 1);

                //            if (lessons[i].students.length == 0) {
                //                // במידה ואין עוד אף אחד תמחוק שיעור
                //                lessonsService.deleteLesson(lessons[i].id, false).then(function (res) {
                //                    for (var m in this.lessons) {
                //                        if (this.lessons[m].id == lessons[i].id) {
                //                            this.lessons.splice(m, 1);
                //                            break;
                //                        }
                //                    }

                //                }.bind(this));



                //            }
                //            else { // במידה ויש עוד תוריד רק את הנוכחי
                //                lessonsService.updateLesson(lessons[i], false, 0).then(function (res) {
                //                    debugger
                //                    for (var m in this.lessons) {
                //                        if (this.lessons[m].id == lessons[i].id) {
                //                            this.lessons.splice(m, 1);
                //                            break;
                //                        }
                //                    }
                //                }.bind(this));
                //            }

                //        }

                //    }

                //    this.initLessons();

                //}.bind(this));





            }





            $('#modalAddRemove').modal('hide');

        }

        function _AddMultipleLessons() {

            this.typeAddRemove = 0;
            var lastEvent = this.lessons[this.lessons.length - 1];

            if (!lastEvent) {
                alert("לא ניתן להוסיף שיעורים כאשר אין שיעורים כלל ");
                return;
            }

            var diffdays = (moment(lastEvent.start)).diff(moment(), 'days', true);
            if (diffdays > -8) {

                //   lessonsService.getifLessonsHaveMoreOneRider(lastEvent.id).then(function (res) {
                lessonsService.getLessons(null, lastEvent.start, lastEvent.end, null).then(function (lessons) {

                    for (var i in lessons) {

                        if (lessons[i].start == lastEvent.start && lessons[i].resourceId == lastEvent.resourceId) {
                            this.parentEventStudents = lessons[i].students;
                            break;
                        }
                    }




                    if (this.parentEventStudents.length > 1) {


                        $('#myModalLabel').text(' תלמיד זה נמצא בקבוצה, האם להוסיף שיעורים לכל הקבוצה? ');
                        $('#dvAppendHad').text(' הוסף רק תלמיד נוכחי ');
                        $('#dvAppendTz').text(' הוסף שיעורים לכל חברי הקבוצה ');
                        $('#modalAddRemove').modal('show');



                    }

                    else {

                        this.createChildEvent(lastEvent, this.lessAdd);
                        this.initLessons();

                    }



                }.bind(this));

            } else {
                alert("לא ניתן להוסיף שיעורים כאשר שיעור האחרון יותר משבוע");
            }

        }

        function _createChildEvent(parentEvent, lessonsQty, isMultiple) {

            if (lessonsQty > 0) {

                var newEvent = {
                    id: 0,
                    prevId: parentEvent.id,
                    start: moment(parentEvent.start).add(7, 'days').format('YYYY-MM-DDTHH:mm:ss'),
                    end: moment(parentEvent.end).add(7, 'days').format('YYYY-MM-DDTHH:mm:ss'),
                    resourceId: parentEvent.resourceId,
                    students: (isMultiple) ? this.parentEventStudents : [this.user.Id],
                    lessprice: parentEvent.lessprice,
                    lessonpaytype: parentEvent.lessonpaytype,
                    statuses: [{ "StudentId": this.user.Id, "Status": null, "Details": "", "IsComplete": 1 }],
                };


                lessonsService.updateLesson(newEvent, false, lessonsQty).then(function (res) {

                    if (res.Error) {

                        var DateTafus = moment(res.Error).format('DD/MM/YYYY HH:mm');
                        alert("המערכת יצרה שיעורים עד לתאריך - " + DateTafus + ", מדריך תפוס בתאריך זה ");
                        return;
                    }

                    newEvent.id = res.id;

                    this.lessons.push(newEvent);

                    this.createChildEvent(res, --lessonsQty, isMultiple);

                }.bind(this));
            }

        }




        function _getDayOfWeek(day) {
            var newDate = new Date(day);
            var CurrentDay = newDate.getDay();
            if (CurrentDay == 0) return "א'";
            if (CurrentDay == 1) return "ב'";
            if (CurrentDay == 2) return "ג'";
            if (CurrentDay == 3) return "ד'";
            if (CurrentDay == 4) return "ה'";
            if (CurrentDay == 5) return "ו'";
            if (CurrentDay == 6) return "ש'";

            return newDate.getDay();
        }

        function _changeLessonsData() {




            for (var i in this.lessons) {

                if (moment(this.lessons[i].start).format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD')) {
                    this.lessons[i].lessprice = this.user.Cost;
                    this.lessons[i].lessonpaytype = (this.user.PayType == "lessonCost") ? 1 : 2;
                    this.setLessPrice(this.lessons[i]);

                }

            }

        }

        function _openComments(statusIndex, lesson) {

            this.selectedStudent = statusIndex;
            this.currentLesson = lesson;
        }

        function _openReport(reportdate) {
            // alert(reportdate);

            this.selectedStudentForReport = this.user.Id;
            var instructorId = this.lessons[this.lessons.length - 1].resourceId;
            this.scope.$broadcast('reportMonth.show', this.filterReportMontlyComments(reportdate), this.user.FirstName + " " + this.user.LastName, this.user.Email, this.farm.Name, this.getInstructorName(instructorId));


        }

        function _filterReportMontlyComments(reportdate) {

            //  alert(this.lessons.length);
            var returnComments = [];

            for (var i in this.monthlyReportData) {
                if (moment(this.monthlyReportData[i].Date).format('YYYYMM') == moment(reportdate).format('YYYYMM')) {
                    returnComments.push(this.monthlyReportData[i]);

                }
            }



            return returnComments;
        }

        function _commentClose(returnmessages) {
            if (returnmessages) {
                this.currentLesson.statuses[this.selectedStudent].Details = "";
            }

            for (var i = 0; i < returnmessages.length; i++) {
                this.currentLesson.statuses[this.selectedStudent].Details += returnmessages[i] + "\n";
            }

            if (returnmessages) {

                this.changeLessonsStatus(
                    this.currentLesson.statuses[this.selectedStudent].Status,
                    this.currentLesson.statuses[this.selectedStudent].Details,
                    this.currentLesson.statuses[this.selectedStudent].StudentId,
                    this.currentLesson.id,
                    this.currentLesson.statuses[this.selectedStudent].IsComplete,
                    this.currentLesson,
                    true,
                    this.currentLesson.statuses[this.selectedStudent].OfficeDetails);
            }

        }

        window.wipeUser = function () {
            var email = prompt('email');
            $http.get(sharedValues.apiUrl + 'users/destroyuser/?email=' + email).then(function (response) {
                console.log(response);
            });
        }

        $scope.$on('submit', function (event, args) {

            //  if (confirm('האם לשמור שינוים')) {
            this.submit(true);
            // }
        }.bind(this));

        this.dateFrom = moment().add(-1, 'months').toDate();
        this.dateTo = moment().add(1, 'months').toDate();

        // init student
        this.initStudent = function () {
           
            if (this.user.IsTafus) { alert(" כרטיס תלמיד זה פתוח אצל ''" + this.user.TofesName + "'',לא ניתן לעבוד על אותו כרטיס במקביל")};
            //  this.migration();
            this.initPaymentForm();
            this.initCommitmentForm();
            this.initMakavForm();
            if (!$scope.idSelectedVote) $scope.idSelectedVote = 0;// סימון שורה ראשונה במידה ויש
            this.initNewExpense();
            this.initNewHorse();
            this.countAllCredits();
            this.monthlyReport();

            if (!this.user.LeaveDate) {
                this.user.LeaveDate = moment().toDate();
            }
            else {
                this.user.LeaveDate = moment(this.user.LeaveDate).startOf('day').toDate();
            }
            this.user.BirthDate = moment(this.user.BirthDate).startOf('day').toDate();
            this.user.DateForMonthlyPay = moment(this.user.DateForMonthlyPay).startOf('day').toDate();

            this.user.Active = this.user.Active || 'active';

            // set default farm
            if (this.farms.length == 1) {
                this.user.Farm_Id = this.user.Farm_Id || this.farms[0].Id;
            }
        }.bind(this);

        this.initStudent();

        function _migration() {

            if (this.user.Id == 0) return;

            // if is not migrated
            if (this.user.Meta.migration != 'v1') {

                // check if has other expenses
                if (this.user.Meta.Expenses && this.user.Meta.Expenses.length > 0) {
                    alert('migration failed: has expenses');
                    return
                }

                // check if has float payments
                for (var lessonPayment of this.user.Meta.Payments || []) {
                    if ((lessonPayment.InvoiceSum / lessonPayment.Price) % 1 != 0) {
                        alert('migration failed: invoice sum doesn\'t match lesson price');
                        return;
                    }
                }

                // make migration for lessons
                for (var lessonPayment of this.user.Meta.Payments || []) {
                    lessonPayment.lessons = lessonPayment.InvoiceSum / lessonPayment.Price;
                    lessonPayment.InvoiceDetails = lessonPayment.lessons + ' שיעורים';
                }

                // make migration for monthly 
                for (var monthlyPayment of this.user.Meta.MonthlyPayments || []) {
                    monthlyPayment.month = monthlyPayment.Date;
                    this.user.Meta.Payments = this.user.Meta.Payments || [];
                    monthlyPayment.InvoiceDetails = 'חודש ' + moment(monthlyPayment.month).format('MM/YYYY')
                    this.user.Meta.Payments.push(monthlyPayment);
                }

                // end migration
                this.user.Meta.migration = 'v1';
                alert('שדרוג התלמיד הצליח, יש ללחוץ על עדכן');
            }
        }

        function _removeFile(file) {
            filesService.delete(file).then(function () {
                this.files.splice(this.files.indexOf(file), 1);
            }.bind(this));
        }

        function _uploadFile(file) {

            this.files = this.files || [];
            if (file) {
                var fileObj = {};

                fileObj.Link = file;

                this.files.push(fileObj);
            }
        }

        function _createNotifications() {


            // בינתיים צחי ביטל
            //var hmoMessage = '';
            //for (var hmo of this.HMOs) {
            //    if (hmo.id == this.user.HMO) {
            //        if (hmo.maxLessons) {
            //            hmoMessage = ', לקוח ' + hmo.name + ' (נוצלו: ' + self.commitmentLessonsThisYear + ' שיעורים מתוך: ' + hmo.maxLessons + ')';
            //        }
            //    }
            //}


            //if (this.user.PayType == 'lessonCost') {
            //    // var notificationText = 'יתרת השיעורים של התלמיד ' + this.user.FirstName + ' ' + this.user.LastName + ' נמוכה' + hmoMessage;

            //} else {
            //    var notificationText = 'יש לגבות תשלום עבור החודש הבא מ' + this.user.FirstName + ' ' + this.user.LastName;
            //}

            var notificationText = ((this.role == "farmAdminHorse") ? " הלקוח " : " התלמיד ") + this.user.FirstName + ' ' + this.user.LastName + ' נמצא בחובה ועליו להסדיר את התשלום '; //+ hmoMessage;

            var heshbon = this.totalExpensesNoShulam * -1 + this.unpaidLessons; //+ this.monthlyBalance;



            notificationsService.createNotification({
                entityType: 'student',
                entityId: this.user.Id,
                group: 'balance',
                farmId: this.user.Farm_Id,
                // צחי שינה מ this.creditPaidLessons < 1 ל this.creditPaidLessons < 0
                text: (heshbon < 0) ? notificationText : null,
                //(this.user.Active == 'active' && this.creditPaidLessons < 0 && this.attendedLessons && this.attendedLessons > 0)
                //||
                //(this.user.Active == 'active' && this.user.PayType == 'monthCost') ? notificationText : null,
                date: moment().endOf('month').format('YYYY-MM-DD')
            });

            //text details notification


            this.monthlyReport();


            var detailsText = null;
            var condition1 = false;
            var condition2 = this.user.Style === "treatment"; //|| this.user.Meta.Style === "privateTreatment";
            //  var condition3 = moment() > (moment().endOf('month').add(-8, 'day'));


            for (var i in this.monthlyReportHeader) {
                if (moment(this.monthlyReportHeader[i].Date).format('YYYYMM') == moment().format('YYYYMM')) {
                    condition1 = true;
                    break;
                }
            }


            if (!condition1 && condition2) {
                detailsText = "חסרה הערה חודשית לתלמיד " + this.user.FirstName + " " + this.user.LastName;
            } else {
                detailsText = null;

            }



            notificationsService.createNotification({
                entityType: 'student',
                entityId: this.user.Id,
                group: 'details',
                farmId: this.user.Farm_Id,
                text: detailsText,
                date: moment().endOf('month').format('YYYY-MM-DD')// moment().format('YYYY-MM-DD')
            });
        }

        function _addExpense() {
            this.expenses = this.expenses || [];


         
            this.newExpense.Price = this.newExpense.BeforePrice;// - this.newExpense.Discount;
            this.newExpense.Price = (this.newExpense.IsZikuy) ? this.newExpense.Price * -1 : this.newExpense.Price;
            this.newExpense.BeforePrice = (this.newExpense.IsZikuy) ? this.newExpense.BeforePrice * -1 : this.newExpense.BeforePrice;
            this.expenses.push(this.newExpense);


            for (var i in this.expenses) {

                //if (this.expenses[i].SelectedForZikuy) {

                //    this.expenses[i].ZikuySum = this.newExpense.Price;
                //    this.expenses[i].ZikuyNumber = 7777;
                //    this.expenses[i].SelectedForZikuy = false;
                //}


                this.expenses[i].SelectedForZikuy = false;

                if (typeof (this.newExpense.ZikuyNumber) != "undefined" && this.expenses[i].Id == this.newExpense.ZikuyNumber) {

                    this.expenses[i].ZikuySum = this.newExpense.Price;
                }


            }


            this.initNewExpense();
            this.countAllCredits();



        }


        

        function _changeExpense(expense) {

            expense.Price = expense.BeforePrice - expense.Discount;

            this.countExpenses();
            
        }

        function _setExpensiveZikuy(expense) {

        
            this.newExpense.ZikuyNumber = expense.Id;
            
            this.countExpenses();

        }




        function _removeExpense(expense) {
            for (var i in this.expenses) {
                if (this.expenses[i] == expense) {
                    this.expenses.splice(i, 1);
                }
            }
            this.countAllCredits();
        }

        function _initNewExpense() {
            this.expenses = this.expenses || [];
            this.newExpense = {};
            this.newExpense.Date = new Date();
            if ($scope.expenseForm != null) {
                $scope.expenseForm.$setPristine();
            }

           

        }

        function _getIfExpensiveInMas(InvoiceNum) {

            for (var i in this.payments) {

                if (!this.payments[i].canceled &&
                    (this.payments[i].InvoiceNum == InvoiceNum || InvoiceNum.toString() == "true") &&
                    parseInt(moment(this.payments[i].Date).format('YYYYMMDD')) > parseInt(moment(sharedValues.DateModify).format('YYYYMMDD'))

                ) {
                    return true;
                }

            }

            return false;

        }



        function _isNullOrEmpty(value) {
            return value == null || value == '';
        }



        function _initNewHorse() {

            this.userhorses = this.userhorses || [];
            this.newHorse = null;
            if ($scope.newHorseForm != null) {
                $scope.newHorseForm.$setPristine();
            }
        }

        function _addNewHorse() {


            for (var i in this.userhorses) {
                if (this.userhorses[i].HorseId == this.newHorse.Id) {
                    return false;
                }
            }
            this.userhorses = this.userhorses || [];
            this.userhorses.push({ HorseId: this.newHorse.Id, Name: this.newHorse.Name, PensionPrice: 0 });
            this.initNewHorse();
        }

        function _removeHorse(horse) {
            var horses = this.userhorses;
            for (var i in horses) {
                if (horses[i].HorseId == horse.HorseId) {
                    horses.splice(i, 1);
                }
            }
        }

        function _monthlyReport() {
            var LastDate = "";
            this.monthlyReportData = [];
            this.monthlyReportHeader = [];
            var monthlyLessons = this.lessons || [];
            for (var i in monthlyLessons) {

                if (moment(monthlyLessons[i].start).format('YYYYMM') != LastDate && monthlyLessons[i].statuses[0].Details) {

                    LastDate = moment(monthlyLessons[i].start).format('YYYYMM');

                    this.monthlyReportHeader.push({ Date: monthlyLessons[i].start });
                }


                if (monthlyLessons[i].statuses[0].Details) {

                    // alert(monthlyLessons[i].statuses[0].Details);
                    this.monthlyReportData.push({ Date: monthlyLessons[i].start, Details: monthlyLessons[i].statuses[0].Details });


                }

                // var ddd = "dfdfdf";
                // alert(monthlyLessons[i].start);
                //payments.splice(i, 1);
                //break;

            }


        }

        function _getLessonsDateNoPaid(LessonsPaidCounter) {

            if (!LessonsPaidCounter || LessonsPaidCounter == 0) return "";
            var results = "תאריכי שיעורים- ";
            var TotalPAID = this.creditPaidLessons;

            for (var i in this.lessons) {

                if (!this.lessons[i].paid && this.lessons[i].lessprice && this.lessons[i].lessprice > 0) {

                    var studentsStatusObj = this.lessons[i].statuses[this.getStatusIndex(this.lessons[i])];
                    var CurrentStatus = studentsStatusObj.Status;


                    // במידה ומדובר בחווה שהחיוב הוא רק בעת הדרוש שיעור השלמה 
                
                    if (CurrentStatus == 'completionReq' || (this.IsHiyuvInHashlama == 1 && (studentsStatusObj.IsComplete > "3"))) continue;



                    var IsPast = parseInt(moment(this.lessons[i].start).format('YYYYMMDD')) < parseInt(moment().format('YYYYMMDD'));


                    if (
                        LessonsPaidCounter > 0 &&
                        (!IsPast || ['attended', 'notAttendedCharge', 'completionReqCharge'].indexOf(CurrentStatus) != -1)

                    ) {
                        if (TotalPAID > 0) {
                            TotalPAID--;

                        } else {

                            results += moment(this.lessons[i].start).format('DD/MM/YYYY') + ",  ";
                            LessonsPaidCounter--;

                        }
                    }


                }

            }


            return results;

        }

        //function _setLessonsDetails(lesson) {
        //    //this.lessonToUpdate = this.lessonToUpdate || [];
        //    //this.lessonToUpdate.push(lesson);
        //    //lessonsService.updateLessonDetails(lesson);

        //   lessonsService.updateLesson(lesson, false).then(function () {
        //        //this.createNotifications(event, 'update');
        //        //this.reloadLessons();
        //    }.bind(this));

        //}

        function _setLessPrice(lesson, index) {



            this.lessonStatusesToUpdate = this.lessonStatusesToUpdate || [];
            var found = false;
            for (var i in this.lessonStatusesToUpdate) {
                if (this.lessonStatusesToUpdate[i].studentId == this.user.Id && this.lessonStatusesToUpdate[i].lessonId == lesson.id) {

                    this.lessonStatusesToUpdate[i].lessprice = eval(lesson.lessprice);
                    this.lessonStatusesToUpdate[i].lessonpaytype = lesson.lessonpaytype;
                    found = true;
                }
            }
            if (!found) {

                this.lessonStatusesToUpdate.push({ studentId: this.user.Id, lessonId: lesson.id, lessprice: eval(lesson.lessprice), lessonpaytype: lesson.lessonpaytype });
            }


            this.countAllCredits();
            // this.changeLessonsStatus(lesson.statuses[statusIndex].Status, lesson.statuses[statusIndex].Details, lesson.statuses[statusIndex].StudentId, lesson.id, lesson.statuses[statusIndex].IsComplete, lesson, false);

        }

        function _initLessons() {







            // הגדרות בשביל הדוח
            this.lessReport = [];
            this.getStatusLengthFrom1 = 0, this.getStatusLengthFrom2 = 0, this.getStatusLengthFrom3 = 0, this.getStatusLengthFrom4 = 0, this.getStatusLengthFrom5 = 0;

            this.lessons = this.lessons.sort(function (a, b) {
                if (a.start > b.start)
                    return 1;
                if (a.start < b.start)
                    return -1;
                return 0;
            });



            this.creditPaidLessons = this.paidLessons //+ this.commitmentLessons;

            this.creditPaidMonth = this.paidMonths;

            this.results = [];
            this.newPrice = 0;

            
            this.StudentTotalLessons = 0;

            for (var i in this.lessons) {




                var ststIndex = this.getStatusIndex(this.lessons[i]);

                // שיעור השלמה
                if (this.lessons[i].statuses[ststIndex].IsComplete == "4") {
                    this.lessons[i].statuses[ststIndex].Status = "attended";

                }
                if (this.lessons[i].statuses[ststIndex].IsComplete == "6") {

                    this.lessons[i].statuses[ststIndex].Status = "notAttendedCharge";

                }
                if (this.lessons[i].statuses[ststIndex].IsComplete == "3") {
                    this.lessons[i].statuses[ststIndex].Status = "notAttended";
                }

                // this.calcLessonsReport();




                if (this.lessons[i].statuses[ststIndex].Status == "attended") this.getStatusLengthFrom1 += 1;
                if (this.lessons[i].statuses[ststIndex].Status == "notAttendedCharge") this.getStatusLengthFrom2 += 1;
                if (this.lessons[i].statuses[ststIndex].Status == "notAttended") this.getStatusLengthFrom3 += 1;
                if (this.lessons[i].statuses[ststIndex].Status == "notAttendedDontCharge") this.getStatusLengthFrom4 += 1;
                if (
                    this.lessons[i].statuses[ststIndex].Status == "completionReq"
                    ||
                    this.lessons[i].statuses[ststIndex].Status == "completionReqCharge"

                ) this.getStatusLengthFrom5 += 1;




                // הפרדה לאנשי מכבי
                if (this.lessons[i].lessprice == 0) {

                    var studentsStatusObj = this.lessons[i].statuses[this.getStatusIndex(this.lessons[i])];
                    var studentsStatus = studentsStatusObj.Status;  //|| (['completion'].indexOf(studentsStatus) != -1 && lesson.IsComplete==4)
                    if (['attended', 'notAttendedCharge', 'completionReqCharge'].indexOf(studentsStatus) != -1) {

                        // במידה ומדובר בחווה שהחיוב הוא רק בעת הדרוש שיעור השלמה 
                        if ((studentsStatusObj.IsComplete == "4" || studentsStatusObj.IsComplete == "6")  && this.IsHiyuvInHashlama == 1) {

                            this.lessons[i].paid = false;
                        }


                        if (this.commitmentLessons-- > 0)
                            this.lessons[i].paid = true;
                        else
                            this.lessons[i].paid = false;
                    } else {
                        this.lessons[i].paid = false;


                    }
                    continue;
                }



                if (this.lessons[i].statuses[ststIndex].IsComplete < 7) {


                    var res = this.setPaid(this.lessons[i]);
                    this.lessons[i].paid = res[0];
                    this.lessons[i].lessprice = eval(res[1]);

                    // אם השיעור התלמיד הגיע
                    if (res[2]) {

                        this.newPrice += eval(res[1]);

                        //*******************************************
                        var lprice = [];
                        lprice.price = this.lessons[i].lessprice;
                        lprice.type = this.lessons[i].lessonpaytype;
                        //1 שיעור    
                        //2 חודשים
                        lprice.count = 1;

                        var isExist = false;
                        for (var i = 0; i < this.lessReport.length; i++) {
                            if (this.lessReport[i]["price"] === lprice.price && this.lessReport[i]["type"] === lprice.type) {

                                this.lessReport[i]["count"] += 1;
                                isExist = true;
                            }
                        }

                        if (!isExist) this.lessReport.push(lprice);


                        this.StudentTotalLessons += 1;
                        //**************************************
                    }




                }
            }
        }

        function _getStatusIndex(lesson) {
            for (var i in lesson.statuses) {
                if (lesson.statuses[i].StudentId == this.user.Id) {
                    return i;
                }
            }
        }

        function _setStatus(lesson) {
            return parseInt(moment(lesson.start).format('YYYYMMDD')) < parseInt(moment().format('YYYYMMDD')) && this.isNullOrEmpty(lesson.statuses[this.getStatusIndex(lesson)].Status);
        }

        function _setStatusZikuy(doc_type) {
          
            return doc_type == 'Zikuy';
        }

        function _setPaid(lesson) {


            var Price = this.user.Cost;

            //for (var i in this.payments) {
            //    var month = this.payments[i].month;
            //    var untilmonth = this.payments[i].untilmonth;
            //    if (this.payments[i].month
            //        && !this.payments[i].canceled
            //        ) {
            //        if (!untilmonth) untilmonth = month;

            //        var diffMonth = (moment(untilmonth).startOf('month')).diff(moment(month).startOf('month'), 'months', true);
            //        if (diffMonth == 0) {
            //            diffMonth++;
            //        }

            //        // ביטלתי
            //        //else {
            //        //    if (parseInt(moment(this.payments[i].Date).format('YYYYMMDD')) < parseInt(moment("20190331").format('YYYYMMDD')))
            //        //        diffMonth++;
            //        //}

            //        for (var j = 0; j < diffMonth; j++) {
            //            if ((moment(month).add(j, 'M')).format('YYYYMM') == moment(lesson.start).format('YYYYMM')) {

            //                return [true, (lesson.lessprice) ? lesson.lessprice : Price, false, true];

            //            }

            //        }

            //    }

            //    //   return [false, Price];
            //}


            //completionReq
            var studentsStatusObj = lesson.statuses[this.getStatusIndex(lesson)];
            var studentsStatus = studentsStatusObj.Status;  //|| (['completion'].indexOf(studentsStatus) != -1 && lesson.IsComplete==4)
            if (['attended', 'notAttendedCharge', 'completionReqCharge'].indexOf(studentsStatus) != -1) {
                // במידה ומדובר בחווה שהחיוב הוא רק בעת הדרוש שיעור השלמה 
               
                if ((studentsStatusObj.IsComplete == "4" || studentsStatusObj.IsComplete == "6")  && this.IsHiyuvInHashlama == 1) {

                    return [false, (lesson.lessprice || lesson.lessprice == 0) ? lesson.lessprice : Price, false];
                }

                this.attendedLessons = this.attendedLessons || 0;
                this.attendedLessons++;
                if (lesson.lessonpaytype == 1) {
                    if (this.creditPaidLessons-- > 0) {

                        return [true, (lesson.lessprice || lesson.lessprice == 0) ? lesson.lessprice : Price, true];
                    }
                    else {
                        return [false, (lesson.lessprice || lesson.lessprice == 0) ? lesson.lessprice : Price, true];
                    }
                }
                else {


                    var monthOnly = moment(lesson.start).format("YYYYMM");
                    if (this.results.indexOf(monthOnly) == -1) {
                        this.results.push(monthOnly);

                        if (this.creditPaidMonth-- > 0) {
                            return [true, (lesson.lessprice || lesson.lessprice == 0) ? lesson.lessprice : Price, true];
                        }
                        else {
                            return [false, (lesson.lessprice || lesson.lessprice == 0) ? lesson.lessprice : Price, true];
                        }
                    } else
                        if (this.creditPaidMonth >= 0) {
                            return [true, (lesson.lessprice || lesson.lessprice == 0) ? lesson.lessprice : Price, false];

                        }

                }

            }

            return [false, (lesson.lessprice || lesson.lessprice == 0) ? lesson.lessprice : Price, false];
        }

        function _initPaymentForm() {


            for (var i in this.farms) {
                if (this.farms[i].Id == this.user.Farm_Id) {

                    var farm = this.farms[i];
                    if (farm.Meta === null) return;

                    //if (farm.Meta.farmTags.length > 0) {
                    //    //alert(farm.Meta.farmTags[0].tag_name);



                    //}

                    this.farm = farm;
                    this.showNewPayment = false;
                    this.newPayment = {};
                    this.currentCheckindex = 0;
                    this.checksCount = 0;
                    this.newPayment.doc_type = "";
                    this.newPayment.api_key = this.farm.Meta.api_key;
                    this.newPayment.ua_uuid = this.farm.Meta.ua_uuid;
                    this.newPayment.api_email = this.farm.Meta.api_email;
                    if (this.user.Farm_Id != 46) {
                        this.newPayment.isMasKabala = true;
                    } else {
                        this.newPayment.isMasKabala = false;
                        this.newPayment.isKabala = true;
                    }

                    this.IsHiyuvInHashlama = this.farm.IsHiyuvInHashlama;
                    ////אם לחייב אז תוריד את דרוש שיעור השלמה הרגיל


                    if (this.IsHiyuvInHashlama == 1 && this.lessonStatuses.length > 5) {

                        this.lessonStatuses.splice(4, 1);

                    } else if (this.lessonStatuses.length > 3) {

                        this.lessonStatuses.splice(5, 1);
                    }


                    this.newPayment.Date = new Date();
                    this.newPayment.Price = this.user.Cost;
                    this.newPayment.IsAshrai = this.farm.Meta.IsAshrai;
                    this.newPayment.IsToken = this.farm.Meta.IsToken;

                    if ($scope.paymentForm != null) {
                        $scope.paymentForm.$setPristine();
                    }




                    break;
                }

            }

            //  alert(this.IsHiyuvInHashlama);


            //this.farmsService.getFarm(this.user.Farm_Id).then(function (farm) {


            //    if (farm.Meta === null) return;
            //    this.farm = farm;
            //    this.showNewPayment = false;
            //    this.newPayment = {};
            //    this.newPayment.api_key = this.farm.Meta.api_key;
            //    this.newPayment.ua_uuid = this.farm.Meta.ua_uuid;
            //    this.newPayment.api_email = this.farm.Meta.api_email;
            //    if (this.user.Farm_Id != 46) {
            //        this.newPayment.isMasKabala = true;
            //    } else {

            //        this.newPayment.isKabala = true;
            //    }
            //    //let current_datetime = new Date()
            //    //let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds()

            //    this.IsHiyuvInHashlama = this.farm.IsHiyuvInHashlama;

            //    this.newPayment.Date = new Date();
            //    this.newPayment.Price = this.user.Cost;
            //    this.newPayment.IsAshrai = this.farm.Meta.IsAshrai;
            //    this.newPayment.IsToken = this.farm.Meta.IsToken;

            //    if ($scope.paymentForm != null) {
            //        $scope.paymentForm.$setPristine();
            //    }




            //}.bind(this));


        }


        function _countTotal() {
          
            self.newPayment.InvoiceSum = 0;
            self.newPayment.InvoiceDetails = '';
            if (self.newPayment.lessons || self.newPayment.month) {
                if (self.user.PayType == 'lessonCost') {
                    self.newPayment.InvoiceSum += self.newPayment.lessons * self.user.Cost;
                    // self.newPayment.InvoiceDetails += ((this.farm.Meta.IsRekivaTipulitInKabala && self.user.Style == "treatment") ? "רכיבה טיפולית - " : "") + self.newPayment.lessons + ' שיעורים ' + ((this.farm.Meta.IsDateInKabala) ? ("," + this.getLessonsDateNoPaid(self.newPayment.lessons)) : "");// "," + this.getLessonsDateNoPaid(self.newPayment.lessons);  //only for dev

                    if (this.farm.Meta.IsRekivaTipulitInKabala) {

                        if (self.user.Style == "treatment") {
                            // var styleObject = sharedValues.styles.filter(x => x.id == self.user.Style);   //this.getStyleObjectfromSharedValue
                            self.newPayment.InvoiceDetails += " תשלום עבור " + self.newPayment.lessons + " טיפולי רכיבה "; //((this.farm.Meta.IsDateInKabala) ? ("," + this.getLessonsDateNoPaid(self.newPayment.lessons)) : "");
                        }
                        if (self.user.Style == "phizi") {
                            // var styleObject = sharedValues.styles.filter(x => x.id == self.user.Style);   //this.getStyleObjectfromSharedValue
                            self.newPayment.InvoiceDetails += " תשלום עבור " + self.newPayment.lessons + " טיפולי פיזותרפיה "; //((this.farm.Meta.IsDateInKabala) ? ("," + this.getLessonsDateNoPaid(self.newPayment.lessons)) : "");
                        }

                    }

                    if (this.farm.Meta.IsDateInKabala) {

                        self.newPayment.InvoiceDetails += "," + this.getLessonsDateNoPaid(self.newPayment.lessons);

                    }







                }
                else {
                    var diffMonth = 1;
                    if (self.newPayment.untilmonth && self.newPayment.month) {

                        diffMonth = (moment(self.newPayment.untilmonth).startOf('month')).diff(moment(self.newPayment.month).startOf('month'), 'months', true);
                        if (diffMonth < 0) {
                            self.newPayment.untilmonth = '';
                            alert("טווח תאריכים שגוי!");
                            return;

                        }

                        self.newPayment.InvoiceSum += self.user.Cost * ((diffMonth == 0) ? 1 : diffMonth);
                        self.newPayment.InvoiceDetails += 'חודש ' + moment(self.newPayment.month).format('DD/MM/YYYY') + ' עד חודש ' + moment(self.newPayment.untilmonth).format('DD/MM/YYYY');

                    }
                    if (!self.newPayment.untilmonth && self.newPayment.month) {
                        self.newPayment.InvoiceSum += self.user.Cost;
                        self.newPayment.InvoiceDetails += 'חודש ' + moment(self.newPayment.month).format('DD/MM/YYYY');
                    }

                }
            }
            if (this.expenses !== undefined) {
                for (var expense of this.expenses.filter(function (expense) { return expense.Checked && expense.Price != expense.Sum })) {

                    self.newPayment.InvoiceSum += expense.Price + ((!expense.ZikuySum) ? 0 : expense.ZikuySum) - ((!expense.Sum) ? 0 : expense.Sum);
                    self.newPayment.InvoiceDetails += ', ' + expense.Details;
                }
            }

        }
        //function _countTotal() {


        //    debugger
        //    self.newPayment.InvoiceSum = 0;
        //    self.newPayment.InvoiceDetails = '';
        //    if (self.newPayment.lessons || self.newPayment.month) {
        //        if (self.user.PayType == 'lessonCost') {
        //            self.newPayment.InvoiceSum += self.newPayment.lessons * self.user.Cost;
        //            self.newPayment.InvoiceDetails += ((this.farm.Meta.IsRekivaTipulitInKabala && self.user.Style == "treatment") ? "רכיבה טיפולית - " : "") + self.newPayment.lessons + ' שיעורים ' + ((this.farm.Meta.IsDateInKabala) ? ("," + this.getLessonsDateNoPaid(self.newPayment.lessons)) : "");// "," + this.getLessonsDateNoPaid(self.newPayment.lessons);  //only for dev

        //        }
        //        else {
        //            var diffMonth = 1;
        //            if (self.newPayment.untilmonth && self.newPayment.month) {

        //                diffMonth = (moment(self.newPayment.untilmonth).startOf('month')).diff(moment(self.newPayment.month).startOf('month'), 'months', true);
        //                if (diffMonth < 0) {
        //                    self.newPayment.untilmonth = '';
        //                    alert("טווח תאריכים שגוי!");
        //                    return;

        //                }

        //                self.newPayment.InvoiceSum += self.user.Cost * ((diffMonth == 0) ? 1 : diffMonth);
        //                self.newPayment.InvoiceDetails += 'חודש ' + moment(self.newPayment.month).format('DD/MM/YYYY') + ' עד חודש ' + moment(self.newPayment.untilmonth).format('DD/MM/YYYY');

        //            }
        //            if (!self.newPayment.untilmonth && self.newPayment.month) {
        //                self.newPayment.InvoiceSum += self.user.Cost;
        //                self.newPayment.InvoiceDetails += 'חודש ' + moment(self.newPayment.month).format('DD/MM/YYYY');
        //            }

        //        }
        //    }
        //    if (this.expenses !== undefined) {
        //        for (var expense of this.expenses.filter(function (expense) { return expense.Checked && expense.Price != expense.Sum })) {

        //            self.newPayment.InvoiceSum += expense.Price - ((!expense.Sum) ? 0 : expense.Sum);
        //            self.newPayment.InvoiceDetails += ', ' + expense.Details;
        //        }
        //    }

        //}

        function _cancelToken() {

            this.user.cc_token = "";

        }

        //איבנט בעת שינוי סכום חשבונית מאתחל את כמות השיעורים בהתאם לסכום
        function _countTotalByInvoiceSum() {

            self.newPayment.InvoiceDetails = "";
            var TempExpenses = 0;
            if (this.expenses !== undefined) {
                for (var expense of this.expenses.filter(function (expense) { return !expense.Paid && expense.Checked })) {
                    TempExpenses += expense.Price;
                }
            }

            self.newPayment.lessons = 0;



            if (self.user.PayType == 'lessonCost') {

                var TempSum = this.Sherit + self.newPayment.InvoiceSum - TempExpenses;
                ////מקרה שקסדה עולה 120 שח ושילמתי 80 שיעדכן שיש לי 80 ש"ח עודף
                if (TempExpenses > 0 && self.newPayment.InvoiceSum < TempExpenses) {
                    self.newPayment.lessons += 0;
                    return;
                }

                if (TempSum < 0) return;
                //הסכום גדול קח את ההפרש לעודף
                var DivisionRemainder = TempSum % self.user.Cost;
                self.newPayment.lessons += (TempSum - DivisionRemainder) / self.user.Cost;

            }

            if (self.newPayment.lessons)

                self.newPayment.InvoiceDetails += ((this.farm.Meta.IsRekivaTipulitInKabala && self.user.Meta.Style == "treatment") ? "רכיבה טיפולית - " : "") + self.newPayment.lessons + ' שיעורים ' + ((this.farm.Meta.IsDateInKabala) ? ("," + this.getLessonsDateNoPaid(self.newPayment.lessons)) : "");
            if (this.expenses !== undefined) {
                for (var expense of this.expenses.filter(function (expense) { return !expense.Paid && expense.Checked })) {

                    //self.newPayment.InvoiceSum += expense.Price;
                    self.newPayment.InvoiceDetails += ', ' + expense.Details + ', ';
                }
            }

        }

        //מחיקה
        function _removePayment(payment) {

            var removeApprove = confirm('האם למחוק את החשבונית?');
            if (!removeApprove) return;
            var payments = this.payments;

            for (var i in payments) {
                if (payments[i].InvoiceNum == payment.InvoiceNum) {
                    payments.splice(i, 1);
                    break;
                }
            }
            this.countAllCredits();
        }

        //זיכוי
        function _refundPayment(payment) {
            var cancelApprove = prompt('כדי לבטל חשבונית, אנא הזן את מספר חשבונית הזיכוי');
            if (!cancelApprove || cancelApprove == '') return;
            var payments = this.payments;
            payment.canceled = cancelApprove;
            for (var i in this.expenses) {
                if (this.expenses[i].Paid == payment.InvoiceNum) {
                    delete this.expenses[i].Paid;
                    delete this.expenses[i].Checked;
                }
            }
            this.countAllCredits();
        }

        function _initCommitmentForm() {
            this.newCommitment = {};
            this.newCommitment.Date = new Date();
            if ($scope.commitmentForm != null) {
                $scope.commitmentForm.$setPristine();
            }
        }

        function _initMakavForm() {
            this.newMakav = {};
            this.newMakav.Date = new Date();
            this.newMakav.UserWrite = localStorage.getItem('userLogin');
            //if ($scope.commitmentForm != null) {
            //    $scope.commitmentForm.$setPristine();
            //}
        }

        function _changeLessonsStatus(status, details, studentId, lessonId, isComplete, lesson, isText, officedetails) {

         
            if (!isText && (isComplete > 2)) {
              

                if (status && status != "attended" && status != "notAttended" && status != "notAttendedCharge") {

                    alert("בשיעור השלמה ניתן להזין רק אם הגיע \ לא הגיע");
                    //lesson.statuses[0].IsComplete = isComplete;
                    lesson.statuses[0].Status = "completion";
                    this.initLessons();
                    return;
                }

                if (status == "attended") {

                    isComplete = 4;
                }

                if (status == "notAttendedCharge") {

                    isComplete = 6;
                }


                if (status == "notAttended") {

                    isComplete = 3;
                }

                if (!status) {

                    isComplete = 5;
                }


               
            }

            if (isComplete > 2) {
                status = "completion";
                lesson.statuses[0].Status = "completion";
                lesson.statuses[0].IsComplete = isComplete;
            }



            if ((status == "completionReq" || status == "completionReqCharge") && isComplete == 0) {

                isComplete = 1;
            }


            this.lessonStatusesToUpdate = this.lessonStatusesToUpdate || [];
            var found = false;
            for (var i in this.lessonStatusesToUpdate) {
                if (this.lessonStatusesToUpdate[i].studentId == studentId && this.lessonStatusesToUpdate[i].lessonId == lessonId) {
                    this.lessonStatusesToUpdate[i].status = status;
                    this.lessonStatusesToUpdate[i].details = details;
                    this.lessonStatusesToUpdate[i].officedetails = officedetails;
                    this.lessonStatusesToUpdate[i].isComplete = isComplete;

                    found = true;
                }
            }
            if (!found) {
                this.lessonStatusesToUpdate.push({ studentId: studentId, lessonId: lessonId, status: status, details: details, isComplete: isComplete, officedetails: officedetails });
            }

            this.countAllCredits();
        }

        function _countAllCredits() {

            this.countCommitmentLessons();
            this.countPaidLessons();
            this.countExpenses();
            this.countPaidMonths();
            this.initLessons();

            this.countSherit();
            // unpaid lessons
            //חוב על שיעורים
            //    if (this.user.PayType == 'lessonCost') {

            this.unpaidLessons = this.Sherit;// (this.Sherit -this.totalExpensesShulam - this.user.Meta.Cost);


            //  }



            //  alert(this.totalExpensesNoShulam * -1 + this.unpaidLessons + this.monthlyBalance);
        }

        //הוצאות אחרות
        function _countExpenses() {



            var total = 0;
            this.totalExpensesShulam = 0;

            for (var i in this.expenses) {
                var exp = this.expenses[i];

                if (!exp.Paid) {

                    total += exp.Price;

                }
                else {

                    this.totalExpensesShulam += exp.Price;// שונה Price

                }
            }


            this.totalExpensesNoShulam = total;

        }


        //הוצאות אחרות
        function _getExpensesAfterZikuy() {
           
            var TempExpenses =this.expenses || [];

            
            for (var i in TempExpenses) {
                var exp = TempExpenses[i];

                if (!exp.ZikuyNumber) {

                    for (var y in TempExpenses) {
                        var ZikuyNumber = TempExpenses[y].ZikuyNumber;
                        if (ZikuyNumber == exp.Id) {
                            TempExpenses[i].Price = TempExpenses[i].Price + TempExpenses[y].Price;
                        }

                    }

                }
            }


           
            return TempExpenses;
        }




        

        function _countPaidLessons() {

            var payments = this.payments || [];
            var totalLessons = 0;
            var totalLessonsThisYear = 0;
            for (var i in payments) {
                if (payments[i].lessons && payments[i].canceled) payments[i].count = 0 + " שיעורים ";
                if (payments[i].lessons && !payments[i].canceled) {
                    totalLessons += payments[i].lessons;
                    payments[i].count = payments[i].lessons + " שיעורים ";
                    if (moment(payments[i].Date).format('YYYY') == moment().format('YYYY')) {
                        totalLessonsThisYear += payments[i].lessons;
                    }
                }
            }


            this.paidLessons = totalLessons;
            this.paidLessonsThisYear = totalLessonsThisYear;
        }

        function _countPaidMonths() {

            var payments = this.payments || [];
            var results = [];
            var sum = 0;
            var paid = 0;
            var totalExpenOut = 0;
            for (var i in payments) {

                if (payments[i].month && payments[i].canceled) payments[i].count = 0 + " חודשים ";
                if (payments[i].month && !payments[i].canceled) {
                    paid += payments[i].InvoiceSum;
                    var month = moment(payments[i].month).format('MM-YYYY');
                    if (results.indexOf(month) == -1) {
                        var untilmonth = moment(payments[i].untilmonth).format('MM-YYYY');
                        if (payments[i].untilmonth && payments[i].untilmonth != payments[i].month) {
                            var diffMonth = (moment(payments[i].untilmonth).startOf('month')).diff(moment(payments[i].month).startOf('month'), 'months', true);
                            if (diffMonth == 0) {
                                diffMonth++;
                            }
                            //else {
                            //    if (parseInt(moment(payments[i].Date).format('YYYYMMDD')) < parseInt(moment("20190331").format('YYYYMMDD'))) diffMonth++;
                            //}

                            payments[i].count = diffMonth + " חודשים ";
                            for (var j = 0; j < diffMonth; j++) {
                                results.push(moment(payments[i].month).add(j, 'M'));
                                sum += payments[i].Price;
                            }


                        } else {
                            payments[i].count = 1 + " חודשים ";
                            results.push(month);
                            sum += payments[i].Price;
                        }



                    }
                }
                //else if (!payments[i].lessons && !payments[i].canceled) {

                //    totalExpenOut += payments[i].InvoiceSum;

                //}
            }

            //alert(this.unpaidLessons);
            // var totalOnlyMonth = (this.user.PayType == 'lessonCost') ? 0 : (this.totalExpensesShulam - totalExpenOut);
            this.paidMonths = results.length;

            // this.monthlyBalance = paid - this.totalExpensesShulam - sum;


        }

        function _isKabalaToMas(InvoiceNum, ParentInvoiceNum) {
            var payments = this.payments || [];

            for (var i in payments) {

                if (!payments[i].canceled) {

                    if ((payments[i].InvoiceNum == ParentInvoiceNum || payments[i].ParentInvoiceNum == InvoiceNum)
                        && payments[i].doc_type == "Kabala"
                        && payments[i].payment_type == "check")

                        return true;

                }
            }

          
            return false;
        }
        function _countSherit() {

           
            this.totalPay = 0;
            var total = 0;
            var totalLessons = 0;
            this.Sherit = 0;
            var payments = this.payments || [];

            for (var i in payments) {

                if (!payments[i].canceled) {

                    // קורס מדריכם מחנה רכיבה ופנסיון מקבל הגדרה אחרת רק לפי חשבוניות מס
                    if (payments[i].doc_type == "Mas") {
                        if ((this.user.Style == "course" || this.user.Style == "camp" || this.user.Style == "horseHolder")) {

                            if (this.isKabalaToMas(payments[i].InvoiceNum, payments[i].ParentInvoiceNum))
                                total += payments[i].InvoiceSum || 0;
                        }

                    }
                    else {

                        if ((this.user.Style == "course" || this.user.Style == "camp" || this.user.Style == "horseHolder") && payments[i].payment_type == "check" && (payments[i].doc_type == "Kabala")) {
                            continue;
                        }


                        total += payments[i].InvoiceSum || 0;
                    }

                }


            }



            this.totalPay = total;
            //this.newPrice כמה היה צריך לשלם לפי החישוב של הגעה  

            this.Sherit = (total - this.totalExpensesShulam) - this.newPrice;


            //  הוספתי למקרה שהשארית יותר גדולה ממחיר שיעור אז תחשיב שיעור
            //if (this.Sherit > 0 && this.Sherit >= this.user.Cost && this.user.Cost > 0) {
            //    this.paidLessons++;
            //    this.Sherit = this.Sherit - this.user.Cost;
            //}

            //  הוספתי למקרה שהשארית יותר גדולה ממחיר שיעור אז תחשיב שיעור
            //if (this.Sherit < 0 && this.Sherit <= this.user.Cost && this.user.Cost > 0) {
            //    this.creditPaidLessons--;
            //  //  this.Sherit = this.Sherit + this.user.Cost;
            //}



        }

        // התחייבות
        function _countCommitmentLessons() {

            var commitments = this.commitments || [];

            var total = 0;
            var totalThisYear = 0;
            for (var i in commitments) {

                if (!commitments[i].Date) { commitments[i].Date = '01/01/2016' };
                total += commitments[i].Qty;
                var isThisYear = moment(commitments[i].Date).format('YYYY') == moment().format('YYYY');
                if (isThisYear) {
                    totalThisYear += commitments[i].Qty;
                }
            }
            this.commitmentLessons = total;
            this.commitmentLessonsThisYear = totalThisYear;
        }

        function _addCommitment() {
            this.commitments = this.commitments || [];
            this.newCommitment.HMO = this.user.HMO;

            //  this.newCommitment.Date = this.newCommitment.Date || new Date();



            this.commitments.push(this.newCommitment);
            this.initCommitmentForm();
            this.countAllCredits();
        }

        function _removeCommitment(commitment) {
            var commitments = this.commitments;
            for (var i in commitments) {
                if (commitments[i] == commitment) {
                    commitments.splice(i, 1);
                }
            }
            this.countAllCredits();
        }


        function _addMakav() {
            this.makav = this.makav || [];
            //    this.newMakav.UserWrite = "צחיאל חזן";
            this.makav.push(this.newMakav);
            this.initMakavForm();

        }

        function _removeMakav(ma, ind) {

            $scope.idSelectedVote = ind;
            if (confirm('האם למחוק את המעקב?')) {
                var makav = this.makav;
                for (var i in makav) {
                    if (makav[i] == ma) {
                        makav.splice(i, 1);
                    }
                }

                $scope.idSelectedVote -= 1;
            }
        }

        function _setMakavDesc(ma, ind) {
            $scope.idSelectedVote = ind;
            $scope.Desc = ma.Desc;
            //  $scope.idSelectedVote  = ma.Id;
            //  alert(ma.Desc);

            //var makav = this.makav;
            //for (var i in makav) {
            //    if (i == ind) {
            //        makav.splice(i, 1);
            //    }
            //}

        }






        this.getccType = function (ValeType) {

            switch (ValeType) {
                case "Isracart":
                    return "1";
                case "Visa":
                    return "2";
                case "Dainers":
                    return "3";
                case "American express":
                    return "4";
                case "Leumi card":
                    return "6";
                case "Mastercard":
                    return "99";
                default:
                    return "0";
            }

        }

        this.getccTypeName = function (ValeType) {

            switch (ValeType) {
                case "1":
                    return "ישראכרט";
                case "2":
                    return "ויזה";
                case "3":
                    return "דיינרס";
                case "4":
                    return "אמירקן אקספרס";
                case "6":
                    return "לאומי קארד";
                case "99":
                    return "מאסטר קארד";
                default:
                    return "0";
            }

        }

        this.winPayClose = function () {

            // alert(getUrlParameter("http://ynet.co.il?sdsd=1&Shir=3", "Shir"));


            if (this.newPayment.payment_type == 'ashrai') {
                this.newPayment.payment_type = 'validate';
                this.newPayment.ksys_token = this.ksys_token;
                $http.post(sharedValues.apiUrl + 'invoices/sendInvoice/', this.newPayment).then(function (response) {

                    if (response.data.success) {

                        this.newPayment.payment_type = 'credit card';
                        this.newPayment.cc_number = response.data.cgp_customer_cc_4_digits;
                        this.newPayment.cc_payment_num = response.data.cgp_shva_transacion_id;
                        this.newPayment.cc_num_of_payments = response.data.cgp_num_of_payments;
                        this.newPayment.cc_customer_name = response.data.cgp_customer_name;
                        this.newPayment.cc_deal_type = (response.data.cgp_num_of_payments == 1) ? "1" : "2";// סוג עסקה לבדוק
                        this.newPayment.cc_type = this.getccType(response.data.cgp_customer_cc_name);
                        this.addPayment();

                    } else {

                        // alert("תקלה בחיוב כרטיס אשראי");
                        this.newPayment.payment_type = 'ashrai';
                    }



                }.bind(this));
            }




            if (this.newPayment.payment_type == 'token') {
                //  alert("כרטיס אשראי נרשם בהצלחה! מעתה תוכל לחייב בטוקן");
                window.location.reload();


            }





            this.disablBtn = false;
        }

        function _addPayment() {

            if (this.newPayment.payment_type == 'check') {
                var TotalSumFromChecks = 0;
                for (var i in this.newPayment.Checks) {
                    var checks_bank_name = this.newPayment.Checks[i].checks_bank_name;
                    var checks_number = this.newPayment.Checks[i].checks_number;
                    var checks_date = this.newPayment.Checks[i].checks_date;
                    var checks_sum = this.newPayment.Checks[i].checks_sum;


                    //  this.newPayment.Checks[i].UserId = this.user.Id;
                    //   this.newPayment.Checks[i].PaymentsId = 0;

                    if (checks_bank_name && checks_number && checks_date && checks_sum) {
                        TotalSumFromChecks += eval(checks_sum);
                    } else {
                        this.newPayment.Checks.splice(i, 1);
                    }

                }


                if (TotalSumFromChecks != this.newPayment.InvoiceSum) {

                    alert("סך כל הצ'קים אינו זהה לסכום לתשלום.");
                    return;
                }

            }


            this.disablBtn = true;

            var UserTypePaid = this.user.PayType;
            this.newPayment.customer_name = (this.user.Organzion ? (this.user.Organzion + "-"):"") +   this.user.FirstName + ' ' + this.user.LastName;
            this.newPayment.customer_email = this.user.AnotherEmail;
            this.newPayment.customer_address = this.user.Address;
            this.newPayment.UserId = this.user.Id;

            // הגדרות בשביל מס' לקוח
            this.newPayment.customer_crn = this.user.IdNumber;
            this.newPayment.c_accounting_num = this.user.ClientNumber;

            // הוספת טאג 
            this.newPayment.tag_id = this.tag_id;





            this.newPayment.comment =
                'מס לקוח: ' + (this.user.ClientNumber || "") +
                ', ת.ז.: ' + (this.user.IdNumber || "");


            // במידה וקיים כבר טוקן על הכרטיס תלמיד תשלום עם טוקן
            if (this.user.cc_token && this.newPayment.payment_type == 'token') {

                this.newPayment.cc_token = this.user.cc_token;
                this.newPayment.cc_type_id = this.user.cc_type_id;
                this.newPayment.cc_type_name = this.user.cc_type_name;
                this.newPayment.cc_4_digits = this.user.cc_4_digits;
                this.newPayment.cc_payer_name = this.user.cc_payer_name;
                this.newPayment.cc_payer_id = this.user.cc_payer_id;
                this.newPayment.cc_expire_month = this.user.cc_expire_month;
                this.newPayment.cc_expire_year = this.user.cc_expire_year;

                this.newPayment.payment_type = 'tokenBuy';

            }

            var newPayment = angular.copy(this.newPayment);
            newPayment.cc_type_name = this.getccTypeName(this.newPayment.cc_type);
            newPayment.doc_type = this.getRealDocType(newPayment);//(newPayment.isMasKabala) ? "MasKabala" : ((newPayment.isKabala || newPayment.isKabalaTroma) ? "Kabala" : "");

            var TempSum = newPayment.InvoiceSum;






            if (!newPayment.noEazi && (newPayment.isMasKabala || newPayment.isKabala || newPayment.isKabalaTroma || newPayment.isMas || newPayment.isZikuy)) {
                newPayment.parents = [];
                this.payments.map(function (payment) {

                    if (payment.SelectedForInvoiceTemp) {
                        newPayment.parents.push(payment.doc_uuid);
                        // newPayment.parents = ;
                    }
                });

                if (newPayment.parents)
                    newPayment.parents = (newPayment.parents).join();




                $http.post(sharedValues.apiUrl + 'invoices/sendInvoice/', newPayment).then(function (response) {


                    if (response.data == "-1") {
                        alert('לא ניתן להנפיק מסמך , תעודת זהות קיימת במערכת');
                        return;
                    }
                    if (this.newPayment.payment_type == 'ashrai' || this.newPayment.payment_type == 'token') {

                        if (response.data.errMsg) {
                            alert("תקלה בסליקת האשראי!");
                            return;
                        }

                        // מאחר וזה פוסט אני מעדכן את השדות שלא יאבדו לי
                        this.newPayment.InvoiceSum = newPayment.InvoiceSum;
                        this.newPayment.InvoiceDetails = newPayment.InvoiceDetails;
                        this.ksys_token = response.data.secretTransactionId;
                        var top = 0;
                        top = top > 0 ? top / 2 : 0;
                        var left = window.screen.width - 600;
                        left = left > 0 ? left / 2 : 0;
                        if (response.data.url && !this.payWin) {
                            this.payWin = true;

                            //response.data.url
                            //http://localhost:52476/closeToken.html
                            http://localhost:52476/index.html#/closetoken

                            // var testUrl = "http://localhost:52476/index.html#/closetoken?aa=55&UserId="+this.user.Id+"&cc_token=4cf8e168-261e-4613-8d20-000332986b24&cc_type_id=2&cc_type_name=%D7%95%D7%99%D7%96%D7%94+%D7%9B.%D7%90.%D7%9C.&cc_4_digits=0000&cc_payer_name=Card+Owner&cc_payer_id=040617649&cc_expire_month=10&cc_expire_year=2021&success=1";
                            var payWind = window.open(response.data.url, "Upload Chapter content", "width=600,height=600" + ",top=" + top + ",left=" + left);

                            var timer = setInterval(function () {


                                if (payWind.closed) {

                                    $scope.$ctrl.payWin = false;
                                    clearInterval(timer);
                                    $scope.$ctrl.winPayClose();
                                }
                            }, 1000);


                        }
                        return;

                    }

                    if (this.newPayment.payment_type == 'tokenBuy') {

                        if (!response.data.success) {

                            alert("תקלה בחיוב הטוקן!");
                            return;
                        }

                        this.newPayment.payment_type = 'token';
                    }

                    if (response.data.errMsg) {

                        alert("תקלה בהפקת חשבוניות!");
                        return;
                    }




                    newPayment.InvoiceNum = response.data.doc_number;
                    newPayment.InvoicePdf = response.data.pdf_link;
                    newPayment.doc_uuid = response.data.doc_uuid;




                    this.expenses.map(function (expense) {
                        if (expense.Checked && expense.Price != expense.Sum) { //&& !expense.Paid !צחי הוריד בינתיים

                            expense.Paid = newPayment.InvoiceNum;
                            expense.Sum = (!expense.Sum) ? 0 : expense.Sum;

                            var Diff = expense.Price - expense.Sum;

                            if (TempSum >= Diff) {

                                expense.Sum = expense.Sum + Diff;
                                TempSum = TempSum - Diff;
                            } else {
                                expense.Sum = expense.Sum + TempSum;
                                TempSum = 0;

                            }

                        }
                    });
                    this.payments = this.payments || [];
                    if (newPayment.isZikuy) newPayment.InvoiceSum = newPayment.InvoiceSum * -1;
                    this.payments.push(newPayment);
                    this.createNewPayment(newPayment);
                    this.submit();

                    this.initPaymentForm();
                    this.countAllCredits();
                }.bind(this));
            }

            else {

                this.payments = this.payments || [];
                this.expenses.map(function (expense) {
                    if (expense.Checked && expense.Price != expense.Sum) { //&& !expense.Paid !צחי הוריד בינתיים
                        expense.Paid = newPayment.InvoiceNum;
                        expense.Sum = (!expense.Sum) ? 0 : expense.Sum;
                        var Diff = expense.Price - expense.Sum;

                        if (TempSum >= Diff) {

                            expense.Sum = expense.Sum + Diff;
                            TempSum = TempSum - Diff;
                        } else {
                            expense.Sum = expense.Sum + TempSum;
                            TempSum = 0;

                        }

                    }
                });
                if (newPayment.isZikuy) newPayment.InvoiceSum = newPayment.InvoiceSum * -1;
                this.payments.push(newPayment);
                this.createNewPayment(newPayment);
                this.submit();

                this.initPaymentForm();
                this.countAllCredits();
            }


        }

        function _createNewPayment(newPayment) {

            //debugger
            //for (var i in this.payments) {
            //    if (this.payments[i].SelectedForInvoiceTemp) {
            //        if (newPayment.doc_type == "Zikuy") {
            //            this.payments[i].ZikuyNumber = newPayment.InvoiceNum;
            //            this.payments[i].lessons = 0;
            //        }
            //    }
            //}

            var thisCtrl = this;

            this.payments.map(function (payment) {

                if (payment.SelectedForInvoiceTemp) {
                    // newPayment.SelectedForInvoice = true;
                    if (payment.doc_type == "Mas" && newPayment.doc_type == "Kabala") {

                        payment.ParentInvoiceNum = newPayment.InvoiceNum;
                        payment.ParentInvoicePdf = newPayment.InvoicePdf;

                        //newPayment.ParentInvoiceNum = payment.InvoiceNum;
                        //newPayment.ParentInvoicePdf = payment.InvoicePdf;
                        payment.SelectedForInvoice = true;
                    }

                    if (payment.doc_type == "Kabala" && newPayment.doc_type == "Mas") {

                        //payment.ParentInvoiceNum = newPayment.InvoiceNum;
                        //payment.ParentInvoicePdf = newPayment.InvoicePdf;
                        newPayment.ParentInvoiceNum = payment.InvoiceNum;
                        newPayment.ParentInvoicePdf = payment.InvoicePdf;


                        // payment.SelectedForInvoice = true;

                        newPayment.SelectedForInvoice = true;
                    }
                    if (newPayment.doc_type == "Zikuy") {

                        payment.ZikuyNumber = newPayment.InvoiceNum;
                        payment.ZikuyPdf = newPayment.InvoicePdf;

                        // רק במידה ויש שיעורים בחשבונית שאתה מצמיד אליה זיכוי תעשה הורדת שיעורים
                        if (thisCtrl.user.PayType == "lessonCost" && payment.lessons > 0) {
                            var difflessons = ((payment.lessons * payment.Price) + newPayment.InvoiceSum) / payment.Price;
                            payment.lessons = Math.floor(difflessons);
                        } else {

                            payment.month = null;
                            payment.untilmonth = null;

                        }





                        payment.count = "";


                    }

                    payment.SelectedForInvoiceTemp = false;
                }
            });

        }

        function _getRealDocType(pay) {

            if (pay.isMasKabala) return "MasKabala";
            if (pay.isKabala || pay.isKabalaTroma) return "Kabala";
            if (pay.isMas) return "Mas";
            if (pay.isZikuy) return "Zikuy";
            return "";

        }

        function _setCheckboxForClose(pay) {

            // אם זה קבלה והשורה היא חשבונית מס ואין לו מסמך אב תציג אופציה לסגירה  || this.newPayment.isKabalaTroma
            if ((this.newPayment.isKabala) && pay.doc_type == 'Mas' && !pay.SelectedForInvoice) {

                return true;

            }
            else if ((this.newPayment.isMas) && pay.doc_type == 'Kabala' && !pay.SelectedForInvoice) {

                return true;
            }
            else if ((this.newPayment.isZikuy) && (pay.doc_type != 'Zikuy' && !pay.canceled)) {

                return true;
            }

            else
                return false;
        }




        this.currentCheckindex = 0;
        this.checksCount = 0;

        function _addCheck(action) {
            // 1. הוספת חדש
            if (action == 1) {

                this.currentCheckindex += 1;
                this.checksCount += 1;
            }
            if (action == 3) {
                this.currentCheckindex -= 1;

            }
            if (action == 4) {

                this.currentCheckindex += 1;

            }



        }

        function _getIfanyCheckValid() {


            if (this.newPayment.payment_type == 'check') {

                for (var i in this.newPayment.Checks) {
                    var checks_bank_name = this.newPayment.Checks[i].checks_bank_name;
                    var checks_number = this.newPayment.Checks[i].checks_number;
                    var checks_date = this.newPayment.Checks[i].checks_date;
                    var checks_sum = this.newPayment.Checks[i].checks_sum;

                    if (checks_bank_name && checks_number && checks_date && checks_sum && self.newPayment.InvoiceDetails && self.newPayment.InvoiceSum)
                        return false;

                }

                return true;

            }

            return true;
        }

        function _submit(isalert) {



            if ($scope.studentForm.$valid && !this.user.IsTafus) {

                this.user.Role = 'student';
                this.user.Email = this.user.IdNumber;
                this.user.Password = this.user.IdNumber;


                this.user.IsTafus = false;

                if (this.user.BirthDate)
                    this.user.BirthDate.setHours(this.user.BirthDate.getHours() + 3);
                if (this.user.LeaveDate)
                    this.user.LeaveDate.setHours(this.user.LeaveDate.getHours() + 3);

                if (this.user.DateForMonthlyPay) {
                    this.user.DateForMonthlyPay.setHours(this.user.DateForMonthlyPay.getHours() + 3);
                }

                if (this.role == "farmAdminHorse") { this.user.Style = "horseHolder" }



                usersService.updateUserMultiTables(this.user, this.payments, this.files, this.commitments, this.expenses, this.userhorses, [], this.makav, this.getChecsObjList()).then(function (user) {

                    if (user.FirstName == "Error") {
                        alert('שגיאה בעת עדכון תלמיד , בדוק אם קיימת תעודת זהות במערכת');
                        //user.FirstName = "";
                        return;
                    }

                    //this.lessonToUpdate.push(lesson);
                    //lessonsService.updateLesson(lesson);
                    //for (var i in this.lessonToUpdate) {

                    //    alert(this.lessonToUpdate[i].details);
                    //}

                    usersService.getPaymentsByUserId(user.Id).then(function (payments) {
                       
                        this.payments = payments;

                        this.createNotifications();
                        this.initStudent();

                    }.bind(this));
                   


                    lessonsService.updateStudentLessonsStatuses(this.lessonStatusesToUpdate);
                    this.user = user;

                    if (!isalert) alert('נשמר בהצלחה');
                }.bind(this));
            }
        }

        function _getChecsObjList() {
            var CheckList = [];

            try {





                for (var i in this.newPayment.Checks) {


                   
                    this.newPayment.Checks[i].checks_date = moment(this.newPayment.Checks[i].checks_date).format("YYYY-MM-DD");

                    CheckList.push(this.newPayment.Checks[i]);


                }

            }
            catch (e) {

            }

            return CheckList;
        }


        function _getInstructorName(id) {
            for (var i in this.instructors) {
                if (this.instructors[i].Id == id) {
                    return this.instructors[i].FirstName + " " + this.instructors[i].LastName;
                }
            }
        }







        function _delete() {
            if (confirm('האם למחוק את התלמיד?')) {

                var ctrl = this;
                usersService.deleteUser(this.user.Id).then(function (res) {
                    ctrl.user.Deleted = true;
                    $state.go('students');
                });
            }
        }

        function _isPrepaid() {
            if (self.user.HMO) {
                for (var hmo of self.HMOs) {
                    if (hmo.id == this.user.HMO && hmo.prePaid)
                        return true;
                }
                return false;
            }
        }



        $scope.search = function (s) {


            if ($scope.searchInput) {
                var query = $scope.searchInput.toLowerCase(),

                    fullname = s.FirstName.toLowerCase() + ' ' + s.LastName.toLowerCase();

                if (fullname.indexOf(query) != -1) {
                    return true;
                }
            }
            return false;
        };
    }

})();

