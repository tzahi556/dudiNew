using System;

namespace FarmsApi.DataModels
{
    public class MonthlyReports
    {
        public int Id { get; set; }
        public int UserId { get; set; }
      
        public DateTime Date { get; set; }
        public string Summery { get; set; }



    }
}