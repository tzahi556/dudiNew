using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmsApi.DataModels
{
    public class Ashrais
    {

        [Key, Column(Order = 0)]
        public int Id { get; set; }
        public int? UserId { get; set; }
        public DateTime? AshraiDate { get; set; }
        public int? PaymentsId { get; set; }
        public double? ashrai_sum { get; set; }

        public string cc_number { get; set; }
        public string cc_num_of_payments { get; set; }

        public string cc_customer_name { get; set; }
        public string cc_payment_num { get; set; }

        public string cc_deal_type { get; set; }
        public string cc_type { get; set; }
        public string cc_type_name { get; set; }
        public bool ashrai_auto { get; set; }

    }
}