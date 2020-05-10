using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmsApi.DataModels
{
    public class StudentLessons
    {
        [Key, Column(Order = 0)]
        public int User_Id { get; set; }
        [Key, Column(Order = 1)]
        public int Lesson_Id { get; set; }
        public string Status { get; set; }
        public string Details { get; set; }
        public int IsComplete { get; set; }
        public int? HorseId { get; set; }
        public double? Price { get; set; }
        public int LessonPayType { get; set; }
        public string OfficeDetails { get; set; }

        public string Matarot { get; set; }
        public string Mahalak { get; set; }
        public string HearotStatus { get; set; }
        public string Mashov { get; set; }



    }
}