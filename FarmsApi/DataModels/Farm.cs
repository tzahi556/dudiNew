using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FarmsApi.DataModels
{
    public class Farm
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Deleted { get; set; }
        public string Meta { get; set; }
    }
}