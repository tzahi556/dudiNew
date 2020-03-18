using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FarmsApi.DataModels;
using EZcountApiLib;
using System.Configuration;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;

namespace FarmsApi.Services
{
    public  class CommonTasks
    {
        public  bool TaskDone { get; set; }
        public CommonTasks()
        {
            //var Today = DateTime.Now;

            //if (Today.Day == 23)
            //{
            //    TaskDone = true;
            //    AddExpenseToHorseLanders();
            //}
        }

        public void InsertSchedularToken()
        {
            string IsProduction = ConfigurationSettings.AppSettings["IsProduction"].ToString();
            string SlikaUrlChargeToken = ConfigurationSettings.AppSettings["SlikaUrlChargeToken"].ToString();

            DateTime CurrentDate = DateTime.Now;
            int Day = CurrentDate.Day;
            int Month = CurrentDate.Month;


            using (var Context = new Context())
            {

                var UsersToPay = Context.Users.Where(x => x.Active == "active" &&
                             x.DateForMonthlyPay.Value.Day == Day &&
                             x.DateForMonthlySum > 0 &&
                             x.DateForMonthlySeq!= x.DateForMonthlyPrev && // ההסטוריה שונה 
                             x.cc_token != null && 
                             x.cc_token != ""
                             ).ToList();

                foreach (User up in UsersToPay)
                {

                 
                    if (up.Rivoni) { 
                        if (Month != 1 && Month != 4 && Month != 7 && Month != 10)
                            continue;

                    }

                    var Farm = Context.Farms.Where(y => y.Id == up.Farm_Id).FirstOrDefault();
                    var Meta = JObject.Parse(Farm.Meta);
                    string api_key = Meta["api_key"].ToString();
                    string api_email = Meta["api_email"].ToString();
                    var ua_uuid = Meta["ua_uuid"];


                    var reqObjAshrai = new
                    {
                        api_key = api_key,
                        developer_email = "tzahi556@gmail.com",
                        sum = up.DateForMonthlySum,
                        cc_token = up.cc_token,
                        cc_4_digits = up.cc_4_digits,
                        cc_payer_name = up.cc_payer_name,
                        cc_payer_id =up.cc_payer_id,
                        cc_expire_month = up.cc_expire_month,
                        cc_expire_year = up.cc_expire_year,
                        cc_type_id = up.cc_type_id,
                        cc_type_name = up.cc_type_name,


                    };

                    string DATA = Newtonsoft.Json.JsonConvert.SerializeObject(reqObjAshrai);
                    var SlikaUrl = SlikaUrlChargeToken;
                    var client = new HttpClient();
                    HttpContent content = new StringContent(DATA, UTF8Encoding.UTF8, "application/json");
                    HttpResponseMessage messge = client.PostAsync(SlikaUrl, content).Result;

                    dynamic responseToken = "";



                    if (messge.IsSuccessStatusCode)
                    {
                        responseToken = JsonConvert.DeserializeObject(messge.Content.ReadAsStringAsync().Result);

                        if (responseToken.success == "true")
                        {
                            DocCreation doc = new DocCreation();
                            List<dynamic> Payment = new List<dynamic>();
                            Payment.Add(new
                            {
                                payment_type = 3,
                                date = up.DateForMonthlyPay.Value.ToString("dd/MM/yyyy"),
                                payment = up.DateForMonthlySum,

                                cc_type = up.cc_type_id,
                                cc_type_name = up.cc_type_name,
                                cc_number = up.cc_4_digits,
                                cc_deal_type =1,
                                cc_num_of_payments = 1,
                                cc_payment_num = 1,

                            });

                            var reqObj = new
                            {
                                api_key = api_key,
                                api_email = api_email,
                                ua_uuid = ua_uuid,

                                developer_email = "tzahi556@gmail.com",
                                developer_phone = "0505913817",
                                type = 320,//קבלה חשבונית מס
                                description = " חיוב אוטמטי " + up.DateForMonthlyPay.Value.ToString("dd/MM/yyyy"),
                                customer_name = up.FirstName + " " + up.LastName,
                                customer_email = up.AnotherEmail,
                                customer_address = up.Address,
                                comment = "מס לקוח: " + up.ClientNumber + ", ת.ז.: " + up.IdNumber,
                               

                                item = new dynamic[] {
                                 new {
                                    details =" חיוב אוטמטי " + up.DateForMonthlyPay.Value.ToString("dd/MM/yyyy"),
                                    amount = 1,
                                    price = up.DateForMonthlySum,
                                    price_inc_vat = true
                                 }

                                },

                                payment = Payment,
                                price_total = up.DateForMonthlySum,
                            };


                            dynamic response = doc.execute(((IsProduction == "0") ? Constants.ENV_TEST : Constants.ENV_PRODUCTION), reqObj);

                            // אם זה הצליח
                            if (response[5].ToString() == "True")
                            {
                                Payments p = new Payments();
                                p.Date = CurrentDate;
                                p.doc_type = "MasKabala";
                                p.InvoiceNum = response[2].ToString();
                                p.InvoicePdf = response[0].ToString();
                              
                                p.Price = up.DateForMonthlySum;
                                p.InvoiceDetails = " חיוב אוטמטי " + up.DateForMonthlyPay.Value.ToString("dd/MM/yyyy");
                                p.UserId = up.Id;
                                p.InvoiceSum = up.DateForMonthlySum;

                                p.lessons = GetLessonsByCost(up);

                                if(up.PayType == "monthCost")
                                {
                                    p.month = CurrentDate;

                                    if (up.Rivoni)
                                    {

                                        p.untilmonth = CurrentDate.AddMonths(3);
                                    }

                                }
                                    


                                Context.Payments.Add(p);

                                up.DateForMonthlyPrev = ((up.DateForMonthlyPrev == null) ? 0 : up.DateForMonthlyPrev) + 1;
                                Context.Entry(up).State = System.Data.Entity.EntityState.Modified;

                                Context.SaveChanges();

                            }

                        }

                    }
                 

                }
            }
        }

        private int? GetLessonsByCost(User up)
        {
            if(up.PayType== "lessonCost")
            {
                int lessCount =Convert.ToInt32(up.DateForMonthlySum)  / Convert.ToInt32(up.Cost);

                return lessCount;


            }
            else
            {

                return 0;

            }
        }

        public  void InsertChecksToMas()
        {
            string IsProduction = ConfigurationSettings.AppSettings["IsProduction"].ToString();


            DateTime CurrentDate = DateTime.Now.Date;
            using (var Context = new Context())
            {
                var UsersChecks = Context.Checks.Where(x => x.checks_date == CurrentDate && x.checks_auto).ToList();



                foreach (var uc in UsersChecks)
                {
                    var User = Context.Users.Where(y => y.Id == uc.UserId).FirstOrDefault();
                    var PaymentUser = Context.Payments.Where(y => y.Id == uc.PaymentsId).FirstOrDefault();
                    var Farm = Context.Farms.Where(y => y.Id == User.Farm_Id).FirstOrDefault();
                    var Meta = JObject.Parse(Farm.Meta);
                    var api_key = Meta["api_key"];
                    var api_email = Meta["api_email"];
                    var ua_uuid = Meta["ua_uuid"];

                    if (User == null || PaymentUser == null ||
                        (PaymentUser.canceled != null && PaymentUser.canceled != "") ||
                        api_key == null
                        )
                        continue;



                    if (!string.IsNullOrEmpty(PaymentUser.InvoicePdf))
                    {
                        DocCreation doc = new DocCreation();
                        List<dynamic> Payment = new List<dynamic>();
                        Payment.Add(new
                        {
                            payment_type = 2,
                            date = uc.checks_date.Value.ToString("dd/MM/yyyy"),
                            payment = uc.checks_sum,
                            checks_bank_name = uc.checks_bank_name,
                            checks_number = uc.checks_number,

                        });

                        var reqObj = new
                        {
                            api_key = (string)api_key,
                            api_email = (string)api_email,
                            ua_uuid = (string)ua_uuid,

                            developer_email = "tzahi556@gmail.com",
                            developer_phone = "0505913817",
                            type = 305,// חשבונית מס
                            description = "פירעון שיק",
                            customer_name = User.FirstName + " " + User.LastName,
                            customer_email = User.AnotherEmail,
                            customer_address = User.Address,
                            comment = "מס לקוח: " + User.ClientNumber + ", ת.ז.: " + User.IdNumber,
                            parent = PaymentUser.doc_uuid,

                            item = new dynamic[] {
                            new {
                                    details ="פירעון שיק" + uc.checks_number,
                                    amount = 1,
                                    price = uc.checks_sum,
                                    price_inc_vat = true
                            }

                        },

                            payment = Payment,
                            //  details = Params.checks_date != null ? "תאריך פרעון צ'ק: " + ((DateTime)Params.checks_date).ToLocalTime().ToShortDateString() : "",
                            price_total = uc.checks_sum,
                        };


                        dynamic response = doc.execute(((IsProduction == "0") ? Constants.ENV_TEST : Constants.ENV_PRODUCTION), reqObj);

                        // אם זה הצליח
                        if (response[5].ToString() == "True")
                        {
                            Payments p = new Payments();
                            p.Date = uc.checks_date;
                            p.doc_type = "Mas";
                            p.InvoiceNum = response[2].ToString();
                            p.InvoicePdf = response[0].ToString();
                            p.ParentInvoiceNum = PaymentUser.InvoiceNum;
                            p.ParentInvoicePdf = PaymentUser.InvoicePdf;
                            p.SelectedForInvoice = true;
                            p.Price = uc.checks_sum;
                            p.InvoiceDetails = " פירעון שיק " + uc.checks_number;
                            p.UserId = User.Id;
                            p.InvoiceSum = uc.checks_sum;

                            uc.checks_auto = false;
                            Context.Payments.Add(p);
                            //  Context.SaveChanges();
                            PaymentUser.SelectedForInvoice = true;
                            Context.Entry(PaymentUser).State = System.Data.Entity.EntityState.Modified;
                            Context.SaveChanges();


                        }
                    }
                    else
                    {
                        Payments p = new Payments();
                        p.Date = uc.checks_date;
                        p.doc_type = "Mas";
                        p.InvoiceNum = uc.checks_number;
                        p.InvoicePdf = "";
                        p.ParentInvoiceNum = PaymentUser.InvoiceNum;
                        p.ParentInvoicePdf = PaymentUser.InvoicePdf;
                        p.SelectedForInvoice = true;
                        p.Price = uc.checks_sum;
                        p.InvoiceDetails = " פירעון שיק " + uc.checks_number;
                        p.UserId = User.Id;
                        p.InvoiceSum = uc.checks_sum;

                        uc.checks_auto = false;
                        Context.Payments.Add(p);
                        //  Context.SaveChanges();
                        PaymentUser.SelectedForInvoice = true;
                        Context.Entry(PaymentUser).State = System.Data.Entity.EntityState.Modified;
                        Context.SaveChanges();


                    }

                }
            }

        }

        public  void AddExpenseToHorseLanders()
        {
            using (var Context = new Context())
            {
                var UsersH = Context.UserHorses;//.Where(x=>x.UserId== 20533).ToList();

                foreach (var UserH in UsersH)
                {
                    var PensionPrice = UserH.PensionPrice;
                    var TrainingCost = UserH.TrainingCost;
                    string addExpen = "";


                    if (PensionPrice != null && PensionPrice > 0)
                        addExpen += " פנסיון(" + PensionPrice + ")";

                    if (TrainingCost != null && TrainingCost > 0)
                        addExpen += " + אימון(" + TrainingCost + ")";


                    if (!string.IsNullOrEmpty(addExpen))
                    {
                        Expenses ex = new Expenses();
                        ex.Id = 0;
                        ex.Date = DateTime.Now;
                        ex.Price = (PensionPrice ?? 0) + (TrainingCost ?? 0);
                        ex.UserId = UserH.UserId;
                        string MonthPay = DateTime.Now.Month.ToString();
                        string YearPay = DateTime.Now.Year.ToString();
                        ex.Details = " תשלום חודש " + MonthPay + "/" + YearPay + " עבור סוס:  " + UserH.Name + " " + addExpen;

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

        private  void AddExpense(string Details, double Price, User user)
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