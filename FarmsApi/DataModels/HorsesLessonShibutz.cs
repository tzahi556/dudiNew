using System;

namespace FarmsApi.DataModels
{
   

    public class HorsesLessonShibutz
    {

        public int User_Id { get; set; }

        public int Lesson_Id { get; set; }

        public int HorseId { get; set; }

        public int? MainHorseId { get; set; }

        public DateTime Start { get; set; }

        public DateTime End { get; set; }

        public int MinuteOfLesson { get; set; }

    }
}