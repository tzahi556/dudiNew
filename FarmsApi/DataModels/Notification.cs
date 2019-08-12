using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FarmsApi.DataModels
{
    public class Notification
    {
        public int Id { get; set; }
        public string EntityType { get; set; }
        public int EntityId { get; set; }
        public string Group { get; set; }
        public string Text { get; set; }
        public string Details { get; set; }
        public int FarmId { get; set; }
        public DateTime Date { get; set; }
        public bool Deletable { get; set; }
    }
}