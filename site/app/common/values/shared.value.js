﻿(function () {

    var app = angular.module('app');

  //  var API_ADDRESS = window.location.href.indexOf('giddyup.co.il') != -1 ? '/api/' : 'http://giddyup.co.il/api/';

    var API_ADDRESS = window.location.href.indexOf('giddyup.co.il') != -1 ? '/api/' : 'http://localhost:54033/';

    app.value('sharedValues', {

       
        DateModify:"20181105",
        apiUrl: API_ADDRESS,
        roles: [
            { id: 'sysAdmin', name: 'מנהל מערכת', showInUsers: true, sysAdminOnly: true, homePage: 'farms' },
            { id: 'farmAdmin', name: ' מנהל חווה', showInUsers: true, sysAdminOnly: true, homePage: 'lessons' },
            { id: 'farmAdminHorse', name: 'מנהל חווה לגידול סוסים', showInUsers: true, sysAdminOnly: true, homePage: 'lessons' },
            { id: 'profAdmin', name: 'מנהל מקצועי', showInUsers: true, sysAdminOnly: false, homePage: 'lessons' },
            { id: 'stableman', name: 'סייס', showInUsers: true, sysAdminOnly: false, homePage: 'horses' },
            { id: 'worker', name: 'עובד כללי', showInUsers: true, sysAdminOnly: false, homePage: 'horses' },
            { id: 'instructor', name: 'מדריך', showInUsers: false, sysAdminOnly: true, homePage: 'lessons' },
            { id: 'student', name: 'תלמיד', showInUsers: false, sysAdminOnly: true, homePage: 'lessons' },
        ],


        hozimTypes: [
            { id: '1', name: 'חליבה', hide: false },
            { id: '2', name: 'זירמה קפואה', hide: false },
            { id: '3', name: 'הקפצה', hide: true }
          
        ],



        lessonStatuses: [
            { id: 'attended', name: 'הגיע', hide: false },
            { id: 'notAttended', name: 'לא הגיע', hide: false },
            { id: 'notAttendedCharge', name: 'לא הגיע, לחייב', hide: true },
            { id: 'notAttendedDontCharge', name: 'לא הגיע, לא לחייב', hide: true },
            { id: 'completionReq', name: 'דרוש שיעור השלמה', hide: true },
            { id: 'completionReqCharge', name: 'דרוש שיעור השלמה', hide: true }
        ],
        styles: [
            { id: 'treatment', name: 'רכיבה טיפולית' },
            { id: 'privateTreatment', name: 'טיפולית פרטי' },
            { id: 'western', name: 'מערבי' },
            { id: 'reining', name: 'ריינינג' },
            { id: 'karting', name: 'קאטינג' },
            { id: 'english', name: 'אינגליש' },
            { id: 'course', name: 'קורס מדריכים' },
            { id: 'camp', name: 'מחנה רכיבה' },
            { id: 'phizi', name: 'פיזותרפיה' },
            { id: 'horseHolder', name: 'אחזקת סוס (פנסיון)' },
            { id: 'treatmentPsychological', name: 'טיפול פסיכולוגי' },
            { id: 'treatmentPsychological3-9', name: 'טיפול פסיכולוגי 3-9' },
            { id: 'treatmentPsychological9-18', name: 'טיפול פסיכולוגי 9-18' },
            { id: 'treatmentAnimal', name: 'טיפול בעזרת בעלי חיים' },
            { id: 'parentGuidance', name: 'הדרכת הורים' },
            { id: 'treatmentSwimming', name: 'שחייה טיפולית' },
            { id: 'treatmentSport', name: 'ספורט טיפולי' },
            { id: 'treatmentArt', name: 'תראפיה באומנות' },
            { id: 'treatmentMusic', name: 'תראפיה במוזיקה' },
            { id: 'treatmentPsychoDrama', name: 'פסיכודרמה' },
            { id: 'treatmentMovement', name: 'טיפול בתנועה' },
        ],
        HMOs: [
            { id: 'maccabiGold', name: 'מכבי זהב', prePaid: true, maxLessons: 30 },
            { id: 'maccabiSheli', name: 'מכבי שלי', prePaid: true, maxLessons: 50 },
            { id: 'klalit', name: 'כללית מושלם', maxLessons: 30 },
            { id: 'klalitPlatinum', name: 'כללית פלטינום', maxLessons: 55 },
            { id: 'klalitDikla', name: 'כללית דקלה', maxLessons: 55 },
            { id: 'meuhedet', name: 'מאוחדת' },
            { id: 'leumit', name: 'לאומית' },
        ],
        pregnancyStates: [
            { id: 'insemination', name: 'הזרעה', day: 0 },
            { id: 'ultrasound1', name: 'בדיקת אולטרסאונד 1', day: moment.duration(17, 'days').asDays() },
            { id: 'ultrasound2', name: 'בדיקת אולטרסאונד 2', day: moment.duration(30, 'days').asDays() },
            { id: 'ultrasound3', name: 'בדיקת אולטרסאונד 3', day: moment.duration(90, 'days').asDays() },
            { id: 'herpes1', name: 'חיסון הרפס 1', day: moment.duration(5, 'months').asDays() },
            { id: 'herpes2', name: 'חיסון הרפס 2', day: moment.duration(7, 'months').asDays() },
            { id: 'herpes3', name: 'חיסון הרפס 3', day: moment.duration(9, 'months').asDays() },
            { id: 'birth', name: 'לידה', day: moment.duration(11, 'months').asDays() }
        ],

        pregnancyStatesOuter: [
            { id: 'insemination', name: 'הזרעה', day: 0 },
            { id: 'ultrasound1', name: 'קליטה', day: moment.duration(17, 'days').asDays() },
            { id: 'birth', name: 'לידה', day: moment.duration(11, 'months').asDays() }
        ],



        pregnancyStatesSurrogateMother: [
            { id: 'implantation', name: 'השתלה', day: 0 },
            { id: 'ultrasound1', name: 'בדיקת אולטרסאונד 1', day: moment.duration(17, 'days').add(-7, 'days').asDays() },
            { id: 'ultrasound2', name: 'בדיקת אולטרסאונד 2', day: moment.duration(30, 'days').add(-7, 'days').asDays() },
            { id: 'ultrasound3', name: 'בדיקת אולטרסאונד 3', day: moment.duration(90, 'days').add(-7, 'days').asDays() },
            { id: 'herpes1', name: 'חיסון הרפס 1', day: moment.duration(5, 'months').add(-7, 'days').asDays() },
            { id: 'herpes2', name: 'חיסון הרפס 2', day: moment.duration(7, 'months').add(-7, 'days').asDays() },
            { id: 'herpes3', name: 'חיסון הרפס 3', day: moment.duration(9, 'months').add(-7, 'days').asDays() },
            { id: 'birth', name: 'לידה', day: moment.duration(11, 'months').add(-7, 'days').asDays() }
        ],
        pregnancyStatesSurrogate: [
            { id: 'insemination', name: 'הזרעה', day: 0 },
            { id: 'cleaning', name: 'שטיפה', day: moment.duration(7, 'days').asDays() },
            { id: 'surrogatePregnancy', name: 'הריון אומנת', day: moment.duration(7, 'days').asDays() }
        ],
        shoeing: { first: moment.duration(22, 'months').asDays(), interval: moment.duration(7, 'weeks').asDays() },
        vaccinations: [
            { id: "flu", name: "שפעת", first: moment.duration(6, 'months').asDays(), second: moment.duration(3, 'weeks').asDays(), interval: moment.duration(6, 'months').asDays() },
            { id: "nile", name: "קדחת הנילוס", first: moment.duration(6, 'months').asDays(), second: moment.duration(3, 'weeks').asDays(), interval: moment.duration(12, 'months').asDays() },
            { id: "tetanus", name: "טטנוס", first: moment.duration(3, 'months').asDays(), second: moment.duration(6, 'months').asDays(), interval: moment.duration(12, 'months').asDays() },
            { id: "rabies", name: "כלבת", first: moment.duration(3, 'months').asDays(), interval: moment.duration(12, 'months').asDays() },
            { id: "herpes", name: "הרפס", interval: moment.duration(12, 'months').asDays() },
            { id: "worming", name: "תילוע", first: moment.duration(2, 'months').asDays(), interval1: moment.duration(2, 'months').asDays(), interval2: moment.duration(6, 'months').asDays() },
            { id: "other", name: "אחר" }
        ]
    });

})();