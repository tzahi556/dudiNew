using FarmsApi.DataModels;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Http.Results;

namespace FarmsApi.Services
{
    public class FarmsService
    {
        public static List<Farm> GetFarms(bool deleted)
        {
            using (var Context = new Context())
            {
                var CurrentUser = UsersService.GetCurrentUser();
                if (CurrentUser.Role == "sysAdmin")
                    return Context.Farms.Where(f => f.Deleted == deleted).ToList();
                else
                    return Context.Farms.Where(f => f.Deleted == deleted && f.Id == CurrentUser.Farm_Id).ToList();
            }
        }

        public static User GetFarmsMainUser(int FarmId)
        {
            using (var Context = new Context())
            {

                return Context.Users.Where(x => x.Farm_Id == FarmId && (x.Role == "farmAdmin" || x.Role == "farmAdminHorse")).FirstOrDefault();


            }
        }



        public static void DeleteFarm(int id)
        {
            using (var Context = new Context())
            {
                var Farm = Context.Farms.SingleOrDefault(f => f.Id == id);
                Farm.Deleted = true;
                foreach (var User in Context.Users.Where(u => u.Farm_Id == id))
                {
                    User.Deleted = true;
                }
                foreach (var Horse in Context.Horses.Where(h => h.Farm_Id == id))
                {
                    Horse.Deleted = true;
                }
                Context.Notifications.RemoveRange(Context.Notifications.Where(n => n.FarmId == id));

                Context.SaveChanges();
            }
        }

        public static Farm GetFarm(int Id)
        {
            using (var Context = new Context())
                return Context.Farms.SingleOrDefault(u => u.Id == Id);
        }

        public static FarmManagers GetMangerFarm()
        {
            using (var Context = new Context())
            {
                var CurrentUser = UsersService.GetCurrentUser();

                return Context.FarmManagers.SingleOrDefault(u => u.FarmId == CurrentUser.Farm_Id);

            }
                
        }

        public static IEnumerable<FarmInstructors> GetMangerInstructorFarm()
        {
            using (var Context = new Context())
            {
                var CurrentUser = UsersService.GetCurrentUser();
                var CurrentUserFarmId = CurrentUser.Farm_Id;

                var InstructorList = from u in Context.Users
                                     from um in Context.FarmInstructors.Where(x=>x.UserId==u.Id).DefaultIfEmpty()//  on u.Id equals um.UserId
                                     where u.Role== "instructor" && u.Farm_Id == CurrentUserFarmId && !u.Deleted && u.IsMazkirut!=1
                                     select new {Id=u.Id, ClalitNumber =um.ClalitNumber, UserId=u.Id, InstructorName = u.FirstName + " " + u.LastName };


                var l = InstructorList.ToList().Select(x => new FarmInstructors { Id = x.Id, ClalitNumber = x.ClalitNumber, UserId = x.UserId, InstructorName = x.InstructorName });

                return l;

            }

        }

        public static bool SetMangerFarm(FarmManagers farmmanger)
        {

            var CurrentUser = UsersService.GetCurrentUser();
            using (var Context = new Context())
            {

                Context.Entry(farmmanger).State = System.Data.Entity.EntityState.Modified;
                Context.SaveChanges();

            }




            return true;

        }

        public static bool SetMangerInstructorFarm(List<FarmInstructors> farmInstructors)
        {

            var CurrentUser = UsersService.GetCurrentUser();
            using (var Context = new Context())
            {

              

                foreach (FarmInstructors item in farmInstructors)
                {

                    FarmInstructors dbfarmInstructor = Context.FarmInstructors.Where(x => x.UserId == item.UserId).FirstOrDefault();

                    if (dbfarmInstructor != null)
                    {
                        dbfarmInstructor.ClalitNumber = item.ClalitNumber;

                        Context.Entry(dbfarmInstructor).State = System.Data.Entity.EntityState.Modified;
                        //Context.SaveChanges();

                    }
                    else
                    {
                        Context.FarmInstructors.Add(item);

                    }


                }
                Context.SaveChanges();


                //Context.Entry(farmmanger).State = System.Data.Entity.EntityState.Modified;
                //Context.SaveChanges();

            }

            return true;

        }

        public static Farm UpdateFarm(Farm Farm)
        {
            using (var Context = new Context())
            {
                if (Farm.Id == 0)
                    Context.Farms.Add(Farm);
                else
                    Context.Entry(Farm).State = System.Data.Entity.EntityState.Modified;

                Context.SaveChanges();
                return Farm;
            }
        }



        public static List<KlalitHistoris> GetKlalitHistoris(int FarmId, string startDate = null, string endDate = null, int? type = null, int? klalitId = null)
        {
            using (var Context = new Context())
            {

              //  DateTime StartDate = startDate != null ? DateTime.Parse(startDate) : DateTime.Now.Date;
              //  DateTime EndDate = endDate != null ? DateTime.Parse(endDate) : DateTime.Now.Date;

                SqlParameter FarmIdPara = new SqlParameter("FarmId", FarmId);
                SqlParameter StartDatePara = new SqlParameter("StartDate", startDate);
                SqlParameter EndDatePara = new SqlParameter("EndDate", endDate);


             
                var query = Context.Database.SqlQuery<KlalitHistoris>
                ("GetKlalitHistoris  @FarmId,@StartDate,@EndDate", FarmIdPara, StartDatePara, EndDatePara);
                var Objects = query.ToList();
                return Objects;

               

               



            }
        }




        
    }
}