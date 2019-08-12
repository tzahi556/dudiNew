using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;

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

        public Context() : base("Farms") { }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
        }
    }
}