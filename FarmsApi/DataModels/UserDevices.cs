using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FarmsApi.DataModels
{
    public class UserDevices
    {
        public int Id { get; set; }
        public int User_Id { get; set; }   
        public string DeviceToken { get; set; }
    }
}