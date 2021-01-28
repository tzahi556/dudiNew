using System;

namespace FarmsApi.DataModels
{
    public class LessonsResult
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }

        public string Details { get; set; }
        //  public bool editable { get; set; }
        public int? Instructor_Id { get; set; }

        public int? User_Id { get; set; }
        public string Status { get; set; }
        public string StatusDetails { get; set; }
        public int? IsComplete { get; set; }
        public int? HorseId { get; set; }
        public double? Price { get; set; }
        public string StudentName { get; set; }
        public int? LessonPayType { get; set; }
        public string HorseName { get; set; }
        public string OfficeDetails { get; set; }
        public int PrevNext { get; set; }

        public string Matarot { get; set; }
        public string Mahalak { get; set; }
        public string HearotStatus { get; set; }
        public string Mashov { get; set; }

        public int? IsMazkirut { get; set; }

        public string HMO { get; set; }

        public int? IsPaid { get; set; }


        // id = lesson.Id,
        //prevId = lesson.ParentId,
        //start = lesson.Start,
        //end = lesson.End,
        //details = lesson.Details,
        //editable = true,
        //resourceId = lesson.Instructor_Id,
        //student = studentLesson != null ? (int?)studentLesson.User_Id : null,
        //status = studentLesson != null ? studentLesson.Status : null,
        //statusDetails = studentLesson != null ? studentLesson.Details : null,
        //isComplete = studentLesson != null ? studentLesson.IsComplete : 0,
        //lessprice = studentLesson.Price,
        ////studentName = student.FirstName + " " + student.LastName + ((IsPrice) ? "<a  style='color:" + ((student.Id < 0) ? "red" : "blue") + ";font-weight:bold;padding-right:2px;padding-left:2px;'>(<span id=dvPaid_" + studentLesson.User_Id.ToString() + ">" + -348 + "</span>)</a>" : "")

        //studentName



    }
}