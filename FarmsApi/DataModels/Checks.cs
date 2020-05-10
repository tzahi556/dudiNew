using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmsApi.DataModels
{
    public class Checks
    {

        [Key, Column(Order = 0)]
        public int Id { get; set; }
        public int? UserId { get; set; }
        public DateTime? checks_date { get; set; }
        public int? PaymentsId { get; set; }
        public double? checks_sum { get; set; }
        public string checks_number { get; set; }
        public string checks_bank_name { get; set; }
        public bool checks_auto { get; set; }

    }
}