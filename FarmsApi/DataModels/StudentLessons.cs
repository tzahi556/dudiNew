﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FarmsApi.DataModels
{
    public class StudentLessons
    {
        [Key, Column(Order = 0)]
        public int User_Id { get; set; }
        [Key, Column(Order = 1)]
        public int Lesson_Id { get; set; }
        public string Status { get; set; }
        public string Details { get; set; }
        public int IsComplete { get; set; }
    }
}