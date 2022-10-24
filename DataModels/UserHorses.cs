using System;

namespace FarmsApi.DataModels
{
    public class UserHorses
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int HorseId { get; set; }

        public string Name { get; set; }
        public bool Owner { get; set; }
        public int? PensionPrice { get; set; }
        public int? TrainingCost { get; set; }

        public bool IsCancelAuto { get; set; }
     
        public DateTime? UntilCancelTime { get; set; }

    }
}