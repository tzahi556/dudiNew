﻿using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmsApi.DataModels
{
    public class KlalitHistoris
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int FarmId { get; set; }

        public DateTime DateSend { get; set; }
        public DateTime DateLesson { get; set; }

        public string Result { get; set; }
        public string ResultXML { get; set; }

      
        public string UserName { get; set; }
      
        public string Taz { get; set; }


    }
}