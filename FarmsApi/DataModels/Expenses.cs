using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmsApi.DataModels
{
    public class Expenses
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime? Date { get; set; }
        public double? Price { get; set; }
        public double? Sum { get; set; }
        public string Details { get; set; }
        public string Paid { get; set; }

        public double? Discount { get; set; }
        public int? ZikuyNumber { get; set; }
        public double? BeforePrice { get; set; }
        public double? ZikuySum { get; set; }
        [NotMapped]
        public bool SelectedForZikuy { get; set; }

       
        public int? SelectedForZikuyManualId { get; set; }

        
    }
}