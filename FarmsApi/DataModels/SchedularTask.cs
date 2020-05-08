using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FarmsApi.DataModels
{
    public class SchedularTasks
    {
        public int Id { get; set; }
        public int ResourceId { get; set; }
        public int LessonId { get; set; }

        public string Title { get; set; }
        public string Desc { get; set; }
        public bool EveryDay { get; set; }
        public bool EveryWeek { get; set; }
        public bool EveryMonth { get; set; }

        public bool IsExe { get; set; }
        public DateTime? EndDate { get; set; }

    }
}