using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FarmsApi.DataModels
{
    public class TransferResult
    {
        public int? Id { get; set;}
        public string Result { get; set;}
        public int? IsTafus { get; set; }
        
    }


 }