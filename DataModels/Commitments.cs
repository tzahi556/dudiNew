using System;

namespace FarmsApi.DataModels
{
    public class Commitments
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public string HMO { get; set; }
        public double? Qty { get; set; }
        public string Number { get; set; }
        public DateTime? Date { get; set; }
        public string canceled { get; set; }
        public string Price { get; set; }
        public string InvoiceSum { get; set; }

    }
}