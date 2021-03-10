using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmsApi.DataModels
{
    public class Tiyuls
    {

        [Key, Column(Order = 0)]
        public int Id { get; set; }

        public int LessonId { get; set; }

        public int? HorseId { get; set; }
        public string NameofRidder { get; set; }

        public string TiyulTel { get; set; }
        public string TiyulMail { get; set; }
        public string TiyulCost { get; set; }
        public int? TiyulCounts { get; set; }
        public string TiyulMazmin { get; set; }

        public string TiyulCostSend { get; set; }

        public DateTime? TiyulDate { get; set; }
        


    }
}