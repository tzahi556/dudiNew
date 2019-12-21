using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Web;

namespace FarmsApi.Services
{
    public class UploadFromAccess
    {
        public static void UpdateUsersLessons()
        {
           // String connection = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=|DataDirectory|\\Tables.accdb;Persist Security Info=True";
            String connection = @"Provider=Microsoft.Jet.OLEDB.4.0;" +
                                @"Data source=C:\DataBase\Amir.mdb;Jet OLEDB:Database Password=diana;";


            string sql = @" SELECT top 50  fm.RiderId,r.FamilyName,r.PrivateName,
                             fm.DayofRide,fm.HourofRide,fm.executed,
                             fm.UnexecutedReson,fm.Price,fm.invoice,w.FirstName,w.FamilyName
                             FROM FarmDairy fm 
                            inner join Riders r on r.RiderId=fm.RiderId
                            inner join Workers w on w.WorkerId=fm.WorkerId




                        ";
            using (OleDbConnection conn = new OleDbConnection(connection))
            {
                conn.Open();
                DataSet ds = new DataSet();
               // DataGridView dataGridView1 = new DataGridView();
                using (OleDbDataAdapter adapter = new OleDbDataAdapter(sql, conn))
                {
                    adapter.Fill(ds);
                 //   dataGridView1.DataSource = ds;
                    // Of course, before addint the datagrid to the hosting form you need to 
                    // set position, location and other useful properties. 
                    // Why don't you create the DataGrid with the designer and use that instance instead?
                   // this.Controls.Add(dataGridView1);
                }
            }

        }
    }
}