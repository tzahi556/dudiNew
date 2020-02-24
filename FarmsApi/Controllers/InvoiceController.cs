using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using EZcountApiLib;
using Newtonsoft.Json;
using RestSharp;
using Newtonsoft.Json.Linq;

namespace FarmsApi.Controllers
{
    [RoutePrefix("invoices")]
    public class InvoiceController : ApiController
    {
        [Authorize]
        [Route("sendInvoice")]
        [HttpPost]
        public IHttpActionResult sendInvoice(dynamic Params)
        {
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

                var SlikaUrl = "https://demo.ezcount.co.il/api/payment/validate/" + Params.ksys_token;
                var client = new HttpClient();
                HttpContent content = new StringContent(DATA, UTF8Encoding.UTF8, "application/json");
                HttpResponseMessage messge = client.PostAsync(SlikaUrl, content).Result;

                dynamic response = "";
                if (messge.IsSuccessStatusCode)
                {
                    response = JsonConvert.DeserializeObject(messge.Content.ReadAsStringAsync().Result);

                }


                // dynamic response = doc.execute(, );
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
                    successUrl = "http://giddyup.co.il/close.html"


                };


                string DATA = Newtonsoft.Json.JsonConvert.SerializeObject(reqObjAshrai);

                var SlikaUrl = "https://demo.ezcount.co.il/api/payment/prepareSafeUrl/clearingFormForMerchant";
                var client = new HttpClient();
                HttpContent content = new StringContent(DATA, UTF8Encoding.UTF8, "application/json");
                HttpResponseMessage messge = client.PostAsync(SlikaUrl, content).Result;

                dynamic response = "";
                if (messge.IsSuccessStatusCode)
                {
                    response = JsonConvert.DeserializeObject(messge.Content.ReadAsStringAsync().Result);

                }

                return Ok(response);
            }

            else if ((string)Params.payment_type == "token")
            {

                var reqObjAshrai = new
                {
                    api_key = (string)Params.api_key,

                    developer_email = "tzahi556@gmail.com",

                    successUrl = "https://www.giddyup.co.il"///#/closetoken?aaa=5454545&UserId=" + (string)Params.UserId

                };


                string DATA = Newtonsoft.Json.JsonConvert.SerializeObject(reqObjAshrai);

                var SlikaUrl = "https://demo.ezcount.co.il/api/payment/prepareSafeUrl/token";
                var client = new HttpClient();
                HttpContent content = new StringContent(DATA, UTF8Encoding.UTF8, "application/json");
                HttpResponseMessage messge = client.PostAsync(SlikaUrl, content).Result;

                dynamic response = "";
                if (messge.IsSuccessStatusCode)
                {
                    response = JsonConvert.DeserializeObject(messge.Content.ReadAsStringAsync().Result);

                }

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
                var SlikaUrl = "https://demo.ezcount.co.il/api/payment/chargeToken";
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
                        return sendInvoice(Params);

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
                            cc_payment_num = (int)Params.cc_payment_num,

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
                    DocType = ((bool)Params.isMasKabala) ? 320 : ((bool)Params.isKabala ? 400 : 405);
                }
                catch (Exception ex)
                {
                    Params.isMasKabala = false;
                }

                //
                var reqObj = new
                {
                    api_key = (string)Params.api_key,
                    api_email = (string)Params.api_email,
                    ua_uuid = (string)Params.ua_uuid,

                    developer_email = "tzahi556@gmail.com",
                    developer_phone = "0505913817",
                    type = DocType,
                    description = (bool)Params.isMasKabala ? "" : (string)Params.InvoiceDetails,
                    customer_name = (string)Params.customer_name,
                    customer_email = (string)Params.customer_email,
                    customer_address = (string)Params.customer_address,
                    comment = (string)Params.comment,

                    item = new dynamic[] {
                    new {
                        details = (string)Params.InvoiceDetails,
                        amount = 1,
                        price = (decimal)Params.payment,
                        price_inc_vat = true
                       }


                    },

                    payment = Payment,
                    //  details = Params.checks_date != null ? "תאריך פרעון צ'ק: " + ((DateTime)Params.checks_date).ToLocalTime().ToShortDateString() : "",
                    price_total = (decimal)Params.payment,
                };


                dynamic response = doc.execute(Constants.ENV_TEST, reqObj);

                return Ok(response);

                //}catch(Exception ex)
                //{
                //    dynamic response="";
                //    return Ok(response);
                //}
            }
        }
    }
}
