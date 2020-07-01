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


        public DbSet<HorseFiles> HorseFiles { get; set; }
        public DbSet<HorseHozeFiles> HorseHozeFiles { get; set; }
        public DbSet<HorsePundekautFiles> HorsePundekautFiles { get; set; }
        public DbSet<HorseTreatments> HorseTreatments { get; set; }
        public DbSet<HorseShoeings> HorseShoeings { get; set; }
        public DbSet<HorseTilufings> HorseTilufings { get; set; }

        public DbSet<HorsePregnancies> HorsePregnancies { get; set; }
        public DbSet<HorsePregnanciesStates> HorsePregnanciesStates { get; set; }
        public DbSet<HorseInseminations> HorseInseminations { get; set; }


        

        public Context() : base("Farms") { }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
        }
    }
}