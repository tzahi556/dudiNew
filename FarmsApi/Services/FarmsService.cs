using FarmsApi.DataModels;
using RestSharp.Extensions;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading;
using System.Web.Http.Results;
using System.Xml;

namespace FarmsApi.Services
{
    public class FarmsService
    {
        public static List<Farm> GetFarms(bool deleted)
        {
            using (var Context = new Context())
            {
                var CurrentUser = UsersService.GetCurrentUser();
                if (CurrentUser.Role == "sysAdmin" || CurrentUser.Role == "vetrinar" || CurrentUser.Role == "shoeing")
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
                                     from um in Context.FarmInstructors.Where(x => x.UserId == u.Id).DefaultIfEmpty()//  on u.Id equals um.UserId
                                     where u.Role == "instructor" && u.Farm_Id == CurrentUserFarmId && !u.Deleted && u.IsMazkirut != 1
                                     select new { Id = u.Id, ClalitNumber = um.ClalitNumber, UserId = u.Id, InstructorName = u.FirstName + " " + u.LastName };


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

        

        public static KlalitHistoris SetKlalitHistoris(KlalitHistoris khv)
        {

          

                using (var Context = new Context())
                {
                    var item = khv;
                    FarmManagers fm = Context.FarmManagers.Where(x => x.FarmId == item.FarmId).FirstOrDefault();
                    IEnumerable<FarmInstructors> fi = GetMangerInstructorFarm();

                    FarmInstructors fs = fi.Where(y => y.UserId == item.Instructor_Id).FirstOrDefault();




                    string FirstName = item.UserName.Split(',')[0];
                    string LastName = item.UserName.Split(',')[1];
                    string DateStart = item.DateLesson.ToString("ddMMyyyy");

                    KlalitAPI.SupplierRequest kp = new KlalitAPI.SupplierRequest();

                    string xml = @"
                                    <XMLInput>
	                                    <ActionCode>11</ActionCode>
	                                    <UserName>" + fm.UserName + @"</UserName>
	                                    <Password>" + fm.Password + @"</Password>
	                                    <SupplierID>" + fm.SupplierID + @"</SupplierID>
	                                    <ClinicID>0</ClinicID>
	                                    <InsuredID>" + item.Taz + @"</InsuredID>
	                                    <InsuredFirstName>" + FirstName + @"</InsuredFirstName>
	                                    <InsuredLastName>" + LastName + @"</InsuredLastName>
	                                    <SectionCode>" + fm.SectionCode + @"</SectionCode>
	                                    <CareCode>" + fm.CareCode + @"</CareCode>
	                                    <CareDate>" + DateStart + @"</CareDate>
	                                    <DoctorID>" + fs.ClalitNumber + @"</DoctorID>
	                                    <OnlineServiceType>0</OnlineServiceType>
                                    </XMLInput>";
                    var resXML = kp.SendXML(xml); //203700003 //203700007

                    XmlDocument XmlRes = new XmlDocument();
                    XmlRes.LoadXml(resXML.ToString());

                    var Result = XmlRes.DocumentElement.SelectSingleNode("Result").InnerText;// 1 נקלטה
                    var AnswerDetails = XmlRes.DocumentElement.SelectSingleNode("AnswerDetails");// התשובה כאן
                    var ErrorDescription = XmlRes.DocumentElement.SelectSingleNode("ErrorDescription");// השגיאה כאן
                    var ClaimNumber = XmlRes.DocumentElement.SelectSingleNode("ClaimNumber");// מספר תביעה

                    KlalitHistoris kh = new KlalitHistoris();
                    kh.Id = 0;
                    kh.UserId = item.UserId;
                    kh.UserName = khv.UserName;
                    kh.FarmId = item.FarmId;
                    kh.DateSend = DateTime.Now;
                    kh.DateLesson = item.DateLesson;
                    kh.ClaimNumber = (ClaimNumber == null) ? "" : ClaimNumber.InnerText;
                    kh.ResultXML = resXML.ToString();
                    kh.ResultNumber = Result;
                    kh.Result = (Int32.Parse(Result) > 0) ? AnswerDetails.InnerText : ErrorDescription.InnerText;

                    if (kh.Result.Contains("קיימת פניה דומה")) kh.Result = "קיימת כבר תביעה לתאריך";


                    kh.Instructor_Id = item.Instructor_Id;
                    Context.KlalitHistoris.Add(kh);
                    Context.SaveChanges();
                    return kh;
                }
          
        }

        public static List<KlalitHistoris> GetKlalitHistoris(int FarmId, string startDate = null, string endDate = null, int? type = null, int? klalitId = null)
        {
            using (var Context = new Context())
            {


                if (type == null) type = -1;
                if (klalitId == null) klalitId = 0;


                SqlParameter FarmIdPara = new SqlParameter("FarmId", FarmId);
                SqlParameter StartDatePara = new SqlParameter("StartDate", startDate);
                SqlParameter EndDatePara = new SqlParameter("EndDate", endDate);
                SqlParameter TypePara = new SqlParameter("Type", type);
                SqlParameter KlalitIdPara = new SqlParameter("KlalitId", klalitId);

                var query = Context.Database.SqlQuery<KlalitHistoris>
                ("GetKlalitHistoris  @FarmId,@StartDate,@EndDate,@Type,@KlalitId", FarmIdPara, StartDatePara, EndDatePara, TypePara, KlalitIdPara);
                var Objects = query.ToList();

                if (type == 2 || type == 1)
                {


                    int res = SendToKlalitAPI(FarmId, Objects, Context);
                    if (res < 0)
                    {
                        return GetError(res);
                    }

                    return GetKlalitHistoris(FarmId, startDate, endDate, -1, 0);

                }







                return Objects;

            }
        }

        private static List<KlalitHistoris> GetError(int res)
        {

            List<KlalitHistoris> kllist = new List<KlalitHistoris>();

            KlalitHistoris kh = new KlalitHistoris();
            kh.Id = res;
            kh.UserId = 0;
            kh.FarmId = 0;
            kh.DateSend = DateTime.Now;
            kh.DateLesson = DateTime.Now;

            kllist.Add(kh);
            return kllist;




        }

        private static int SendToKlalitAPI(int FarmId, List<KlalitHistoris> Objects, Context Context)
        {
            int res = 0;
            FarmManagers fm = Context.FarmManagers.Where(x => x.FarmId == FarmId).FirstOrDefault();
            IEnumerable<FarmInstructors> fi = GetMangerInstructorFarm();
            if (fm != null)
            {
                // אין הגדרות למדריכים
                if (fi.Count() == 0) return -1;

                foreach (var item in Objects)
                {
                    FarmInstructors fs = fi.Where(y => y.UserId == item.Instructor_Id).FirstOrDefault();

                    if (fs == null) continue;


                    string FirstName = item.UserName.Split(',')[0];
                    string LastName = item.UserName.Split(',')[1];
                    string DateStart = item.DateLesson.ToString("ddMMyyyy");

                    KlalitAPI.SupplierRequest kp = new KlalitAPI.SupplierRequest();

                    string xml = @"
                                    <XMLInput>
	                                    <ActionCode>11</ActionCode>
	                                    <UserName>" + fm.UserName + @"</UserName>
	                                    <Password>" + fm.Password + @"</Password>
	                                    <SupplierID>" + fm.SupplierID + @"</SupplierID>
	                                    <ClinicID>0</ClinicID>
	                                    <InsuredID>" + item.Taz + @"</InsuredID>
	                                    <InsuredFirstName>" + FirstName + @"</InsuredFirstName>
	                                    <InsuredLastName>" + LastName + @"</InsuredLastName>
	                                    <SectionCode>" + fm.SectionCode + @"</SectionCode>
	                                    <CareCode>" + fm.CareCode + @"</CareCode>
	                                    <CareDate>" + DateStart + @"</CareDate>
	                                    <DoctorID>" + fs.ClalitNumber + @"</DoctorID>
	                                    <OnlineServiceType>0</OnlineServiceType>
                                    </XMLInput>";
                    var resXML = kp.SendXML(xml); //203700003 //203700007

                    XmlDocument XmlRes = new XmlDocument();
                    XmlRes.LoadXml(resXML.ToString());

                    var Result = XmlRes.DocumentElement.SelectSingleNode("Result").InnerText;// 1 נקלטה
                    var AnswerDetails = XmlRes.DocumentElement.SelectSingleNode("AnswerDetails");// התשובה כאן
                    var ErrorDescription = XmlRes.DocumentElement.SelectSingleNode("ErrorDescription");// השגיאה כאן
                    var ClaimNumber = XmlRes.DocumentElement.SelectSingleNode("ClaimNumber");// מספר תביעה

                    KlalitHistoris kh = new KlalitHistoris();
                    kh.Id = 0;
                    kh.UserId = item.UserId;
                    kh.FarmId = item.FarmId;
                    kh.DateSend = DateTime.Now;
                    kh.DateLesson = item.DateLesson;
                    kh.ClaimNumber = (ClaimNumber == null) ? "" : ClaimNumber.InnerText;
                    kh.ResultXML = resXML.ToString();
                    kh.ResultNumber = Result;
                    kh.Result = (Int32.Parse(Result) > 0) ? AnswerDetails.InnerText : ErrorDescription.InnerText;

                    if (kh.Result.Contains("קיימת פניה דומה")) kh.Result = "קיימת כבר תביעה לתאריך";


                    kh.Instructor_Id = item.Instructor_Id;
                    Context.KlalitHistoris.Add(kh);

                }

                Context.SaveChanges();
            }
            else
            {
                // אין הגדרות לחווה שם משתמש
                return -2;


            }



            return res;
        }
    }
}