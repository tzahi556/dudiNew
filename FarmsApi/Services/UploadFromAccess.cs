using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Web;
using FarmsApi.DataModels;
using System.Collections;

namespace FarmsApi.Services
{

    // הערות חשובות
    // כאשר מפעילים באמת צריך לדסבל את הטריגר שקולט מחיר וסוג שיעור TRG_InsertPriceLesson
    public class UploadFromAccess
    {
        public int FarmId = 67; //71 רנצו מניס
                                //67 חוות גרין פילדס חווה אמת
                                // טסט 59
                                //73 חניאל
        public DataSet ds = new DataSet();

        public Context Context = new Context();
        public string MailPrefix = "greenfields";
        // "greenfields";

        public string Hava = "greenfields";
        //"greenfields";
        //rancho
        //haniel
        public string ExpensWorkerId = "3";
        //3 חוות גרין פילדס חווה אמת
        //6 חוות רנצו
        // טסט 59
        public string HavaMacabi = "2";
        //מכבי בחווה גרין פילדס 2
        //מכבי בחווה רנצו 54
        //מכבי בחווה חניאל 2

        public string SectionCourse = "36";
        //קורס מדריכים בחווה גרין פילדס
        //קורס מדריכים בחווה רנצו 
        //קורס מדריכים בחווה חניאל 36
        public string SectionPension = "7";
        //פנסיון בחווה גרין פילדס
        //פנסיון  בחווה רנצו 
        //פנסיון בחווה חניאל 7 




        public UploadFromAccess()
        {
            String connection = @"Provider=Microsoft.Jet.OLEDB.4.0;" +
                                @"Data source=C:\Users\tzahi\Desktop\ORD\Database\Amir.mdb;Jet OLEDB:Database Password=diana;";




            ds.Tables.Add(new DataTable("Riders"));
            ds.Tables.Add(new DataTable("Instructor"));
            ds.Tables.Add(new DataTable("Lessons"));
            ds.Tables.Add(new DataTable("Organizations"));
            ds.Tables.Add(new DataTable("RiderParents"));
            ds.Tables.Add(new DataTable("Users"));
            ds.Tables.Add(new DataTable("Candidates"));
            ds.Tables.Add(new DataTable("Horses"));
            ds.Tables.Add(new DataTable("CustCorrespondence"));



            ////מקורי
            string sqlLessons = @"  
                                SELECT FarmDairy.*
                                FROM (FarmDairy INNER JOIN Riders ON Riders.RiderId = FarmDairy.RiderId)
                                Where  (Riders.Active=True Or Riders.LastUpdate > #2019-01-01 00:00:00#)
                                and FarmDairy.DayofRide  >= #2019-01-01 00:00:00#

                                Order by FarmDairy.DayofRide
                  ";



            // להביא רק שיעורים להשלמה
            //string sqlLessons = @" 
            //SELECT FarmDairy.*
            //                FROM(FarmDairy INNER JOIN Riders ON Riders.RiderId = FarmDairy.RiderId)
            //                    Where(Riders.Active = True)
            //                    and FarmDairy.DayofRide >= #2019-01-01 00:00:00#
            //                    and FarmDairy.forComp = 1

            //                    Order by FarmDairy.DayofRide
            //        ";

            string sqlRiders = @" SELECT * from Riders";

            string sqlInstructor = @" SELECT * from Workers ";

            string sqlOrganizations = @" SELECT * from Organizations ";

            string sqlRiderParents = @" SELECT * from RiderParents ";

            string sqlUsers = @" SELECT * from Users ";

            string sqlCandidates = @" SELECT * from Candidates ";

            string sqlHorses = @" SELECT * from Horses Where Active=True";

            string sqlKesher = @" SELECT * from CustCorrespondence where CustCorrespondence.DateofRecord >= #2019-01-01 00:00:00#";

            using (OleDbConnection conn = new OleDbConnection(connection))
            {
                conn.Open();

                OleDbDataAdapter da = new OleDbDataAdapter(sqlRiders, connection);
                da.Fill(ds, "Riders");

                da.SelectCommand.CommandText = sqlRiderParents;
                da.Fill(ds, "RiderParents");

                da.SelectCommand.CommandText = sqlOrganizations;
                da.Fill(ds, "Organizations");

                da.SelectCommand.CommandText = sqlInstructor;
                da.Fill(ds, "Instructor");

                da.SelectCommand.CommandText = sqlLessons;
                da.Fill(ds, "Lessons");

                da.SelectCommand.CommandText = sqlUsers;
                da.Fill(ds, "Users");

                da.SelectCommand.CommandText = sqlCandidates;
                da.Fill(ds, "Candidates");

                da.SelectCommand.CommandText = sqlHorses;
                da.Fill(ds, "Horses");

                da.SelectCommand.CommandText = sqlKesher;
                da.Fill(ds, "CustCorrespondence");

                conn.Close();



            }

        }


        public void UpdateUsersLessons()
        {

            //BuildEntityIdOnly();
            //  BuildUserRiders();
            //   BuildUserInstructors();
            //  BuildLessons();
            //   BuildStudentLessons();
            // BuildCommitmentsLessons();
            //   BuildPayments();

            //    BuildCandidates();

            // BuildPensionAndCourse();
            //   BuildHorses();
            BuildFixedPhone();
          //  BuildFixedBirthDate();
         //   BuildHashlama();

            //    BuildKesher();
        }

        private void BuildKesher()
        {
            foreach (DataRow item in ds.Tables[8].Rows)
            {



                string CustId = item["CustId"].ToString();
                string DateofRecord = item["DateofRecord"].ToString();
                string Subject = item["Subject"].ToString();
                string Contents = item["Contents"].ToString();
                string userId = item["userId"].ToString();

                if (string.IsNullOrEmpty(CustId) || string.IsNullOrEmpty(userId)) continue;
                int RiderIdInt = Int32.Parse(CustId);
                int WorkerIDInt = Int32.Parse(userId);

                var StudentObj = Context.Users.Where(x => x.Farm_Id == FarmId && x.EntityId == RiderIdInt && x.Role == "student").FirstOrDefault();
                var InstructorObj = Context.Users.Where(x => x.Farm_Id == FarmId && x.EntityId == WorkerIDInt && x.Role == "instructor").FirstOrDefault();

                if (StudentObj == null || InstructorObj == null) continue;

                Makavs ma = new Makavs();
                ma.UserId = StudentObj.Id;
                ma.UserWrite = InstructorObj.FirstName + " " + InstructorObj.LastName;
                ma.Subject = Subject;
                ma.Desc = Contents;
                ma.Date = GetDateFromAccess(DateofRecord, "00:00");

                Context.Makavs.Add(ma);
            }

            Context.SaveChanges();
        }

        private void BuildHashlama()
        {
            string RiderId, WorkerID, DayofRide, HourofRide, HorseId, TypeofRiders, financier;

            foreach (DataRow item in ds.Tables[2].Rows)
            {
                RiderId = item["RiderId"].ToString();
                int RiderIdInt = Int32.Parse(RiderId);

                WorkerID = item["WorkerID"].ToString();
                int WorkerIDInt = Int32.Parse(WorkerID);

                DayofRide = item["DayofRide"].ToString();
                HourofRide = item["HourofRide"].ToString();

                var StudentObj = Context.Users.Where(x => x.Farm_Id == FarmId && x.EntityId == RiderIdInt && x.Role == "student").FirstOrDefault();
                var InstructorObj = Context.Users.Where(x => x.Farm_Id == FarmId && x.EntityId == WorkerIDInt && x.Role == "instructor").FirstOrDefault();

                if (StudentObj == null || InstructorObj == null) continue;
                DateTime LessonsStart = GetDateFromAccess(DayofRide, HourofRide);
                var LessonEN = Context.Lessons.Where(x => x.Instructor_Id == InstructorObj.Id && x.Start == LessonsStart).FirstOrDefault();
                if (LessonEN != null)
                {
                    var StudentLessonsEN = Context.StudentLessons.Where(x => x.Lesson_Id == LessonEN.Id && x.User_Id == StudentObj.Id).FirstOrDefault();
                    if (StudentLessonsEN != null)
                    {
                        StudentLessonsEN.Status = "completionReq";
                        StudentLessonsEN.IsComplete = 1;
                        Context.Entry(StudentLessonsEN).State = System.Data.Entity.EntityState.Modified;
                    }
                }

            }


            Context.SaveChanges();
        }

        private void BuildFixedPhone()
        {

            try
            {

                string RiderId,

                    PhonHome = "",
                    SelolarPhon = "",
                    PhonAnother = "",
                    PhoneNumber = "",
                    PhoneNumber2 = "";


                foreach (DataRow item in ds.Tables[0].Rows)
                {






                    RiderId = item["RiderId"].ToString();
                    int RiderIdInt = Int32.Parse(RiderId);

                    PhonHome = item["PhonHome"].ToString();
                    SelolarPhon = item["SelolarPhon"].ToString();
                    PhonAnother = item["PhonAnother"].ToString();



                    var ParentDetalis = GetParentDetalis(RiderId);
                    if (ParentDetalis != null)
                    {
                        //ParentName = ParentDetalis["FatherName"].ToString();
                        //ParentName2 = ParentDetalis["MotherName"].ToString();

                        //  AnotherEmail = GetEmailMotherFather(ParentDetalis);
                        var nomobileFather = ParentDetalis["PhonFather"].ToString();
                        var nomobileMother = ParentDetalis["PhonMother"].ToString();

                        PhoneNumber = ParentDetalis["mobileFather"].ToString();
                        PhoneNumber2 = ParentDetalis["mobileMother"].ToString(); 

                        if (string.IsNullOrEmpty(PhoneNumber)) PhoneNumber = nomobileFather;
                        if (string.IsNullOrEmpty(PhoneNumber2)) PhoneNumber2 = nomobileMother;
                    }




                    if (string.IsNullOrEmpty(PhoneNumber.Trim()))
                    {
                        PhoneNumber = (string.IsNullOrEmpty(SelolarPhon)) ? ((string.IsNullOrEmpty(PhonAnother)) ? PhonHome : PhonAnother) : SelolarPhon;
                    }

                    if (string.IsNullOrEmpty(PhoneNumber2.Trim()))
                    {

                        if (PhoneNumber == SelolarPhon)
                            PhoneNumber2 = (string.IsNullOrEmpty(PhonAnother)) ? PhonHome : PhonAnother;
                        else if (PhoneNumber == PhonAnother)
                            PhoneNumber2 = (string.IsNullOrEmpty(SelolarPhon)) ? PhonHome : SelolarPhon;
                        else if (PhoneNumber == PhonHome)
                            PhoneNumber2 = (string.IsNullOrEmpty(SelolarPhon)) ? PhonAnother : SelolarPhon;
                        else
                            PhoneNumber2 = (string.IsNullOrEmpty(SelolarPhon)) ? ((string.IsNullOrEmpty(PhonAnother)) ? PhonHome : PhonAnother) : SelolarPhon;



                    }


                    var UserEN = Context.Users.Where(x => x.Farm_Id == FarmId && x.Role == "student" && x.EntityId == RiderIdInt).FirstOrDefault();
                    if (UserEN != null)
                    {

                        UserEN.PhoneNumber = PhoneNumber;
                        UserEN.PhoneNumber2 = PhoneNumber2;
                        Context.Entry(UserEN).State = System.Data.Entity.EntityState.Modified;
                    }

                }


                Context.SaveChanges();

            }
            catch (Exception ex)
            {


            }

        }

        private void BuildFixedBirthDate()
        {

            try
            {

                string RiderId,

                    BirthDate = "";
                   


                foreach (DataRow item in ds.Tables[0].Rows)
                {






                    RiderId = item["RiderId"].ToString();
                    int RiderIdInt = Int32.Parse(RiderId);

                    BirthDate = item["BirthDay"].ToString();
                   



               

                    var UserEN = Context.Users.Where(x => x.Farm_Id == FarmId && x.Role == "student" && x.EntityId == RiderIdInt).FirstOrDefault();
                    if (UserEN != null)
                    {

                        UserEN.BirthDate = GetDateTimeParse(BirthDate);
                        Context.Entry(UserEN).State = System.Data.Entity.EntityState.Modified;
                    }

                }


                Context.SaveChanges();

            }
            catch (Exception ex)
            {


            }

        }
        private void BuildHorses()
        {
            foreach (DataRow item in ds.Tables[7].Rows)
            {



                string HorseDec = item["HorseDec"].ToString();
                string Active = item["Active"].ToString();
                string DateofBirth = item["DateofBirth"].ToString();
                string pension = item["pension"].ToString();
                string Category = item["Category"].ToString();
                string species = item["species"].ToString();


                // string Meta = @"{""BirthDate"":""{0}"",""PensionStartDate"":""{1}"",""Treatments"":[],""Pregnancies"":[],""Active"":""active"",""Gender"":""{2}"",""Ownage"":""{3}"",""Vaccinations"":[]}";

                string Output = String.Format("\"BirthDate\":\"{0}\",\"PensionStartDate\":\"{1}\",\"Treatments\":[],\"Pregnancies\":[],\"Active\":\"active\",\"Gender\":\"{2}\",\"Ownage\":\"{3}\",\"Vaccinations\":[]", DateofBirth, DateofBirth, GetHorsesGender(species), GetHorsesOwnage(Category, pension));

                Horse hr = new Horse();
                hr.Deleted = false;
                hr.Farm_Id = FarmId;
                hr.Name = HorseDec;
                hr.Meta = "{" + Output + "}";
                Context.Horses.Add(hr);


            }


            Context.SaveChanges();
        }

        private string GetHorsesOwnage(string category, string pension)
        {
            if (pension != "True")
                return "school";
            else
            {

                if (category == "4")
                    return "pensionEnglish";
                if (category == "5")
                    return "pensionMaravi";
                if (category == "6")
                    return "pensionMere";
                if (category == "7")
                    return "pensionKating";
            }

            return "pension";
            //4   פנסיון אינגליש
            //5   פנסיון ווסטרן
            //6   פנסיון מרעה
            //7   קאטינג

            //< option value = "pension" > פנסיון </ option >
            //< option value = "school" > בית ספר </ option >
            //< option value = "farm" > חווה </ option >
            //< option value = "pensionEnglish" > פנסיון אינגליש </ option >
            //< option value = "pensionMaravi" > פנסיון מערבי </ option >
            //< option value = "pensionKating" > פנסיון קאטינג </ option >
            //< option value = "pensionMere" > פנסיון מרעה </ option >

        }

        private string GetHorsesGender(string species)
        {
            //< option value = "male" > זכר </ option >
            //< option value = "female" > נקבה </ option >
            //< option value = "castrated" > מסורס </ option >

            if (string.IsNullOrEmpty(species) || species == "מסורס")
                return "castrated";

            if (species == "זכר")
                return "male";
            else
                return "female";
        }

        private void BuildPensionAndCourse()
        {
            foreach (DataRow item in ds.Tables[0].Rows)
            {
                string Section = item["Section"].ToString();
                string RiderId = item["RiderId"].ToString();
                int RiderIdInt = Int32.Parse(RiderId);
                var UserEN = Context.Users.Where(x => x.Farm_Id == FarmId && x.Role == "student" && x.EntityId == RiderIdInt).FirstOrDefault();
                if (UserEN != null && (Section == SectionCourse || Section == SectionPension))
                {
                    if (Section == SectionCourse)
                        UserEN.Style = "course";

                    if (Section == SectionPension)
                        UserEN.Style = "horseHolder";


                    Context.Entry(UserEN).State = System.Data.Entity.EntityState.Modified;

                    var PaymentsList = Context.Payments.Where(x => x.UserId == UserEN.Id).ToList();
                    foreach (Payments pay in PaymentsList)
                    {
                        pay.lessons = 0;
                        Context.Entry(pay).State = System.Data.Entity.EntityState.Modified;


                        Expenses ex = new Expenses();
                        ex.Id = 0;
                        ex.Paid = pay.InvoiceNum;
                        ex.Price = pay.InvoiceSum;
                        ex.Sum = pay.InvoiceSum;
                        ex.UserId = pay.UserId;
                        ex.Date = pay.Date;
                        ex.Details = pay.InvoiceDetails.Replace(pay.InvoiceNum, "");

                        Context.Expenses.Add(ex);

                    }


                    var StudentLessonsList = Context.StudentLessons.Where(x => x.User_Id == UserEN.Id).ToList();

                    foreach (StudentLessons stl in StudentLessonsList)
                    {
                        var LessonEN = Context.Lessons.Where(x => x.Id == stl.Lesson_Id).FirstOrDefault();
                        Context.Lessons.Remove(LessonEN);

                    }


                    Context.StudentLessons.RemoveRange(StudentLessonsList);

                }
            }

            Context.SaveChanges();
        }
        private void BuildCandidates()
        {
            foreach (DataRow item in ds.Tables[6].Rows)
            {



                string CandidateID = item["CandidateID"].ToString();
                string Intek = item["DirectingCause"].ToString();
                string MatrotAl = item["Remark"].ToString();
                int RiderIdInt = Int32.Parse(CandidateID);

                var UserE = Context.Users.Where(x => x.Farm_Id == FarmId && x.Role == "student" && x.EntityId == RiderIdInt).FirstOrDefault();
                if (UserE != null)
                {
                    UserE.Intek = Intek;
                    UserE.MatrotAl = MatrotAl;

                    Context.Entry(UserE).State = System.Data.Entity.EntityState.Modified;
                }



            }


            Context.SaveChanges();


        }
        private void BuildEntityIdOnly()
        {

            foreach (DataRow item in ds.Tables[0].Rows)
            {
                string FirstName = GetRightName(item["PrivateName"].ToString());
                string LastName = GetRightName(item["FamilyName"].ToString());
                string RiderId = item["RiderId"].ToString();
                int RiderIdInt = Int32.Parse(RiderId);
                var UserEN = Context.Users.Where(x => x.Farm_Id == FarmId && x.Role == "student" && x.FirstName == FirstName && x.LastName == LastName).FirstOrDefault();
                if (UserEN != null)
                {
                    UserEN.EntityId = RiderIdInt;
                    Context.Entry(UserEN).State = System.Data.Entity.EntityState.Modified;
                }
            }


            foreach (DataRow item in ds.Tables[1].Rows)
            {
                string FirstName = GetRightName(item["FirstName"].ToString());
                string LastName = GetRightName(item["FamilyName"].ToString().Replace("_", ""));
                string WorkerID = item["WorkerID"].ToString();
                int WorkerIDInt = Int32.Parse(WorkerID);
                var UserEN = Context.Users.Where(x => x.Farm_Id == FarmId && x.Role == "instructor" && x.FirstName == FirstName && x.LastName == LastName).FirstOrDefault();
                if (UserEN != null)
                {
                    UserEN.EntityId = WorkerIDInt;
                    Context.Entry(UserEN).State = System.Data.Entity.EntityState.Modified;
                }

            }


            Context.SaveChanges();
        }
        private void BuildUserRiders()
        {

            try
            {

                string Role = "student", Email, Password, FirstName, LastName, Deleted = "0", Active, RiderId,
                    IdNumber, BirthDate, ParentName2 = "", ParentName = "", Address, PhoneNumber = "",
                   PhoneNumber2 = "", AnotherEmail = "", PhonHome = "", SelolarPhon = "", PhonAnother = "",
                   Style = "treatment", TeamMember = "no", Cost, PayType, Details, HMO, BalanceDetails;

                foreach (DataRow item in ds.Tables[0].Rows)
                {



                    FirstName = GetRightName(item["PrivateName"].ToString());
                    LastName = GetRightName(item["FamilyName"].ToString());
                    Active = (item["Active"].ToString() == "True") ? "active" : "notActive"; //(Active == "True") ? "active" : "notActive"; item["Active"].ToString();
                    Address = item["Address"].ToString() + " " + item["City"].ToString();
                    PhonHome = item["PhonHome"].ToString();
                    SelolarPhon = item["SelolarPhon"].ToString();
                    PhonAnother = item["PhonAnother"].ToString();

                    RiderId = item["RiderId"].ToString();
                    int RiderIdInt = Int32.Parse(RiderId);

                    if (string.IsNullOrEmpty(item["Id"].ToString()) || item["Id"].ToString() == "0")
                    {
                        IdNumber = (Hava + RiderId);
                        Password = (Hava + RiderId);
                        Email = (Hava + RiderId); // אם זה תלמיד
                    }
                    else
                    {
                        IdNumber = item["Id"].ToString();
                        Password = item["Id"].ToString();
                        Email = item["Id"].ToString(); // אם זה תלמיד

                    }

                    DateTime? LastUpdate = GetDateTimeParse(item["LastUpdate"].ToString());

                    BirthDate = item["BirthDay"].ToString();
                    PayType = item["PayArrangement"].ToString();// הסדר תשלומים 0 = רגיל  1 = חודשי

                    Style = GetStyleHava(item["financier"].ToString());
                    HMO = GetHMO(Style, item["financier"].ToString());// מטבלת Organzion

                    var ParentDetalis = GetParentDetalis(RiderId);
                    if (ParentDetalis != null)
                    {
                        ParentName = ParentDetalis["FatherName"].ToString();
                        ParentName2 = ParentDetalis["MotherName"].ToString();

                        AnotherEmail = GetEmailMotherFather(ParentDetalis);

                        var nomobileFather = ParentDetalis["PhonFather"].ToString();
                        var nomobileMother = ParentDetalis["PhonMother"].ToString();

                        PhoneNumber = ParentDetalis["mobileFather"].ToString();
                        PhoneNumber2 = ParentDetalis["mobileMother"].ToString();

                        if (string.IsNullOrEmpty(PhoneNumber)) PhoneNumber = nomobileFather;
                        if (string.IsNullOrEmpty(PhoneNumber2)) PhoneNumber2 = nomobileMother;

                    }



                    if (string.IsNullOrEmpty(PhoneNumber.Trim()))
                    {
                        PhoneNumber = (string.IsNullOrEmpty(SelolarPhon)) ? ((string.IsNullOrEmpty(PhonAnother)) ? PhonHome : PhonAnother) : SelolarPhon;
                    }

                    if (string.IsNullOrEmpty(PhoneNumber2.Trim()))
                    {

                        if (PhoneNumber == SelolarPhon)
                            PhoneNumber2 = (string.IsNullOrEmpty(PhonAnother)) ? PhonHome : PhonAnother;
                        else if (PhoneNumber == PhonAnother)
                            PhoneNumber2 = (string.IsNullOrEmpty(SelolarPhon)) ? PhonHome : SelolarPhon;
                        else if (PhoneNumber == PhonHome)
                            PhoneNumber2 = (string.IsNullOrEmpty(SelolarPhon)) ? PhonAnother : SelolarPhon;
                        else
                            PhoneNumber2 = (string.IsNullOrEmpty(SelolarPhon)) ? ((string.IsNullOrEmpty(PhonAnother)) ? PhonHome : PhonAnother) : SelolarPhon;



                    }

                    if (Active == "notActive" && LastUpdate < new DateTime(2019, 01, 01)) continue;

                    var UserEN = Context.Users.Where(x => x.Farm_Id == FarmId && x.Role == "student" && x.EntityId == RiderIdInt).FirstOrDefault();
                    if (UserEN == null)
                    {
                        User UserE = new User();

                        UserE.Farm_Id = FarmId;
                        UserE.Role = Role;
                        UserE.Deleted = false;
                        UserE.EntityId = RiderIdInt;

                        UserE.FirstName = FirstName;
                        UserE.LastName = LastName;
                        UserE.Active = Active;
                        UserE.Address = Address;
                        UserE.Password = Password;
                        UserE.IdNumber = IdNumber;
                        UserE.Email = Email;

                        //if (GetDateTimeParse(BirthDate) != null)
                        UserE.BirthDate = GetDateTimeParse(BirthDate);// DateTime.Parse(BirthDate);

                        UserE.PayType = (PayType == "0") ? "lessonCost" : "monthCost";
                        UserE.Style = Style;
                        UserE.HMO = HMO;


                        UserE.ParentName = ParentName;
                        UserE.ParentName2 = ParentName2;
                        UserE.PhoneNumber = PhoneNumber;
                        UserE.PhoneNumber2 = PhoneNumber2;
                        UserE.AnotherEmail = AnotherEmail;
                        UserE.Cost = GetCostByHMO(HMO, item["Lasttariff"].ToString());
                        Context.Users.Add(UserE);
                    }
                    //else
                    //{
                    //    var UserE = UserEN;

                    //    UserE.Farm_Id = FarmId;
                    //    UserE.Role = Role;
                    //    UserE.Deleted = false;

                    //    UserE.FirstName = FirstName;
                    //    UserE.LastName = LastName;
                    //    UserE.Active = (Active == "True") ? "active" : "notActive";
                    //    UserE.Address = Address;
                    //    UserE.Password = Password;
                    //    UserE.IdNumber = IdNumber;
                    //    UserE.Email = Email;
                    //    UserE.BirthDate = GetDateTimeParse(BirthDate);
                    //    UserE.PayType = (PayType == "0") ? "lessonCost" : "monthCost";
                    //    UserE.Style = Style;
                    //    UserE.HMO = HMO;


                    //    UserE.ParentName = ParentName;
                    //    UserE.ParentName2 = ParentName2;
                    //    UserE.PhoneNumber = PhoneNumber;
                    //    UserE.PhoneNumber2 = PhoneNumber2;
                    //    UserE.AnotherEmail = AnotherEmail;
                    //    UserE.Cost = GetCostByHMO(HMO, item["Lasttariff"].ToString());


                    //    Context.Entry(UserE).State = System.Data.Entity.EntityState.Modified;
                    //}

                }


                Context.SaveChanges();

            }
            catch (Exception ex)
            {


            }

        }

        private void BuildUserInstructors()
        {
            try
            {
                string Role = "instructor", Email, Password, FirstName, LastName, Active, WorkerID,
                   DepartmetId, IdNumber, BirthDate, ParentName2, ParentName, Address, PhoneNumber,
                   PhoneNumber2, AnotherEmail
                  , Cost, PayType, Details, HMO, BalanceDetails;

                bool Deleted = false;

                foreach (DataRow item in ds.Tables[1].Rows)
                {
                    FirstName = GetRightName(item["FirstName"].ToString());
                    LastName = GetRightName(item["FamilyName"].ToString().Replace("_", ""));
                    Active = (item["Active"].ToString() == "True") ? "active" : "notActive";
                   
                    
                    Deleted = (Active == "active") ? false : true;
                    Address = item["Address"].ToString() + " " + item["City"].ToString();
                    IdNumber = item["IDNmber"].ToString();
                    Password = "123";


                    WorkerID = item["WorkerID"].ToString();
                    int WorkerIDInt = Int32.Parse(WorkerID);
                    Email = (string.IsNullOrEmpty(item["Email"].ToString())) ? (MailPrefix + WorkerID + "@gmail.com") : (item["Email"].ToString()); // אם זה מדריך
                    PhoneNumber = item["MobilePhon"].ToString();

                    DepartmetId = item["DepartmetId"].ToString();

                    // רק מדריך פעיל וממחלקה 1 שזה מדריך רכיבה
                    if (DepartmetId != "1") continue;

                    var random = new Random();
                    var color = String.Format("#{0:X6}", random.Next(0x1000000)); // = "#A197B9"

                    var UserEN = Context.Users.Where(x => x.Farm_Id == FarmId && x.Role == "instructor" && x.EntityId == WorkerIDInt).FirstOrDefault();
                    if (UserEN == null)
                    {
                        User UserE = new User();
                        UserE.Farm_Id = FarmId;
                        UserE.Role = Role;
                        UserE.Deleted = Deleted;
                        UserE.EntityId = WorkerIDInt;
                        UserE.FirstName = FirstName;
                        UserE.LastName = LastName;
                        UserE.Active = (Active == "True") ? "active" : "notActive";
                        UserE.Address = Address;
                        UserE.Password = Password;
                        UserE.IdNumber = IdNumber;
                        UserE.Email = Email;
                        UserE.PhoneNumber = PhoneNumber;
                        UserE.EventsColor = color;
                        Context.Users.Add(UserE);
                    }
                    //else
                    //{
                    //    var UserE = UserEN;

                    //    UserE.Farm_Id = FarmId;
                    //    UserE.Role = Role;
                    //    UserE.Deleted = Deleted;

                    //    UserE.FirstName = FirstName;
                    //    UserE.LastName = LastName;
                    //    UserE.Active = (Active == "True") ? "active" : "notActive";
                    //    UserE.Address = Address;
                    //    UserE.Password = Password;
                    //    UserE.IdNumber = IdNumber;
                    //    UserE.Email = Email;
                    //    UserE.PhoneNumber = PhoneNumber;


                    //    Context.Entry(UserE).State = System.Data.Entity.EntityState.Modified;
                    //}


                }


                Context.SaveChanges();
            }
            catch (Exception ex)
            {


            }

        }

        private void BuildLessons()
        {
            try
            {
                string RiderId, WorkerID, DayofRide, HourofRide, HorseId, TypeofRiders,
                executed, UnexecutedReson, Price, invoice, TypeForBookkeeping, financPrecent;
                foreach (DataRow item in ds.Tables[2].Rows)
                {
                    RiderId = item["RiderId"].ToString();
                    int RiderIdInt = Int32.Parse(RiderId);

                    WorkerID = item["WorkerID"].ToString();
                    int WorkerIDInt = Int32.Parse(WorkerID);

                    DayofRide = item["DayofRide"].ToString();
                    HourofRide = item["HourofRide"].ToString();
                    HorseId = item["HorseId"].ToString();
                    TypeofRiders = item["TypeofRiders"].ToString();
                    executed = item["executed"].ToString();
                    UnexecutedReson = item["UnexecutedReson"].ToString();

                    Price = item["Price"].ToString();
                    financPrecent = item["financPrecent"].ToString();

                    invoice = item["invoice"].ToString();
                    TypeForBookkeeping = item["TypeForBookkeeping"].ToString();

                    var StudentObj = Context.Users.Where(x => x.Farm_Id == FarmId && x.EntityId == RiderIdInt && x.Role == "student").FirstOrDefault();
                    var InstructorObj = Context.Users.Where(x => x.Farm_Id == FarmId && x.EntityId == WorkerIDInt && x.Role == "instructor").FirstOrDefault();
                    if (StudentObj == null || InstructorObj == null) continue;


                    DateTime LessonsStart = GetDateFromAccess(DayofRide, HourofRide);
                    DateTime LessonsEnd = LessonsStart.AddMinutes(30); //GetDateFromAccess(DayofRide, HourofRide);

                    // int LessId;
                    //var LessonEN = Context.Lessons.Where(x => x.Instructor_Id == InstructorObj.Id && x.Start == LessonsStart).FirstOrDefault();
                    //if (LessonEN == null)
                    //{
                    Lesson Less = new Lesson();
                    Less.Instructor_Id = InstructorObj.Id;
                    Less.ParentId = 0;
                    Less.Start = LessonsStart;
                    Less.End = LessonsEnd;
                    Less.Details = UnexecutedReson;
                    Context.Lessons.Add(Less);


                    // }

                }

                Context.SaveChanges();



            }
            catch (Exception ex)
            {


            }
        }

        private void BuildStudentLessons()
        {
            Hashtable hs = new Hashtable();
            try
            {
                string RiderId, WorkerID, DayofRide, HourofRide, HorseId, TypeofRiders, financier,
                executed, UnexecutedReson, Price, invoice, TypeForBookkeeping, financPrecent;
                foreach (DataRow item in ds.Tables[2].Rows)
                {
                    RiderId = item["RiderId"].ToString();
                    int RiderIdInt = Int32.Parse(RiderId);

                    WorkerID = item["WorkerID"].ToString();
                    int WorkerIDInt = Int32.Parse(WorkerID);

                    DayofRide = item["DayofRide"].ToString();
                    HourofRide = item["HourofRide"].ToString();
                    HorseId = item["HorseId"].ToString();
                    TypeofRiders = item["TypeofRiders"].ToString();
                    executed = item["executed"].ToString();
                    UnexecutedReson = item["UnexecutedReson"].ToString();

                    Price = item["Price"].ToString();
                    financPrecent = item["financPrecent"].ToString();
                    financier = item["financier"].ToString();
                    invoice = item["invoice"].ToString();
                    TypeForBookkeeping = item["TypeForBookkeeping"].ToString();

                    var StudentObj = Context.Users.Where(x => x.Farm_Id == FarmId && x.EntityId == RiderIdInt && x.Role == "student").FirstOrDefault();
                    var InstructorObj = Context.Users.Where(x => x.Farm_Id == FarmId && x.EntityId == WorkerIDInt && x.Role == "instructor").FirstOrDefault();


                    if (StudentObj == null || InstructorObj == null) continue;


                    DateTime LessonsStart = GetDateFromAccess(DayofRide, HourofRide);
                    DateTime LessonsEnd = LessonsStart.AddMinutes(30); //GetDateFromAccess(DayofRide, HourofRide);
                                                                       //  var LessonEN = Context.Lessons.Where(x => x.Instructor_Id == InstructorObj.Id && x.Start == LessonsStart).FirstOrDefault();



                    // מכניס מחיר לשיעור השלמה
                    if (TypeofRiders == "1")
                    {
                        foreach (DictionaryEntry de in hs)
                        {
                            if (UnexecutedReson.Contains(de.Key.ToString()))
                            {
                                Price = de.Value.ToString();

                            }
                        }

                        if (Price == "0") Price = StudentObj.Cost.ToString();

                    }


                    //הוצאות נוספות
                    double? FixedPrice = double.Parse(Price) - double.Parse(financPrecent);

                    // אם מכבימתכניס 0
                    if (financier == HavaMacabi)
                    {
                        FixedPrice = 0;
                    }
                    //else
                    //{
                    //    if (WorkerID != "3") // אם יש לי חשבונית שאני אביא מהסכום
                    //        FixedPrice = StudentObj.Cost;
                    //}

                    // זה הוצאות אחרות 3
                    if (WorkerID != ExpensWorkerId)
                    {

                        int LessId;

                        #region Lessons
                        var LessonEN = Context.Lessons.Where(x => x.Instructor_Id == InstructorObj.Id && x.Start == LessonsStart).FirstOrDefault();
                        if (LessonEN == null)
                        {
                            Lesson Less = new Lesson();
                            Less.Instructor_Id = InstructorObj.Id;
                            Less.ParentId = 0;
                            Less.Start = LessonsStart;
                            Less.End = LessonsEnd;

                            Context.Lessons.Add(Less);
                            Context.SaveChanges();
                            LessId = Less.Id;
                        }
                        else
                        {
                            LessId = LessonEN.Id;

                        }



                        #endregion

                        #region StudentLessons
                        try
                        {

                            var StudentLessonsEN = Context.StudentLessons.Where(x => x.Lesson_Id == LessId && x.User_Id == StudentObj.Id).FirstOrDefault();
                            if (StudentLessonsEN == null)
                            {
                                StudentLessons StudLess = new StudentLessons();
                                StudLess.User_Id = StudentObj.Id;
                                StudLess.Lesson_Id = LessId;
                                StudLess.LessonPayType = Int32.Parse(TypeForBookkeeping) + 1;
                                StudLess.Price = FixedPrice;
                                StudLess.OfficeDetails = UnexecutedReson;
                                if (DateTime.Now > LessonsStart)
                                {


                                    StudLess.Status = (executed == "True") ? "attended" : "notAttended";
                                    // אם לא הגיע ויש חשבונית שמור את המחיר והחשבונית ואם יימצא בשורות הבאות שיעור השלמה הוא יעדכן שם מחיר כי 
                                    // כשיש שיעור השלמה המחיר הוא 0
                                    if (StudLess.Status == "notAttended" && financier != "2" && invoice != "0" && !hs.ContainsKey(invoice))
                                    {

                                        hs.Add(invoice, FixedPrice);

                                    }

                                }

                                Context.StudentLessons.Add(StudLess);
                                Context.SaveChanges();

                            }
                            else
                            {
                                StudentLessonsEN.User_Id = StudentObj.Id;
                                StudentLessonsEN.Lesson_Id = LessonEN.Id;
                                StudentLessonsEN.LessonPayType = Int32.Parse(TypeForBookkeeping) + 1;
                                StudentLessonsEN.Price = FixedPrice;
                                StudentLessonsEN.OfficeDetails = UnexecutedReson;
                                if (DateTime.Now > LessonsStart)
                                {
                                    StudentLessonsEN.Status = (executed == "True") ? "attended" : "notAttended";
                                }
                                Context.Entry(StudentLessonsEN).State = System.Data.Entity.EntityState.Modified;
                                Context.SaveChanges();

                            }
                        }
                        catch (Exception ex)
                        {


                        }


                        #endregion

                        #region Commitments
                        try
                        {
                            // אם מכבי
                            if (financier == HavaMacabi && TypeofRiders == "0") // אם זה לא שיעור השלמה
                            {
                                var CommitmentsUser = Context.Commitments.Where(x => x.HMO == "maccabiSheli" && x.UserId == StudentObj.Id).FirstOrDefault();
                                if (CommitmentsUser == null)
                                {
                                    Commitments com = new Commitments();
                                    com.Date = LessonsStart;
                                    com.HMO = "maccabiSheli";
                                    com.Number = "התחייבות מכבי";
                                    com.UserId = StudentObj.Id;
                                    com.Qty = 1;
                                    Context.Commitments.Add(com);
                                    Context.SaveChanges();
                                }
                                else
                                {
                                    CommitmentsUser.Qty += 1;
                                    Context.Entry(CommitmentsUser).State = System.Data.Entity.EntityState.Modified;
                                    Context.SaveChanges();
                                }

                            }
                        }
                        catch (Exception ex)
                        {


                        }


                        #endregion
                    }
                    else
                    {
                        #region Expenses

                        Expenses Exp = new Expenses();
                        Exp.UserId = StudentObj.Id;
                        Exp.Date = LessonsStart;
                        Exp.Price = FixedPrice;
                        Exp.Sum = FixedPrice;
                        Exp.Details = UnexecutedReson;
                        Exp.Paid = invoice;
                        Context.Expenses.Add(Exp);
                        Context.SaveChanges();


                        #endregion

                    }


                    #region Payments
                    try
                    {
                        // חשבונית
                        if (!string.IsNullOrEmpty(invoice) && invoice != "0")
                        {
                            var invoiceUser = Context.Payments.Where(x => x.InvoiceNum == invoice && x.UserId == StudentObj.Id).FirstOrDefault();
                            if (invoiceUser == null)
                            {
                                Payments pay = new Payments();

                                pay.UserId = StudentObj.Id;
                                pay.Date = LessonsStart;
                                pay.InvoicePdf = "";
                                pay.InvoiceNum = invoice;
                                pay.InvoiceDetails = invoice + " חשבונית " + " " + UnexecutedReson;

                                //pay.canceled = CheckifExistStr(Item["canceled"]);
                                pay.Price = FixedPrice;
                                pay.InvoiceSum = FixedPrice;

                                pay.payment_type = "1";
                                if (WorkerID != ExpensWorkerId) pay.lessons = 1;
                                //pay.month = CheckifExistDate(Item["month"]);
                                //pay.untilmonth = CheckifExistDate(Item["untilmonth"]);


                                Context.Payments.Add(pay);
                                Context.SaveChanges();


                            }
                            else
                            {
                                invoiceUser.Price = FixedPrice;
                                invoiceUser.InvoiceSum += FixedPrice;
                                if (WorkerID != ExpensWorkerId) invoiceUser.lessons += 1;
                                Context.Entry(invoiceUser).State = System.Data.Entity.EntityState.Modified;
                                Context.SaveChanges();
                            }
                        }



                    }
                    catch (Exception ex)
                    {


                    }

                    #endregion

                }//end loop


            }
            catch (Exception ex)
            {


            }
        }

        private void BuildCommitmentsLessons()
        {
            try
            {
                string RiderId, WorkerID, DayofRide, HourofRide, HorseId, TypeofRiders,
                executed, UnexecutedReson, Price, invoice, TypeForBookkeeping, financPrecent, financier;
                foreach (DataRow item in ds.Tables[2].Rows)
                {
                    RiderId = item["RiderId"].ToString();
                    int RiderIdInt = Int32.Parse(RiderId);

                    WorkerID = item["WorkerID"].ToString();
                    int WorkerIDInt = Int32.Parse(WorkerID);

                    DayofRide = item["DayofRide"].ToString();
                    HourofRide = item["HourofRide"].ToString();
                    HorseId = item["HorseId"].ToString();
                    TypeofRiders = item["TypeofRiders"].ToString();
                    executed = item["executed"].ToString();
                    UnexecutedReson = item["UnexecutedReson"].ToString();
                    financier = item["financier"].ToString();
                    Price = item["Price"].ToString();
                    financPrecent = item["financPrecent"].ToString();

                    invoice = item["invoice"].ToString();
                    TypeForBookkeeping = item["TypeForBookkeeping"].ToString();

                    var StudentObj = Context.Users.Where(x => x.Farm_Id == FarmId && x.EntityId == RiderIdInt && x.Role == "student").FirstOrDefault();
                    var InstructorObj = Context.Users.Where(x => x.Farm_Id == FarmId && x.EntityId == WorkerIDInt && x.Role == "instructor").FirstOrDefault();


                    if (StudentObj == null || InstructorObj == null) continue;


                    DateTime LessonsStart = GetDateFromAccess(DayofRide, HourofRide);

                    // אם מכבי
                    if (financier == "2")
                    {
                        var CommitmentsUser = Context.Commitments.Where(x => x.HMO == "maccabiSheli" && x.UserId == StudentObj.Id).FirstOrDefault();
                        if (CommitmentsUser == null)
                        {
                            Commitments com = new Commitments();
                            com.Date = LessonsStart;
                            com.HMO = "maccabiSheli";
                            com.Number = "התחייבות מכבי";
                            com.UserId = StudentObj.Id;
                            com.Qty = 1;
                            Context.Commitments.Add(com);
                            Context.SaveChanges();
                        }
                        else
                        {
                            CommitmentsUser.Qty += 1;
                            Context.Entry(CommitmentsUser).State = System.Data.Entity.EntityState.Modified;
                            Context.SaveChanges();
                        }

                    }
                }

            }
            catch (Exception ex)
            {


            }
        }

        private void BuildPayments()
        {
            try
            {
                string RiderId, WorkerID, DayofRide, HourofRide, HorseId, TypeofRiders,
                executed, UnexecutedReson, Price, invoice, TypeForBookkeeping, financPrecent;
                foreach (DataRow item in ds.Tables[2].Rows)
                {
                    RiderId = item["RiderId"].ToString();
                    int RiderIdInt = Int32.Parse(RiderId);

                    WorkerID = item["WorkerID"].ToString();
                    int WorkerIDInt = Int32.Parse(WorkerID);

                    DayofRide = item["DayofRide"].ToString();
                    HourofRide = item["HourofRide"].ToString();
                    HorseId = item["HorseId"].ToString();
                    TypeofRiders = item["TypeofRiders"].ToString();
                    executed = item["executed"].ToString();
                    UnexecutedReson = item["UnexecutedReson"].ToString();

                    Price = item["Price"].ToString();
                    financPrecent = item["financPrecent"].ToString();

                    invoice = item["invoice"].ToString();
                    TypeForBookkeeping = item["TypeForBookkeeping"].ToString();

                    var StudentObj = Context.Users.Where(x => x.Farm_Id == FarmId && x.EntityId == RiderIdInt && x.Role == "student").FirstOrDefault();
                    var InstructorObj = Context.Users.Where(x => x.Farm_Id == FarmId && x.EntityId == WorkerIDInt && x.Role == "instructor").FirstOrDefault();

                    // להביא חשבוניות של שיעורים ללא מדריך
                    if (StudentObj != null && InstructorObj == null)
                    {

                        DateTime LessonsStart = GetDateFromAccess(DayofRide, HourofRide);
                        double FixedPrice = double.Parse(Price) - double.Parse(financPrecent);

                        // חשבונית
                        if (!string.IsNullOrEmpty(invoice) && invoice != "0")
                        {
                            var invoiceUser = Context.Payments.Where(x => x.InvoiceNum == invoice && x.UserId == StudentObj.Id).FirstOrDefault();
                            if (invoiceUser == null)
                            {
                                Payments pay = new Payments();

                                pay.UserId = StudentObj.Id;
                                pay.Date = LessonsStart;
                                pay.InvoicePdf = "";
                                pay.InvoiceNum = invoice;
                                pay.InvoiceDetails = invoice + " חשבונית " + " " + UnexecutedReson;

                              
                                pay.Price = FixedPrice;
                                pay.InvoiceSum = FixedPrice;

                                pay.payment_type = "1";
                                if (WorkerID != ExpensWorkerId) pay.lessons = 1;
                              

                                Context.Payments.Add(pay);
                                Context.SaveChanges();


                            }
                            else
                            {
                                invoiceUser.Price = FixedPrice;
                                invoiceUser.InvoiceSum += FixedPrice;
                                if (WorkerID != ExpensWorkerId) invoiceUser.lessons += 1;
                                Context.Entry(invoiceUser).State = System.Data.Entity.EntityState.Modified;
                                Context.SaveChanges();
                            }
                        }




                    }




                }
            }
            catch (Exception ex)
            {


            }
        }

        private DateTime GetDateFromAccess(string dayofRide, string hourofRide)
        {
            string strDateStarted = dayofRide.Substring(0, 10) + " " + hourofRide;
            DateTime datDateStarted;
            DateTime.TryParseExact(strDateStarted, new string[] { "dd/MM/yyyy HH:mm" }, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out datDateStarted);

            return datDateStarted;
        }

        private string GetRightName(string LastName)
        {
            if (!string.IsNullOrEmpty(LastName))
            {
                char FirstChar = LastName[0];
                if (Char.IsDigit(FirstChar)) return (LastName.Substring(1, LastName.Length - 1)).Trim();

            }
            else
            {
                return "";

            }
            return LastName.Trim();
        }

        private DateTime? GetDateTimeParse(string birthDate)
        {
            if (string.IsNullOrEmpty(birthDate.Trim()) || birthDate.Length < 10) return (DateTime?)null;

            DateTime dt;
            bool ok = DateTime.TryParse(birthDate, out dt);

            if (ok)
            {
                if (dt < new DateTime(1753, 01, 01))
                {
                    return (DateTime?)null;

                }
                return dt;

            }

            return (DateTime?)null;

        }

        private double? GetCostByHMO(string HMO, string Acost)
        {
            if (HMO == "maccabiSheli") return 0;
            if (HMO == "klalit") return 45;

            if (!string.IsNullOrEmpty(Acost)) return double.Parse(Acost); //- double.Parse(Financer);

            return 0;



        }

        private string GetEmailMotherFather(DataRow parentDetalis)
        {
            string FatherMail = parentDetalis["eMailFather"].ToString();
            string MotherMail = parentDetalis["eMailMother"].ToString();
            if (!string.IsNullOrEmpty(MotherMail) && MotherMail.IndexOf("@") != -1) return MotherMail;//
            return FatherMail;

        }

        private string GetHMO(string style, string finance)
        {
            // גולדן פילד
            if (FarmId == 67)
            {
                if (style == "treatment" && finance == "2") return "maccabiSheli";
                if (style == "treatment" && finance == "15") return "klalit";


            }


            // רנצו
            if (FarmId == 71)
            {
                if (style == "treatment" && finance == "54") return "maccabiSheli";
                if (style == "treatment" && finance == "105") return "klalit";
                if (style == "treatment" && finance == "106") return "leumit";
                if (style == "treatment" && finance == "107") return "meuhedet";
            }

            // חניאל
            if (FarmId == 73)
            {
                if (style == "treatment" && finance == "2") return "maccabiSheli";
                if (style == "treatment" && finance == "3") return "klalit";
                if (style == "treatment" && finance == "10") return "leumit";
                if (style == "treatment" && finance == "8") return "meuhedet";
            }

            return "";
        }

        private string GetStyleHava(string finance)
        {
            // גולדן פילד
            if (FarmId == 67)
            {
                if (finance == "2" || finance == "15") return "treatment";
            }
            // רנצו
            if (FarmId == 71)
            {
                if (finance == "54" || finance == "105" || finance == "106" || finance == "107") return "treatment";
            }


            // חניאל
            if (FarmId == 73)
            {
                if (finance == "2" || finance == "3" || finance == "8" || finance == "10") return "treatment";
            }



            return "privateTreatment";
        }

        private DataRow GetParentDetalis(string riderId)
        {
            if (string.IsNullOrEmpty(riderId)) return null;
            var result = ds.Tables[4].AsEnumerable().Where(myRow => myRow.Field<int>("RiderId") == Int32.Parse(riderId)).FirstOrDefault();
            return result;
        }
    }


}






//OleDbDataAdapter adapter = new OleDbDataAdapter(sql, conn);

//adapter.Fill(ds, "Riders");


// DataSet ds = new DataSet();
// DataGridView dataGridView1 = new DataGridView();
//using (OleDbDataAdapter adapter = new OleDbDataAdapter(sql, conn))
//{
//    adapter.Fill(ds);
// //   dataGridView1.DataSource = ds;
//    // Of course, before addint the datagrid to the hosting form you need to 
//    // set position, location and other useful properties. 
//    // Why don't you create the DataGrid with the designer and use that instance instead?
//   // this.Controls.Add(dataGridView1);
//}