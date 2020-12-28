(function () {
    var app = angular.module('app');

    app.component('reports', {
        templateUrl: 'app/reports/reports.template.html',
        controller: ReportsController,
    });

    function ReportsController(usersService, lessonsService, horsesService, sharedValues, $q, $rootScope) {
        var self = this;

        self.role = $rootScope.role;
        self.studentsReport = _studentsReport;
        self.lessonsReport = _lessonsReport;
        self.horsesReport = _horsesReport;
        self.ReportManger = _ReportManger;
        self.ReportHMO = _ReportHMO;
        self.ReportDebt = _ReportDebt;
        self.ReportInsructor = _ReportInsructor;
        self.sortArrayOfObjects = _sortArrayOfObjects;


        self.getHebStatus = _getHebStatus;
        self.getHebHMO = _getHebHMO;
        self.getInstructorCounter = _getInstructorCounter;
        self.getTotalPerStyle = _getTotalPerStyle;
        self.getRound = _getRound;

        self.getPartaniK = _getPartaniK;
        
        self.reports = [
            { name: 'רשימת תלמידים כולל פרטים', callback: self.studentsReport },
            { name: 'רשימת שיעורים', callback: self.lessonsReport },
            { name: 'רשימת סוסים + טיפולים עתידיים', callback: self.horsesReport }
        ]

        
        if (["farmAdminHorse", "vetrinar", "shoeing"].indexOf(self.role)!=-1 ) {
           
           
            self.reports = [
                { name: 'רשימת לקוחות כולל פרטים', callback: self.studentsReport },
                { name: 'רשימת סוסים + טיפולים עתידיים', callback: self.horsesReport }
            ]

        }




        function _ReportInsructor() {

            function getAllStudentInDay(resourceId, Day, lessonsSort) {

                var html = "";
                var lessonsList = lessonsSort.filter(function (less) {
                    return less.resourceId == resourceId;
                });


                for (var lesson of lessonsList) {

                    if (moment(lesson.start).day() == Day) {
                       
                        for (var status of lesson.statuses) {

                            var student = getUser(status.StudentId);
                            var Phone = (student.PhoneNumber) ? student.PhoneNumber : student.PhoneNumber2;
                            html += "<div>" + getName(status.StudentId) + " " + ((Phone) ? "<div style='float:left'> - " + Phone + "</div>" : "" )  +"</div></br>";

                        }

                    }
                }


                return html;
            }

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



                $.get('app/reports/ReportInsructor.html?sss=' + new Date(), function (text) {

                    text = text.replace("@NameHava", localStorage.getItem('FarmName'));
                 
                    var startOfWeek = moment().startOf('week').toDate();
                    var endOfWeek = moment(startOfWeek).add(5, 'day').toDate();//
                   
                    lessonsService.getLessons(null, startOfWeek, endOfWeek).then(function (lessons) {

                        var html = "";
                     
                        var lessonsSort = self.sortArrayOfObjects(lessons, "resourceId");

                        var prevInstructorId = "";

                        for (var lesson of lessonsSort) {
                            if (lesson.IsMazkirut == "1") continue;

                            // כאן מכניסים את הראשי עם הטבלה מדריך חדש
                            if (lesson.resourceId != prevInstructorId) {



                                html += "<div class='dvSubtitle'>"
                                    + "       <span style='text-decoration:underline;font-size:24px'>" + getName(lesson.resourceId) + "</span><br />"
                                    + "   </div>"
                                    + "   <div class='dvTable'>"
                                    + "    <table width='100%' border='1' dir='rtl' style='border-collapse: collapse;'>"
                                    + "      <tr> "
                                    + "          <th style='background:#42ecf5;'>ראשון</th>"
                                    + "          <th style='background:#42ecf5;'>שני</th>"
                                    + "          <th style='background:#42ecf5;'>שלישי</th>"
                                    + "          <th style='background:#42ecf5;'>רביעי</th>"
                                    + "          <th style='background:#42ecf5;'>חמישי</th>"
                                    + "          <th style='background:#42ecf5;'>שישי</th>"
                                    + "          <th style='background:#42ecf5;'>יום שבת</th>"
                                    + "       </tr>"



                                    + "<tr>"
                                    + "      <tr> "
                                    + "          <td>" + getAllStudentInDay(lesson.resourceId, 0, lessonsSort) + "</td>"
                                    + "          <td>" + getAllStudentInDay(lesson.resourceId, 1, lessonsSort) + "</td>"
                                    + "          <td>" + getAllStudentInDay(lesson.resourceId, 2, lessonsSort) + "</td>"
                                    + "          <td>" + getAllStudentInDay(lesson.resourceId, 3, lessonsSort) + "</td>"
                                    + "          <td>" + getAllStudentInDay(lesson.resourceId, 4, lessonsSort) + "</td>"
                                    + "          <td>" + getAllStudentInDay(lesson.resourceId, 5, lessonsSort) + "</td>"
                                    + "          <td>" + getAllStudentInDay(lesson.resourceId, 6, lessonsSort) + "</td>"
                                    + "       </tr></table></div>";

                                 
                                prevInstructorId = lesson.resourceId;
                            }


                        }

                        text = text.replace("@Html", html);



                        var blob = new Blob([text], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                        });


                        saveAs(blob, "Instructors_ " + new Date() + ".html");

                    });

                   




                });

            })

        }

      


        function _sortArrayOfObjects(arr, key) {

            return arr.sort((a, b) => {
                return a[key] - b[key];
            });
        }

        function _ReportDebt() {




            $.get('app/reports/ReportDebt' + ((["farmAdminHorse", "vetrinar", "shoeing"].indexOf(self.role) != -1)?"Horse":"")+'.html?sdss=' + new Date(), function (text) {

                text = text.replace("@NameHava", localStorage.getItem('FarmName'));

                var TableDebtKlalit = "";
                var TableDebtMacabi = "";
                var TableDebtOther = "";
                var TableDebtDikla = "";

                usersService.reportDebt().then(function (res) {


                    var CountKlalit = 0;
                    var CountMacabi = 0;
                    var CountOther = 0;
                    var CountDikla = 0;

                    for (var i = 0; i < res.length; i++) {



                        var Taz = res[i].Taz;
                        var FirstName = res[i].FirstName;
                        var LastName = res[i].LastName;
                        var Total = res[i].Total;
                        var TotalPayForMacabi = res[i].TotalPayForMacabi;

                        var HMO = res[i].HMO;
                        var Style = res[i].Style;
                        var ClientNumber = (res[i].ClientNumber) ? res[i].ClientNumber : "";

                        if (HMO && HMO!="") {

                            if (HMO == "klalit" || HMO == "klalitPlatinum") {
                                CountKlalit++;
                                TableDebtKlalit += "<tr>"
                                    + "<td>" + CountKlalit.toString()
                                    + "</td><td> " + ClientNumber
                                    + "</td><td> " + Taz
                                    + "</td><td style='text-align:right'>" + FirstName
                                    + "</td><td style='text-align:right'>" + LastName
                                    + "</td><td style='direction:ltr;text-align:right'>" + Total + "</td ></tr>";



                            } else if (HMO == "maccabiGold" || HMO == "maccabiSheli") {
                                CountMacabi++;
                                TableDebtMacabi += "<tr>"
                                    + "<td>" + CountMacabi.toString()
                                    + "</td><td> " + ClientNumber
                                    + "</td><td> " + Taz
                                    + "</td><td style='text-align:right'>" + FirstName
                                    + "</td><td style='text-align:right'>" + LastName
                                    + "</td><td style='direction:ltr;text-align:right'>" + Total + "</td>"
                                    + "</td><td style='direction:ltr;text-align:right'>" + TotalPayForMacabi + "</td></tr>";
                                
                            


                            } else if (HMO == "klalitDikla") {
                                CountDikla++;
                                TableDebtDikla += "<tr>"
                                    + "<td>" + CountDikla.toString()
                                    + "</td><td> " + ClientNumber
                                    + "</td><td> " + Taz
                                    + "</td><td style='text-align:right'>" + FirstName
                                    + "</td><td style='text-align:right'>" + LastName
                                    + "</td><td style='direction:ltr;text-align:right'>" + Total + "</td ></tr>";


                            }

                            else {
                                CountOther++;
                                TableDebtOther += "<tr>"
                                    + "<td>" + CountOther.toString()
                                    + "</td><td> " + ClientNumber
                                    + "</td><td> " + Taz
                                    + "</td><td style='text-align:right'>" + FirstName
                                    + "</td><td style='text-align:right'>" + LastName
                                    + "</td><td style='direction:ltr;text-align:right'>" + Total + "</td ></tr>";

                            }





                        } else {
                            CountOther++;
                            TableDebtOther += "<tr>"
                                + "<td>" + CountOther.toString()
                                + "</td><td> " + ClientNumber
                                + "</td><td> " + Taz
                                + "</td><td style='text-align:right'>" + FirstName
                                + "</td><td style='text-align:right'>" + LastName
                                + "</td><td style='direction:ltr;text-align:right'>" + Total + "</td ></tr>";

                        }

                    }

                    text = text.replace("@TableDebtKlalit", TableDebtKlalit);
                    text = text.replace("@TableDebtMacabi", TableDebtMacabi);
                    text = text.replace("@TableDebtDikla", TableDebtDikla);
                    text = text.replace("@TableDebtOther", TableDebtOther);



                    var blob = new Blob([text], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                    });


                    saveAs(blob, "HMODebt_ " + new Date() + ".html");
                });


            });



        }

        function _ReportHMO() {




            $.get('app/reports/ReportHMO.html?sss=' + new Date(), function (text) {

                // var CurrentDate = self.fromDate;
                //if (!CurrentDate) CurrentDate = new Date();
                //var daysInMonth = moment(CurrentDate).daysInMonth();

                //var Month = CurrentDate.getMonth() + 1;
                //var Year = CurrentDate.getFullYear();
                //if (Month < 10) Month = "0" + Month;



                text = text.replace("@FromDate", moment(self.fromDate).format('DD/MM/YYYY')).replace("@ToDate", moment(self.toDate).format('DD/MM/YYYY'));
                text = text.replace("@NameHava", localStorage.getItem('FarmName'));

                usersService.reportHMO(moment(self.fromDate).format('YYYYMMDD'), moment(self.toDate).format('YYYYMMDD')).then(function (res) {

                    var TableMacabi = "";
                    var TableKlalit = "";
                    var TableDikla = "";
                    var PrevInvoice = "";
                    var Count = 0;
                    var CountNoPay = 0;
                    var StartDetails = "";
                    var StartDetailsNoPay = "";
                    var InvoiceDetails = "";

                    var CountMacabi = 0;
                    var StartDetailsMacabi = "";


                    for (var i = 0; i < res.length; i++) {

                        var Type = res[i].Type;
                        var Taz = res[i].Taz;
                        var StudentId = res[i].Id;
                        var FirstName = res[i].FirstName;
                        var LastName = res[i].LastName;
                        var Invoice = res[i].Invoice;
                        var Start = moment(res[i].Start).format('DD/MM/YYYY');
                        var Total = res[i].Total;




                        if ((!res[i + 1] || (res[i].Invoice != res[i + 1].Invoice)) && Invoice) {
                            InvoiceDetails += ((InvoiceDetails) ? ", " : "") + Invoice;
                        }

                        if (Invoice) {
                            Count++;
                            StartDetails += ((StartDetails) ? ", " : "") + Start;
                        }
                        if (!Invoice) {
                            CountNoPay++;
                            StartDetailsNoPay += ((StartDetailsNoPay) ? ", " : "") + Start;
                        }

                        if (Type == "1") {
                            CountMacabi++;
                            StartDetailsMacabi += ((StartDetailsMacabi) ? ", " : "") + Start;
                        }
                        if (!res[i + 1] || (res[i + 1].Id != StudentId)) {


                            if (Type == "1")
                                TableMacabi += "<tr><td>" + Taz
                                    + "</td><td style='text-align:right'>" + FirstName
                                    + "</td><td style='text-align:right'>" + LastName
                                    + "</td><td style='direction:ltr;text-align:right'>" + Total// פה לשים יתרת שיעורים
                                    + "</td><td>" + CountMacabi.toString()
                                    + "</td><td style='text-align:right'>" + StartDetailsMacabi + "</td ></tr>";

                            if (Type == "2")
                                TableKlalit += "<tr><td>" + Taz
                                    + "</td><td style='text-align:right'>" + FirstName
                                    + "</td><td style='text-align:right'>" + LastName
                                    + "</td><td>" + InvoiceDetails
                                    + "</td><td>" + ((Count > 0) ? Count.toString() : "")
                                    + "</td><td style='text-align:right'>" + StartDetails + "</td>"
                                    + "</td><td>" + ((CountNoPay > 0) ? CountNoPay.toString() : "")
                                    + "</td><td style='text-align:right'>" + StartDetailsNoPay + "</td></tr>";





                            if (Type == "3")
                                TableDikla += "<tr><td>" + Taz
                                    + "</td><td style='text-align:right'>" + FirstName
                                    + "</td><td style='text-align:right'>" + LastName
                                    + "</td><td>" + InvoiceDetails
                                    + "</td><td>" + ((Count > 0) ? Count.toString() : "")
                                    + "</td><td style='text-align:right'>" + StartDetails + "</td>"
                                    + "</td><td>" + ((CountNoPay > 0) ? CountNoPay.toString() : "")
                                    + "</td><td style='text-align:right'>" + StartDetailsNoPay + "</td></tr>";

                            StartDetails = "";
                            StartDetailsNoPay = "";
                            InvoiceDetails = "";
                            Count = 0;
                            CountNoPay = 0;
                            CountMacabi = 0;
                            StartDetailsMacabi = "";
                        }


                    }

                    text = text.replace("@TableMacabi", TableMacabi);
                    text = text.replace("@TableKlalit", TableKlalit);
                    text = text.replace("@TableDikla", TableDikla);


                    var blob = new Blob([text], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                    });


                    saveAs(blob, "HMOReport_ " + new Date() + ".html");
                });

            });



        }

        function _ReportManger() {


            if (!self.toDate || !self.fromDate) { alert("חובה לבחור תאריכים לדו''ח"); return; }
            var ReportFileName = (["farmAdminHorse", "vetrinar", "shoeing"].indexOf(self.role) != -1) ?"ReportAdminFarmHorse":"Report"; 
            $.get('app/reports/' + ReportFileName+'.html?sssd=' + new Date(), function (text) {

                // var CurrentDate = self.fromDate;
                //    if (!CurrentDate) CurrentDate = new Date();
                // var daysInMonth = moment(CurrentDate).daysInMonth();
                var daysInMonth = (moment(self.toDate)).diff(moment(self.fromDate), 'days', true);
                daysInMonth++;

                //
                //var Month = CurrentDate.getMonth() + 1;
                //var Year = CurrentDate.getFullYear();

                //if (Month < 10) Month = "0" + Month;


                // text = text.replace("@ReportDate", Month + "/" + Year);
                text = text.replace("@FromDate", moment(self.fromDate).format('DD/MM/YYYY')).replace("@ToDate", moment(self.toDate).format('DD/MM/YYYY'));
                text = text.replace("@NameHava", localStorage.getItem('FarmName'));

                usersService.report("1", moment(self.fromDate).format('YYYYMMDD'), moment(self.toDate).format('YYYYMMDD')).then(function (res) {


                    text = text.replace("@ActiveUser", res[0].ActiveUser);
                    text = text.replace("@notActiveUser", res[0].notActiveUser);
                    text = text.replace("@ActivePension", res[0].ActivePension);
                    text = text.replace("@notActivePension", res[0].notActivePension);




                    text = text.replace("@instructorUser", res[0].instructorUser);
                    text = text.replace("@AllMinusCount", res[0].AllMinusCount);
                    text = text.replace("@AllMinusSum", (res[0].AllMinusSum));
                    text = text.replace("@NameHava", res[0].farmNAME);

                    text = text.replace("@Macbi", res[0].Macbi);
                    text = text.replace("@Clalit", res[0].Clalit);
                    text = text.replace("@Diklla", res[0].Dikla);
                    text = text.replace("@Leummit", res[0].Leumit);
                    text = text.replace("@Meuedet", res[0].Meuedet);
                    text = text.replace("@Other", res[0].Other);



                    usersService.report("2", moment(self.fromDate).format('YYYYMMDD'), moment(self.toDate).format('YYYYMMDD')).then(function (res) {


                        var HtmlTable = "";
                        var ExistInstructor = [];
                        var HtmlHorsesTable = "";
                        var ExistHorses = [];
                        var FarmWorkHoursSus = 0;

                        var MakabiOne = 0;
                        var MakabiTwoUp = 0;

                        var KlalitOne = 0;
                        var KlalitTwoUp = 0;

                        var DiklaOne = 0;
                        var DiklaTwoUp = 0;

                        var MeuhedetOne = 0;
                        var MeuhedetTwoUp = 0;

                        var LeumitOne = 0;
                        var LeumitTwoUp = 0;

                        // מעדכן את המערך של השיעורים שיהיה מפולטר לפי מדריך של שיעור אחרון
                        self.getInstructorCounter(0, res, "FilterByLastLesson");

                        for (var i = 0; i < res.length; i++) {

                            if (ExistInstructor.indexOf(res[i].Id) == "-1") {



                                var ObjOfAMount = self.getTotalPerStyle(res[i].Id, res);

                                MakabiOne += ObjOfAMount.MakabiOne;
                                MakabiTwoUp += ObjOfAMount.MakabiTwoUp;

                                KlalitOne += ObjOfAMount.KlalitOne;
                                KlalitTwoUp += ObjOfAMount.KlalitTwoUp;

                                DiklaOne += ObjOfAMount.DiklaOne;
                                DiklaTwoUp += ObjOfAMount.DiklaTwoUp;

                                MeuhedetOne += ObjOfAMount.MeuhedetOne;
                                MeuhedetTwoUp += ObjOfAMount.MeuhedetTwoUp;

                                LeumitOne += ObjOfAMount.LeumitOne;
                                LeumitTwoUp += ObjOfAMount.LeumitTwoUp;



                                ExistInstructor.push(res[i].Id);
                                HtmlTable += "<tr><td style='text-align:right'>" + res[i].FullName + "</td><td >" + self.getInstructorCounter(res[i].Id, res, "DayInMonth")
                                    + "</td><td>" + self.getInstructorCounter(res[i].Id, res, "HourNumber")
                                    + "</td><td>" + self.getInstructorCounter(res[i].Id, res, "Attend")
                                    + "</td><td>" + self.getInstructorCounter(res[i].Id, res, "NotAttend")
                                    + "</td><td>" + self.getInstructorCounter(res[i].Id, res, "NotAttendCharge")
                                    + "</td><td>" + self.getInstructorCounter(res[i].Id, res, "NoStatus")

                                    + "</td><td>" + ObjOfAMount.OneTipuli
                                    + "</td><td>" + ObjOfAMount.TwoTupuli
                                    + "</td><td>" + ObjOfAMount.ThreeUp
                                    + "</td><td>" + ObjOfAMount.western
                                    + "</td><td>" + ObjOfAMount.karting
                                    + "</td><td>" + ObjOfAMount.english

                                    + "</td><td style='background:#a83242;'>" + self.getInstructorCounter(res[i].Id, res, "IsLeave")
                                    + "</td></tr>"
                                    ;
                            }



                            if (res[i].Name && ExistHorses.indexOf(res[i].Name) == "-1") {

                                ExistHorses.push(res[i].Name);
                                var WorkHoursSus = self.getInstructorCounter(res[i].Name, res, "HourNumberHorses");
                                FarmWorkHoursSus += WorkHoursSus;

                                HtmlHorsesTable += "<tr><td style='text-align:right'>" + res[i].Name + "</td><td>" + self.getRound((WorkHoursSus / (daysInMonth * 4)) * 100) + "</td></tr>";




                            }




                        }

                        text = text.replace("@TableInstructor", HtmlTable);

                        text = text.replace("@MakabiOne", MakabiOne);
                        text = text.replace("@MakabiTwoUp", MakabiTwoUp);

                        text = text.replace("@KlalitOne", KlalitOne);
                        text = text.replace("@KlalitTwoUp", KlalitTwoUp);

                        text = text.replace("@DiklaOne", DiklaOne);
                        text = text.replace("@DiklaTwoUp", DiklaTwoUp);


                        text = text.replace("@MeuhedetOne", MeuhedetOne);
                        text = text.replace("@MeuhedetTwoUp", MeuhedetTwoUp);


                        text = text.replace("@LeumitOne", LeumitOne);
                        text = text.replace("@LeumitTwoUp", LeumitTwoUp);


                 



                        horsesService.getHorsesReport(1).then(function (horses) {
                            var HorseCount = 0,
                                HorseActiveCount = 0,
                                HorseNotActiveCount = 0,
                                HorseSchool = 0,
                                HorsePension = 0,
                                HorseFarm = 0,
                                HorseHerion = 0,
                                HorsePirzool = 0,
                                HorseTiluf = 0,
                                HorseUp2 = 0,
                                HorseMan = 0,
                                HorseWoman = 0,
                                HorseSirus = 0




                            horses.forEach(function (horse) {
                              
                                HorseCount++;

                               
                                if (horse.Active == "active") {

                                    HorseActiveCount++;


                                    if (horse.Ownage == "pension" ||
                                        horse.Ownage == "pensionEnglish" ||
                                        horse.Ownage == "pensionMaravi" ||
                                        horse.Ownage == "pensionKating" ||
                                        horse.Ownage == "pensionMere"

                                    )
                                        HorsePension++;
                                    else if (horse.Ownage == "school") {
                                        HorseSchool++;

                                        // מנצל את העובדה של הלופ ולכן
                                        if (ExistHorses.indexOf(horse.Name) == "-1") {
                                            ExistHorses.push(horse.Name);
                                            HtmlHorsesTable += "<tr><td style='text-align:right'>" + horse.Name + "</td><td>0</td></tr>";
                                        }

                                    }

                                    else if (horse.Ownage == "farm")
                                        HorseFarm++;


                                    if (horse.Gender == "male")
                                        HorseMan++;
                                    else if (horse.Gender == "female")
                                        HorseWoman++;
                                    else if (horse.Gender == "castrated")
                                        HorseSirus++;

                                    if (moment() > moment(horse.BirthDate).add(2, 'Y')) HorseUp2++;

                                    if (horse.IsShoeings) HorsePirzool++;
                                    if (horse.IsTilufings) HorseTiluf++;
                                    if (horse.IsHerion) HorseHerion++;


                                    //if (Shoeings && horse.Meta.Shoeings.length > 0) HorsePirzool++;
                                    //if (horse.Meta.Tilufings && horse.Meta.Tilufings.length > 0) HorseTiluf++;

                                    //

                                    //if (horse.Meta.Pregnancies && horse.Meta.Pregnancies.length > 0) {

                                    //    var pregnancy = horse.Meta.Pregnancies[horse.Meta.Pregnancies.length - 1];
                                    //    var PregnancyName = pregnancy.States[pregnancy.States.length - 1].State.name;
                                    //    if (PregnancyName != 'לידה' && !pregnancy.Finished) {
                                    //        HorseHerion++;
                                    //    }

                                    //}



                                }
                                else HorseNotActiveCount++;


                            });

                            text = text.replace("@HorseCount", HorseCount);
                            text = text.replace("@HorseActiveCount", HorseActiveCount);
                            text = text.replace("@HorseNotActiveCount", HorseNotActiveCount);
                            text = text.replace("@HorseSchool", HorseSchool);
                            text = text.replace("@HorsePension", HorsePension);
                            text = text.replace("@HorseFarm", HorseFarm);
                            text = text.replace("@HorseHerion", HorseHerion);
                            text = text.replace("@HorsePirzool", HorsePirzool);
                            text = text.replace("@HorseTiluf", HorseTiluf);
                            text = text.replace("@HorseUp2", HorseUp2);
                            text = text.replace("@HorseMan", HorseMan);
                            text = text.replace("@HorseWoman", HorseWoman);
                            text = text.replace("@HorseSirus", HorseSirus);
                           

                            text = text.replace("@HorseSchoolPercent", self.getRound((FarmWorkHoursSus / (ExistHorses.length * daysInMonth * 4)) * 100));


                            text = text.replace("@TableHorses", HtmlHorsesTable);


                            var blob = new Blob([text], {
                                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                            });


                            saveAs(blob, "Leads " + new Date() + ".html");

                        });


                    });






                });






            });



        }

       

        function _getRound(number) {

            var rounded = Math.round(number * 10) / 10;

            return rounded.toString();

        }

        function _getTotalPerStyle(Id, res) {
           
            var myObj =
            {
                OneTipuli: 0,
                TwoTupuli: 0,
                ThreeUp: 0,
                western: 0,
                karting: 0,
                english: 0,

                MakabiOne: 0,
                MakabiTwoUp: 0,

                KlalitOne: 0,
                KlalitTwoUp: 0,

                DiklaOne: 0,
                DiklaTwoUp: 0,

                MeuhedetOne: 0,
                MeuhedetTwoUp: 0,

                LeumitOne: 0,
                LeumitTwoUp: 0



            }

            var DateExist = [];

            for (var i = 0; i < res.length; i++) {

                if (Id == res[i].Id) {

                    if (res[i].Status == "attended" || res[i].Status == "notAttendedCharge" ||
                        (res[i].Status == "completion" && (res[i].IsComplete == 4 || res[i].IsComplete == 6))
                    ) {

                        if (["privateTreatment", "maccabiGold", "maccabiSheli", "klalit",
                            "klalitPlatinum", "klalitDikla", "meuhedet", "leumit"].indexOf(res[i].HMO) != -1) {//res[i].Style == "treatment" || res[i].Style == "privateTreatment") {

                            var result = DateExist.filter(d => d.Date == res[i].Start);
                            if (result.length > 0) {

                                result[0]["Count"] += 1;

                            } else {

                                DateExist.push({ Date: res[i].Start, Count: 1});
                            }

                        }

                        if (res[i].HMO == "western") { myObj.western++ }
                        if (res[i].HMO == "karting") { myObj.karting++ }
                        if (res[i].HMO == "english") { myObj.english++ }



                    }

                }


            }


            for (var m = 0; m < DateExist.length; m++) {
                if (DateExist[m].Count == 1) {

                    myObj.OneTipuli++;

                }
                if (DateExist[m].Count == 2) {

                    myObj.TwoTupuli += 2;

                }

                if (DateExist[m].Count >= 3) {

                    myObj.ThreeUp += DateExist[m].Count;

                }

            }


            var DateExistHMO = [];
            for (var i = 0; i < res.length; i++) {

                if (Id == res[i].Id) {
                   
                    if (res[i].Status == "attended" || res[i].Status == "notAttendedCharge" ||
                        (res[i].Status == "completion" && (res[i].IsComplete == 4 || res[i].IsComplete == 6))
                    ) {

                        if (["maccabiGold", "maccabiSheli", "klalit",
                            "klalitPlatinum", "klalitDikla", "meuhedet", "leumit"].indexOf(res[i].HMO) != -1) {
                          
                            if (res[i].HMO == "maccabiSheli") res[i].HMO = "maccabiGold";
                            if (res[i].HMO == "klalitPlatinum") res[i].HMO = "klalit";

                            var result = DateExistHMO.filter(d => d.Date == res[i].Start && d.HMO == res[i].HMO);
                            if (result.length > 0) {

                                result[0]["Count"] += 1;

                            } else {



                                DateExistHMO.push({ Date: res[i].Start, Count: 1, HMO: res[i].HMO });
                            }

                        }

                    }

                }


            }

           

            for (var m = 0; m < DateExistHMO.length; m++) {
                if (DateExistHMO[m].Count == 1 && DateExistHMO[m].HMO =="maccabiGold") {

                    myObj.MakabiOne++;

                }
                if (DateExistHMO[m].Count >= 2 && DateExistHMO[m].HMO == "maccabiGold") {

                    myObj.MakabiTwoUp += DateExistHMO[m].Count;

                }


                if (DateExistHMO[m].Count == 1 && DateExistHMO[m].HMO == "klalit") {

                    myObj.KlalitOne++;

                }
                if (DateExistHMO[m].Count >= 2 && DateExistHMO[m].HMO == "klalit") {

                    myObj.KlalitTwoUp += DateExistHMO[m].Count;

                }


                if (DateExistHMO[m].Count == 1 && DateExistHMO[m].HMO == "klalitDikla") {

                    myObj.DiklaOne++;

                }
                if (DateExistHMO[m].Count >= 2 && DateExistHMO[m].HMO == "klalitDikla") {

                    myObj.DiklaTwoUp += DateExistHMO[m].Count;

                }


                if (DateExistHMO[m].Count == 1 && DateExistHMO[m].HMO == "meuhedet") {

                    myObj.MeuhedetOne++;

                }
                if (DateExistHMO[m].Count >= 2 && DateExistHMO[m].HMO == "meuhedet") {

                    myObj.MeuhedetTwoUp += DateExistHMO[m].Count;

                }

                if (DateExistHMO[m].Count == 1 && DateExistHMO[m].HMO == "leumit") {

                    myObj.LeumitOne++;

                }
                if (DateExistHMO[m].Count >= 2 && DateExistHMO[m].HMO == "leumit") {

                    myObj.LeumitTwoUp += DateExistHMO[m].Count;

                }



            }

           

            return myObj;
        }



        function _getInstructorCounter(Id, res, type) {

           
            if (type == "FilterByLastLesson") {

                res = res.sort(function (a, b) {
                    if (a.Start < b.Start)
                        return 1;
                    if (a.Start > b.Start)
                        return -1;
                    return 0;
                });


                var StudentExist = [];
                var counter = 0;
                for (var i = 0; i < res.length; i++) {

                    if (StudentExist.indexOf(res[i].StudentId) == "-1" && res[i].Leave == 1) {

                        StudentExist.push(res[i].StudentId);
                        res[i].LastLesson = true;
                    }


                }


                res = res.sort(function (a, b) {
                    if (a.Id > b.Id)
                        return 1;
                    if (a.Id < b.Id)
                        return -1;
                    return 0;
                });




            }
            
            // כאן id משמש של סוס ולא מדריך
            if (type == "HourNumberHorses") {

                var counter = 0;
                for (var i = 0; i < res.length; i++) {

                    if (Id == res[i].Name && (res[i].Status == "attended" || res[i].IsComplete == 4)) {

                        counter += res[i].Diff;

                    }


                }


                return (counter == 0) ? 0 : (counter / 60);
            }

            if (type == "DayInMonth") {
                var DateExist = [];
                var counter = 0;
                for (var i = 0; i < res.length; i++) {

                    if (DateExist.indexOf(res[i].OnlyDate) == "-1" && Id == res[i].Id) {

                        if (res[i].Status == "attended" || res[i].Status == "notAttendedCharge" ||
                            (res[i].Status == "completion" && (res[i].IsComplete == 4 || res[i].IsComplete == 6))
                        ) {
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

                        if (res[i].Status == "attended" || res[i].Status == "notAttendedCharge" || (res[i].Status == "completion" && (res[i].IsComplete == 4 || res[i].IsComplete == 6))
                        ) {
                            DateExist.push(res[i].Start);
                          //  if (res[i].Leave == 1) continue;// אם עזב לא להחשיב למדריך  
                            counter += res[i].Diff;
                        }

                    }


                }


                return (counter == 0) ? "" : (counter / 60).toString();

            }

            if (type == "Attend") {
                var DateExist = [];
                var counter = 0;
                for (var i = 0; i < res.length; i++) {

                    if (DateExist.indexOf(res[i].Start) == "-1" && Id == res[i].Id) {

                        if (res[i].Status == "attended" || (res[i].Status == "completion" && res[i].IsComplete == 4)) {
                            DateExist.push(res[i].Start);
                            if (res[i].Leave == 1) continue;// אם עזב לא להחשיב למדריך
                            counter++;
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
                var DateExist = [];
                var counter = 0;
                for (var i = 0; i < res.length; i++) {

                    if (DateExist.indexOf(res[i].Start) == "-1" && Id == res[i].Id) {

                        if (res[i].Status == "notAttendedCharge" || (res[i].Status == "completion" && res[i].IsComplete == 6)) {
                            DateExist.push(res[i].Start);
                            if (res[i].Leave==1) continue;// אם עזב לא להחשיב למדריך
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


            if (type == "IsLeave") {
                
                var counter = 0;
                for (var i = 0; i < res.length; i++) {

                    if (Id == res[i].Id && res[i].LastLesson) {
                         counter++;
                    }


                }


                return (counter == 0) ? "" : counter.toString();

            }

        }

        function _studentsReport() {

            function getActiveHeb(name) {

            
                var res = "פעיל";

                if (name == "notActive") res = "לא פעיל";

                return res;

            };

            function getHorsesByUserId(UserId) {
                var res = "";
                var first = true;
                for (var x in self.reportHorses) {

                    if (self.reportHorses[x].UserId == UserId) {

                        var sValue = ((first)?"":"," ) + self.reportHorses[x].Name ;
                        res += sValue; 

                        first = false;

                    }

                } 


                return res;
            };

            if (["farmAdminHorse", "vetrinar", "shoeing"].indexOf(self.role) != -1) {
                usersService.getAllFarmsuseruserhorses().then(function (horses) {
                 
                    self.reportHorses = horses;
                });

            }


            usersService.getUsers('student').then(function (students) {
                var data = [];

                if (["farmAdminHorse", "vetrinar", "shoeing"].indexOf(self.role) != -1) {



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
                        ' סוס ',
                        
                    ]);
                    students.forEach(function (student) {
                        data.push([
                            student.ClientNumber,
                            getActiveHeb(student.Active),
                            student.IdNumber,
                            student.FirstName,
                            student.LastName,
                            student.Address,
                            student.PhoneNumber,
                            student.PhoneNumber2,
                            student.AnotherEmail,
                            getHorsesByUserId(student.Id)
                            //student.ParentName,
                            //student.ParentName2,
                            //student.BirthDate ? new Date(student.BirthDate) : null,
                            //student.Style,
                            //student.TeamMember,
                            //student.HMO,
                            //student.PayType,
                            //student.Cost,
                        ]);
                    });

                } else { 

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
                            getActiveHeb(student.Active),
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

                }
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

              //  debugger
              //  self.fromDate = moment(self.fromDate).startOf('day').toDate();
              //  self.toDate = moment(self.toDate).startOf('day').toDate();
                lessonsService.getLessons(null, self.fromDate,self.toDate).then(function (lessons) {

                  

                    var data = [];
                    data.push([
                        'מס לקוח',
                        'ת.ז.',
                        'תאריך',
                        'שעה',
                        'שם מדריך',
                        'שם תלמיד',
                        'סטטוס',
                        'קופת חולים',
                        'סוג השיעור',
                        'עלות',
                        'הערות משרד'
                    ]);



                    

                    for (var lesson of lessons) {
                       
                        for (var status of lesson.statuses) {
                            var instructorName = getName(lesson.resourceId);
                            var student = getUser(status.StudentId);
                            if (student) {
                                var studentName = student.FirstName + " " + student.LastName;
                                var studentClientNumber = student.ClientNumber || "";
                                var studentIdNumber = student.IdNumber;
                              
                                //var studentHMO = status.HMO;
                                //var studentCost = student.Cost;
                              //  debugger
                                var studentHMO = status.HMO;
                                var studentCost = status.LessPrice;

                                var startHour = (new Date(lesson.start)).toLocaleTimeString();
                                var endHour = (new Date(lesson.end)).toLocaleTimeString();

                                startHour = (startHour.indexOf(':') == 1) ? "0" + startHour.substring(0, 4) : startHour.substring(0, 5) ;
                                endHour = (endHour.indexOf(':') == 1) ? "0" + endHour.substring(0, 4) : endHour.substring(0, 5);

                           
                               
                                if (instructorName && studentName) {
                                    data.push([
                                        studentClientNumber,
                                        studentIdNumber,
                                        new Date(lesson.start),
                                        startHour + ' - ' + endHour,
                                        instructorName,
                                        studentName,
                                        self.getHebStatus(status),
                                        self.getHebHMO(studentHMO),
                                        self.getPartaniK(lesson.statuses, status.StudentId),
                                        status.LessPrice,
                                        status.OfficeDetails,
                                    ]);
                                }
                            }
                        }
                    }
                   
                    _getReport(data);
                });
            })

      
        }

        function _getPartaniK(statuses, StudentId) {
           
            var count = 0;
            for (var i in statuses) {

                if (statuses[i].StudentId == StudentId && statuses[i].Status != "attended")
                    return 'פרטני';

                if (statuses[i].Status == "attended") {

                    count++;

                }

            }


            if (count > 1) return 'קבוצתי';

            else return 'פרטני';


        }

        function _getHebStatus(status) {

           
            if (status.Status == "completion" && (status.IsComplete == 4)) {
                return "הגיע משיעור השלמה";
            }

            if (status.Status == "completion" && (status.IsComplete == 6)) {
                return " לא הגיע,לחייב (שיעור השלמה)";
            }


            if (status.Status == "completion" && (status.IsComplete == 3)) {
                return " לא הגיע (שיעור השלמה)";
            }

            if (status.Status == "completion" && (status.IsComplete == 5)) {
                return "";
            }


            switch (status.Status) {

                case 'attended':
                    return 'הגיע'
                case 'notAttended':
                    return 'לא הגיע'
                case 'notAttendedCharge':
                    return 'לא הגיע לחייב'
                case 'notAttendedDontCharge':
                    return 'לא הגיע לא לחייב'
                case 'completionReq':
                case 'completionReqCharge':
                    return 'דרוש שיעור השלמה'
                case 'completion':
                    return 'לא הגיע'


                default:
                    return ''
            }


            // return status.Status;
            // return moment(event).isAfter(moment());
        }

        function _getHebHMO(studentHMO) {
            switch (studentHMO) {

                case 'maccabiGold':
                    return 'מכבי זהב'
                case 'maccabiSheli':
                    return 'מכבי שלי'

                case 'klalit':
                    return 'כללית'

                case 'klalitPlatinum':
                    return 'כללית פלטניום'

                case 'klalitDikla':
                    return 'כללית דקלה'

                case 'meuhedet':
                    return 'מאוחדת'

                case 'leumit':
                    return 'לאומית'







                default:
                    return ''
            }
        }


        function _horsesReport() {
            horsesService.getHorsesReport(2).then(function (horses) {
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
                        (horse.Active == "notActive")? "לא פעיל":"פעיל",
                        horse.Name,
                        horse.Race,
                        horse.Gender,
                        horse.Owner,
                        horse.Father,
                        horse.Mother,
                        horse.Ownage,
                        horse.Details,
                        horse.BirthDate ? new Date(horse.BirthDate) : null,
                        horse.Morning1,
                        horse.Morning2,

                        horse.Lunch1,
                        horse.Lunch2,

                        horse.Dinner1,
                        horse.Dinner2,

                      
                        _getVaccineDate('flu', horse),
                        _getVaccineDate('nile', horse),
                        _getVaccineDate('tetanus', horse),
                        _getVaccineDate('rabies', horse),
                        _getVaccineDate('herpes', horse),
                        _getVaccineDate('Deworming', horse),
                        _getShoeingDate(horse)
                    ]);
                });
                _getReport(data);
            });
        }



        function _getShoeingDate(horse) {

            var horseBirthDate = horse.BirthDate;
            var shoeingDate = null;
           // var hasLastShoeing = (typeof (horse.Meta.Shoeings) !== "undefined" && horse.Meta.Shoeings.length > 0);
            var first = moment(horseBirthDate).add(sharedValues.shoeing.first, 'days');

            if (horse.shoeings) {

                //horse.Meta.Shoeings = horse.Meta.Shoeings.sort(function (a, b) {
                //    if (new Date(a.Date) > new Date(b.Date))
                //        return 1;
                //    else if (new Date(a.Date) < new Date(b.Date))
                //        return -1;
                //    else
                //        return 0;
                //});
               // var lastShoeing = horse.Meta.Shoeings[horse.Meta.Shoeings.length - 1];
                shoeingDate = moment(horse.shoeingsLastDate).add(sharedValues.shoeing.interval, 'days');
            }
            else if (_isFuture(first)) {
                shoeingDate = first;
            }

            return shoeingDate ? shoeingDate.toDate() : null;
        }

        function _getVaccineDate(vaccineName, horse) {
            var horseBirthDate = horse.BirthDate;
            var horseAge = moment().diff(moment(horseBirthDate), 'years');
            var vaccine = _getVaccination(vaccineName);

            var lastVaccination = _getLastVaccination(vaccineName, horse);
            var vaccineDate = null;
            var first = vaccine.first ? moment(horseBirthDate).add(vaccine.first, 'days') : null;
            var second = vaccine.second ? first.add(vaccine.second, 'days') : null;
            var interval = vaccine.interval;

            if (vaccineName == 'Deworming') {
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

             
                if (horse[id]) {

                   
                      var Date = id + "LastDate";
                  //  for (var i in horse.Meta.Vaccinations) {
                       // if (horse[id]) {
                            lastVaccination.age = Math.ceil(moment.duration(moment(horse[Date]).diff(horse.BirthDate)).asDays());
                            lastVaccination.times++;
                            lastVaccination.date = horse[Date];
                        //}
                   // }
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