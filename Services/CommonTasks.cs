using EZcountApiLib;
using FarmsApi.DataModels;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Text;

namespace FarmsApi.Services
{
    public class CommonTasks
    {
        public bool TaskDone { get; set; }
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
            string MasterApiKey = ConfigurationSettings.AppSettings["MasterApiKey"].ToString();

            string IsProduction = ConfigurationSettings.AppSettings["IsProduction"].ToString();
            string SlikaUrlChargeToken = ConfigurationSettings.AppSettings["SlikaUrlChargeToken"].ToString();

            DateTime CurrentDate = DateTime.Now;
            int Day = CurrentDate.Day;
            int Month = CurrentDate.Month;


            using (var Context = new Context())
            {

                Logs lgstaet = new Logs();
                lgstaet.Type = 22;// בדיקה שהסקדולר רץ
                lgstaet.TimeStamp = DateTime.Now;
                lgstaet.Request = "";
                lgstaet.RequestEzea = "";
                lgstaet.RequestTimeStamp = DateTime.Now;
                lgstaet.StudentId = 9999;

                lgstaet.Response = "";
                lgstaet.ResponseTimeStamp = DateTime.Now;
                Context.Logs.Add(lgstaet);

                Context.SaveChanges();


                var UsersToPay = Context.Users.Where(x => x.Active == "active" &&
                             x.DateForMonthlyPay.Value.Day == Day &&
                             x.DateForMonthlySum > 0 &&
                             x.DateForMonthlySeq != x.DateForMonthlyPrev && // ההסטוריה שונה 
                             x.cc_token != null &&
                             x.cc_token != ""
                             ).ToList();

                foreach (User up in UsersToPay)
                {


                    if (up.Rivoni)
                    {
                        if (Month != 1 && Month != 4 && Month != 7 && Month != 10)
                            continue;

                    }


                    AutoPayObj ap = GetAutoPayObj(up);

                    var Farm = Context.Farms.Where(y => y.Id == up.Farm_Id).FirstOrDefault();
                    var Meta = JObject.Parse(Farm.Meta);
                    string api_key = Meta["api_key"].ToString();
                    string api_email = Meta["api_email"].ToString();
                    var ua_uuid = Meta["ua_uuid"];


                    var reqObjAshrai = new
                    {
                        api_key = api_key,
                        created_by_api_key = MasterApiKey,
                        developer_email = "musicminor@gmail.com",
                        sum = up.DateForMonthlySum,
                        cc_token = up.cc_token,
                        cc_4_digits = up.cc_4_digits,
                        cc_payer_name = up.cc_payer_name,
                        cc_payer_id = up.cc_payer_id,
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
                                cc_deal_type = 1,
                                cc_num_of_payments = 1,
                                cc_payment_num = 1,

                            });

                            var reqObj = new
                            {
                                api_key = api_key,
                                created_by_api_key = MasterApiKey,
                                api_email = api_email,
                                ua_uuid = ua_uuid,

                                developer_email = "musicminor@gmail.com",
                                developer_phone = "0544249573",
                                type = 320,//קבלה חשבונית מס
                                description = ap.InvoiceTitle,
                                customer_name = up.FirstName + " " + up.LastName,
                                customer_email = up.AnotherEmail,
                                customer_address = up.Address,
                                comment = "מס לקוח: " + up.ClientNumber + ", ת.ז.: " + up.IdNumber,


                                item = new dynamic[] {
                                 new {
                                    details =" תאריכי שיעורים: " + ap.InvoiceDates,
                                    amount = 1,
                                    price = up.DateForMonthlySum,
                                    price_inc_vat = true
                                 }

                                },

                                payment = Payment,
                                price_total = up.DateForMonthlySum,
                            };

                            Logs lg = new Logs();
                            lg.Type = 2;// החזרת צק
                            lg.TimeStamp = DateTime.Now;
                            lg.Request = reqObj.ToString();
                            lg.RequestEzea = reqObj.ToString();
                            lg.RequestTimeStamp = DateTime.Now;
                            lg.StudentId = up.Id;

                            dynamic response = doc.execute(((IsProduction == "0") ? Constants.ENV_TEST : Constants.ENV_PRODUCTION), reqObj);

                            lg.Response = response.ToString();
                            lg.ResponseTimeStamp = DateTime.Now;
                            Context.Logs.Add(lg);

                            Context.SaveChanges();

                            // אם זה הצליח
                            if (response[5].ToString() == "True")
                            {
                                Payments p = new Payments();
                                p.Date = CurrentDate;
                                p.doc_type = "MasKabala";
                                p.InvoiceNum = response[2].ToString();
                                p.InvoicePdf = response[0].ToString();

                                p.Price = up.DateForMonthlySum;
                                p.InvoiceDetails = " חיוב אוטמטי תאריכי שיעורים: " + ap.InvoiceDates;
                                p.UserId = up.Id;
                                p.InvoiceSum = up.DateForMonthlySum;

                                p.lessons = ap.lessons;
                                p.month = ap.month;
                                p.untilmonth = ap.untilmonth;


                                Context.Payments.Add(p);

                                up.DateForMonthlyPrev = ((up.DateForMonthlyPrev == null) ? 0 : up.DateForMonthlyPrev) + 1;
                                Context.Entry(up).State = System.Data.Entity.EntityState.Modified;

                                lg = new Logs();
                                lg.Type = 4; // חשבונית חדשה חשבונית אצלינו
                                lg.TimeStamp = DateTime.Now;
                                lg.Request = p.InvoiceNum;
                                lg.StudentId = up.Id;
                                // lg.UserId = UsersService.GetCurrentUser().Id;
                                lg.Response = p.InvoicePdf;

                                lg.ResponseTimeStamp = DateTime.Now;
                                lg.RequestTimeStamp = DateTime.Now;
                                Context.Logs.Add(lg);

                                Context.SaveChanges();

                            }

                        }

                    }


                }


                // זה נועד לאפס את העסק שאם ירצה להוסיף

                var UsersToDeleteAuto = Context.Users.Where(x => x.Active == "active" &&
                         x.DateForMonthlyPay.Value.Day == Day &&
                         x.DateForMonthlySum > 0 &&
                         x.DateForMonthlySeq == x.DateForMonthlyPrev && // ההסטוריה שונה 
                         x.cc_token != null &&
                         x.cc_token != ""
                         ).ToList();
                foreach (User upd in UsersToDeleteAuto)
                {
                    upd.DateForMonthlyPay = null;
                    upd.DateForMonthlySum = null;
                    upd.DateForMonthlySeq = null;
                    upd.DateForMonthlyPrev = null;
                    upd.Rivoni = false;
                    Context.Entry(upd).State = System.Data.Entity.EntityState.Modified;

                    Context.SaveChanges();

                }

            }
        }

        private int? GetLessonsByCost(User up)
        {
            if (up.PayType == "lessonCost")
            {
                int lessCount = Convert.ToInt32(up.DateForMonthlySum) / Convert.ToInt32(up.Cost);

                return lessCount;
            }
            else
            {
                return 0;
            }
        }


        private AutoPayObj GetAutoPayObj(User up)
        {
            DateTime CurrentDate = DateTime.Now;

            AutoPayObj ap = new AutoPayObj();
            ap.lessons = 0;
            ap.month = null;
            ap.untilmonth = null;
            ap.InvoiceDates = ""; // details
            ap.InvoiceTitle = ""; //desc

            if (up.PayType == "lessonCost")
            {
                int lessCount = Convert.ToInt32(up.DateForMonthlySum) / Convert.ToInt32(up.Cost);
                ap.lessons = lessCount;

                ap.InvoiceTitle = "חיוב אוטמטי עבור " + lessCount.ToString() + " שיעורים ";

            }
            else
            {
                ap.month = CurrentDate;
                ap.InvoiceTitle = "חיוב אוטמטי עבור חודש אחד ";

                if (up.Rivoni)
                {
                    ap.untilmonth = CurrentDate.AddMonths(3);
                    ap.InvoiceTitle = "חיוב אוטמטי עבור 3 חודשים ";
                }


            }



            using (var Context = new Context())
            {
                var LessonsDates = (from sl in Context.StudentLessons
                                    join l in Context.Lessons
                                    on sl.Lesson_Id equals l.Id
                                    where sl.User_Id == up.Id && l.Start >= CurrentDate
                                    select new
                                    {
                                        StartDate = l.Start
                                    }).ToList();


                for (int i = 0; i < LessonsDates.Count; i++)
                {

                    ap.InvoiceDates += "," + LessonsDates[i].StartDate.ToString("dd/MM/yy");

                    if (
                        (i + 1 == ap.lessons) ||
                        (!up.Rivoni && LessonsDates[i].StartDate > CurrentDate.AddMonths(1)) ||
                        (up.Rivoni && LessonsDates[i].StartDate > CurrentDate.AddMonths(3))
                        ) break;

                }


            }




            return ap;
        }

        public void InsertChecksToMas()
        {

            string MasterApiKey = ConfigurationSettings.AppSettings["MasterApiKey"].ToString();

            string IsProduction = ConfigurationSettings.AppSettings["IsProduction"].ToString();


            DateTime CurrentDate = DateTime.Now.Date;
            using (var Context = new Context())
            {

                Logs lgstaet = new Logs();
                lgstaet.Type = 20;// בדיקה שהסקדולר רץ
                lgstaet.TimeStamp = DateTime.Now;
                lgstaet.Request = "";
                lgstaet.RequestEzea = "";
                lgstaet.RequestTimeStamp = DateTime.Now;
                lgstaet.StudentId = 9999;

                lgstaet.Response = "";
                lgstaet.ResponseTimeStamp = DateTime.Now;
                Context.Logs.Add(lgstaet);

                Context.SaveChanges();


                var UsersChecks = Context.Checks.Where(x =>x.checks_date == CurrentDate && x.checks_auto).ToList();
                //בשביל להביא קודמים שלא עלו
                //var UsersChecks = Context.Checks.Where(x => x.checks_date < CurrentDate && x.checks_auto).ToList();
                foreach (var uc in UsersChecks)
                {
                    var User = Context.Users.Where(y => y.Id == uc.UserId).FirstOrDefault();
                    var PaymentUser = Context.Payments.Where(y => y.Id == uc.PaymentsId && !y.Deleted && y.ZikuyNumber==null).FirstOrDefault();
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
                            created_by_api_key = MasterApiKey,
                            api_email = (string)api_email,
                            ua_uuid = (string)ua_uuid,

                            developer_email = "musicminor@gmail.com",
                            developer_phone = "0544249573",
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



                        Logs lg = new Logs();
                        lg.Type = 2;// החזרת צק
                        lg.TimeStamp = DateTime.Now;
                        lg.Request = reqObj.ToString();
                        lg.RequestEzea = reqObj.ToString();
                        lg.RequestTimeStamp = DateTime.Now;
                        lg.StudentId = uc.UserId;
                      //  lg.UserId = UsersService.GetCurrentUser().Id;



                        dynamic response = doc.execute(((IsProduction == "0") ? Constants.ENV_TEST : Constants.ENV_PRODUCTION), reqObj);
                       
                        lg.Response = response.ToString();
                        lg.ResponseTimeStamp = DateTime.Now;
                        Context.Logs.Add(lg);

                        Context.SaveChanges();

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
                            // Context.SaveChanges();
                            //PaymentUser.SelectedForInvoice = true;
                            Context.Entry(PaymentUser).State = System.Data.Entity.EntityState.Modified;


                            lg = new Logs();
                            lg.Type = 4; // חשבונית חדשה חשבונית אצלינו
                            lg.TimeStamp = DateTime.Now;
                            lg.Request = p.InvoiceNum;
                            lg.StudentId = uc.UserId;
                           // lg.UserId = UsersService.GetCurrentUser().Id;
                            lg.Response = p.InvoicePdf;

                            lg.ResponseTimeStamp = DateTime.Now;
                            lg.RequestTimeStamp = DateTime.Now;
                            Context.Logs.Add(lg);


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

        public void InsertAshraisToMas()
        {

            string MasterApiKey = ConfigurationSettings.AppSettings["MasterApiKey"].ToString();

            string IsProduction = ConfigurationSettings.AppSettings["IsProduction"].ToString();


            DateTime CurrentDate = DateTime.Now.Date;
            using (var Context = new Context())
            {


                Logs lgstaet = new Logs();
                lgstaet.Type = 21;// בדיקה שהסקדולר רץ
                lgstaet.TimeStamp = DateTime.Now;
                lgstaet.Request = "";
                lgstaet.RequestEzea = "";
                lgstaet.RequestTimeStamp = DateTime.Now;
                lgstaet.StudentId = 9999;

                lgstaet.Response = "";
                lgstaet.ResponseTimeStamp = DateTime.Now;
                Context.Logs.Add(lgstaet);

                Context.SaveChanges();


                var UsersAshrais = Context.Ashrais.Where(x => x.AshraiDate == CurrentDate && x.ashrai_auto).ToList();
                //בשביל להביא קודמים שלא עלו
                // var UsersChecks = Context.Checks.Where(x => x.checks_date < CurrentDate && x.checks_auto).ToList();
                foreach (var uc in UsersAshrais)
                {
                    var User = Context.Users.Where(y => y.Id == uc.UserId).FirstOrDefault();
                    var PaymentUser = Context.Payments.Where(y => y.Id == uc.PaymentsId && !y.Deleted && y.ZikuyNumber == null).FirstOrDefault();
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
                            //payment_type = 2,
                            //date = uc.checks_date.Value.ToString("dd/MM/yyyy"),
                            //payment = uc.checks_sum,
                            //checks_bank_name = uc.checks_bank_name,
                            //checks_number = uc.checks_number,

                            payment_type = 3,
                            date = uc.AshraiDate.Value.ToString("dd/MM/yyyy"),
                            payment = uc.ashrai_sum,

                            cc_type =uc.cc_type,
                            cc_type_name = uc.cc_type_name,
                            cc_number = uc.cc_number,
                            cc_deal_type = uc.cc_deal_type,
                            cc_num_of_payments = uc.cc_num_of_payments,
                            cc_payment_num = uc.cc_payment_num,





                        });

                        var reqObj = new
                        {
                            api_key = (string)api_key,
                            created_by_api_key = MasterApiKey,
                            api_email = (string)api_email,
                            ua_uuid = (string)ua_uuid,

                            auto_balance=true,
                            developer_email = "musicminor@gmail.com",
                            developer_phone = "0544249573",
                            type = 305,// חשבונית מס
                            description = "פירעון אשראי תשלומים",
                            customer_name = User.FirstName + " " + User.LastName,
                            customer_email = User.AnotherEmail,
                            customer_address = User.Address,
                            comment = "מס לקוח: " + User.ClientNumber + ", ת.ז.: " + User.IdNumber,
                            parent = PaymentUser.doc_uuid,

                            item = new dynamic[] {
                            new {
                                    details =" פירעון אשראי תשלומים",
                                    amount = 1,
                                    price = uc.ashrai_sum,
                                    price_inc_vat = true
                            }

                        },

                            payment = Payment,
                            //  details = Params.checks_date != null ? "תאריך פרעון צ'ק: " + ((DateTime)Params.checks_date).ToLocalTime().ToShortDateString() : "",
                            price_total = uc.ashrai_sum,
                        };



                        Logs lg = new Logs();
                        lg.Type = 7;// אשראי
                        lg.TimeStamp = DateTime.Now;
                        lg.Request = reqObj.ToString();
                        lg.RequestEzea = reqObj.ToString();
                        lg.RequestTimeStamp = DateTime.Now;
                        lg.StudentId = uc.UserId;
                        //  lg.UserId = UsersService.GetCurrentUser().Id;



                        dynamic response = doc.execute(((IsProduction == "0") ? Constants.ENV_TEST : Constants.ENV_PRODUCTION), reqObj);

                        lg.Response = response.ToString();
                        lg.ResponseTimeStamp = DateTime.Now;
                        Context.Logs.Add(lg);

                        Context.SaveChanges();

                        // אם זה הצליח
                        if (response[5].ToString() == "True")
                        {
                            Payments p = new Payments();
                            p.Date = uc.AshraiDate;
                            p.doc_type = "Mas";
                            p.InvoiceNum = response[2].ToString();
                            p.InvoicePdf = response[0].ToString();
                            p.ParentInvoiceNum = PaymentUser.InvoiceNum;
                            p.ParentInvoicePdf = PaymentUser.InvoicePdf;
                            p.SelectedForInvoice = true;
                            p.Price = uc.ashrai_sum;
                            p.InvoiceDetails = " פירעון אשראי - תשלומים " ;
                            p.UserId = User.Id;
                            p.InvoiceSum = uc.ashrai_sum;

                            uc.ashrai_auto = false;
                            Context.Payments.Add(p);
                            //  Context.SaveChanges();
                            PaymentUser.SelectedForInvoice = true;
                            Context.Entry(PaymentUser).State = System.Data.Entity.EntityState.Modified;


                            lg = new Logs();
                            lg.Type = 4; // חשבונית חדשה חשבונית אצלינו
                            lg.TimeStamp = DateTime.Now;
                            lg.Request = p.InvoiceNum;
                            lg.StudentId = uc.UserId;
                            // lg.UserId = UsersService.GetCurrentUser().Id;
                            lg.Response = p.InvoicePdf;

                            lg.ResponseTimeStamp = DateTime.Now;
                            lg.RequestTimeStamp = DateTime.Now;
                            Context.Logs.Add(lg);


                            Context.SaveChanges();


                        }
                    }
                    else
                    {
                        Payments p = new Payments();
                        p.Date = uc.AshraiDate;
                        p.doc_type = "Mas";
                        p.InvoiceNum = uc.cc_payment_num;
                        p.InvoicePdf = "";
                        p.ParentInvoiceNum = PaymentUser.InvoiceNum;
                        p.ParentInvoicePdf = PaymentUser.InvoicePdf;
                        p.SelectedForInvoice = true;
                        p.Price = uc.ashrai_sum;
                        p.InvoiceDetails = " פירעון אשראי - תשלומים ";
                        p.UserId = User.Id;
                        p.InvoiceSum = uc.ashrai_sum;

                        uc.ashrai_auto = false;
                        Context.Payments.Add(p);
                        //  Context.SaveChanges();
                        PaymentUser.SelectedForInvoice = true;
                        Context.Entry(PaymentUser).State = System.Data.Entity.EntityState.Modified;
                        Context.SaveChanges();


                    }

                }
            }

        }

        public void AddExpenseToHorseLanders()
        {
            using (var Context = new Context())
            {

                var CurrentDate = DateTime.Now;
                var UsersH = Context.UserHorses.Where(x=>!x.IsCancelAuto || (x.IsCancelAuto && CurrentDate > x.UntilCancelTime)).ToList();
                
                foreach (var UserH in UsersH)
                {
                    // במידה והסוס מחוק או לא פעיל
                    Horse h = Context.Horses.Where(x => x.Id == UserH.HorseId).FirstOrDefault();
                    if (h != null && (h.Deleted || h.Active== "notActive")) continue;

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
                        ex.BeforePrice = (PensionPrice ?? 0) + (TrainingCost ?? 0);
                        ex.UserId = UserH.UserId;
                        ex.HorseId = UserH.HorseId;
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

        private void AddExpense(string Details, double Price, User user)
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


class AutoPayObj
{

    public int? lessons { get; set; }
    public DateTime? month { get; set; }
    public DateTime? untilmonth { get; set; }
    public string InvoiceDates { get; set; }

    public string InvoiceTitle { get; set; }
}