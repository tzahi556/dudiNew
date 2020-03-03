using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FarmsApi.DataModels
{
    public class Payments
    {
     
        [Key, Column(Order = 0)]
        public int Id { get; set; }
        public int UserId { get; set; }

        public DateTime? Date { get; set; }
        public string InvoicePdf { get; set; }
        public string InvoiceNum { get; set; }

        public string ParentInvoicePdf { get; set; }
        public string ParentInvoiceNum { get; set; }

        public string InvoiceDetails { get; set; }
        public string canceled { get; set; }

        public double? Price { get; set; }
        public double? InvoiceSum { get; set; }
        public string payment_type { get; set; }

        public string doc_type { get; set; }

        public string doc_uuid { get; set; }
        
        public int? lessons { get; set; }
        public DateTime? month { get; set; }
        public DateTime? untilmonth { get; set; }
       
        public bool SelectedForInvoice { get; set; }


    }
}