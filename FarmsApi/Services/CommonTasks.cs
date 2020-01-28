using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FarmsApi.DataModels;

namespace FarmsApi.Services
{
    public static class CommonTasks
    {
        public static bool TaskDone { get; set; }
        public static void DoCommonTasks()
        {
            var Today = DateTime.Now;
            var EndOfMonthDay = DateTime.DaysInMonth(Today.Year, Today.Month);
            if (Today.Day == EndOfMonthDay && !TaskDone)
            {
                AddExpenseToHorseLanders();
                TaskDone = true;
            }
        }

        public static void AddExpenseToHorseLanders()
        {
            using (var Context = new Context())
            {
                var UsersH = Context.UserHorses;

                foreach (var UserH in UsersH)
                {
                    var PensionPrice = UserH.PensionPrice;
                    var TrainingCost = UserH.TrainingCost;
                    string addExpen = "";


                    if (PensionPrice != null && PensionPrice > 0)
                        addExpen +=  " פנסיון(" + PensionPrice + ")";

                    if (TrainingCost != null && TrainingCost > 0)
                        addExpen +=  " + אימון(" + TrainingCost + ")" ;


                    if (!string.IsNullOrEmpty(addExpen))
                    {
                        Expenses ex = new Expenses();
                        ex.Id = 0;
                        ex.Date = DateTime.Now;
                        ex.Price = (PensionPrice ?? 0) +  (TrainingCost ?? 0);
                        ex.UserId = UserH.UserId;
                        string MonthPay =  DateTime.Now.Month.ToString();
                        string YearPay = DateTime.Now.Year.ToString();
                        ex.Details = " תשלום חודש "+ MonthPay + "/" + YearPay + " עבור סוס:  " + UserH.Name + " " + addExpen;

                        Context.Expenses.Add(ex);


                    }

                }

                Context.SaveChanges();
            }


            //// צחי צריך לסדר
            //using (var Context = new Context())
            //{
            //    var Users = Context.Users.SqlQuery("SELECT * FROM Users WHERE Meta NOT LIKE '%\"Horses\":[[]]%' AND Meta LIKE '%\"Horses\":%'");
            //   var HorseBalance = new List<HorseBalanceRecord>();
            //    foreach (var User in Users)
            //    {

            //        var Horses = JObject.Parse(User.Meta)["Horses"];
            //        foreach (var Horse in Horses)
            //        {
            //            if (Horse["Owner"] == null || Horse["Owner"].Value<bool>() == false)
            //            {
            //                AddExpense("פסיון: " + Horse["Name"].Value<string>(), Horse["PensionPrice"].Value<double>(), User);
            //                var horseBalance = HorseBalance.SingleOrDefault(o => o.HorseId == Horse["Id"].Value<int>());
            //                if (horseBalance == null)
            //                {
            //                    //HorseBalance.Add(new HorseBalanceRecord { HorseId = Horse["Id"].Value<int>(), HorseName = Horse["Name"].Value<string>(), PensionPrice = -1 * Horse["PensionPrice"].Value<double>(), TrainingCost = -1 * (Horse["TrainingCost"] != null ? Horse["TrainingCost"].Value<double>() : 0) });
            //                    HorseBalance.Add(new HorseBalanceRecord { User = User, HorseId = Horse["Id"].Value<int>(), HorseName = Horse["Name"].Value<string>(), PensionPrice = -1 * Horse["PensionPrice"].Value<double>(), TrainingCost = -1 * (Horse["TrainingCost"] != null ? Horse["TrainingCost"].Value<double>() : 0) });
            //                }
            //                else
            //                {
            //                    horseBalance.PensionPrice -= Horse["PensionPrice"].Value<double>();
            //                    horseBalance.TrainingCost -= (Horse["TrainingCost"] != null ? Horse["TrainingCost"].Value<double>() : 0);
            //                }
            //                if (Horse["TrainingCost"] != null)
            //                {
            //                    AddExpense("אימון: " + Horse["Name"].Value<string>(), Horse["TrainingCost"].Value<double>(), User);
            //                }
            //                Context.Entry(User).State = System.Data.Entity.EntityState.Modified;
            //            }
            //            else
            //            {
            //                var horseBalance = HorseBalance.SingleOrDefault(o => o.HorseId == Horse["Id"].Value<int>());
            //                if (horseBalance == null)
            //                {
            //                    HorseBalance.Add(new HorseBalanceRecord
            //                    {
            //                        User = User,
            //                        HorseName = Horse["Name"].Value<string>(),
            //                        HorseId = Horse["Id"].Value<int>(),
            //                        PensionPrice = (Horse["PensionPrice"] != null && Horse["PensionPrice"].Type.ToString() != "Null" ? Horse["PensionPrice"].Value<double>() : 0),
            //                        TrainingCost = (Horse["TrainingCost"] != null && Horse["TrainingCost"].Type.ToString() != "Null" ? Horse["TrainingCost"].Value<double>() : 0)
            //                    });
            //                }
            //                else
            //                {
            //                    horseBalance.PensionPrice += Horse["PensionPrice"].Value<double>();
            //                    horseBalance.TrainingCost += (Horse["TrainingCost"] != null ? Horse["TrainingCost"].Value<double>() : 0);
            //                }
            //            }
            //        }
            //    }
            //    foreach (var Horse in HorseBalance)
            //    {
            //        AddExpense("פסיון: " + Horse.HorseName, Horse.PensionPrice, Horse.User);
            //        AddExpense("אימון: " + Horse.HorseName, Horse.TrainingCost, Horse.User);
            //        Context.Entry(Horse.User).State = System.Data.Entity.EntityState.Modified;
            //    }
            //    Context.SaveChanges();
            //}
        }

        private static void AddExpense(string Details, double Price, User user)
        {
            //// צחי צריך לסדר
            //try
            //{
            //    var Meta = JObject.Parse(user.Meta);
            //    var Expenses = Meta["Expenses"].Value<JArray>();
            //    if (Expenses.Where(e => e["Date"].Value<DateTime>().ToShortDateString() == DateTime.Now.ToShortDateString() && e["Details"].Value<string>() == Details).Count() == 0)
            //    {
            //        Expenses.Add(JObject.FromObject(new { Date = DateTime.Now.ToUniversalTime(), Details = Details, Price = Price }));
            //    }
            //    user.Meta = Meta.ToString(Newtonsoft.Json.Formatting.None);
            //}
            //catch (Exception ex) { }
        }
    }
}

class HorseBalanceRecord
{
    public User User { get; set; }
    public int HorseId { get; set; }
    public string HorseName { get; set; }
    public double PensionPrice { get; set; }
    public double TrainingCost { get; set; }
}