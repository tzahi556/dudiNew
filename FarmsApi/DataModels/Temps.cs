using System.ComponentModel.DataAnnotations.Schema;

namespace FarmsApi.DataModels
{
   
    public class Temps
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string Taz { get; set; }
        public int total { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string invoicenum { get; set; }

    }

}