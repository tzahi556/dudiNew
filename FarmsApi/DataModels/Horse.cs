using System;
using System.Collections.Generic;

namespace FarmsApi.DataModels
{
    public class Horse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Meta { get; set; }
        public int Farm_Id { get; set; }
        public bool Deleted { get; set; }
        public List<string> Meta2 { get; set; }

        public DateTime ArrivedDate { get; set; }

        public DateTime OutDate { get; set; }

        public int? SeqNumber { get; set; }

        public string Shvav { get; set; }

        public DateTime BirthDate { get; set; }
        public DateTime PensionStartDate { get; set; }

        public string Active { get; set; }
        public string Gender { get; set; }
        public string Ownage { get; set; }
        public string Race { get; set; }
        public string Owner { get; set; }
        public string Father { get; set; }
        public string Mother { get; set; }
        public string Details { get; set; }
        public string Morning1 { get; set; }
        public string Morning2 { get; set; }
        public string Lunch1 { get; set; }
        public string Lunch2 { get; set; }
        public string Dinner1 { get; set; }
        public string Dinner2 { get; set; }
        public string Image { get; set; }


        //Morning1    nvarchar(MAX)   Checked
        //Morning2    nvarchar(MAX)   Checked
        //Lunch1  nvarchar(MAX)   Checked
        //Lunch2  nvarchar(MAX)   Checked
        //Dinner1 nvarchar(MAX)   Checked
        //Dinner2 nvarchar(MAX)   Checked
        //Files   nvarchar(MAX)   Checked
        //Image   nvarchar(MAX)   Checked
        //     Unchecked

    }


    public class HorseFiles
    {
        public int Id { get; set; }
        public int HorseId { get; set; }
        public string FileName { get; set; }
    }

    public class HorseHozeFiles
    {
        public int Id { get; set; }
        public int HorseId { get; set; }
        public string FileName { get; set; }
    }

    public class HorsePundekautFiles
    {
        public int Id { get; set; }
        public int HorseId { get; set; }
        public string FileName { get; set; }
    }
    /// <summary>
    /// טיפולים
    /// </summary>
    public class HorseTreatments
    {
        public int Id { get; set; }
        public int HorseId { get; set; }
        public string Name { get; set; }
        public double? Cost { get; set; }
        public double? Discount { get; set; }
        public string FileName { get; set; }

    }
    /// <summary>
    /// חיסונים
    /// </summary>
    public class HorseVaccinations
    {
        public int Id { get; set; }
        public int HorseId { get; set; }
        public string Name { get; set; }
        public double? Cost { get; set; }
        public double? Discount { get; set; }
        public string FileName { get; set; }

    }

    /// <summary>
    /// פירזול
    /// </summary>
    public class HorseShoeings
    {
        public int Id { get; set; }
        public int HorseId { get; set; }

        public string Name { get; set; }
        public string ShoerName { get; set; }
        public double? Cost { get; set; }
        public double? Discount { get; set; }
        public string FileName { get; set; }

    }

    /// <summary>
    /// טילוף
    /// </summary>
    public class HorseTilufings
    {
        public int Id { get; set; }
        public int HorseId { get; set; }
        public string Name { get; set; }
        public string ShoerName { get; set; }
        public double? Cost { get; set; }
        public double? Discount { get; set; }
        public string FileName { get; set; }

    }

    /// <summary>
    /// הריון
    /// </summary>
    public class HorsePregnancies
    {
        public int Id { get; set; }
        public int HorseId { get; set; }
        public DateTime Date { get; set; }
        public bool Finished { get; set; }

        public bool IsSurrogate { get; set; }

        public int FatherHorseId { get; set; }

        public int SurrogateId { get; set; }

        public List<HorsePregnanciesStates> PregnanciesStates { get; set; } 




    }

    public class HorsePregnanciesStates
    {
        public int Id { get; set; }
        public int HorseId { get; set; }
        public int HorsePregnanciesId { get; set; }
        
        public DateTime Date { get; set; }
        public int id { get; set; }
        public int name { get; set; }
        public int day { get; set; }
     

    }

    /// <summary>
    /// הרבעות
    /// </summary>
    public class HorseInseminations
    {
        public int Id { get; set; }
        public int HorseId { get; set; }
        public DateTime InseminationDate { get; set; }

        public int PregnanciesHorseId { get; set; }
     


    }

    


}