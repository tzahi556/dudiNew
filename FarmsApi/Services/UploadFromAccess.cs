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
        public string MailPrefix = "glifx";

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





            string sqlLessons = @"  SELECT top 50  fm.RiderId,r.FamilyName,r.PrivateName,r.PayArrangement,
                                    fm.DayofRide,fm.HourofRide,fm.executed,
                                    fm.UnexecutedReson,fm.Price,fm.invoice,
                                    w.FirstName,w.FamilyName
                                    FROM (FarmDairy fm 
                                    inner join Riders r on r.RiderId=fm.RiderId)
                                    inner join Workers w on w.WorkerID=fm.WorkerId
                                ";
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
            BuildUserRiders();
            BuildUserInstructors();



        }


        private void BuildUserInstructors()
        {
            string Role = "instructor", Email, Password, FirstName, LastName, Deleted = "0", Active, WorkerID,
                   ClientNumber, IdNumber, BirthDate, ParentName2, ParentName, Address, PhoneNumber,
                   PhoneNumber2, AnotherEmail
                  , Cost, PayType, Details, HMO, BalanceDetails;

            foreach (DataRow item in ds.Tables[3].Rows)
            {
                FirstName = item["FirstName"].ToString();
                LastName = item["FamilyName"].ToString();
                Active = item["Active"].ToString();

                Address = item["Address"].ToString() + " " + item["City"].ToString();
                IdNumber = item["Id"].ToString();
                Password = "123";
              
                WorkerID = item["WorkerID"].ToString();
                Email = MailPrefix + WorkerID + "@gmail.com"; // אם זה מדריך
                PhoneNumber = item["MobilePhon"].ToString();
               


             
                var UserEN = Context.Users.Where(x => x.Farm_Id == FarmId && x.FirstName == FirstName && x.LastName == LastName).FirstOrDefault();
                if (UserEN == null)
                {
                    User UserE = new User();
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

        private void BuildUserRiders()
        {
            string Role = "student", Email, Password, FirstName, LastName, Deleted = "0", Active, RiderId,
                   ClientNumber, IdNumber, BirthDate, ParentName2="", ParentName="", Address, PhoneNumber="",
                   PhoneNumber2="", AnotherEmail="",
                   Style = "treatment", TeamMember = "no", Cost, PayType, Details, HMO, BalanceDetails;

            foreach (DataRow item in ds.Tables[0].Rows)
            {



                FirstName = item["PrivateName"].ToString();
                LastName = item["FamilyName"].ToString();
                Active = item["Active"].ToString();

                Address = item["Address"].ToString() + " " + item["City"].ToString();
                IdNumber = item["Id"].ToString();
                Password = item["Id"].ToString();

                Email = item["Id"].ToString(); // אם זה תלמיד
                RiderId = item["RiderId"].ToString();
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


                var UserEN = Context.Users.Where(x => x.Farm_Id == FarmId && x.FirstName == FirstName && x.LastName == LastName).FirstOrDefault();
                if (UserEN == null)
                {
                    User UserE = new User();

                    UserE.Farm_Id = FarmId;
                    UserE.Role = Role;
                    UserE.Deleted = false;

                    UserE.FirstName = FirstName;
                    UserE.LastName = LastName;
                    UserE.Active = (Active=="True")?"active":"notActive";
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
                }else
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