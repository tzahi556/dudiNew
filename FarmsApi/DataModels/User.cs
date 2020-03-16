using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FarmsApi.DataModels
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        //public int AccountStatus { get; set; }
        //public string Meta { get; set; }
        public string Active { get; set; }
        public int Farm_Id { get; set; }
        public bool Deleted { get; set; }


        public string Image { get; set; }
        public string ClientNumber { get; set; }
        public string IdNumber { get; set; }
        public DateTime? BirthDate { get; set; }

        public DateTime? DateForMonthlyPay { get; set; }

        public double? DateForMonthlySum { get; set; }
        
        public string ParentName2 { get; set; }
        public string ParentName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string PhoneNumber2 { get; set; }
        public string AnotherEmail { get; set; }
        public string Style { get; set; }
        public string TeamMember { get; set; }
        public double? Cost { get; set; }
        public string PayType { get; set; }
        public string Details { get; set; }
        public string HMO { get; set; }
        public string BalanceDetails { get; set; }


        public string cc_token { get; set; }
        public string cc_type_id { get; set; }
        public string cc_type_name { get; set; }
        public string cc_4_digits { get; set; }
        public string cc_payer_name { get; set; }
        public string cc_payer_id { get; set; }
        public string cc_expire_month { get; set; }
        public string cc_expire_year { get; set; }

        //public string Meta { get; set; }

        public string EventsColor { get; set; }

        public int? EntityId { get; set; }

        public string Intek { get; set; }
        public string MatrotAl { get; set; }



    }
}