using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmsApi.DataModels
{
    public class Logs
    {

        [Key, Column(Order = 0)]
        public int Id { get; set; }
        public int Type { get; set; }
        // 1 - סליקה אשראי טוקן קבלה מאיזיקאונט כל סוגי החשבוניות מאיזיקאונט
        // 2 - חזרה מאיזקאונט צקים דחויים
        // 3 - מחיקת חשבונית אצלינו
        // 4 - הוספה אצלינו בלבד
        public int? UserId { get; set; }
        public int? StudentId { get; set; }
        public DateTime TimeStamp { get; set; }
        public string Request { get; set; }
        public string Response { get; set; }
        public string Exception { get; set; }
        public string Details { get; set; }
        

    }
}