using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmsApi.DataModels
{
    public class LogsLessons
    {

        [Key, Column(Order = 0)]
        public int Id { get; set; }
        public int Type { get; set; }
        // 1 - הכנסת חדש
        // 2 - עדכון
        // 3 - הוספת תלמיד
        // 4 - מחיקה תלמיד
        // 5 - מחיקת שיעור
        public int? UserId { get; set; }
        public int? StudentId { get; set; }
        public DateTime TimeStamp { get; set; }

        public DateTime? LessonDate { get; set; }
        public string Status { get; set; }
        //public string Response { get; set; }
        public string Exception { get; set; }
        public string Details { get; set; }
        public int? LessonId { get; set; }

        public int Instructor_Id { get; set; }


    }
}