using FarmsApi.DataModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;

namespace FarmsApi.Services
{
    public class HorsesService
    {

        public static List<Horse> GetHorses(bool IncludeDeleted = false)
        {
            using (var Context = new Context())
            {
                var CurrentUserFarmId = UsersService.GetCurrentUser().Farm_Id;
                var Horses = Context.Horses.ToList();
                if (CurrentUserFarmId != 0)
                {
                    Horses = Horses.Where(h => h.Farm_Id == CurrentUserFarmId).OrderBy(x=>x.Name).ToList();
                }
                Horses = FilterDeleted(Horses, IncludeDeleted);
                return Horses;
            }
        }

        private static List<Horse> FilterDeleted(List<Horse> Horses, bool IncludeDeleted)
        {
            if (IncludeDeleted)
            {
                return Horses;
            }

            return Horses.Where(u => !u.Deleted).ToList();
        }

        public static Horse GetHorse(int Id)
        {
            using (var Context = new Context())
                return Context.Horses.SingleOrDefault(u => u.Id == Id && !u.Deleted);
        }

        public static Horse UpdateHorse(Horse Horse)
        {
            using (var Context = new Context())
            {
                var CurrentUserFarmId = UsersService.GetCurrentUser().Farm_Id;
                Horse.Farm_Id = CurrentUserFarmId != 0 ? CurrentUserFarmId : Horse.Farm_Id;
                if (Horse.Id == 0)
                    Context.Horses.Add(Horse);
                else
                    Context.Entry(Horse).State = System.Data.Entity.EntityState.Modified;

                Context.SaveChanges();
                return Horse;
            }
        }

        public static int CheckIfHorseWork(int? id, string start, string end)
        {
            using (var Context = new Context())
            {
                try {

                    DateTime dtStart = Convert.ToDateTime(start);
                    DateTime dtSEnd = Convert.ToDateTime(end);

                    var isExist = (from l in Context.Lessons
                              join s in Context.StudentLessons
                              on l.Id equals s.Lesson_Id
                              where s.HorseId == id && 
                              ((l.Start >= dtStart && l.Start < dtSEnd) || (dtStart >= l.Start && dtStart < l.End))
                                   select new
                              {
                                  ID = s.HorseId
                                 
                              }).ToList();


                    return isExist.Count();


                }
                catch(Exception ex)
                {


                }


            }

            return 0;
        }
        public static void DeleteHorse(int Id)
        {
            using (var Context = new Context())
            {
                var Horse = Context.Horses.SingleOrDefault(u => u.Id == Id);
                var HorseNotifications = Context.Notifications.Where(n => n.EntityType == "horse" && n.EntityId == Horse.Id);
                if (Horse != null)
                {
                    Horse.Deleted = true;
                    Context.Notifications.RemoveRange(HorseNotifications);
                }
                Context.SaveChanges();
            }
        }
    }
}