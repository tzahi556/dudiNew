using EZcountApiLib;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using FarmsApi.Services;
using FarmsApi.DataModels;
using System.Linq;

namespace FarmsApi.Controllers
{
    [RoutePrefix("invoices")]
    public class InvoiceController : ApiController
    {
        [Authorize]
        [Route("sendInvoice")]
        [HttpPost]
        [Obsolete]
        public IHttpActionResult sendInvoice(dynamic Params)
        {

            Logs lg = new Logs();
            lg.Type = 1;
            lg.TimeStamp = DateTime.Now;
            lg.Request = Params.ToString();
            lg.StudentId = (int)Params.UserId;
            User CurrentUser = UsersService.GetCurrentUser(); 
            lg.UserId = CurrentUser.Id;

            try
            {


                string IsProduction = ConfigurationSettings.AppSettings["IsProduction"].ToString();

                string SlikaUrlAsraiValidate = ConfigurationSettings.AppSettings["SlikaUrlAsraiValidate"].ToString();
                string SuccessUrlAshrai = ConfigurationSettings.AppSettings["SuccessUrlAshrai"].ToString();
                string SlikaUrlAshrai = ConfigurationSettings.AppSettings["SlikaUrlAshrai"].ToString();


                string SuccessUrlToken = ConfigurationSettings.AppSettings["SuccessUrlToken"].ToString();
                string SlikaUrlToken = ConfigurationSettings.AppSettings["SlikaUrlToken"].ToString();
                string SlikaUrlChargeToken = ConfigurationSettings.AppSettings["SlikaUrlChargeToken"].ToString();


                var CurrentUserFarmId = CurrentUser.Farm_Id;
                var UserIdByEmail = UsersService.GetUserIdByEmail((string)Params.customer_crn, CurrentUserFarmId);

                // צחי הוסיף בכדי למנוע עדכון של ת"ז קיים לחווה מסויימת
                //if ((string)Params.UserId != UserIdByEmail.ToString() && UserIdByEmail != 0)
                //{
                //    return Ok("-1");
                //}




                DocCreation doc = new DocCreation();

                Params.payment = Params.InvoiceSum;
                Params.payment_date = Params.Date.ToString("dd/MM/yyyy");

                if ((string)Params.payment_type == "validate")
                {

                    var reqObjValidate = new
                    {
                        developer_email = "tzahi556@gmail.com",
                        api_key = (string)Params.api_key

                    };


                    string DATA = Newtonsoft.Json.JsonConvert.SerializeObject(reqObjValidate);

                    var SlikaUrl = SlikaUrlAsraiValidate + Params.ksys_token;
                    lg.RequestEzea = SlikaUrl.ToString();
                    lg.RequestTimeStamp = DateTime.Now;
                    var client = new HttpClient();
                    HttpContent content = new StringContent(DATA, UTF8Encoding.UTF8, "application/json");
                    HttpResponseMessage messge = client.PostAsync(SlikaUrl, content).Result;

                   
                    dynamic response = "";
                    if (messge.IsSuccessStatusCode)
                    {
                        response = JsonConvert.DeserializeObject(messge.Content.ReadAsStringAsync().Result);

                    }

                    lg.Details = "סליקה באשראי ולידציה";
                    lg.Response = response.ToString();
                    lg.ResponseTimeStamp = DateTime.Now;
                    return Ok(response);
                }

                else if ((string)Params.payment_type == "ashrai")
                {

                    var reqObjAshrai = new
                    {
                        api_key = (string)Params.api_key,
                        //   api_email = (string)Params.api_email,
                        developer_email = "tzahi556@gmail.com",
                        sum = (decimal)Params.payment,
                        successUrl = SuccessUrlAshrai
                    };



                    string DATA = Newtonsoft.Json.JsonConvert.SerializeObject(reqObjAshrai);

                    var SlikaUrl = SlikaUrlAshrai;

                    lg.RequestEzea = DATA.ToString();
                    lg.RequestTimeStamp = DateTime.Now;
                    var client = new HttpClient();
                    HttpContent content = new StringContent(DATA, UTF8Encoding.UTF8, "application/json");
                    HttpResponseMessage messge = client.PostAsync(SlikaUrl, content).Result;

                    

                    dynamic response = "";
                    if (messge.IsSuccessStatusCode)
                    {
                        response = JsonConvert.DeserializeObject(messge.Content.ReadAsStringAsync().Result);

                    }
                    lg.Details = "אשראי קבלת קישור לחלון";
                    lg.Response = response.ToString();
                    lg.ResponseTimeStamp = DateTime.Now;
                    return Ok(response);
                }

                else if ((string)Params.payment_type == "token")
                {

                    var reqObjAshrai = new
                    {
                        api_key = (string)Params.api_key,

                        developer_email = "tzahi556@gmail.com",

                        successUrl = SuccessUrlToken + "&UserId=" + (string)Params.UserId
                    };


                    string DATA = Newtonsoft.Json.JsonConvert.SerializeObject(reqObjAshrai);

                    var SlikaUrl = SlikaUrlToken;

                    lg.RequestEzea = DATA.ToString();
                    lg.RequestTimeStamp = DateTime.Now;

                    var client = new HttpClient();
                    HttpContent content = new StringContent(DATA, UTF8Encoding.UTF8, "application/json");
                    HttpResponseMessage messge = client.PostAsync(SlikaUrl, content).Result;

                    dynamic response = "";
                    if (messge.IsSuccessStatusCode)
                    {
                        response = JsonConvert.DeserializeObject(messge.Content.ReadAsStringAsync().Result);

                    }
                    lg.Details = "הגדרת טוקן";
                    lg.Response = response.ToString();
                    lg.ResponseTimeStamp = DateTime.Now;

                    return Ok(response);
                }

                else if ((string)Params.payment_type == "tokenBuy")
                {

                    var reqObjAshrai = new
                    {
                        api_key = (string)Params.api_key,
                        developer_email = "tzahi556@gmail.com",
                        sum = (decimal)Params.payment,
                        cc_token = (string)Params.cc_token,
                        cc_4_digits = (string)Params.cc_4_digits,
                        cc_payer_name = (string)Params.cc_payer_name,
                        cc_payer_id = (string)Params.cc_payer_id,
                        cc_expire_month = (string)Params.cc_expire_month,
                        cc_expire_year = (string)Params.cc_expire_year,
                        cc_type_id = (string)Params.cc_type_id,
                        cc_type_name = (string)Params.cc_type_name,


                    };

                    string DATA = Newtonsoft.Json.JsonConvert.SerializeObject(reqObjAshrai);
                    var SlikaUrl = SlikaUrlChargeToken;

                    lg.RequestEzea = DATA.ToString();
                    lg.RequestTimeStamp = DateTime.Now;
                    var client = new HttpClient();
                    HttpContent content = new StringContent(DATA, UTF8Encoding.UTF8, "application/json");
                    HttpResponseMessage messge = client.PostAsync(SlikaUrl, content).Result;

                    dynamic responseToken = "";



                    if (messge.IsSuccessStatusCode)
                    {
                        responseToken = JsonConvert.DeserializeObject(messge.Content.ReadAsStringAsync().Result);

                        if (responseToken.success == "true")
                        {
                            Params.payment_type = "credit card";
                            Params.cc_type = (int)Params.cc_type_id;
                            Params.cc_type_name = (string)Params.cc_type_name;
                            Params.cc_number = (string)Params.cc_4_digits;
                            Params.cc_num_of_payments = 1;
                            Params.cc_deal_type = 1;
                            Params.cc_payment_num = 1;
                            lg.Details = "סליקה טוקן";
                            lg.Response = responseToken.ToString();
                          
                            lg.ResponseTimeStamp = DateTime.Now;
                            return sendInvoice(Params);

                        }
                        else
                        {
                            lg.Details = "סליקה טוקן";
                            lg.Response = responseToken.ToString();
                            lg.ResponseTimeStamp = DateTime.Now;
                        }


                    }
                    responseToken = "false";
                    return Ok(responseToken);

                }

                else
                {

                    //try
                    //{

                    List<dynamic> Payment = new List<dynamic>();
                    switch ((string)Params.payment_type)
                    {
                        case "PayPal":
                        case "Pay":
                        case "Bit":
                        case "PayBox":

                            Payment.Add(
                            new
                            {
                                payment_type = 91,
                                date = (string)Params.payment_date,
                                payment = (decimal)Params.payment,
                                wt_vendor= (string)Params.payment_type,
                            }

                            );


                            break;
                        case "cash":

                            Payment.Add(
                            new
                            {
                                payment_type = 1,
                                date = (string)Params.payment_date,
                                payment = (decimal)Params.payment
                            }

                            );


                            break;
                        case "check":

                            JObject Checks = JObject.Parse((Newtonsoft.Json.JsonConvert.SerializeObject(Params.Checks)));
                            for (int i = 0; i < Checks.Count; i++)
                            {
                                Payment.Add(new
                                {
                                    payment_type = 2,
                                    date = ((DateTime)Checks[i.ToString()]["checks_date"]).ToLocalTime().ToShortDateString(),// tzahi change//Params.payment_date,
                                    payment = (decimal)(Checks[i.ToString()]["checks_sum"]),//(decimal)Params.payment,

                                    checks_bank_name = Checks[i.ToString()]["checks_bank_name"].ToString(),//(string)Params.checks_bank_name,
                                    checks_number = Checks[i.ToString()]["checks_number"].ToString(),// (string)Params.checks_number,

                                });
                            }



                            break;
                        case "credit card":
                            Payment.Add(new
                            {
                                payment_type = 3,
                                date = (string)Params.payment_date,
                                payment = (decimal)Params.payment,

                                cc_type = (int)Params.cc_type,
                                cc_type_name = (string)Params.cc_type_name,
                                cc_number = (string)Params.cc_number,
                                cc_deal_type = (int)Params.cc_deal_type,
                                cc_num_of_payments = (int)Params.cc_num_of_payments,
                                cc_payment_num = (string)Params.cc_payment_num,

                            });
                            break;

                        //case "tokenBuy":



                        //    Payment.Add(new
                        //    {
                        //        payment_type = 3,
                        //        date = (string)Params.payment_date,
                        //        payment = (decimal)Params.payment,

                        //        cc_type = (int)Params.cc_type,
                        //        cc_type_name = (string)Params.cc_type_name,
                        //        cc_number = (string)Params.cc_number,
                        //        cc_deal_type = (int)Params.cc_deal_type,
                        //        cc_num_of_payments = (int)Params.cc_num_of_payments,
                        //        cc_payment_num = (int)Params.cc_payment_num,

                        //    });
                        //    break;


                        case "bank transfer":
                            Payment.Add(new
                            {
                                payment_type = 4,
                                date = (string)Params.payment_date,
                                payment = (decimal)Params.payment,

                                bt_bank_account = (string)Params.bt_bank_account,
                                bt_bank_branch = (string)Params.bt_bank_branch,
                                bt_bank_name = (string)Params.bt_bank_name,
                            });
                            break;
                    }

                    int DocType = 405;
                    try
                    {
                        DocType = ((bool)Params.isMasKabala) ? 320 : ((bool)Params.isKabala ? 400 : ((bool)Params.isMas ? 305 : 405));
                        if ((bool)Params.isZikuy) DocType = 330;
                        if ((bool)Params.isIska) DocType = 300;

                    }
                    catch (Exception ex)
                    {
                        Params.isMasKabala = false;
                    }


                    //*************************** חלוקה לרשימות
                    List<dynamic> listProduct = new List<dynamic>();
                    string InvoiceDetailsArray = Newtonsoft.Json.JsonConvert.SerializeObject(Params.InvoiceDetailsArray);
                    List<JsonObj> items = JsonConvert.DeserializeObject<List<JsonObj>>(InvoiceDetailsArray);
                    foreach (var product in items)
                    {

                        dynamic temp = new
                        {
                            details = product.details,
                            amount = 1,
                            price = product.price,
                            price_inc_vat = true
                        };

                        listProduct.Add(temp);

                    }

                    if (items.Count == 0)
                    {

                        dynamic temp = new
                        {
                            details = (string)Params.InvoiceDetails,
                            amount = 1,
                            price = (decimal)Params.payment,
                            price_inc_vat = true
                        };

                        listProduct.Add(temp);


                    }

                    //********************************************

                    try
                    {

                        if ((bool)Params.isZikuy)
                        {
                            using (var Context = new Context())
                            {
                                dynamic responseZikuy = null;


                                string parentList = (string)Params.parents;


                                var Pays = Context.Payments.Where(x => (parentList).Contains(x.doc_uuid)).ToList();
                                if(Pays.Count > 1)
                                {
                                  
                                    foreach (var Pay in Pays)
                                    {
                                        bool IsExist = Pays.Any(x => x.doc_type != Pay.doc_type);

                                        if (IsExist)
                                        {
                                            lg.Details = " תקלה בהפקת זיכוי " + (string)Params.payment_type;
                                            lg.RequestTimeStamp = DateTime.Now;
                                           
                                            lg.Response = " תקלה בהפקת זיכוי ";
                                            lg.ResponseTimeStamp = DateTime.Now;
                                            return Ok("-2");
                                        }

                                    }


                                }


                                //צחי שינה שיש ריבוי חשבוניות לזיכוי
                                var item = Context.Payments.Where(x => (parentList).Contains(x.doc_uuid)).FirstOrDefault();
                                
                                if(item!=null)
                                {
                                    var doc_type = item.doc_type;

                                    if (doc_type == "Mas" || doc_type == "MasKabala")
                                    {
                                        decimal p = (decimal)Params.payment;
                                        DocType = 330;
                                        //Payment = null;
                                        dynamic temp = new
                                        {
                                            details = (string)Params.InvoiceDetails,
                                            amount = 1,
                                            price = p,
                                            price_inc_vat = true
                                        };

                                        listProduct[0] = temp;


                                        responseZikuy = GetEzcountRes(Params, listProduct, Payment, DocType, IsProduction, doc, ref lg, p);
                                    }

                                    if (doc_type == "Kabala" || doc_type == "MasKabala")
                                    {
                                        DocType = 400;

                                        decimal p = -1 * (decimal)Params.payment;

                                        dynamic temp = new
                                        {
                                            details = (string)Params.InvoiceDetails,
                                            amount = 1,
                                            price = p,
                                            price_inc_vat = true
                                        };

                                        listProduct[0] = temp;

                                       

                                        Payment.Add(
                                                     new
                                                     {
                                                         payment_type = GetPaymentTypeByString(item.payment_type),
                                                         date = (string)Params.payment_date,
                                                         payment = p
                                                     }

                                                     );

                                        responseZikuy = GetEzcountRes(Params, listProduct, Payment, DocType, IsProduction, doc, ref lg, p);

                                    }
                                }
                                return Ok(responseZikuy);



                            }

                        }
                    }
                    catch (Exception ex)
                    {

                    }




                    var reqObj = new
                    {
                        api_key = (string)Params.api_key,
                        api_email = (string)Params.api_email,
                        ua_uuid = (string)Params.ua_uuid,

                        developer_email = "tzahi556@gmail.com",
                        developer_phone = "0505913817",
                        type = DocType,
                        description = (DocType!=400) ? "": (string)Params.InvoiceDetails,

                        customer_email = (string)Params.customer_email,
                        customer_address = (string)Params.customer_address,
                        comment = (string)Params.comment,
                        parent = (string)Params.parents,

                        customer_name = (string)Params.customer_name,
                        customerAction = "ASSOC_CREATE",
                        customer_crn =  (string.IsNullOrEmpty((string)Params.temp_customer_crn))? (string)Params.customer_crn: (string)Params.temp_customer_crn,
                        c_accounting_num = (string)Params.c_accounting_num,
                        tag_id = (string)Params.tag_id,


                        item = listProduct,

                        payment = Payment,
                        //  details = Params.checks_date != null ? "תאריך פרעון צ'ק: " + ((DateTime)Params.checks_date).ToLocalTime().ToShortDateString() : "",
                        price_total = (decimal)Params.payment,
                    };

                    lg.Details = " הנפקת חשבונית " + (string)Params.payment_type;
                    lg.RequestEzea = reqObj.ToString();
                    lg.RequestTimeStamp = DateTime.Now;
                    dynamic response = doc.execute(((IsProduction == "0") ? Constants.ENV_TEST : Constants.ENV_PRODUCTION), reqObj);
                    lg.Response = response.ToString();
                    lg.ResponseTimeStamp = DateTime.Now;
                    return Ok(response);


                }



            }
            catch (Exception ex)
            {
                lg.Exception = ex.Message;
                DocCreation doc = new DocCreation();
                dynamic response = doc.execute(Constants.ENV_TEST , null); // "{errMsg:2220}";
                return Ok(response);

            }
            finally
            {

                using (var Context = new Context())
                {

                    Context.Logs.Add(lg);
                    Context.SaveChanges();

                }

            }
        }

        private object GetPaymentTypeByString(string payment_type)
        {


            switch (payment_type)
            {
                case "PayPal":
                case "Pay":
                case "Bit":
                case "PayBox":
                    return 91;
                case "cash":
                    return 1;
                case "check":
                    return 2;
                case "credit card":
                    return 3;
                case "bank transfer":
                    return 4;
             

                default:
                    return 1;
                   
            }
        }

        private dynamic GetEzcountRes(dynamic Params, List<dynamic> listProduct, List<dynamic> Payment, int DocType, string IsProduction, DocCreation doc, ref Logs lg, decimal p)
        {
            var reqObjZikuy = new
            {
                api_key = (string)Params.api_key,
                api_email = (string)Params.api_email,
                ua_uuid = (string)Params.ua_uuid,

                developer_email = "tzahi556@gmail.com",
                developer_phone = "0505913817",
                type = DocType,
                description = "",//(bool)Params.isMasKabala ? "" : (string)Params.InvoiceDetails,

                customer_email = (string)Params.customer_email,
                customer_address = (string)Params.customer_address,
                comment = (string)Params.comment,
                parent = (string)Params.parents,

                customer_name = (string)Params.customer_name,
                customerAction = "ASSOC_CREATE",
                customer_crn = (string)Params.customer_crn,
                c_accounting_num = (string)Params.c_accounting_num,
                tag_id = (string)Params.tag_id,


                item = listProduct,

                payment = Payment,
                price_total = p,
            };

            lg.Details = " הנפקת זיכוי " + (string)Params.payment_type;
            lg.RequestTimeStamp = DateTime.Now;
            dynamic responseZikuy = doc.execute(((IsProduction == "0") ? Constants.ENV_TEST : Constants.ENV_PRODUCTION), reqObjZikuy);
            lg.Response = responseZikuy.ToString();
            lg.ResponseTimeStamp = DateTime.Now;
            return responseZikuy;

        }
    }


    public class JsonObj
    {
        [JsonProperty("amount")]
        public int amount { get; set; }

        [JsonProperty("details")]
        public string details { get; set; }
        [JsonProperty("price")]
        public decimal price { get; set; }
        [JsonProperty("price_inc_vat")]
        public bool price_inc_vat { get; set; }



    }
}
