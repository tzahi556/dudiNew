using System;

namespace FarmsApi.DataModels
{
    public class Makavs
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime? Date { get; set; }
        public string Subject { get; set; }
        public string UserWrite { get; set; }
        public string Desc { get; set; }
    }
}