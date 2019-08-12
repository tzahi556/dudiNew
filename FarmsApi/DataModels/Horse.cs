using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FarmsApi.DataModels
{
    public class Horse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Meta { get; set; }
        public int Farm_Id { get; set; }
        public bool Deleted { get; set; }
        public List<string> Meta2 { get; set; }
    }
}