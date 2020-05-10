using System;

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


    }
}