using FarmsApi.DataModels;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.UI.WebControls;

namespace FarmsApi.Services
{


    public class UsersService
    {
        public static string CreateLoopLessons()
        {
            using (var Context = new Context())
            {

                //var AddsLessons = Context.Temps.Where(x=>x.total<0 && x.UserId!=null).ToList();
                //var startDate = DateTime.Now.AddYears(-1);

                //foreach (var item in AddsLessons)
                //{
                //    for (int i = 0; i < (item.total * -1); i++)
                //    {
                //        Lesson less = new Lesson();
                //        less.Instructor_Id = 11;
                //        less.Start = startDate.AddDays(-1 * i);
                //        less.End = startDate.AddDays(-1 * i);
                //        less.Details = "";
                //        less.ParentId = 0;

                //        Context.Lessons.Add(less);
                //        Context.SaveChanges();

                //        StudentLessons sl = new StudentLessons()
                //        {
                //            Lesson_Id = less.Id,
                //            User_Id = (int)item.UserId,
                //            Status = "attended"




                //        };
                //        Context.StudentLessons.Add(sl);




                //    }

                //}


                var LessonList = Context.InsertedLessonsTemps.ToList();

                foreach (var item in LessonList)
                {
                    Lesson Firstless = new Lesson();
                    Firstless.Instructor_Id = item.InstructorId;
                    Firstless.Start = item.Start;
                    Firstless.End = item.End;
                    Firstless.Details = "";
                    Firstless.ParentId = 0;

                    Context.Lessons.Add(Firstless);
                    Context.SaveChanges();

                    StudentLessons slFirst = new StudentLessons()
                    {
                        Lesson_Id = Firstless.Id,
                        User_Id = (int)item.UserId,
                        Status = null
                    };

                    Context.StudentLessons.Add(slFirst);

                    for (int i = 1; i < 30; i++)
                    {

                        Lesson less = new Lesson();
                        less.Instructor_Id = item.InstructorId;
                        less.Start = item.Start.AddDays(7 * i);
                        less.End = item.End.AddDays(7 * i);
                        less.Details = "";
                        less.ParentId = Firstless.Id;

                        Context.Lessons.Add(less);
                        Context.SaveChanges();

                        StudentLessons sl = new StudentLessons()
                        {
                            Lesson_Id = less.Id,
                            User_Id = (int)item.UserId,
                            Status = null
                        };

                        Context.StudentLessons.Add(sl);
                    }


                }

                Context.SaveChanges();

                return "dfsdssfd.Count.ToString()";
            }
        }

        // public static List<int> UsersEnter;

        //public static void UpdateUsers()
        //{

        //    using (var Context = new Context())
        //    {
        //       // var Users = Context.Users.Where(x=>x.Id==-1).ToList();
        //        var Users = Context.Users.ToList();
        //        foreach (User Userf in Users)
        //        {

        //            try
        //            {

        //                // User Userf = Context.Users.Where(x => x.Id == 50).FirstOrDefault();yyy

        //                var Meta = JObject.Parse(Userf.Meta);

        //                #region User
        //                if (Meta["Active"] != null)
        //                {
        //                    if (Meta["Active"].ToString() == "1")
        //                    {
        //                        Userf.Active = "active";
        //                    }
        //                    else
        //                    {
        //                        Userf.Active = Meta["Active"].ToString();
        //                    }

        //                }
        //                else
        //                {
        //                    Userf.Active = "active";
        //                }

        //                if (Meta["Image"] != null)
        //                {
        //                    Userf.Image = Meta["Image"].ToString();

        //                }
        //                if (Meta["ClientNumber"] != null)
        //                {
        //                    Userf.ClientNumber = Meta["ClientNumber"].ToString();

        //                }

        //                if (Meta["IdNumber"] != null)
        //                {
        //                    Userf.IdNumber = Meta["IdNumber"].ToString();

        //                }
        //                if (Meta["BirthDate"] != null)
        //                {
        //                    Userf.BirthDate = CheckifExistDate(Meta["BirthDate"]);

        //                }



        //                if (Meta["ParentName2"] != null)
        //                {
        //                    Userf.ParentName2 = Meta["ParentName2"].ToString();

        //                }
        //                if (Meta["ParentName"] != null)
        //                {
        //                    Userf.ParentName = Meta["ParentName"].ToString();

        //                }

        //                if (Meta["Address"] != null)
        //                {
        //                    Userf.Address = Meta["Address"].ToString();

        //                }
        //                if (Meta["PhoneNumber"] != null)
        //                {
        //                    Userf.PhoneNumber = Meta["PhoneNumber"].ToString();

        //                }

        //                if (Meta["PhoneNumber2"] != null)
        //                {
        //                    Userf.PhoneNumber2 = Meta["PhoneNumber2"].ToString();

        //                }
        //                if (Meta["AnotherEmail"] != null)
        //                {
        //                    Userf.AnotherEmail = Meta["AnotherEmail"].ToString();

        //                }

        //                if (Meta["Style"] != null)
        //                {
        //                    Userf.Style = Meta["Style"].ToString();

        //                }


        //                if (Meta["TeamMember"] != null)
        //                {
        //                    Userf.TeamMember = Meta["TeamMember"].ToString();

        //                }
        //                if (Meta["Cost"] != null)
        //                {
        //                    Userf.Cost = CheckifExistDouble(Meta["Cost"]);

        //                }
        //                if (Meta["PayType"] != null)
        //                {
        //                    Userf.PayType = Meta["PayType"].ToString();

        //                }
        //                if (Meta["Details"] != null)
        //                {
        //                    Userf.Details = Meta["Details"].ToString();

        //                }
        //                if (Meta["HMO"] != null)
        //                {
        //                    Userf.HMO = Meta["HMO"].ToString();

        //                }
        //                if (Meta["BalanceDetails"] != null)
        //                {
        //                    Userf.BalanceDetails = Meta["BalanceDetails"].ToString();

        //                }


        //                if (Meta["cc_4_digits"] != null)
        //                {
        //                    Userf.cc_4_digits = Meta["cc_4_digits"].ToString();

        //                }
        //                if (Meta["cc_expire_month"] != null)
        //                {
        //                    Userf.cc_expire_month = Meta["cc_expire_month"].ToString();

        //                }
        //                if (Meta["cc_expire_year"] != null)
        //                {
        //                    Userf.cc_expire_year = Meta["cc_expire_year"].ToString();

        //                }
        //                if (Meta["cc_payer_id"] != null)
        //                {
        //                    Userf.cc_payer_id = Meta["cc_payer_id"].ToString();

        //                }
        //                if (Meta["cc_payer_name"] != null)
        //                {
        //                    Userf.cc_payer_name = Meta["cc_payer_name"].ToString();

        //                }
        //                if (Meta["cc_token"] != null)
        //                {
        //                    Userf.cc_token = Meta["cc_token"].ToString();

        //                }
        //                if (Meta["cc_type_id"] != null)
        //                {
        //                    Userf.cc_type_id = Meta["cc_type_id"].ToString();

        //                }
        //                if (Meta["cc_type_name"] != null)
        //                {
        //                    Userf.cc_type_name = Meta["cc_type_name"].ToString();

        //                }

        //                if (Meta["EventsColor"] != null)
        //                {
        //                    Userf.EventsColor = Meta["EventsColor"].ToString();

        //                }



        //                Context.Entry(Userf).State = System.Data.Entity.EntityState.Modified;


        //                #endregion

        //                //**************************************************************************

        //                #region Payments
        //                if (Meta["Payments"] != null)
        //                {
        //                    foreach (var Item in Meta["Payments"])
        //                    {

        //                        Payments pay = new Payments();

        //                        pay.UserId = Userf.Id;
        //                        pay.Date = CheckifExistDate(Item["Date"]);
        //                        pay.InvoicePdf = CheckifExistStr(Item["InvoicePdf"]);
        //                        pay.InvoiceNum = CheckifExistStr(Item["InvoiceNum"]);
        //                        pay.InvoiceDetails = CheckifExistStr(Item["InvoiceDetails"]);

        //                        pay.canceled = CheckifExistStr(Item["canceled"]);
        //                        pay.Price = CheckifExistDouble(Item["Price"]);
        //                        pay.InvoiceSum = CheckifExistDouble(Item["InvoiceSum"]);

        //                        pay.payment_type = CheckifExistStr(Item["payment_type"]);
        //                        pay.lessons = CheckifExistInt(Item["lessons"]);
        //                        pay.month = CheckifExistDate(Item["month"]);
        //                        pay.untilmonth = CheckifExistDate(Item["untilmonth"]);


        //                        Context.Payments.Add(pay);
        //                        // Context.Entry(pay).State = System.Data.Entity.EntityState.Added;
        //                   //    Context.SaveChanges();

        //                        // Item["resourceId"] = Userf.Id;
        //                    }
        //                }

        //                #endregion

        //                #region Expenses
        //                if (Meta["Expenses"] != null)
        //                {
        //                    foreach (var Item in Meta["Expenses"])
        //                    {
        //                        Expenses Exp = new Expenses();
        //                        Exp.UserId = Userf.Id;
        //                        Exp.Date = CheckifExistDate(Item["Date"]);
        //                        Exp.Price = CheckifExistDouble(Item["Price"]);
        //                        Exp.Details = CheckifExistStr(Item["Details"]);
        //                        Exp.Paid = CheckifExistStr(Item["Paid"]);

        //                        Context.Expenses.Add(Exp);
        //                        //   Context.SaveChanges();
        //                        // Item["resourceId"] = Userf.Id;
        //                    }
        //                }

        //                #endregion

        //                #region AvailableHours
        //                if (Meta["AvailableHours"] != null)
        //                {
        //                    foreach (var Item in Meta["AvailableHours"])
        //                    {
        //                        AvailableHours Exp = new AvailableHours();
        //                        Exp.UserId = Userf.Id;
        //                        Exp.resourceId = CheckifExistInt(Item["resourceId"]);
        //                        Exp.start = CheckifExistStr(Item["start"]);
        //                        Exp.end = CheckifExistStr(Item["end"]);

        //                        string res = (Item["dow"].ToString()).Replace("[", "").Replace("]", "").Replace("\"", "").Trim();

        //                        //  string res = Regex.Replace(Item["dow"].ToString(), "\"[^\"]*\"", string.Empty);
        //                        Exp.dow = res;//CheckifExistStr(CheckifExistInt(res));

        //                        Context.AvailableHours.Add(Exp);
        //                        //   Context.SaveChanges();
        //                        // Item["resourceId"] = Userf.Id;
        //                    }
        //                }

        //                #endregion

        //                #region Commitments
        //                if (Meta["Commitments"] != null)
        //                {
        //                    foreach (var Item in Meta["Commitments"])
        //                    {
        //                        Commitments Com = new Commitments();
        //                        Com.UserId = Userf.Id;
        //                        Com.Date = (CheckifExistDate(Item["Date"]) == null) ? new DateTime(2016, 01, 01) : CheckifExistDate(Item["Date"]);
        //                        Com.Price = CheckifExistStr(Item["Price"]);

        //                        Com.HMO = CheckifExistStr(Item["HMO"]);
        //                        Com.Qty = CheckifExistDouble(Item["Qty"]);
        //                        Com.Number = CheckifExistStr(Item["Number"]);
        //                        Com.canceled = CheckifExistStr(Item["canceled"]);
        //                        Com.InvoiceSum = CheckifExistStr(Item["InvoiceSum"]);

        //                        Context.Commitments.Add(Com);
        //                      //  Context.SaveChanges();
        //                        Item["resourceId"] = Userf.Id;
        //                    }
        //                }

        //                #endregion

        //                #region Horses
        //                if (Meta["Horses"] != null)
        //                {
        //                    foreach (var Item in Meta["Horses"])
        //                    {
        //                        UserHorses Uh = new UserHorses();
        //                        Uh.UserId = Userf.Id;
        //                        Uh.Name = CheckifExistStr(Item["Name"]);
        //                        Uh.Owner = CheckifExistBool(Item["Owner"]);

        //                        Uh.PensionPrice = CheckifExistInt(Item["PensionPrice"]);
        //                        Uh.TrainingCost = CheckifExistInt(Item["TrainingCost"]);


        //                        Context.UserHorses.Add(Uh);
        //                        //         Context.SaveChanges();
        //                        // Item["resourceId"] = Userf.Id;
        //                    }
        //                }

        //                #endregion

        //                #region Files
        //                if (Meta["Files"] != null)
        //                {
        //                    foreach (var Item in Meta["Files"])
        //                    {
        //                        Files Fi = new Files();
        //                        Fi.UserId = Userf.Id;
        //                        Fi.Link = CheckifExistStr(Item);

        //                        Context.Files.Add(Fi);
        //                        //    Context.SaveChanges();
        //                        // Item["resourceId"] = Userf.Id;
        //                    }
        //                }

        //                #endregion

        //                Context.SaveChanges();
        //            }
        //            catch (DbEntityValidationException e)
        //            {
        //                foreach (var eve in e.EntityValidationErrors)
        //                {
        //                    //Debug.WriteLine(@"Entity of type ""{0}"" in state ""{1}"" 
        //                    // has the following validation errors:",
        //                    //eve.Entry.Entity.GetType().Name,
        //                    // eve.Entry.State);
        //                    foreach (var ve in eve.ValidationErrors)
        //                    {
        //                        // Debug.WriteLine(@"- Property: ""{0}"", Error: ""{1}""",
        //                        //  ve.PropertyName, ve.ErrorMessage);
        //                    }
        //                }
        //                throw;
        //            }
        //            catch (DbUpdateException e)
        //            {
        //                //Add your code to inspect the inner exception and/or
        //                //e.Entries here.
        //                //Or just use the debugger.
        //                //Added this catch (after the comments below) to make it more obvious 
        //                //how this code might help this specific problem
        //            }
        //            catch (Exception e)
        //            {

        //            }
        //        }

        //    }


        //}

        private static double? CheckifExistDouble(JToken jToken)
        {
            if (jToken == null) return 0;
            double res;
            bool Ok = Double.TryParse(jToken.ToString(), out res);
            if (Ok) return res;
            else return 0;
        }

        private static bool CheckifExistBool(JToken jToken)
        {
            if (jToken == null) return false;
            Boolean res = new Boolean();
            bool Ok = Boolean.TryParse(jToken.ToString(), out res);
            if (Ok)
                return res;
            else
                return false;
        }

        private static DateTime? CheckifExistDate(JToken jToken)
        {

            if (jToken == null) return null;
            DateTime res = new DateTime();
            bool Ok = DateTime.TryParse(jToken.ToString(), out res);
            if (Ok && res.Year > 1960) return res;

            else return null;
        }

        private static int CheckifExistInt(JToken jToken)
        {
            if (jToken == null) return 0;
            int res;
            bool Ok = Int32.TryParse(jToken.ToString(), out res);
            if (Ok) return res;
            else return 0;
        }

        private static string CheckifExistStr(JToken jToken)
        {

            if (jToken != null)

                return jToken.ToString();

            return "";

        }


        public static List<AvailableHours> getAvailablehours(int? Id)
        {
            using (var Context = new Context())
            {

                var AvailableHoursList = Context.AvailableHours.Where(u => u.UserId == Id || Id == null).ToList();

                return AvailableHoursList;
            }
        }

        public static List<Payments> getpaymentsbyuserid(int? Id)
        {
            using (var Context = new Context())
            {
                // הוספתי שליפה ללא המחוקים
                var PaymentsList = Context.Payments.Where(u => u.UserId == Id && !u.Deleted).ToList();

                return PaymentsList;
            }
        }

        public static List<UserHorses> getuseruserhorsesbyuserid(int? Id)
        {
            using (var Context = new Context())
            {

                var UserHorsesList = Context.UserHorses.Where(u => u.UserId == Id).ToList();
                //foreach (var item in UserHorsesList)
                //{
                //    Horse h = Context.Horses.Where();

                //}

                return UserHorsesList;
            }
        }


        public static List<UserHorses> getAllFarmsuseruserhorses()
        {
            using (var Context = new Context())
            {
                var CurrentUserFarmId = GetCurrentUser().Farm_Id;

                var UserHorsesList = from uh in Context.UserHorses
                                     join u in Context.Users on uh.UserId equals u.Id
                                     where u.Farm_Id == CurrentUserFarmId
                                     select uh;





                return UserHorsesList.ToList();
            }
        }





        public static List<Files> getuserfilesbyuserid(int? Id)
        {
            using (var Context = new Context())
            {

                var FilesList = Context.Files.Where(u => u.UserId == Id).ToList();


                return FilesList;
            }
        }

        public static List<Commitments> getusercommitmentsbyuserid(int? Id)
        {
            using (var Context = new Context())
            {

                var CommitmentsList = Context.Commitments.Where(u => u.UserId == Id).ToList();


                return CommitmentsList;
            }
        }

        public static List<Expenses> getuserexpensesbyuserid(int? Id)
        {
            using (var Context = new Context())
            {

                var ExpensesList = Context.Expenses.Where(u => u.UserId == Id).ToList();

                return ExpensesList;

                ///asasasas
            }
        }

        public static List<Makavs> getuserusermakavbyuserid(int? Id)
        {
            using (var Context = new Context())
            {

                var MakavList = Context.Makavs.Where(u => u.UserId == Id).ToList();

                return MakavList;

                ///asasasas
            }
        }


        //*****************************************************************************

        public static List<User> GetUsers(string Role, bool IncludeDeleted = false)
        {
            using (var Context = new Context())
            {
                var CurrentUserFarmId = GetCurrentUser().Farm_Id;

                Context.Database.CommandTimeout = 36000;

                Context.Configuration.ProxyCreationEnabled = false;
                Context.Configuration.LazyLoadingEnabled = false;

                if (CurrentUserFarmId == 0)
                {
                    string[] keys = Role.Split(',');
                    var UsersForFarm = Context.Users.Where(u => keys.Any(key=> u.Role.Contains(key))).OrderBy(x => x.FirstName).ToList();
                    UsersForFarm = FilterDeleted(UsersForFarm, IncludeDeleted);
                    return UsersForFarm;

                }


                var Users = Context.Users.Where(u => u.Farm_Id == CurrentUserFarmId).OrderBy(x => x.FirstName).ToList();

               

                Users = FilterByUser(Users);
                Users = FilterRole(Users, Role);
                Users = FilterDeleted(Users, IncludeDeleted);

                return RemovePassword(Users);
            }
        }

        public static List<UsersList> GetStudents()
        {
            using (var Context = new Context())
            {
                var CurrentUserFarmId = GetCurrentUser().Farm_Id;

                SqlParameter Farm_IdPara = new SqlParameter("Farm_Id", CurrentUserFarmId);

                Context.Database.CommandTimeout = 36000;
                var query = Context.Database.SqlQuery<UsersList>
                ("GetStudents @Farm_Id", Farm_IdPara);
                var res = query.ToList();
                return res;


             
            }
        }





        private static List<User> FilterByUser(List<User> Users)
        {
            var CurrentUser = GetCurrentUser();

            if (CurrentUser.Role == "instructor" || CurrentUser.Role == "profAdmin")
                return Users.Where(u => u.Role == "student" || u.Id == CurrentUser.Id).ToList();

            return Users;
        }

        private static List<User> FilterByFarm(List<User> Users)
        {
            var CurrentUserFarmId = GetCurrentUser().Farm_Id;
            if (CurrentUserFarmId != 0)
                return Users.Where(u => u.Farm_Id == CurrentUserFarmId).ToList();
            else
                return Users;
        }

        private static List<User> FilterDeleted(List<User> Users, bool IncludeDeleted)
        {
            if (IncludeDeleted)
            {
                return Users;
            }

            return Users.Where(u => !u.Deleted).ToList();
        }

        private static List<User> FilterRole(List<User> Users, string Role)
        {
            if (!string.IsNullOrEmpty(Role))
            {
                var Roles = Role.Split(',');
                if (Roles.Length > 1)
                {
                    List<User> ReturnUsers = new List<User>();
                    foreach (var role in Roles)
                    {
                        ReturnUsers.AddRange(Users.Where(u => u.Role == role).ToList());
                    }
                    return ReturnUsers;
                }
                else
                {
                    return Users.Where(u => u.Role == Role).ToList();
                }
            }
            return Users;
        }

        public static User GetUser(int? Id)
        {
            using (var Context = new Context())
            {
                if (Id.HasValue)
                {
                    return Context.Users.SingleOrDefault(u => u.Id == Id.Value && !u.Deleted);
                }
                else
                {
                    var CurrentUserId = GetCurrentUser().Id;
                    return Context.Users.SingleOrDefault(u => u.Id == CurrentUserId);
                }

            }
        }

        public static User GetSetUserEnter(int? Id, bool isForCartis = false)
        {


            using (var Context = new Context())
            {
                if (Id.HasValue)
                {
                    User us = Context.Users.SingleOrDefault(u => u.Id == Id.Value && !u.Deleted);
                    if (isForCartis)
                    {

                        if (us != null) //&& us.CurrentUserId != GetCurrentUser().Id)
                        {

                            //var users = Context.Users.Where(x => x.CurrentUserId == user.Id).ToList();

                            //users.ForEach(a =>
                            //{
                            //    a.IsTafus = false;
                            //    a.CurrentUserId = null;
                            //});



                            //Context.SaveChanges();

                            // אם לא תפוס  תתפוס
                            if (!us.IsTafus)
                            {
                                User u = GetCurrentUser();
                                us.IsTafus = true;
                                us.CurrentUserId = u.Id;
                                us.TofesName = u.FirstName + " " + u.LastName;
                                Context.Entry(us).State = System.Data.Entity.EntityState.Modified;
                                Context.SaveChanges();

                                us.IsTafus = false;

                            }
                            else
                            {
                                // אם תפוס אבל אותו משתמש תחזיר שלא תפוס
                                if (us.CurrentUserId == GetCurrentUser().Id)
                                    us.IsTafus = false;

                            }

                        }


                    }
                    return us;
                }
                else
                {
                    var CurrentUserId = GetCurrentUser().Id;
                    return Context.Users.SingleOrDefault(u => u.Id == CurrentUserId);
                }

            }
        }



        public static User UpdateUserMultiTables(JArray dataObj)
        {


            User u = UpdateUser(dataObj[0].ToObject<User>());
            if (u.Id == 0 || u.FirstName == "Error") return u;

            //if (u.IsMazkirut == 1 && u.Role == "instructor") ReopenLessonsByInstructorMazkirut(u);

            List<Payments> p = dataObj[1].ToObject<List<Payments>>();
            int NewId = UpdatePaymentsObject(p, u);

            List<Files> f = dataObj[2].ToObject<List<Files>>();
            UpdateFilesObject(f, u);

            List<Commitments> c = dataObj[3].ToObject<List<Commitments>>();
            UpdateCommitmentsObject(c, u);

            List<Expenses> e = dataObj[4].ToObject<List<Expenses>>();
            UpdateExpensesObject(e, u);

            List<Makavs> m = dataObj[7].ToObject<List<Makavs>>();
            UpdateMakavObject(m, u);

            try
            {
                List<UserHorses> uhs = dataObj[5].ToObject<List<UserHorses>>();
                UpdateUserHorsesObject(uhs, u);


                List<AvailableHours> uav = dataObj[6].ToObject<List<AvailableHours>>();
                UpdateAvailableHoursObject(uav, u);

                List<Checks> ch = dataObj[8].ToObject<List<Checks>>();
                UpdateChecksObject(ch, u, NewId);

                List<Ashrais> ah = dataObj[9].ToObject<List<Ashrais>>();
                UpdateAshraisObject(ah, u, NewId);

            }
            catch (Exception ex)
            {


            }



            return u;
        }

        private static void ReopenLessonsByInstructorMazkirut(User u)
        {
            using (var Context = new Context())
            {
                DateTime CurrentDate = DateTime.Now;
                int ParentId = 0;
                var LastDay = new DateTime(DateTime.Now.Year, 12, 31, 23, 59, 59);
                var ExistLesson = Context.Lessons.Where(l => l.Instructor_Id == u.Id && l.Start > CurrentDate).FirstOrDefault();
                if (ExistLesson == null)
                {

                    while (CurrentDate <= LastDay)
                    {

                        Lesson less = new Lesson();
                        less.Instructor_Id = u.Id;
                        less.Start = new DateTime(CurrentDate.Year, CurrentDate.Month, CurrentDate.Day, 07, 00, 0);
                        less.End = new DateTime(CurrentDate.Year, CurrentDate.Month, CurrentDate.Day, 23, 59, 59);
                        less.ParentId = ParentId;
                        Context.Lessons.Add(less);
                        Context.SaveChanges();
                        ParentId = less.Id;



                        CurrentDate = CurrentDate.AddDays(1);

                    }



                }

            }

        }
        private static void UpdateChecksObject(List<Checks> objList, User u, int PaymentsId)
        {
            using (var Context = new Context())
            {

                foreach (Checks item in objList)
                {

                    item.UserId = u.Id;
                    item.PaymentsId = PaymentsId;
                    if (item.Id == 0)
                    {
                        Context.Checks.Add(item);
                        //  Context.SaveChanges();

                    }
                    else
                    {

                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                        //  Context.SaveChanges();

                    }

                }

                try
                {

                    //var result = Context.Checks.Where(p => p.UserId == u.Id).ToList();
                    //IEnumerable<Checks> differenceQuery = result.Except(objList);

                    //foreach (Checks item in differenceQuery)
                    //{
                    //    Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                    //    // Context.SaveChanges();
                    //}



                }
                catch (Exception ex)
                {


                }
                // 

                // Context.UserHorses.AddRange(uhs);
                //User u = UpdateUser(User);




                Context.SaveChanges();

                if (objList.Count > 0)
                {
                    CommonTasks Tasking = new CommonTasks();
                    Tasking.InsertChecksToMas();
                }



            }
        }

        private static void UpdateAshraisObject(List<Ashrais> objList, User u, int PaymentsId)
        {
            using (var Context = new Context())
            {

                foreach (Ashrais item in objList)
                {

                    item.UserId = u.Id;
                    item.PaymentsId = PaymentsId;
                    if (item.Id == 0)
                    {
                        Context.Ashrais.Add(item);
                        //  Context.SaveChanges();

                    }
                    else
                    {

                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                        //  Context.SaveChanges();

                    }

                }

                try
                {

                    //var result = Context.Checks.Where(p => p.UserId == u.Id).ToList();
                    //IEnumerable<Checks> differenceQuery = result.Except(objList);

                    //foreach (Checks item in differenceQuery)
                    //{
                    //    Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                    //    // Context.SaveChanges();
                    //}



                }
                catch (Exception ex)
                {


                }
                // 

                // Context.UserHorses.AddRange(uhs);
                //User u = UpdateUser(User);




                Context.SaveChanges();

                if (objList.Count > 0)
                {
                    CommonTasks Tasking = new CommonTasks();
                    Tasking.InsertAshraisToMas();
                }



            }
        }
        private static void UpdateAvailableHoursObject(List<AvailableHours> objList, User u)
        {
            using (var Context = new Context())
            {

                foreach (AvailableHours item in objList)
                {

                    item.UserId = u.Id;

                    if (item.Id == 0)
                    {
                        Context.AvailableHours.Add(item);
                        //  Context.SaveChanges();

                    }
                    else
                    {

                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                        //  Context.SaveChanges();

                    }

                }

                try
                {

                    var result = Context.AvailableHours.Where(p => p.UserId == u.Id).ToList();
                    IEnumerable<AvailableHours> differenceQuery = result.Except(objList);

                    foreach (AvailableHours item in differenceQuery)
                    {
                        Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                        // Context.SaveChanges();
                    }



                }
                catch (Exception ex)
                {


                }
                // 

                // Context.UserHorses.AddRange(uhs);
                //User u = UpdateUser(User);
                Context.SaveChanges();


            }
        }
        private static int UpdatePaymentsObject(List<Payments> objList, User u)
        {
            int NewId = 0;
            Payments NewPayment = null;
            using (var Context = new Context())
            {

                foreach (Payments item in objList)
                {

                    if (item.month != null) item.month = ((DateTime)item.month).AddHours(3);
                    if (item.untilmonth != null) item.untilmonth = ((DateTime)item.untilmonth).AddHours(3);

                    item.UserId = u.Id;

                    if (item.Id == 0)
                    {

                        Logs lg = new Logs();
                        lg.Type = 4; // חשבונית חדשה חשבונית
                        lg.TimeStamp = DateTime.Now;
                        lg.Request = item.InvoiceNum;
                        lg.StudentId = item.UserId;
                        lg.UserId = GetCurrentUser().Id;
                        lg.Response = item.InvoicePdf;
                        lg.Details = "חשבונית חדשה אצלינו";

                        lg.ResponseTimeStamp = DateTime.Now;
                        lg.RequestTimeStamp = DateTime.Now;


                        Context.Logs.Add(lg);


                        Context.Payments.Add(item);
                        NewPayment = item;
                        //Context.SaveChanges();
                        //   NewId = item.Id;


                    }
                    else
                    {

                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                        //  Context.SaveChanges();

                    }

                }

                try
                {

                    var result = Context.Payments.Where(p => p.UserId == u.Id && !p.Deleted).ToList();
                    IEnumerable<Payments> differenceQuery = result.Except(objList);

                    foreach (Payments item in differenceQuery)
                    {
                        // מחיקת צקים שמוצמדים לחשבונית
                        //var ChecksList = Context.Checks.Where(x => x.PaymentsId == item.Id).ToList();
                        //ChecksList.ForEach(a =>
                        //{

                        //    Context.Entry(a).State = System.Data.Entity.EntityState.Deleted;
                        //});


                        Logs lg = new Logs();
                        lg.Type = 3; // מחיקת חשבונית
                        lg.TimeStamp = DateTime.Now;
                        lg.Request = item.InvoiceNum;
                        lg.StudentId = item.UserId;
                        lg.UserId = GetCurrentUser().Id;
                        lg.Response = item.InvoicePdf;
                        lg.Details = "מחיקת חשבונית";

                        lg.ResponseTimeStamp = DateTime.Now;
                        lg.RequestTimeStamp = DateTime.Now;

                        Context.Logs.Add(lg);

                        if (string.IsNullOrEmpty(item.InvoicePdf))
                        {
                            //שיניתי ממחיקה לשמירה
                            item.Deleted = true;
                            Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                        }

                    }



                }
                catch (Exception ex)
                {


                }

                Context.SaveChanges();

                if (NewPayment != null) NewId = NewPayment.Id;

                return NewId;

            }
        }

        private static void UpdateFilesObject(List<Files> objList, User u)
        {
            using (var Context = new Context())
            {

                foreach (Files item in objList)
                {

                    item.UserId = u.Id;

                    if (item.Id == 0)
                    {
                        Context.Files.Add(item);
                        //  Context.SaveChanges();

                    }
                    else
                    {

                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                        //  Context.SaveChanges();

                    }

                }

                try
                {

                    var result = Context.Files.Where(p => p.UserId == u.Id).ToList();
                    IEnumerable<Files> differenceQuery = result.Except(objList);

                    foreach (Files item in differenceQuery)
                    {
                        Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                        // Context.SaveChanges();
                    }



                }
                catch (Exception ex)
                {


                }
                // 

                // Context.UserHorses.AddRange(uhs);
                //User u = UpdateUser(User);
                Context.SaveChanges();


            }
        }

        private static void UpdateCommitmentsObject(List<Commitments> objList, User u)
        {
            using (var Context = new Context())
            {

                foreach (Commitments item in objList)
                {

                    item.UserId = u.Id;

                    if (item.Id == 0)
                    {
                        Context.Commitments.Add(item);
                        //  Context.SaveChanges();

                    }
                    else
                    {

                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                        //  Context.SaveChanges();

                    }

                }

                try
                {

                    var result = Context.Commitments.Where(p => p.UserId == u.Id).ToList();
                    IEnumerable<Commitments> differenceQuery = result.Except(objList);

                    foreach (Commitments item in differenceQuery)
                    {
                        Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                        // Context.SaveChanges();
                    }



                }
                catch (Exception ex)
                {


                }
                // 

                // Context.UserHorses.AddRange(uhs);
                //User u = UpdateUser(User);
                Context.SaveChanges();


            }
        }




        private static void UpdateExpensesObject(List<Expenses> objList, User u)
        {
            using (var Context = new Context())
            {

                Expenses Newitem = new Expenses();
                List<Expenses> Diff = new List<Expenses>();

                foreach (Expenses item in objList)
                {

                    item.UserId = u.Id;

                    if (item.Id == 0)
                    {
                        Context.Expenses.Add(item);
                        Newitem = item;

                    }
                    else
                    {
                        //זיכוי בעל הסוס המרביע כאשר בעל הסוסה משלם
                        HorseHozims hh = Context.HorseHozims.Where(x => x.ExpensesId == item.Id).FirstOrDefault();
                        if (hh != null)
                        {




                            Horse h = HorsesService.GetHorse(hh.FatherHorseId);   //Context.Horses.Where(x => x.Id == hh.FatherHorseId).FirstOrDefault();

                            if (h != null && h.OwnerId != null)
                            {
                                Horse hSusa = Context.Horses.Where(x => x.Id == hh.HorseId).FirstOrDefault();
                                Expenses ex = Context.Expenses.Where(x => x.ZikuyNumber == hh.ExpensesId).FirstOrDefault();
                                if (ex == null)
                                {

                                    Expenses NewE = new Expenses();
                                    NewE.ZikuyNumber = hh.ExpensesId;
                                    NewE.UserId = (int)h.OwnerId;
                                    NewE.BeforePrice = -1 * item.Sum;
                                    NewE.Price = -1 * item.Sum;
                                    NewE.Date = item.Date;
                                    NewE.Details = " זיכוי עבור חוזה לסוסה -  " + hSusa.Name;

                                    Context.Expenses.Add(NewE);



                                }
                                else
                                {

                                    ex.BeforePrice = -1 * item.Sum;
                                    ex.Price = -1 * item.Sum;
                                    Context.Entry(ex).State = System.Data.Entity.EntityState.Modified;

                                }

                                // הוספת סכום לסוס
                                HorseInseminations hi = Context.HorseInseminations.Where(x => x.HozimId == hh.Id && x.HalivaDate != null).FirstOrDefault();
                                if (hi != null)
                                {

                                    hi.Sum = item.Sum;
                                    Context.Entry(hi).State = System.Data.Entity.EntityState.Modified;
                                }





                            }


                        }

                        if (item.SelectedForZikuyManualId != null)
                        {
                            Newitem = item;
                        }
                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;

                        if (item.HorseId != null)
                        {

                            var HorseShoeingsF = Context.HorseShoeings.Where(x => x.HorseId == item.HorseId && x.ExpensesId == item.Id).FirstOrDefault();
                            var HorseVaccinationsF = Context.HorseVaccinations.Where(x => x.HorseId == item.HorseId && x.ExpensesId == item.Id).FirstOrDefault();
                            var HorseTreatmentsF = Context.HorseTreatments.Where(x => x.HorseId == item.HorseId && x.ExpensesId == item.Id).FirstOrDefault();
                            var HorseTilufingsF = Context.HorseTilufings.Where(x => x.HorseId == item.HorseId && x.ExpensesId == item.Id).FirstOrDefault();

                            var HorsePregnanciesStatesF = Context.HorsePregnanciesStates.Where(x => x.HorseId == item.HorseId && x.ExpensesId == item.Id).FirstOrDefault();
                            var HorseHozimsF = Context.HorseHozims.Where(x => x.HorseId == item.HorseId && x.ExpensesId == item.Id).FirstOrDefault();




                            if (HorseShoeingsF != null)
                            {
                                HorseShoeingsF.Cost = item.BeforePrice;
                                HorseShoeingsF.Discount = item.Discount;
                                Context.Entry(HorseShoeingsF).State = System.Data.Entity.EntityState.Modified;
                            }

                            if (HorseVaccinationsF != null)
                            {
                                HorseVaccinationsF.Cost = item.BeforePrice;
                                HorseVaccinationsF.Discount = item.Discount;
                                Context.Entry(HorseVaccinationsF).State = System.Data.Entity.EntityState.Modified;
                            }


                            if (HorseTreatmentsF != null)
                            {
                                HorseTreatmentsF.Cost = item.BeforePrice;
                                HorseTreatmentsF.Discount = item.Discount;
                                Context.Entry(HorseTreatmentsF).State = System.Data.Entity.EntityState.Modified;
                            }

                            if (HorseTilufingsF != null)
                            {
                                HorseTilufingsF.Cost = item.BeforePrice;
                                HorseTilufingsF.Discount = item.Discount;
                                Context.Entry(HorseTilufingsF).State = System.Data.Entity.EntityState.Modified;
                            }


                            if (HorsePregnanciesStatesF != null)
                            {
                                HorsePregnanciesStatesF.Cost = item.BeforePrice;
                                // HorsePregnanciesStatesF.Discount = item.Discount;
                                Context.Entry(HorsePregnanciesStatesF).State = System.Data.Entity.EntityState.Modified;
                            }
                            if (HorseHozimsF != null)
                            {
                                HorseHozimsF.Cost = item.BeforePrice;
                                // HorsePregnanciesStatesF.Discount = item.Discount;
                                Context.Entry(HorseHozimsF).State = System.Data.Entity.EntityState.Modified;
                            }


                        }

                    }

                }

                try
                {

                    var result = Context.Expenses.Where(p => p.UserId == u.Id).ToList();
                    IEnumerable<Expenses> differenceQuery = result.Except(objList);

                    foreach (Expenses item in differenceQuery)
                    {

                        Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;

                    }



                }
                catch (Exception ex)
                {


                }



                //foreach (Expenses item in Diff)
                //{
                //    Context.SaveChanges();
                //    var SumDiff = item.Price - item.Sum;
                //    Expenses newExe = item;
                //    newExe.Paid = null;
                //   // newExe.Price = SumDiff;
                //    newExe.Sum = item.Price;
                //    Context.Expenses.Add(newExe);
                //}



                // 

                // Context.UserHorses.AddRange(uhs);
                //User u = UpdateUser(User);
                Context.SaveChanges();


                if (Newitem != null && Newitem.Price < 0)
                {
                    var result = Context.Expenses.Where(p => p.UserId == u.Id).ToList();

                    var ZikuyPrice = Newitem.Price * -1;
                    foreach (Expenses item in result)
                    {
                        if (item.SelectedForZikuy && ZikuyPrice != 0)
                        {
                            var TotalPrice = item.Price + (item.ZikuySum ?? 0);

                            if (TotalPrice == 0) continue;

                            if (TotalPrice >= ZikuyPrice)
                            {
                                item.ZikuySum = (item.ZikuySum ?? 0) + ZikuyPrice * -1;
                                item.ZikuyNumber = Newitem.Id;
                                ZikuyPrice = 0;

                            }
                            else
                            {
                                // ZikuyPrice = ZikuyPrice - TotalPrice;
                                item.ZikuySum = (item.ZikuySum ?? 0) + (TotalPrice * -1);
                                item.ZikuyNumber = Newitem.Id;
                                ZikuyPrice = ZikuyPrice - TotalPrice;

                            }



                        }

                    }

                    Context.SaveChanges();

                }

                //var result2 = Context.Expenses.Where(p => p.UserId == u.Id).ToList();

                //foreach (Expenses item in result)
                //{
                //    Context.SaveChanges();
                //    var SumDiff = item.Price - item.Sum;
                //    Expenses newExe = item;
                //    newExe.Paid = null;
                //    // newExe.Price = SumDiff;
                //    newExe.Sum = item.Price;
                //    Context.Expenses.Add(newExe);
                //}




            }
        }

        private static void UpdateUserHorsesObject(List<UserHorses> uhs, User u)
        {
            using (var Context = new Context())
            {

                foreach (UserHorses item_uhs in uhs)
                {

                    item_uhs.UserId = u.Id;

                    // var ExistHorses = Context.UserHorses.Where(x => x.Id == item_uhs.Id && x.UserId == u.Id).FirstOrDefault();
                    if (item_uhs.Id == 0)
                    {
                        Context.UserHorses.Add(item_uhs);
                        //  Context.SaveChanges();

                    }
                    else
                    {

                        Context.Entry(item_uhs).State = System.Data.Entity.EntityState.Modified;
                        //  Context.SaveChanges();

                    }

                }

                try
                {

                    var result = Context.UserHorses.Where(p => p.UserId == u.Id).ToList();
                    IEnumerable<UserHorses> differenceQuery = result.Except(uhs);

                    foreach (UserHorses item in differenceQuery)
                    {
                        Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                        // Context.SaveChanges();
                    }



                }
                catch (Exception ex)
                {


                }
                // 

                // Context.UserHorses.AddRange(uhs);
                //User u = UpdateUser(User);
                Context.SaveChanges();


            }
        }

        private static void UpdateMakavObject(List<Makavs> objList, User u)
        {
            using (var Context = new Context())
            {


                List<Makavs> Diff = new List<Makavs>();

                foreach (Makavs item in objList)
                {

                    item.UserId = u.Id;

                    if (item.Id == 0)
                    {
                        Context.Makavs.Add(item);
                    }
                    else
                    {
                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                    }

                }

                try
                {

                    var result = Context.Makavs.Where(p => p.UserId == u.Id).ToList();
                    IEnumerable<Makavs> differenceQuery = result.Except(objList);

                    foreach (Makavs item in differenceQuery)
                    {
                        Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;

                    }



                }
                catch (Exception ex)
                {


                }




                Context.SaveChanges();


            }
        }

        public static User UpdateUser(User User)
        {
            using (var Context = new Context())
            {
                var CurrentUserFarmId = GetCurrentUser().Farm_Id;
                User.Farm_Id = CurrentUserFarmId != 0 ? CurrentUserFarmId : User.Farm_Id;
                if (User.Role == "sysAdmin")
                {
                    User.Farm_Id = 0;
                }
                var UserIdByEmail = GetUserIdByEmail(User.Email, CurrentUserFarmId);
                if (User.Id == 0 && UserIdByEmail == 0)
                {
                    Context.Users.Add(User);
                    Context.SaveChanges();
                }

                // צחי הוסיף בכדי למנוע עדכון של ת"ז קיים לחווה מסויימת
                if (User.Id != UserIdByEmail && UserIdByEmail != 0)
                {
                    User.FirstName = "Error";
                    return User;
                }



                //// צחי שינה
                //var Meta = JObject.Parse(User.Meta);
                //if (Meta["AvailableHours"] != null)
                //{
                //    foreach (var Item in Meta["AvailableHours"])
                //    {
                //        Item["resourceId"] = User.Id;
                //    }
                //}
                //User.Meta = Meta.ToString(Formatting.None);

                Context.Entry(User).State = System.Data.Entity.EntityState.Modified;

                try
                {
                    Context.SaveChanges();

                }
                catch (DbUpdateConcurrencyException ex)
                {
                    // צחי הוסיף כדי לבדוק אם קיים כבר תלמיד כזה להחזיר שגיאה למשתמש
                    User.FirstName = "Error";
                }

                return User;
            }
        }

        public static void DeleteUser(int Id)
        {
            using (var Context = new Context())
            {
                var User = Context.Users.SingleOrDefault(u => u.Id == Id);
                if (User != null)
                {
                    User.Deleted = true;
                }
                Context.Notifications.RemoveRange(Context.Notifications.Where(n => n.EntityId == Id && n.EntityType == "student"));
                Context.SaveChanges();
            }
        }

        public static void DestroyUser(string email)
        {
            using (var Context = new Context())
            {
                var User = Context.Users.SingleOrDefault(u => u.Email == email);
                if (User != null)
                {

                    Context.Users.Remove(User);
                }
                Context.Notifications.RemoveRange(Context.Notifications.Where(n => n.EntityId == User.Id && n.EntityType == "student"));
                Context.SaveChanges();
            }
        }

        public static int GetUserIdByEmail(string Email, int CurrentUserFarmId = 0)
        {
            using (var Context = new Context())
            {

                var User = Context.Users.SingleOrDefault(u => u.Email.ToLower() == Email.ToLower() && (CurrentUserFarmId == 0 || u.Farm_Id == CurrentUserFarmId));
                if (User != null)
                    return User.Id;
                return 0;
            }
        }

        public static User GetCurrentUser()
        {
            var identity = HttpContext.Current.User.Identity as ClaimsIdentity;
            var Email = identity.Claims.SingleOrDefault(c => c.Type == "sub").Value;

            return GetUser(GetUserIdByEmail(Email));
        }

        public static void RegisterDevice(string token)
        {
            using (var Context = new Context())
            {
                try
                {
                    var CurrentUserId = GetCurrentUser().Id;
                    if (Context.UserDevices.SingleOrDefault(ud => ud.DeviceToken == token && ud.User_Id == CurrentUserId) == null)
                    {
                        Context.UserDevices.Add(new UserDevices() { User_Id = CurrentUserId, DeviceToken = token });
                        Context.SaveChanges();
                    }
                }
                catch (Exception ex) { }
            }
        }

        public static void UnregisterDevice(string token)
        {
            using (var Context = new Context())
            {
                try
                {
                    var CurrentUserId = GetCurrentUser().Id;
                    var UserDevice = Context.UserDevices.Where(ud => ud.DeviceToken == token);
                    Context.UserDevices.RemoveRange(UserDevice);
                    Context.SaveChanges();
                }
                catch (Exception ex) { }
            }
        }

        public static List<string> GetDevices(string UserId)
        {
            using (var Context = new Context())
            {
                try
                {
                    return Context.UserDevices.Where(ud => ud.User_Id == int.Parse(UserId)).Select(ud => ud.DeviceToken).ToList();
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
        }

        public static object ManagerReport(string type, string fromDate, string toDate)
        {
            using (var Context = new Context())
            {
                var CurrentUser = GetCurrentUser();

                SqlParameter Type = new SqlParameter("Type", type);
                SqlParameter Farm_IdPara = new SqlParameter("Farm_Id", CurrentUser.Farm_Id);
                SqlParameter FromDatePara = new SqlParameter("StartDate", fromDate);
                SqlParameter ToDatePara = new SqlParameter("EndDate", toDate);
                // SqlParameter StartDatePara = new SqlParameter("StartDate", date.Replace("_", "/"));



                if (type == "1")
                {
                    var query = Context.Database.SqlQuery<ManagerReport>
                    ("GetReport @Type,@Farm_Id,@StartDate,@EndDate",
                    Type, Farm_IdPara, FromDatePara, ToDatePara);
                    var res = query.ToList();
                    return res;
                }

                if (type == "2")
                {
                    var query = Context.Database.SqlQuery<ManagerReportInstructorTable>
                    ("GetReport @Type,@Farm_Id,@StartDate,@EndDate",
                    Type, Farm_IdPara, FromDatePara, ToDatePara);
                    try
                    {
                        var res = query.OrderBy(x => x.Id).ToList();
                        return res;
                    }
                    catch (Exception ex)
                    {


                    }

                }


                return null;

            }
        }

        public static object HMOReport(string fromDate, string toDate)
        {
            using (var Context = new Context())
            {
                var CurrentUser = GetCurrentUser();



                SqlParameter Farm_IdPara = new SqlParameter("Farm_Id", CurrentUser.Farm_Id);
                SqlParameter FromDatePara = new SqlParameter("FromDate", fromDate);
                SqlParameter ToDatePara = new SqlParameter("ToDate", toDate);


                try
                {
                    var query = Context.Database.SqlQuery<HMOReport>
                    ("GetReportHMO @Farm_Id,@FromDate,@ToDate",
                    Farm_IdPara, FromDatePara, ToDatePara);
                    var res = query.ToList();
                    return res;

                }
                catch (Exception ex)
                {


                }



                return null;

            }
        }

        public static object DebtReport()
        {
            using (var Context = new Context())
            {
                var CurrentUser = GetCurrentUser();



                SqlParameter Farm_IdPara = new SqlParameter("Farm_Id", CurrentUser.Farm_Id);


                try
                {
                    var query = Context.Database.SqlQuery<DebtReport>
                    ("GetStudentsDebt @Farm_Id",
                    Farm_IdPara);
                    var res = query.ToList();
                    return res;

                }
                catch (Exception ex)
                {


                }



                return null;

            }
        }

        public static object GetTransferData(string insructorId, string dow, string date)
        {
            using (var Context = new Context())
            {
                var CurrentUser = GetCurrentUser();


                SqlParameter ResourceId = new SqlParameter("ResourceId", insructorId);
                SqlParameter Farm_IdPara = new SqlParameter("Farm_Id", CurrentUser.Farm_Id);
                SqlParameter dowPara = new SqlParameter("dow", dow);
                SqlParameter datePara = new SqlParameter("date", date);


                var query = Context.Database.SqlQuery<TransferResult>
                ("GetTransferData @ResourceId,@Farm_Id,@dow,@date",
                ResourceId, Farm_IdPara, dowPara, datePara);
                var res = query.ToList();
                return res;



            }


            return null;

        }

        #region


        #endregion




        #region Helpers

        public static List<User> RemovePassword(List<User> Users)
        {
            foreach (var User in Users)
                User.Password = null;

            return Users;
        }

        public static User RemovePassword(User User)
        {
            User.Password = null;
            return User;
        }


        #endregion
    }
}