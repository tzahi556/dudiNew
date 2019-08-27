using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FarmsApi.DataModels
{
    public class AvailableHours
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int resourceId { get; set; }
        public string start { get; set; }
        public string end { get; set; }
        public string dow { get; set; }
     

    }
}