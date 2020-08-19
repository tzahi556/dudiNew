using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

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

        public DateTime? ArrivedDate { get; set; }

        public DateTime? OutDate { get; set; }

        public int? SeqNumber { get; set; }

        public string Shvav { get; set; }

        public DateTime? BirthDate { get; set; }
        public DateTime? PensionStartDate { get; set; }

        public string Active { get; set; }
        public string Gender { get; set; }
        public string Ownage { get; set; }

        public string HorseLocation { get; set; }
        public string Race { get; set; }
        
        public int? OwnerId { get; set; }
        
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
        [NotMapped]
        public bool IsShoeings { get; set; }
        [NotMapped]
        public bool IsTilufings { get; set; }
        [NotMapped]
        public bool IsHerion { get; set; }
        [NotMapped]



        public DateTime? fluLastDate { get; set; }
        [NotMapped]
        public bool flu { get; set; }
        [NotMapped]
        public DateTime? nileLastDate { get; set; }
        [NotMapped]
        public bool nile { get; set; }
        [NotMapped]
        public DateTime? tetanusLastDate { get; set; }
        [NotMapped]
        public bool tetanus { get; set; }
        [NotMapped]
        public DateTime? rabiesLastDate { get; set; }
        [NotMapped]
        public bool rabies { get; set; }

        [NotMapped]
        public DateTime? herpesLastDate { get; set; }
        [NotMapped]
        public bool herpes { get; set; }
        [NotMapped]
        public DateTime? wormingLastDate { get; set; }
        [NotMapped]
        public bool worming { get; set; }


        [NotMapped]
        public DateTime? shoeingsLastDate { get; set; }
        [NotMapped]
        public bool shoeings { get; set; }

        //public DateTime? wormingLastDate { get; set; }
        //[NotMapped]
        //public bool worming { get; set; }


        //_getVaccineDate('flu', horse),
        //  _getVaccineDate('nile', horse),
        //   _getVaccineDate('tetanus', horse),
        //                _getVaccineDate('rabies', horse),
        //                _getVaccineDate('herpes', horse),
        //                _getVaccineDate('worming', horse),
        //                _getShoeingDate(horse)

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


    public class HorseHozims
    {
        public int Id { get; set; }
        public int HorseId { get; set; }
        public int Type { get; set; }
        public DateTime? Date { get; set; }
        public int FatherHorseId { get; set; }
        public double? Cost { get; set; }
        public double? CostHava { get; set; }
        public double? CostFather { get; set; }
        public int? ExpensesId { get; set; }
        public int? ExpensesIdHava { get; set; }
        
        public bool IsPaid { get; set; }
        public int? Trial { get; set; }

        public int? UserId { get; set; }
        

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
        public DateTime? Date { get; set; }

        public string Name { get; set; }
        public double? Cost { get; set; }
        public double? Discount { get; set; }
        public string FileName { get; set; }

        public bool IsPaid { get; set; }

        public int? ExpensesId { get; set; }


    }
    /// <summary>
    /// חיסונים
    /// </summary>
    public class HorseVaccinations
    {
        public int Id { get; set; }
        public int HorseId { get; set; }
        public DateTime? Date { get; set; }

        public string Type { get; set; }
        public string Name { get; set; }
        public double? Cost { get; set; }
        public double? Discount { get; set; }
        public string FileName { get; set; }

        public bool IsPaid { get; set; }

        public int? ExpensesId { get; set; }

    }

    /// <summary>
    /// פירזול
    /// </summary>
    public class HorseShoeings
    {
        public int Id { get; set; }
        public int HorseId { get; set; }
        public DateTime? Date { get; set; }
        public string Name { get; set; }
        public string ShoerName { get; set; }
        public double? Cost { get; set; }
        public double? Discount { get; set; }
        public string FileName { get; set; }

        public bool IsPaid { get; set; }

        public int? ExpensesId { get; set; }

    }

    /// <summary>
    /// טילוף
    /// </summary>
    public class HorseTilufings
    {
        public int Id { get; set; }
        public int HorseId { get; set; }
        public DateTime? Date { get; set; }
        public string Name { get; set; }
        public string ShoerName { get; set; }
        public double? Cost { get; set; }
        public double? Discount { get; set; }
        public string FileName { get; set; }

        public bool IsPaid { get; set; }

        public int? ExpensesId { get; set; }

    }

    /// <summary>
    /// הריון
    /// </summary>
    public class HorsePregnancies
    {
        public int Id { get; set; }
        public int HorseId { get; set; }
        public DateTime? Date { get; set; }
        public bool Finished { get; set; }

        public bool IsSurrogate { get; set; }

        public int FatherHorseId { get; set; }

        public string Mother { get; set; }

        public int? MotherId { get; set; }
        public string Father { get; set; }

        public int SurrogateId { get; set; }

        public string SurrogateName { get; set; }

        public string Comments { get; set; }

        public int? HozimId { get; set; }
        

    }

    public class HorsePregnanciesStates
    {
        public int Id { get; set; }
        public int HorseId { get; set; }
        public int HorsePregnanciesId { get; set; }
        
        public DateTime? Date { get; set; }
        public string StateId { get; set; }
        public string name { get; set; }
        public string day { get; set; }

        [NotMapped]
        public bool Finished { get; set; }

        public double? Cost { get; set; }

        public int? ExpensesId { get; set; }

        public bool IsPaid { get; set; }
    }

    /// <summary>
    /// הרבעות
    /// </summary>
    public class HorseInseminations
    {
        public int Id { get; set; }
        public int HorseId { get; set; }

        public int? HozimId { get; set; }

        public DateTime? HalivaDate { get; set; }
        public DateTime? InseminationDate { get; set; }

        public DateTime? HerionDate { get; set; }
        public DateTime? LedaDate { get; set; }
        public int? PregnanciesHorseId { get; set; }

        public double? Cost { get; set; }
        public double? Sum { get; set; }
        public int? ExpensesId { get; set; }

        public int? StatusLeda { get; set; }// 0 התחלה 
                                            //1 - לידה
                                            //2 - הפסקת לידה

        public int? PregnancId { get; set; }
        


    }

    public class HorseInseminationsResult
    {
        public int Id { get; set; }
        public int HorseId { get; set; }

        public DateTime? HalivaDate { get; set; }
        public DateTime? InseminationDate { get; set; }

        public int? Type { get; set; }
        public string Susa { get; set; }

       
        
        public string SusaOwner { get; set; }

        public int? SusaSiduri { get; set; }

        
        public DateTime? HerionDate { get; set; }
        
        public DateTime? LedaDate { get; set; }

        public int? PregnanciesHorseId { get; set; }
        public int? StatusLeda { get; set; }
        public bool IsPaid { get; set; }

        public double? Cost { get; set; }
        public double? Sum { get; set; }
        public int? PregnancId { get; set; }

        public int? HozimId { get; set; }
        public int? OwnerId { get; set; }

        

    }




}