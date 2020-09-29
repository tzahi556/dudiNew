using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace FarmsApi.DataModels
{
    public class Context : DbContext
    {
        public DbSet<User> Users { get; set; }


        public DbSet<Horse> Horses { get; set; }
        public DbSet<Farm> Farms { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<StudentLessons> StudentLessons { get; set; }
        public DbSet<UserDevices> UserDevices { get; set; }
        public DbSet<Messages> Messages { get; set; }
        public DbSet<Commitments> Commitments { get; set; }
        public DbSet<Expenses> Expenses { get; set; }
        public DbSet<Files> Files { get; set; }
        public DbSet<Payments> Payments { get; set; }
        public DbSet<UserHorses> UserHorses { get; set; }
        public DbSet<AvailableHours> AvailableHours { get; set; }
        public DbSet<Makavs> Makavs { get; set; }
        public DbSet<Checks> Checks { get; set; }
        public DbSet<SchedularTasks> SchedularTasks { get; set; }


        public DbSet<HorseFiles> HorseFiles { get; set; } // type 2
        public DbSet<HorseHozeFiles> HorseHozeFiles { get; set; }//3
        public DbSet<HorsePundekautFiles> HorsePundekautFiles { get; set; }//4
        public DbSet<HorseTreatments> HorseTreatments { get; set; }//5
        public DbSet<HorseVaccinations> HorseVaccinations { get; set; }//6
        public DbSet<HorseShoeings> HorseShoeings { get; set; }//7
        public DbSet<HorseTilufings> HorseTilufings { get; set; }//8
        public DbSet<HorsePregnancies> HorsePregnancies { get; set; }//9
        public DbSet<HorsePregnanciesStates> HorsePregnanciesStates { get; set; }//10
        public DbSet<HorseInseminations> HorseInseminations { get; set; }//11

        public DbSet<FarmManagers> FarmManagers { get; set; }
        public DbSet<FarmInstructors> FarmInstructors { get; set; }
        public DbSet<Logs> Logs { get; set; }
        public DbSet<LogsLessons> LogsLessons { get; set; }

        public DbSet<HorseHozims> HorseHozims { get; set; }
        public DbSet<MonthlyReports> MonthlyReports { get; set; }
        public DbSet<KlalitHistoris> KlalitHistoris { get; set; }
        public DbSet<HorsesMultipleFiles> HorsesMultipleFiles { get; set; }
        public DbSet<HorseVetrinars> HorseVetrinars { get; set; }

        

        public Context() : base("Farms") { }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
        }
    }
}