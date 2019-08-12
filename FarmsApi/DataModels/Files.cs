using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FarmsApi.DataModels
{
    public class Files
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public string Link { get; set; }
     
       

    }
}