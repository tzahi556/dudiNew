using FarmsApi.DataModels;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Web;


namespace FarmsApi.Services
{
    public class UsersService
    {


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

                var AvailableHoursList = Context.AvailableHours.Where(u => u.UserId == Id || Id==null).ToList();

                return AvailableHoursList;
            }
        }

        public static List<Payments> getpaymentsbyuserid(int? Id)
        {
            using (var Context = new Context())
            {

                var PaymentsList = Context.Payments.Where(u => u.UserId == Id).ToList();

                return PaymentsList;
            }
        }

        public static List<UserHorses> getuseruserhorsesbyuserid(int? Id)
        {
            using (var Context = new Context())
            {

                var UserHorsesList = Context.UserHorses.Where(u => u.UserId == Id).ToList();


                return UserHorsesList;
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




        //*****************************************************************************

        public static List<User> GetUsers(string Role, bool IncludeDeleted = false)
        {
            using (var Context = new Context())
            {
                var CurrentUserFarmId = GetCurrentUser().Farm_Id;



                Context.Configuration.ProxyCreationEnabled = false;
                Context.Configuration.LazyLoadingEnabled = false;





                var Users = Context.Users.Where(u => u.Farm_Id == CurrentUserFarmId /*&& !u.Meta.Contains("notActive")*/).ToList();
                //!u.Deleted &&
                //(u.Role == "student" || u.Id == CurrentUser.Id) &&
                //  Role.Contains(u.Role)
                //    ).ToList();




                if (CurrentUserFarmId == 0)
                {
                    Users = Context.Users.ToList();
                    //  Users = Context.Database.SqlQuery<User>("Select Id, Role, Email, Password, FirstName, LastName, '{}' as Meta, Deleted, Farm_Id, AccountStatus from users").ToList();  //Select(x => new User{ FirstName=x.FirstName, LastName=x.LastName}).ToList();
                }
                // Users = FilterByFarm(Users);
                Users = FilterByUser(Users);
                Users = FilterRole(Users, Role);
                Users = FilterDeleted(Users, IncludeDeleted);

                return RemovePassword(Users);
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


        public static User UpdateUserMultiTables(JArray dataObj)
        {


            User u = UpdateUser(dataObj[0].ToObject<User>());
            if (u.Id == 0) return u;

            List<Payments> p = dataObj[1].ToObject<List<Payments>>();
            UpdatePaymentsObject(p, u);

            List<Files> f = dataObj[2].ToObject<List<Files>>();
            UpdateFilesObject(f, u);

            List<Commitments> c = dataObj[3].ToObject<List<Commitments>>();
            UpdateCommitmentsObject(c, u);

            List<Expenses> e = dataObj[4].ToObject<List<Expenses>>();
            UpdateExpensesObject(e, u);

            List<UserHorses> uhs = dataObj[5].ToObject<List<UserHorses>>();
            UpdateUserHorsesObject(uhs, u);

            try
            {
                List<AvailableHours> uav = dataObj[6].ToObject<List<AvailableHours>>();
                UpdateAvailableHoursObject(uav, u);

            }
            catch (Exception ex)
            {


            }



            return u;
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


        private static void UpdatePaymentsObject(List<Payments> objList, User u)
        {
            using (var Context = new Context())
            {

                foreach (Payments item in objList)
                {

                    item.UserId = u.Id;

                    if (item.Id == 0)
                    {
                        Context.Payments.Add(item);
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

                    var result = Context.Payments.Where(p => p.UserId == u.Id).ToList();
                    IEnumerable<Payments> differenceQuery = result.Except(objList);

                    foreach (Payments item in differenceQuery)
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


                List<Expenses> Diff = new List<Expenses>();

                foreach (Expenses item in objList)
                {

                    item.UserId = u.Id;

                    if (item.Id == 0)
                    {
                        Context.Expenses.Add(item);
                    }
                    else
                    {
                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
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


            }
        }

        private static void UpdateUserHorsesObject(List<UserHorses> uhs, User u)
        {
            using (var Context = new Context())
            {

                foreach (UserHorses item_uhs in uhs)
                {

                    item_uhs.UserId = u.Id;

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
                var UserIdByEmail = GetUserIdByEmail(User.Email);
                if (User.Id == 0 && UserIdByEmail == 0)
                {
                    Context.Users.Add(User);
                    Context.SaveChanges();
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

        public static int GetUserIdByEmail(string Email)
        {
            using (var Context = new Context())
            {

                var User = Context.Users.SingleOrDefault(u => u.Email.ToLower() == Email.ToLower());
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