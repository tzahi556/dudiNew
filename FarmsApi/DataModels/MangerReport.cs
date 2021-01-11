using System;

namespace FarmsApi.DataModels
{
    public class ManagerReport
    {
        public int? ActiveUser { get; set; }
        public int? notActiveUser { get; set; }
        public int? ActivePension { get; set; }
        public int? notActivePension { get; set; }

        public int? instructorUser { get; set; }
        public int? AllMinusCount { get; set; }
        public int? AllMinusSum { get; set; }
        public int? Macbi { get; set; }
        public int? Clalit { get; set; }

        public int? Dikla { get; set; }
        public int? Leumit { get; set; }
        public int? Meuedet { get; set; }
        public int? Other { get; set; }
        public string farmNAME { get; set; }


        //  public int Id { get; set; }
        //  public int? ParentId { get; set; }
        //  public DateTime? Start { get; set; }
        //  public DateTime? End { get; set; }

        //  public string Details { get; set; }
        ////  public bool editable { get; set; }
        //  public int? Instructor_Id { get; set; }

        //  public int? User_Id { get; set; }
        //  public string Status { get; set; }
        //  public string StatusDetails { get; set; }
        //  public int? IsComplete { get; set; }
        //  public int? HorseId { get; set; }
        //  public double? Price { get; set; }
        //  public string StudentName { get; set; }
        //  public int? LessonPayType { get; set; }




    }

    public class ManagerReportInstructorTable
    {
        public int? Id { get; set; }
        public string FullName { get; set; }
        public string Status { get; set; }
        public int? IsComplete { get; set; }

        public int? Counter { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
        public DateTime? OnlyDate { get; set; }
        public int? Diff { get; set; }
        public string Name { get; set; }
        public string Style { get; set; }
        public string HMO { get; set; }
        public int? Leave { get; set; }
        public int? StudentId { get; set; }

        public int? IsHiyuvInHashlama { get; set; }
    }

    public class HMOReport
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Taz { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Count { get; set; }
        public string Invoice { get; set; }
        public DateTime? Start { get; set; }

        public string Total { get; set; }


    }

    public class DebtReport
    {

        public string Taz { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Total { get; set; }

        public string TotalPayForMacabi { get; set; }
        public string HMO { get; set; }
        public string ClientNumber { get; set; }
        public string Style { get; set; }

    }
}