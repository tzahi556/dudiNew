using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Web;
using FarmsApi.DataModels;

namespace FarmsApi.Services
{
    public class UploadFromAccess
    {
        public int FarmId = 59;
        public DataSet ds = new DataSet();

        public Context Context = new Context();
        public string MailPrefix = "greenfeldes";
        public string Hava = "greenfeldes";

        public UploadFromAccess()
        {
            String connection = @"Provider=Microsoft.Jet.OLEDB.4.0;" +
                                @"Data source=C:\DataBase\Amir.mdb;Jet OLEDB:Database Password=diana;";




            ds.Tables.Add(new DataTable("Riders"));
            ds.Tables.Add(new DataTable("Instructor"));
            ds.Tables.Add(new DataTable("Lessons"));
            ds.Tables.Add(new DataTable("Organizations"));
            ds.Tables.Add(new DataTable("RiderParents"));
            ds.Tables.Add(new DataTable("Users"));





            string sqlLessons = @"  SELECT top 50 * FROM FarmDairy ";

            string sqlRiders = @" SELECT TOP 50 * from Riders ";

            string sqlInstructor = @" SELECT * from Workers ";

            string sqlOrganizations = @" SELECT * from Organizations ";

            string sqlRiderParents = @" SELECT * from RiderParents ";

            string sqlUsers = @" SELECT * from Users ";


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

                conn.Close();



            }

        }


        public void UpdateUsersLessons()
        {
           // BuildUserRiders();
           // BuildUserInstructors();
            BuildLessons();
        }

      

        private void BuildUserRiders()
        {
            string Role = "student", Email, Password, FirstName, LastName, Deleted = "0", Active, RiderId,
                   ClientNumber, IdNumber, BirthDate, ParentName2 = "", ParentName = "", Address, PhoneNumber = "",
                   PhoneNumber2 = "", AnotherEmail = "",
                   Style = "treatment", TeamMember = "no", Cost, PayType, Details, HMO, BalanceDetails;

            foreach (DataRow item in ds.Tables[0].Rows)
            {



                FirstName = GetRightName(item["PrivateName"].ToString());
                LastName = GetRightName(item["FamilyName"].ToString());
                Active = item["Active"].ToString();

                Address = item["Address"].ToString() + " " + item["City"].ToString();


                RiderId = item["RiderId"].ToString();
                int RiderIdInt = Int32.Parse(RiderId);

                if (string.IsNullOrEmpty(item["Id"].ToString()))
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
                    PhoneNumber = ParentDetalis["PhonFather"].ToString();
                    PhoneNumber2 = ParentDetalis["PhonMother"].ToString();

                }


                var UserEN = Context.Users.Where(x => x.Farm_Id == FarmId && x.EntityId == RiderIdInt).FirstOrDefault();
                if (UserEN == null)
                {
                    User UserE = new User();

                    UserE.Farm_Id = FarmId;
                    UserE.Role = Role;
                    UserE.Deleted = false;
                    UserE.EntityId = RiderIdInt;

                    UserE.FirstName = FirstName;
                    UserE.LastName = LastName;
                    UserE.Active = (Active == "True") ? "active" : "notActive";
                    UserE.Address = Address;
                    UserE.Password = Password;
                    UserE.IdNumber = IdNumber;
                    UserE.Email = Email;
                    UserE.BirthDate = GetDateTimeParse(BirthDate);// DateTime.Parse(BirthDate);
                    UserE.PayType = (Int32.Parse(PayType) + 1).ToString();
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
                else
                {
                    var UserE = UserEN;

                    UserE.Farm_Id = FarmId;
                    UserE.Role = Role;
                    UserE.Deleted = false;

                    UserE.FirstName = FirstName;
                    UserE.LastName = LastName;
                    UserE.Active = (Active == "True") ? "active" : "notActive";
                    UserE.Address = Address;
                    UserE.Password = Password;
                    UserE.IdNumber = IdNumber;
                    UserE.Email = Email;
                    UserE.BirthDate = GetDateTimeParse(BirthDate);
                    UserE.PayType = (Int32.Parse(PayType) + 1).ToString();
                    UserE.Style = Style;
                    UserE.HMO = HMO;


                    UserE.ParentName = ParentName;
                    UserE.ParentName2 = ParentName2;
                    UserE.PhoneNumber = PhoneNumber;
                    UserE.PhoneNumber2 = PhoneNumber2;
                    UserE.AnotherEmail = AnotherEmail;
                    UserE.Cost = GetCostByHMO(HMO, item["Lasttariff"].ToString());


                    Context.Entry(UserE).State = System.Data.Entity.EntityState.Modified;
                }

            }


            Context.SaveChanges();

        }

        private void BuildUserInstructors()
        {
            string Role = "instructor", Email, Password, FirstName, LastName, Deleted = "0", Active, WorkerID,
                   DepartmetId, IdNumber, BirthDate, ParentName2, ParentName, Address, PhoneNumber,
                   PhoneNumber2, AnotherEmail
                  , Cost, PayType, Details, HMO, BalanceDetails;

            foreach (DataRow item in ds.Tables[1].Rows)
            {
                FirstName = GetRightName(item["FirstName"].ToString());
                LastName = GetRightName(item["FamilyName"].ToString());
                Active = item["Active"].ToString();

                Address = item["Address"].ToString() + " " + item["City"].ToString();
                IdNumber = item["IDNmber"].ToString();
                Password = "123";

                
                WorkerID = item["WorkerID"].ToString();
                int WorkerIDInt = Int32.Parse(WorkerID);
                Email =(string.IsNullOrEmpty(item["Email"].ToString()))? (MailPrefix + WorkerID + "@gmail.com"): (item["Email"].ToString()); // אם זה מדריך
                PhoneNumber = item["MobilePhon"].ToString();

                DepartmetId = item["DepartmetId"].ToString();

                // רק מדריך פעיל וממחלקה 1 שזה מדריך רכיבה
                if (Active != "True" || DepartmetId!="1") continue;
             
                var UserEN = Context.Users.Where(x => x.Farm_Id == FarmId && x.EntityId == WorkerIDInt).FirstOrDefault();
                if (UserEN == null)
                {
                    User UserE = new User();
                    UserE.Farm_Id = FarmId;
                    UserE.Role = Role;
                    UserE.Deleted = false;
                    UserE.EntityId = WorkerIDInt;
                    UserE.FirstName = FirstName;
                    UserE.LastName = LastName;
                    UserE.Active = (Active == "True") ? "active" : "notActive";
                    UserE.Address = Address;
                    UserE.Password = Password;
                    UserE.IdNumber = IdNumber;
                    UserE.Email = Email;
                    UserE.PhoneNumber = PhoneNumber;
                    Context.Users.Add(UserE);
                }
                else
                {
                    var UserE = UserEN;

                    UserE.Farm_Id = FarmId;
                    UserE.Role = Role;
                    UserE.Deleted = false;

                    UserE.FirstName = FirstName;
                    UserE.LastName = LastName;
                    UserE.Active = (Active == "True") ? "active" : "notActive";
                    UserE.Address = Address;
                    UserE.Password = Password;
                    UserE.IdNumber = IdNumber;
                    UserE.Email = Email;
                    UserE.PhoneNumber = PhoneNumber;
                  

                    Context.Entry(UserE).State = System.Data.Entity.EntityState.Modified;
                }


            }
            // var Users = Context.Users.Where(x => x.Farm_Id == FarmId).ToList();


            Context.SaveChanges();


            //throw new NotImplementedException();
        }

        private void BuildLessons()
        {
            string RiderId, WorkerID, DayofRide, HourofRide, HorseId, TypeofRiders,
                executed, UnexecutedReson, Price, invoice, TypeForBookkeeping;
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

                invoice = item["invoice"].ToString();
                TypeForBookkeeping = item["TypeForBookkeeping"].ToString(); // 

                var InstructorStudentObj = Context.Users.Where(x => x.Farm_Id == FarmId && (x.EntityId == RiderIdInt || x.EntityId == WorkerIDInt)).ToList();

                DateTime LessonsStart = GetDateFromAccess(DayofRide, HourofRide);
              //  DateTime LessonsEnd = GetDateFromAccess(DayofRide, HourofRide);


                //var LessonEN = Context.Lessons.Where(x => x.Instructor_Id == InstructorStudentObj[0].Id && x.Start == WorkerIDInt).FirstOrDefault();
                //if (UserEN == null)
                //{
                //    User UserE = new User();
                //    UserE.Farm_Id = FarmId;
                //    UserE.Role = Role;
                //    UserE.Deleted = false;
                //    UserE.EntityId = WorkerIDInt;
                //    UserE.FirstName = FirstName;
                //    UserE.LastName = LastName;
                //    UserE.Active = (Active == "True") ? "active" : "notActive";
                //    UserE.Address = Address;
                //    UserE.Password = Password;
                //    UserE.IdNumber = IdNumber;
                //    UserE.Email = Email;
                //    UserE.PhoneNumber = PhoneNumber;
                //    Context.Users.Add(UserE);
                //}
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
                //    UserE.PhoneNumber = PhoneNumber;


                //    Context.Entry(UserE).State = System.Data.Entity.EntityState.Modified;
                //}




            }
        }

        private DateTime GetDateFromAccess(string dayofRide, string hourofRide)
        {
            string strDateStarted = dayofRide.Substring(0,10) + " " + hourofRide;
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
            DateTime dt;
            bool ok = DateTime.TryParse(birthDate, out dt);

            if (ok) return dt;

            return null;

        }

        private double? GetCostByHMO(string HMO,string Acost)
        {
            if (HMO == "maccabiSheli") return 0;
            if (HMO == "klalit") return 45;

            if (!string.IsNullOrEmpty(Acost)) return double.Parse(Acost);

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
            if (style == "treatment" && finance == "2") return "maccabiSheli";
            if (style == "treatment" && finance == "15") return "klalit";
            return "";
        }

        private string GetStyleHava(string finance)
        {
            if (finance == "2" || finance == "15") return "treatment";
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