using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FarmsApi.DataModels
{
    public class Lesson
    {
        public int Id { get; set; }
        public int ParentId { get; set; }

        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public int Instructor_Id { get; set; }
        public string Details { get; set; }
       
        

    }
}