using EZcountApiLib;
using FarmsApi.DataModels;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Cryptography.X509Certificates;

namespace FarmsApi.Services
{
    public class HorsesService
    {


        public static void UpdateMetaHorssesPreg()
        {
            using (var Context = new Context())
            {
                var Horses = Context.Horses.ToList();
                // var Horses = Context.Horses.Where(x => x.Id == 17).ToList();
                foreach (Horse Horsef in Horses)
                {

                    try
                    {



                        var Meta = JObject.Parse(Horsef.Meta);

                        if (Meta["Pregnancies"] != null)
                        {
                            foreach (var Item in Meta["Pregnancies"])
                            {

                                var PregDate = CheckifExistDate(Item["Date"]);

                                var HorsePreg = Context.HorsePregnancies.Where(x => x.HorseId == Horsef.Id && x.Date == PregDate).FirstOrDefault();


                                if (HorsePreg == null) continue;

                                if (Item["States"] != null)
                                {


                                    foreach (var st in Item["States"])
                                    {


                                        var State = JObject.Parse(st["State"].ToString());

                                        var statename = State["id"].ToString();

                                        HorsePregnanciesStates hss = Context.HorsePregnanciesStates.Where(x => x.HorsePregnanciesId == HorsePreg.Id && x.StateId == statename).FirstOrDefault();

                                        if (hss != null)
                                        {
                                            hss.Date = CheckifExistDate(st["Date"]);
                                            Context.Entry(hss).State = System.Data.Entity.EntityState.Modified;
                                        }


                                    }

                                }

                            }
                        }


                    }
                    catch (Exception ex)
                    {



                    }
                }


                Context.SaveChanges();
            }
        }


        public static void UpdateMetaHorsses()
        {
            try
            {
                using (var Context = new Context())
                {
                    var Horses = Context.Horses.Where(x => x.Id == 1024).ToList();
                    //var Horses = Context.Horses.ToList();
                    foreach (Horse Horsef in Horses)
                    {

                        try
                        {

                            // User Horsef = Context.Users.Where(x => x.Id == 50).FirstOrDefault();yyy

                            var Meta = JObject.Parse(Horsef.Meta);

                            #region User
                            if (Meta["Active"] != null)
                            {

                                Horsef.Active = Meta["Active"].ToString();

                            }
                            else
                            {
                                Horsef.Active = "active";
                            }

                            if (Meta["Image"] != null)
                            {
                                Horsef.Image = Meta["Image"].ToString();

                            }
                            if (Meta["Gender"] != null)
                            {
                                Horsef.Gender = Meta["Gender"].ToString();

                            }

                            if (Meta["Ownage"] != null)
                            {
                                Horsef.Ownage = Meta["Ownage"].ToString();

                            }
                            if (Meta["BirthDate"] != null)
                            {
                                Horsef.BirthDate = CheckifExistDate(Meta["BirthDate"]);

                            }

                            if (Meta["PensionStartDate"] != null)
                            {
                                Horsef.PensionStartDate = CheckifExistDate(Meta["PensionStartDate"]);

                            }



                            if (Meta["Race"] != null)
                            {
                                Horsef.Race = Meta["Race"].ToString();

                            }
                            if (Meta["Owner"] != null)
                            {
                                Horsef.Owner = Meta["Owner"].ToString();

                            }

                            if (Meta["Father"] != null)
                            {
                                Horsef.Father = Meta["Father"].ToString();

                            }
                            if (Meta["Mother"] != null)
                            {
                                Horsef.Mother = Meta["Mother"].ToString();

                            }

                            if (Meta["Details"] != null)
                            {
                                Horsef.Details = Meta["Details"].ToString();

                            }


                            if (Meta["Food"] != null)
                            {
                                var Food = JObject.Parse(Meta["Food"].ToString());

                                if (Food["Morning1"] != null)
                                {
                                    Horsef.Morning1 = Food["Morning1"].ToString();
                                }

                                if (Food["Morning2"] != null)
                                {
                                    Horsef.Morning2 = Food["Morning2"].ToString();
                                }

                                if (Food["Lunch1"] != null)
                                {
                                    Horsef.Lunch1 = Food["Lunch1"].ToString();
                                }

                                if (Food["Lunch2"] != null)
                                {
                                    Horsef.Lunch2 = Food["Lunch2"].ToString();
                                }

                                if (Food["Dinner1"] != null)
                                {
                                    Horsef.Dinner1 = Food["Dinner1"].ToString();
                                }

                                if (Food["Dinner2"] != null)
                                {
                                    Horsef.Dinner2 = Food["Dinner2"].ToString();
                                }

                            }


                            if (Meta["Files"] != null)
                            {

                                string NewsFiles = Meta["Files"].ToString().Replace("[", "").Replace("]", "");

                                string[] files = NewsFiles.Split(',');

                                foreach (string item in files)
                                {
                                    HorseFiles hf = new HorseFiles();
                                    hf.FileName = item;
                                    hf.HorseId = Horsef.Id;
                                    Context.HorseFiles.Add(hf);

                                }



                            }




                            Context.Entry(Horsef).State = System.Data.Entity.EntityState.Modified;


                            #endregion

                            //**************************************************************************
                            if (Meta["Treatments"] != null)
                            {
                                foreach (var Item in Meta["Treatments"])
                                {

                                    HorseTreatments hs = new HorseTreatments();

                                    hs.HorseId = Horsef.Id;
                                    hs.Date = CheckifExistDate(Item["Date"]);
                                    hs.Name = CheckifExistStr(Item["Details"]);


                                    Context.HorseTreatments.Add(hs);
                                    // Context.Entry(pay).State = System.Data.Entity.EntityState.Added;
                                    //    Context.SaveChanges();

                                    // Item["resourceId"] = Horsef.Id;
                                }
                            }


                            if (Meta["Vaccinations"] != null)
                            {
                                foreach (var Item in Meta["Vaccinations"])
                                {

                                    HorseVaccinations hs = new HorseVaccinations();

                                    hs.HorseId = Horsef.Id;
                                    hs.Date = CheckifExistDate(Item["Date"]);
                                    hs.Type = Item["Type"].ToString();
                                    hs.Name = CheckifExistStr(Item["Details"]);


                                    Context.HorseVaccinations.Add(hs);

                                }
                            }


                            if (Meta["Shoeings"] != null)
                            {
                                foreach (var Item in Meta["Shoeings"])
                                {

                                    HorseShoeings hs = new HorseShoeings();

                                    hs.HorseId = Horsef.Id;
                                    hs.Date = CheckifExistDate(Item["Date"]);
                                    hs.ShoerName = CheckifExistStr(Item["ShoerName"]);
                                    hs.Name = CheckifExistStr(Item["Details"]);
                                    hs.IsPaid = CheckifExistBool(Item["Paid"]);

                                    Context.HorseShoeings.Add(hs);

                                }
                            }

                            if (Meta["Tilufings"] != null)
                            {
                                foreach (var Item in Meta["Tilufings"])
                                {



                                    HorseTilufings hs = new HorseTilufings();

                                    hs.HorseId = Horsef.Id;
                                    hs.Date = CheckifExistDate(Item["Date"]);
                                    hs.ShoerName = CheckifExistStr(Item["ShoerName"]);
                                    hs.Name = CheckifExistStr(Item["Details"]);
                                    hs.IsPaid = CheckifExistBool(Item["Paid"]);

                                    Context.HorseTilufings.Add(hs);



                                }
                            }

                            if (Meta["Pregnancies"] != null)
                            {
                                foreach (var Item in Meta["Pregnancies"])
                                {



                                    HorsePregnancies hs = new HorsePregnancies();

                                    hs.HorseId = Horsef.Id;
                                    hs.Date = CheckifExistDate(Item["Date"]);
                                    hs.Father = CheckifExistStr(Item["Father"]);
                                    hs.Comments = CheckifExistStr(Item["Details"]);
                                    hs.IsSurrogate = CheckifExistBool(Item["IsSurrogate"]);
                                    hs.Finished = CheckifExistBool(Item["Finished"]);

                                    if (Item["Surrogate"] != null)
                                    {
                                        var Surrogate = JObject.Parse(Item["Surrogate"].ToString());
                                        hs.SurrogateId = CheckifExistInt(Surrogate["Id"]);
                                        hs.SurrogateName = CheckifExistStr(Surrogate["Name"]);

                                    }



                                    if (Item["Mother"] != null)
                                    {
                                        var Mother = JObject.Parse(Item["Mother"].ToString());
                                        hs.MotherId = CheckifExistInt(Mother["Id"]);
                                        hs.Mother = CheckifExistStr(Mother["Name"]);

                                    }

                                    Context.HorsePregnancies.Add(hs);
                                    Context.SaveChanges();

                                    if (Item["States"] != null)
                                    {

                                        //  var States = JObject.Parse(Item["States"].ToString());
                                        foreach (var st in Item["States"])
                                        {


                                            var State = JObject.Parse(st["State"].ToString());

                                            HorsePregnanciesStates hss = new HorsePregnanciesStates();
                                            hss.Date = CheckifExistDate(Item["Date"]);
                                            hss.HorseId = Horsef.Id;
                                            hss.HorsePregnanciesId = hs.Id;
                                            hss.StateId = State["id"].ToString();
                                            hss.name = CheckifExistStr(State["name"]);
                                            hss.day = CheckifExistStr(State["day"]);

                                            Context.HorsePregnanciesStates.Add(hss);

                                        }

                                    }

                                }
                            }





                            Context.SaveChanges();
                        }
                        catch (DbEntityValidationException e)
                        {
                            foreach (var eve in e.EntityValidationErrors)
                            {
                                //Debug.WriteLine(@"Entity of type ""{0}"" in state ""{1}"" 
                                // has the following validation errors:",
                                //eve.Entry.Entity.GetType().Name,
                                // eve.Entry.State);
                                foreach (var ve in eve.ValidationErrors)
                                {
                                    // Debug.WriteLine(@"- Property: ""{0}"", Error: ""{1}""",
                                    //  ve.PropertyName, ve.ErrorMessage);
                                }
                            }
                            throw;
                        }
                        catch (DbUpdateException e)
                        {
                            //Add your code to inspect the inner exception and/or
                            //e.Entries here.
                            //Or just use the debugger.
                            //Added this catch (after the comments below) to make it more obvious 
                            //how this code might help this specific problem
                        }
                        catch (Exception e)
                        {

                        }
                    }

                }
            }
            catch (Exception ex)
            {



            }

        }



        private static double? CheckifExistDouble(JToken jToken)
        {
            if (jToken == null) return 0;
            double res;
            bool Ok = Double.TryParse(jToken.ToString(), out res);
            if (Ok) return res;
            else return 0;
        }

        private static bool CheckifExistBool(JToken jToken)
        {
            if (jToken == null) return false;
            Boolean res = new Boolean();
            bool Ok = Boolean.TryParse(jToken.ToString(), out res);
            if (Ok)
                return res;
            else
                return false;
        }

        private static DateTime? CheckifExistDate(JToken jToken)
        {

            if (jToken == null) return null;
            DateTime res = new DateTime();
            bool Ok = DateTime.TryParse(jToken.ToString(), out res);
            if (Ok && res.Year > 1960) return res;

            else return null;
        }

        private static int CheckifExistInt(JToken jToken)
        {
            if (jToken == null) return 0;
            int res;
            bool Ok = Int32.TryParse(jToken.ToString(), out res);
            if (Ok) return res;
            else return 0;
        }

        private static string CheckifExistStr(JToken jToken)
        {

            if (jToken != null)

                return jToken.ToString();

            return "";

        }


        public static List<HorseHozims> UpdateHorseMultiTables(JArray dataObj)
        {


            Horse h = UpdateHorse(dataObj[0].ToObject<Horse>());

            List<HorseFiles> f = dataObj[1].ToObject<List<HorseFiles>>();
            UpdateHorseFilesObject(f, h);

            List<HorseHozeFiles> hf = dataObj[2].ToObject<List<HorseHozeFiles>>();
            UpdateHorseHozeFilesObject(hf, h);

            List<HorsePundekautFiles> pf = dataObj[3].ToObject<List<HorsePundekautFiles>>();
            UpdateHorsePundekautFilesObject(pf, h);




            List<HorseTreatments> ht = dataObj[4].ToObject<List<HorseTreatments>>();
            UpdateHorseTreatmentsObject(ht, h);

            List<HorseVaccinations> hv = dataObj[5].ToObject<List<HorseVaccinations>>();
            UpdateHorseVaccinationsObject(hv, h);

            List<HorseShoeings> hs = dataObj[6].ToObject<List<HorseShoeings>>();
            UpdateHorseShoeingsObject(hs, h);

            List<HorseTilufings> htl = dataObj[7].ToObject<List<HorseTilufings>>();
            UpdateHorseTilufingsObject(htl, h);

            List<HorsePregnancies> htp = dataObj[8].ToObject<List<HorsePregnancies>>();
            UpdateHorsePregnanciesObject(htp, h);
            List<HorsePregnanciesStates> htps = dataObj[9].ToObject<List<HorsePregnanciesStates>>();
            UpdateHorsePregnanciesStatesObject(htps, h);

            List<HorseInseminations> hti = dataObj[10].ToObject<List<HorseInseminations>>();
            UpdateHorseInseminationsObject(hti, h);

            List<HorsesMultipleFiles> htmf = dataObj[12].ToObject<List<HorsesMultipleFiles>>();
            UpdateHorsesMultipleFilesObject(htmf, h);


            List<HorseHozims> hzm = dataObj[11].ToObject<List<HorseHozims>>();

            return UpdateHorseHozimsObject(hzm, h);
        }



        private static void UpdateHorsesMultipleFilesObject(List<HorsesMultipleFiles> objList, Horse f)
        {
            using (var Context = new Context())
            {

                foreach (HorsesMultipleFiles item in objList)
                {

                    item.HorseId = f.Id;

                    if (item.Id == 0)
                    {


                        if (item.TypeId == 0)
                        {
                            if (item.Type == 1)
                            {
                                var ObjList = Context.HorseTreatments.Where(x => x.HorseId == item.HorseId).ToList();
                                foreach (var Obj in ObjList)
                                {
                                    if (Obj.Date.ToString() == item.ObjectDate.Value.ToString())
                                    {
                                        item.TypeId = Obj.Id;
                                        break;
                                    }

                                }
                            }

                            if (item.Type == 2)
                            {
                                var ObjList = Context.HorseVaccinations.Where(x => x.HorseId == item.HorseId).ToList();
                                foreach (var Obj in ObjList)
                                {
                                    if (Obj.Date.ToString() == item.ObjectDate.Value.ToString())
                                    {
                                        item.TypeId = Obj.Id;
                                        break;
                                    }

                                }
                            }
                            if (item.Type == 3)
                            {
                                var ObjList = Context.HorseShoeings.Where(x => x.HorseId == item.HorseId).ToList();
                                foreach (var Obj in ObjList)
                                {
                                    if (Obj.Date.ToString() == item.ObjectDate.Value.ToString())
                                    {
                                        item.TypeId = Obj.Id;
                                        break;
                                    }

                                }


                            }
                            if (item.Type == 4)
                            {
                                var ObjList = Context.HorseTilufings.Where(x => x.HorseId == item.HorseId).ToList();
                                foreach (var Obj in ObjList)
                                {
                                    if (Obj.Date.ToString() == item.ObjectDate.Value.ToString())
                                    {
                                        item.TypeId = Obj.Id;
                                        break;
                                    }

                                }
                            }

                        }

                        Context.HorsesMultipleFiles.Add(item);

                    }
                    else
                    {

                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                        //  Context.SaveChanges();

                    }

                }

                try
                {

                    var result = Context.HorsesMultipleFiles.Where(p => p.HorseId == f.Id).ToList();
                    IEnumerable<HorsesMultipleFiles> differenceQuery = result.Except(objList);

                    foreach (HorsesMultipleFiles item in differenceQuery)
                    {
                        Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                    }



                }
                catch (Exception ex)
                {


                }

                Context.SaveChanges();


            }
        }

        private static List<HorseHozims> UpdateHorseHozimsObject(List<HorseHozims> objList, Horse f)
        {
            using (var Context = new Context())
            {

                foreach (HorseHozims item in objList)
                {

                    item.HorseId = f.Id;

                    if (item.Id == 0)
                    {


                        Horse hsSusa = Context.Horses.Where(x => x.Id == item.HorseId).FirstOrDefault();
                        Horse hsSus = Context.Horses.Where(x => x.Id == item.FatherHorseId).FirstOrDefault();

                        if (hsSus != null && item.CostFather > 0)
                        {
                            string name = " חוזה חווה " + "סוס מרביע -" + hsSus.Name;
                            int? ExpensesId = AddToExpensesTable(item.CostHava, 0, item.HorseId, f.Name, name, item.Date);
                            item.ExpensesIdHava = ExpensesId;
                        }


                        if (hsSus != null && item.CostFather > 0)
                        {
                            string name = " חוזה בעל הסוס " + "סוס מרביע -" + hsSus.Name;
                            int? ExpensesId = AddToExpensesTable(item.CostFather, 0, item.HorseId, f.Name, name, item.Date);
                            item.ExpensesId = ExpensesId;
                        }


                        Context.HorseHozims.Add(item);
                        Context.SaveChanges();

                        if (hsSus != null)
                        {
                            HorseInseminations hi = new HorseInseminations();
                            hi.HorseId = hsSus.Id;
                            hi.HalivaDate = item.Date;
                            hi.PregnanciesHorseId = hsSusa.Id;
                            hi.Cost = item.CostFather;


                            hi.HozimId = item.Id;
                            Context.HorseInseminations.Add(hi);
                        }


                        if (item.UserId != null)
                        {

                            // Lesson CurrentLesson = 
                            DateTime StartSearch = ((DateTime)item.Date).Date;
                            DateTime EndSearch = StartSearch.AddDays(1);
                            Lesson CurrentLesson = Context.Lessons.Where(u => u.Instructor_Id == item.UserId && u.Start < EndSearch && u.Start > StartSearch).OrderByDescending(y => y.End).FirstOrDefault();
                            if (CurrentLesson == null)
                            {
                                CurrentLesson = new Lesson();
                                CurrentLesson.Instructor_Id = (int)item.UserId;
                                CurrentLesson.Start = StartSearch.Add(new TimeSpan(7, 30, 0));
                                CurrentLesson.End = StartSearch.Add(new TimeSpan(8, 00, 0));

                                Context.Lessons.Add(CurrentLesson);
                                Context.SaveChanges();

                            }
                            else
                            {

                                DateTime starttemp = CurrentLesson.End;
                                DateTime endtemp = CurrentLesson.End.AddMinutes(30);

                                CurrentLesson = new Lesson();
                                CurrentLesson.Instructor_Id = (int)item.UserId;
                                CurrentLesson.Start = starttemp;
                                CurrentLesson.End = endtemp;

                                Context.Lessons.Add(CurrentLesson);
                                Context.SaveChanges();


                                //CurrentLesson.Start = CurrentLesson.End;
                                //CurrentLesson.End = CurrentLesson.End.AddMinutes(30);
                                //Context.Entry(CurrentLesson).State = System.Data.Entity.EntityState.Modified;
                                //Context.SaveChanges();

                            }

                            SchedularTasks Schedular = new SchedularTasks();

                            var SusName = (hsSus == null) ? item.OuterHorse : hsSus.Name;
                            Schedular.Title = (item.Type == 1) ? "חליבה" : ((item.Type == 2) ? "זירמה קפואה" : "הקפצה") + " לסוס " + SusName;
                            Schedular.ResourceId = (int)item.UserId;
                            Schedular.LessonId = CurrentLesson.Id;

                            LessonsService.DeleteAll(Schedular, true, Context, CurrentLesson.Id, CurrentLesson);

                            var res = LessonsService.ReopenLessonsByInstructorMazkirut(Schedular, CurrentLesson, (int)item.UserId, Context);


                        }

                    }
                    else
                    {

                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                        //  Context.SaveChanges();

                    }

                }

                try
                {

                    var result = Context.HorseHozims.Where(p => p.HorseId == f.Id).ToList();
                    IEnumerable<HorseHozims> differenceQuery = result.Except(objList);

                    foreach (HorseHozims item in differenceQuery)
                    {
                        DeleteFromExpensive(item.ExpensesId, item.IsPaid);
                        DeleteFromExpensive(item.ExpensesIdHava, item.IsPaid);

                        //// מחיקת זיכוי של בעל הסוס 
                        //var Expensive = Context.Expenses.SingleOrDefault(x => x.ZikuyNumber == item.ExpensesId && x.Paid == null);
                        //if (Expensive != null)
                        //{
                        //    Context.Entry(Expensive).State = System.Data.Entity.EntityState.Deleted;
                        //}

                        // מחיקה מהרבעות
                        List<HorseInseminations> his = Context.HorseInseminations.Where(x => x.HozimId == item.Id).ToList();
                        his.ForEach(a =>
                        {
                            Context.Entry(a).State = System.Data.Entity.EntityState.Deleted;
                        });


                        Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                    }



                }
                catch (Exception ex)
                {


                }

                Context.SaveChanges();



                return Context.HorseHozims.Where(x => x.HorseId == f.Id).ToList();
            }
        }

        private static DateTime? GetDate(DateTime start)
        {
            return start.Date;
        }

        private static void UpdateHorseFilesObject(List<HorseFiles> objList, Horse f)
        {
            using (var Context = new Context())
            {

                foreach (HorseFiles item in objList)
                {

                    item.HorseId = f.Id;

                    if (item.Id == 0)
                    {
                        Context.HorseFiles.Add(item);

                    }
                    else
                    {

                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                        //  Context.SaveChanges();

                    }

                }

                try
                {

                    var result = Context.HorseFiles.Where(p => p.HorseId == f.Id).ToList();
                    IEnumerable<HorseFiles> differenceQuery = result.Except(objList);

                    foreach (HorseFiles item in differenceQuery)
                    {
                        Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                    }



                }
                catch (Exception ex)
                {


                }

                Context.SaveChanges();


            }
        }

        private static void UpdateHorseHozeFilesObject(List<HorseHozeFiles> objList, Horse f)
        {
            using (var Context = new Context())
            {

                foreach (HorseHozeFiles item in objList)
                {

                    item.HorseId = f.Id;

                    if (item.Id == 0)
                    {
                        Context.HorseHozeFiles.Add(item);

                    }
                    else
                    {

                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                        //  Context.SaveChanges();

                    }

                }

                try
                {

                    var result = Context.HorseHozeFiles.Where(p => p.HorseId == f.Id).ToList();
                    IEnumerable<HorseHozeFiles> differenceQuery = result.Except(objList);

                    foreach (HorseHozeFiles item in differenceQuery)
                    {
                        Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                    }



                }
                catch (Exception ex)
                {


                }

                Context.SaveChanges();


            }
        }

        private static void UpdateHorsePundekautFilesObject(List<HorsePundekautFiles> objList, Horse f)
        {
            using (var Context = new Context())
            {

                foreach (HorsePundekautFiles item in objList)
                {

                    item.HorseId = f.Id;

                    if (item.Id == 0)
                    {
                        Context.HorsePundekautFiles.Add(item);

                    }
                    else
                    {

                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                        //  Context.SaveChanges();

                    }

                }

                try
                {

                    var result = Context.HorsePundekautFiles.Where(p => p.HorseId == f.Id).ToList();
                    IEnumerable<HorsePundekautFiles> differenceQuery = result.Except(objList);

                    foreach (HorsePundekautFiles item in differenceQuery)
                    {
                        Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                    }



                }
                catch (Exception ex)
                {


                }

                Context.SaveChanges();


            }
        }



        /// <summary>
        /// 
        /// </summary>
        /// <param name="expensesId"></param>
        /// <param name="isPaid"></param>
        private static void DeleteFromExpensive(int? ExpensesId, bool IsPaid)
        {
            if (ExpensesId != null && !IsPaid)
            {
                using (var Context = new Context())
                {
                    var Expensive = Context.Expenses.SingleOrDefault(x => x.Id == ExpensesId && x.Paid == null);

                    if (Expensive != null)
                    {
                        Context.Entry(Expensive).State = System.Data.Entity.EntityState.Deleted;
                        Context.SaveChanges();
                    }
                }

            }
        }


        private static void DeleteFromExpensiveFarm(int? ExpensesId, bool IsPaid)
        {
            if (ExpensesId != null && !IsPaid)
            {
                using (var Context = new Context())
                {
                    var Expensive = Context.Expenses.SingleOrDefault(x => x.Id == ExpensesId && x.Paid == null);

                    if (Expensive != null)
                    {
                        Context.Entry(Expensive).State = System.Data.Entity.EntityState.Deleted;
                        Context.SaveChanges();
                    }
                }

            }
        }


        private static int? AddToExpensesFarmTable(double? cost, double? discount, int horseId, string horsename, string name, DateTime? date)
        {


            DateTime dt = (DateTime)date;

            int? res = null;
            using (var Context = new Context())
            {



                //UserHorses uh = Context.UserHorses.SingleOrDefault(u => u.HorseId == horseId && u.Owner);

                //if (uh != null)
                //{

                var CurrentUser = UsersService.GetCurrentUser();

                if (CurrentUser.Role == "vetrinar" || CurrentUser.Role == "shoeing")
                {
                    Horse h = Context.Horses.Where(y => y.Id == horseId).FirstOrDefault();

                    HorseVetrinars hv = Context.HorseVetrinars.SingleOrDefault(u => u.FarmIdAdd == h.Farm_Id && u.FarmId == CurrentUser.Farm_Id && u.UserId != null);

                    if (hv != null)
                    {

                        Expenses e = new Expenses();
                        e.Details = " תשלום עבור " + name + " לסוס/ה " + horsename + " בתאריך " + dt.ToString("dd/MM/yy");
                        e.BeforePrice = (cost ?? 0);
                        e.Discount = (discount ?? 0);
                        e.Price = (cost ?? 0) - (discount ?? 0);
                        e.UserId = (int)hv.UserId;
                        e.Date = date;
                        e.HorseId = horseId;
                        Context.Expenses.Add(e);
                        Context.SaveChanges();
                        res = e.Id;
                    }



                    //}
                }








                return res;

            }
        }

        private static int? AddToExpensesTable(double? cost, double? discount, int horseId, string horsename, string name, DateTime? date)
        {


            DateTime dt = (DateTime)date;

            int? res = null;
            using (var Context = new Context())
            {



                UserHorses uh = Context.UserHorses.SingleOrDefault(u => u.HorseId == horseId && u.Owner);

                if (uh != null)
                {

                    Expenses e = new Expenses();
                    e.Details = " תשלום עבור " + name + " לסוס/ה " + horsename + " בתאריך " + dt.ToString("dd/MM/yy");
                    e.BeforePrice = (cost ?? 0);
                    e.Discount = (discount ?? 0);
                    e.Price = (cost ?? 0) - (discount ?? 0);
                    e.UserId = uh.UserId;
                    e.HorseId = horseId;
                    e.Date = date;
                    Context.Expenses.Add(e);
                    Context.SaveChanges();

                    res = e.Id;
                }



                return res;

            }
        }


        private static void UpdateHorseTreatmentsObject(List<HorseTreatments> objList, Horse f)
        {
            using (var Context = new Context())
            {

                foreach (HorseTreatments item in objList)
                {

                    item.HorseId = f.Id;

                    if (item.Id == 0)
                    {
                        int? ExpensesId = AddToExpensesTable(item.Cost, item.Discount, item.HorseId, f.Name, item.Name, item.Date);
                        item.ExpensesId = ExpensesId;

                        item.HavaExpensesId = AddToExpensesFarmTable(item.Cost, item.Discount, item.HorseId, f.Name, item.Name, item.Date);
                        Context.HorseTreatments.Add(item);

                    }
                    else
                    {

                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                        //  Context.SaveChanges();

                    }

                }

                try
                {

                    var result = Context.HorseTreatments.Where(p => p.HorseId == f.Id).ToList();
                    IEnumerable<HorseTreatments> differenceQuery = result.Except(objList);

                    foreach (HorseTreatments item in differenceQuery)
                    {
                        DeleteFromExpensive(item.ExpensesId, item.IsPaid);
                        DeleteFromExpensiveFarm(item.HavaExpensesId, item.HavaIsPaid);

                        Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                    }



                }
                catch (Exception ex)
                {


                }

                Context.SaveChanges();


            }
        }

        private static void UpdateHorseVaccinationsObject(List<HorseVaccinations> objList, Horse f)
        {
            using (var Context = new Context())
            {

                foreach (HorseVaccinations item in objList)
                {

                    item.HorseId = f.Id;

                    if (item.Id == 0)
                    {
                        string name = " חיסון " + item.Type;
                        int? ExpensesId = AddToExpensesTable(item.Cost, item.Discount, item.HorseId, f.Name, name, item.Date);
                        item.ExpensesId = ExpensesId;

                        item.HavaExpensesId = AddToExpensesFarmTable(item.Cost, item.Discount, item.HorseId, f.Name, name, item.Date);
                        Context.HorseVaccinations.Add(item);

                    }
                    else
                    {

                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                        //  Context.SaveChanges();

                    }

                }

                try
                {

                    var result = Context.HorseVaccinations.Where(p => p.HorseId == f.Id).ToList();
                    IEnumerable<HorseVaccinations> differenceQuery = result.Except(objList);

                    foreach (HorseVaccinations item in differenceQuery)
                    {
                        DeleteFromExpensive(item.ExpensesId, item.IsPaid);
                        DeleteFromExpensiveFarm(item.HavaExpensesId, item.HavaIsPaid);
                        Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                    }



                }
                catch (Exception ex)
                {


                }

                Context.SaveChanges();


            }
        }

        private static void UpdateHorseShoeingsObject(List<HorseShoeings> objList, Horse f)
        {
            using (var Context = new Context())
            {

                foreach (HorseShoeings item in objList)
                {

                    item.HorseId = f.Id;

                    if (item.Id == 0)
                    {
                        string name = " פירזול ";
                        int? ExpensesId = AddToExpensesTable(item.Cost, item.Discount, item.HorseId, f.Name, name, item.Date);
                        item.ExpensesId = ExpensesId;
                        item.HavaExpensesId = AddToExpensesFarmTable(item.Cost, item.Discount, item.HorseId, f.Name, name, item.Date);

                        Context.HorseShoeings.Add(item);

                    }
                    else
                    {

                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                        //  Context.SaveChanges();

                    }

                }

                try
                {

                    var result = Context.HorseShoeings.Where(p => p.HorseId == f.Id).ToList();
                    IEnumerable<HorseShoeings> differenceQuery = result.Except(objList);

                    foreach (HorseShoeings item in differenceQuery)
                    {
                        DeleteFromExpensive(item.ExpensesId, item.IsPaid);
                        DeleteFromExpensiveFarm(item.HavaExpensesId, item.HavaIsPaid);
                        Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                    }



                }
                catch (Exception ex)
                {


                }

                Context.SaveChanges();


            }
        }

        private static void UpdateHorseTilufingsObject(List<HorseTilufings> objList, Horse f)
        {
            using (var Context = new Context())
            {

                foreach (HorseTilufings item in objList)
                {

                    item.HorseId = f.Id;

                    if (item.Id == 0)
                    {
                        string name = " טילוף ";
                        int? ExpensesId = AddToExpensesTable(item.Cost, item.Discount, item.HorseId, f.Name, name, item.Date);
                        item.ExpensesId = ExpensesId;
                        item.HavaExpensesId = AddToExpensesFarmTable(item.Cost, item.Discount, item.HorseId, f.Name, name, item.Date);
                        Context.HorseTilufings.Add(item);

                    }
                    else
                    {

                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                        //  Context.SaveChanges();

                    }

                }

                try
                {

                    var result = Context.HorseTilufings.Where(p => p.HorseId == f.Id).ToList();
                    IEnumerable<HorseTilufings> differenceQuery = result.Except(objList);

                    foreach (HorseTilufings item in differenceQuery)
                    {
                        DeleteFromExpensive(item.ExpensesId, item.IsPaid);
                        DeleteFromExpensiveFarm(item.HavaExpensesId, item.HavaIsPaid);
                        Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                    }



                }
                catch (Exception ex)
                {


                }

                Context.SaveChanges();


            }
        }






        private static void UpdateHorsePregnanciesObject(List<HorsePregnancies> objList, Horse f)
        {
            using (var Context = new Context())
            {

                foreach (HorsePregnancies item in objList)
                {
                    item.HorseId = f.Id;
                    if (item.Id == 0)
                    {
                        Context.HorsePregnancies.Add(item);
                    }
                    else
                    {
                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                    }

                }

                try
                {

                    var result = Context.HorsePregnancies.Where(p => p.HorseId == f.Id).ToList();
                    IEnumerable<HorsePregnancies> differenceQuery = result.Except(objList);

                    foreach (HorsePregnancies item in differenceQuery)
                    {

                        Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                    }



                }
                catch (Exception ex)
                {


                }

                Context.SaveChanges();


            }
        }

        private static void UpdateHorsePregnanciesStatesObject(List<HorsePregnanciesStates> objList, Horse f)
        {
            using (var Context = new Context())
            {

                foreach (HorsePregnanciesStates item in objList)
                {

                    item.HorseId = f.Id;


                    if (item.Id == 0)
                    {

                        if (item.Finished)
                        {

                            HorseInseminations LastInseminations = Context.HorseInseminations.Where(h => h.PregnancId == item.HorsePregnanciesId).OrderByDescending(y => y.InseminationDate).FirstOrDefault();
                            if (LastInseminations != null)
                            {
                                LastInseminations.StatusLeda = 2;
                                Context.Entry(LastInseminations).State = System.Data.Entity.EntityState.Modified;
                            }

                        }

                        if (item.StateId == "birth")
                        {

                            HorseInseminations LastInseminations = Context.HorseInseminations.Where(h => h.PregnancId == item.HorsePregnanciesId).OrderByDescending(y => y.InseminationDate).FirstOrDefault();
                            if (LastInseminations != null)
                            {
                                LastInseminations.StatusLeda = 1;
                                Context.Entry(LastInseminations).State = System.Data.Entity.EntityState.Modified;
                            }

                        }

                        //שלב ראשון
                        if (item.StateId == "insemination")
                        {

                            HorsePregnancies hp = Context.HorsePregnancies.Where(p => p.Id == item.HorsePregnanciesId).FirstOrDefault();
                            if (hp != null)
                            {


                                HorsePregnanciesStates hs = Context.HorsePregnanciesStates.Where(p => p.HorsePregnanciesId == item.HorsePregnanciesId).FirstOrDefault();



                                if (hs == null)
                                {
                                    HorseInseminations LastInseminationsTemp = Context.HorseInseminations.Where(h => h.HozimId == hp.HozimId).FirstOrDefault();
                                    // למקרה שמדובר בסוס חיצוני
                                    if (LastInseminationsTemp != null)
                                    {
                                        LastInseminationsTemp.PregnancId = item.HorsePregnanciesId;
                                        Context.Entry(LastInseminationsTemp).State = System.Data.Entity.EntityState.Modified;

                                        HorseInseminations LastInseminations = new HorseInseminations();
                                        LastInseminations.PregnancId = item.HorsePregnanciesId;
                                        LastInseminations.HorseId = LastInseminationsTemp.HorseId;
                                        LastInseminations.PregnancId = item.HorsePregnanciesId;
                                        LastInseminations.PregnanciesHorseId = LastInseminationsTemp.PregnanciesHorseId;
                                        LastInseminations.InseminationDate = item.Date;
                                        LastInseminations.HozimId = hp.HozimId;


                                        Context.HorseInseminations.Add(LastInseminations);
                                    }
                                }

                            }
                            //HorseInseminations LastInseminations = Context.HorseInseminations.Where(h => h.PregnanciesHorseId == item.HorseId && h.InseminationDate == null).OrderByDescending(y => y.InseminationDate).FirstOrDefault();
                            //if (LastInseminations != null)
                            //{
                            //    if (LastInseminations.Cost > 0)
                            //    {

                            //        int? ExpensesId = AddToExpensesTable(LastInseminations.Cost, 0, item.HorseId, f.Name, " הזרעה ", item.Date);
                            //        LastInseminations.ExpensesId = ExpensesId;

                            //    }

                            //    LastInseminations.PregnancId = item.HorsePregnanciesId;
                            //    LastInseminations.InseminationDate = item.Date;
                            //    
                            //}

                        }


                        if (item.StateId == "ultrasound1")
                        {

                            HorseInseminations LastInseminations = Context.HorseInseminations.Where(h => h.PregnancId == item.HorsePregnanciesId).OrderByDescending(y => y.InseminationDate).FirstOrDefault();
                            if (LastInseminations != null)
                            {
                                LastInseminations.HerionDate = item.Date;

                                var dateInseminations = Context.HorsePregnanciesStates.Where(x => x.HorsePregnanciesId == item.HorsePregnanciesId && x.StateId == "insemination").FirstOrDefault();
                                if (dateInseminations != null)
                                {
                                    LastInseminations.LedaDate = ((DateTime)dateInseminations.Date).AddMonths(11);
                                }

                                Context.Entry(LastInseminations).State = System.Data.Entity.EntityState.Modified;
                            }

                        }


                        //if (item.ExpensesId == null && item.Cost > 0)
                        //{
                        //    int? ExpensesId = AddToExpensesTable(item.Cost, 0, item.HorseId, f.Name, item.name, item.Date);
                        //    item.ExpensesId = ExpensesId;

                        //}


                        Context.HorsePregnanciesStates.Add(item);

                    }
                    else
                    {

                        //if (item.ExpensesId == null && item.Cost > 0)
                        //{
                        //    int? ExpensesId = AddToExpensesTable(item.Cost, 0, item.HorseId, f.Name, item.name, item.Date);
                        //    item.ExpensesId = ExpensesId;

                        //}

                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;


                    }







                }

                try
                {

                    var result = Context.HorsePregnanciesStates.Where(p => p.HorseId == f.Id).ToList();
                    IEnumerable<HorsePregnanciesStates> differenceQuery = result.Except(objList);

                    foreach (HorsePregnanciesStates item in differenceQuery)
                    {
                        Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                    }



                }
                catch (Exception ex)
                {


                }

                Context.SaveChanges();


            }
        }



        private static void UpdateHorseInseminationsObject(List<HorseInseminations> objList, Horse f)
        {
            using (var Context = new Context())
            {

                foreach (HorseInseminations item in objList)
                {

                    item.HorseId = f.Id;

                    if (item.Id == 0)
                    {

                        Context.HorseInseminations.Add(item);

                    }
                    else
                    {

                        Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                        //  Context.SaveChanges();

                    }

                }

                try
                {

                    var result = Context.HorseInseminations.Where(p => p.HorseId == f.Id).ToList();
                    IEnumerable<HorseInseminations> differenceQuery = result.Except(objList);

                    foreach (HorseInseminations item in differenceQuery)
                    {
                        Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                    }



                }
                catch (Exception ex)
                {


                }

                Context.SaveChanges();


            }
        }

        public static List<Horse> GetSusut()
        {
            using (var Context = new Context())
            {
                var CurrentHorsefarmId = UsersService.GetCurrentUser().Farm_Id;

                SqlParameter Farm_IdPara = new SqlParameter("Farm_Id", CurrentHorsefarmId);

                var query = Context.Database.SqlQuery<Horse>
                ("GetSusut @Farm_Id", Farm_IdPara);



                var susut = query.ToList();


                return susut;
            }
        }

        public static List<Horse> GetHorses(bool IncludeDeleted = false)
        {
            using (var Context = new Context())
            {

                var CurrentHorsefarmId = UsersService.GetCurrentUser().Farm_Id;

                var HorseVetrinarList = Context.HorseVetrinars.Where(x => x.FarmId == CurrentHorsefarmId && x.UserId == null).ToList();




                var Horses = Context.Horses.ToList();
                if (CurrentHorsefarmId != 0)
                {
                    Horses = Horses.Where(h => h.Farm_Id == CurrentHorsefarmId || HorseVetrinarList.Any(y => y.FarmIdAdd == h.Farm_Id)).OrderBy(x => x.Name).ToList();
                }



                //fo



                Horses = FilterDeleted(Horses, IncludeDeleted);
                return Horses;
            }
        }


        public static List<Horse> GetHorsesReport(int type)
        {
            using (var Context = new Context())
            {


                if (type == 1)
                {

                    var CurrentHorsefarmId = UsersService.GetCurrentUser().Farm_Id;
                    var Horses = Context.Horses.ToList();
                    if (CurrentHorsefarmId != 0)
                    {
                        Horses = Horses.Where(h => h.Farm_Id == CurrentHorsefarmId).OrderBy(x => x.Name).ToList();

                        foreach (Horse item in Horses)
                        {

                            if (item.Gender == "female")
                            {
                                List<HorsePregnanciesStates> Pregnancies = GetHorsePregnanciesStates(item.Id).OrderByDescending(x => x.Date).ToList();

                                if (Pregnancies.Count > 0 && !Pregnancies[0].Finished && Pregnancies[0].StateId != "birth")
                                {
                                    item.IsHerion = true;
                                }
                            }

                            List<HorseShoeings> Shoeings = GetHorseShoeings(item.Id).OrderByDescending(x => x.Date).ToList();

                            if (Shoeings.Count > 0)
                            {
                                item.IsShoeings = true;
                            }

                            List<HorseTilufings> Tilufings = GetHorseTilufings(item.Id).OrderByDescending(x => x.Date).ToList();

                            if (Tilufings.Count > 0)
                            {
                                item.IsTilufings = true;
                            }



                        }


                    }

                    return Horses;


                }
                else
                {

                    var CurrentHorsefarmId = UsersService.GetCurrentUser().Farm_Id;
                    var Horses = Context.Horses.ToList();
                    if (CurrentHorsefarmId != 0)
                    {
                        Horses = Horses.Where(h => h.Farm_Id == CurrentHorsefarmId).OrderBy(x => x.Name).ToList();

                        foreach (Horse item in Horses)
                        {

                            //List<HorseShoeings> Shoeings = GetHorseShoeings(item.Id).OrderByDescending(x => x.Date).ToList();

                            //if (Shoeings.Count > 0)
                            //{
                            //    item.IsShoeings = true;
                            //}

                            List<HorseVaccinations> Vaccinations = GetHorseVaccinations(item.Id).OrderBy(x => x.Date).ToList();
                            foreach (var vac in Vaccinations)
                            {
                                if (vac.Type == "flu")
                                {
                                    item.flu = true;
                                    item.fluLastDate = vac.Date;

                                }

                                if (vac.Type == "nile")
                                {
                                    item.nile = true;
                                    item.nileLastDate = vac.Date;

                                }

                                if (vac.Type == "tetanus")
                                {
                                    item.tetanus = true;
                                    item.tetanusLastDate = vac.Date;

                                }

                                if (vac.Type == "rabies")
                                {
                                    item.rabies = true;
                                    item.rabiesLastDate = vac.Date;

                                }

                                if (vac.Type == "herpes")
                                {
                                    item.herpes = true;
                                    item.herpesLastDate = vac.Date;

                                }

                                if (vac.Type == "Deworming")
                                {
                                    item.worming = true;
                                    item.wormingLastDate = vac.Date;

                                }

                            }

                            List<HorseShoeings> Shoeings = GetHorseShoeings(item.Id).OrderBy(x => x.Date).ToList();
                            foreach (var vac in Shoeings)
                            {

                                item.shoeings = true;
                                item.shoeingsLastDate = vac.Date;

                            }




                        }


                    }

                    return Horses;




                }
            }
        }

        public static List<HorseVetrinars> GetHorseToVetrinars(string type, List<HorseVetrinars> HorseVetrinars = null)
        {
            using (var Context = new Context())
            {
                var CurrentHorsefarmId = UsersService.GetCurrentUser().Farm_Id;

                if (HorseVetrinars == null)
                {
                    return Context.HorseVetrinars.Where(u => u.FarmId == CurrentHorsefarmId).ToList();
                }
                else
                {

                    foreach (HorseVetrinars item in HorseVetrinars)
                    {

                        item.FarmId = CurrentHorsefarmId;
                        item.Role = UsersService.GetCurrentUser().Role;
                        if (item.Id == 0)
                        {

                            if (item.UserId == -1)
                            {
                                var Farm = Context.Farms.Where(x => x.Id == item.FarmIdAdd).FirstOrDefault();
                                User u = new User();
                                u.FirstName = " חווה- " + Farm.Name;
                                u.LastName = " ";
                                u.Role = "student";
                                u.Active = "active";
                                u.Farm_Id = CurrentHorsefarmId;
                                u.Email = CurrentHorsefarmId.ToString() + item.FarmIdAdd.ToString() + "@gmail.com";
                                u.Password = CurrentHorsefarmId.ToString() + item.FarmIdAdd.ToString();
                                u.IdNumber = CurrentHorsefarmId.ToString() + item.FarmIdAdd.ToString();
                                Context.Users.Add(u);
                                Context.SaveChanges();

                                item.UserId = u.Id;

                            }

                            Context.HorseVetrinars.Add(item);

                        }
                        else
                        {

                            Context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                            //  Context.SaveChanges();

                        }

                    }

                    try
                    {

                        var result = Context.HorseVetrinars.Where(p => p.FarmId == CurrentHorsefarmId && p.UserId == null).ToList();
                        if (type == "1")
                        {
                            result = Context.HorseVetrinars.Where(p => p.FarmId == CurrentHorsefarmId && p.UserId != null).ToList();


                        }

                        IEnumerable<HorseVetrinars> differenceQuery = result.Except(HorseVetrinars);

                        foreach (HorseVetrinars item in differenceQuery)
                        {
                            Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;

                            if (item.UserId != null)
                            {
                                var DelUser = Context.Users.Where(p => p.Id == item.UserId).FirstOrDefault();

                                Context.Entry(DelUser).State = System.Data.Entity.EntityState.Deleted;
                            }
                        }



                    }
                    catch (Exception ex)
                    {


                    }

                    Context.SaveChanges();


                    return Context.HorseVetrinars.Where(u => u.FarmId == CurrentHorsefarmId).ToList();






                }

            }
        }

        public static List<HorseGroups> GetHorseGroups(string type, List<HorseGroups> HorseGroups = null)
        {
            using (var Context = new Context())
            {
                var CurrentHorsefarmId = UsersService.GetCurrentUser().Farm_Id;

                if (HorseGroups == null)
                {
                    return Context.HorseGroups.Where(u => u.FarmId == CurrentHorsefarmId).ToList();
                }
                else
                {

                    foreach (HorseGroups item in HorseGroups)
                    {



                        if (item.Id == 0)
                        {


                            Context.HorseGroups.Add(item);

                        }
                        else
                        {

                            Context.Entry(item).State = System.Data.Entity.EntityState.Modified;


                        }

                    }

                    try
                    {

                        var result = Context.HorseGroups.Where(p => p.FarmId == CurrentHorsefarmId).ToList();


                        IEnumerable<HorseGroups> differenceQuery = result.Except(HorseGroups);

                        foreach (HorseGroups item in differenceQuery)
                        {
                            Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;

                            var HorsesInGroupList = Context.HorseGroupsHorses.Where(x => x.HorseGroupsId == item.Id).ToList();

                            Context.HorseGroupsHorses.RemoveRange(HorsesInGroupList);

                        }



                    }
                    catch (Exception ex)
                    {


                    }

                    Context.SaveChanges();


                    return Context.HorseGroups.Where(u => u.FarmId == CurrentHorsefarmId).ToList();
                }

            }
        }

        public static List<HorseGroupsHorses> GetHorseGroupsHorses(string type, List<HorseGroupsHorses> HorseGroupsHorses = null)
        {
            using (var Context = new Context())
            {
                var CurrentHorsefarmId = UsersService.GetCurrentUser().Farm_Id;

                if (HorseGroupsHorses == null)
                {
                    return Context.HorseGroupsHorses.Where(u => u.FarmId == CurrentHorsefarmId).ToList();
                }
                else
                {

                    foreach (HorseGroupsHorses item in HorseGroupsHorses)
                    {



                        if (item.Id == 0)
                        {


                            Context.HorseGroupsHorses.Add(item);

                        }
                        else
                        {

                            Context.Entry(item).State = System.Data.Entity.EntityState.Modified;


                        }

                    }

                    try
                    {

                        var result = Context.HorseGroupsHorses.Where(p => p.FarmId == CurrentHorsefarmId).ToList();


                        IEnumerable<HorseGroupsHorses> differenceQuery = result.Except(HorseGroupsHorses);

                        foreach (HorseGroupsHorses item in differenceQuery)
                        {
                            Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                        }



                    }
                    catch (Exception ex)
                    {


                    }

                    Context.SaveChanges();


                    return Context.HorseGroupsHorses.Where(u => u.FarmId == CurrentHorsefarmId).ToList();
                }

            }
        }



        private static void CreateVaccinationsNotifacions(Context context, int horseId, int lessonId, string Vaccination, Farm CurrentFarm, HorseVaccinationLists HorseVaccinationList, bool IsDelete)
        {









            Lesson Less = context.Lessons.Where(p => p.Id == lessonId).FirstOrDefault();
            Horse h = context.Horses.Where(x => x.Id == horseId).FirstOrDefault();



            //חיסון אחרון
            var LastVaccination = context.HorseVaccinations.Where(x => x.HorseId == horseId && x.Type == Vaccination).ToList();

            int HorseAge = new DateTime((Less.Start - h.BirthDate.Value).Ticks).Year;

            DateTime DateVaction = new DateTime();

            if (LastVaccination.Count == 0)
            {
                if (Vaccination == "flu" || Vaccination == "nile") DateVaction = Less.Start.AddDays(21);
                if (Vaccination == "tetanus") DateVaction = Less.Start.AddMonths(6);
                if (Vaccination == "herpes") DateVaction = Less.Start.AddMonths(12);
            }
            else
            {
                if (Vaccination == "flu") DateVaction = Less.Start.AddMonths(6);
                if (Vaccination == "tetanus" || Vaccination == "nile" || Vaccination == "rabies" || Vaccination == "herpes") DateVaction = Less.Start.AddMonths(12);


            }

            if (Vaccination == "Deworming")
            {
                if (HorseAge >= 2)
                    DateVaction = Less.Start.AddMonths(6);
                else
                    DateVaction = Less.Start.AddMonths(2);
            }




            if (IsDelete)
            {

                var Notification = context.Notifications.Where(x => x.EntityId == horseId && x.Date == DateVaction && x.EntityType == "horse" && x.Group == Vaccination).FirstOrDefault();
                if (Notification != null) context.Notifications.Remove(Notification);

                return;

            }




            Notification Vac = new Notification();
            Vac.Date = DateVaction;
            Vac.EntityType = "horse";
            Vac.EntityId = horseId;
            Vac.FarmId = h.Farm_Id;
            Vac.Group = Vaccination;
            Vac.Text = " חיסון " + GetHebrewVac(Vaccination) + " עבור הסוס " + h.Name;

            context.Notifications.Add(Vac);




            //var Less = context.Lessons.Where(p => p.Id == lessonId).FirstOrDefault();

            ////  int DayDiff = new DateTime((DateVaction - Less.Start).Ticks).Day;



            //var Start = new DateTime(DateVaction.Year, DateVaction.Month, DateVaction.Day, Less.Start.Hour, Less.Start.Minute, Less.Start.Second);// Less.Start.AddDays(DayDiff);
            //var End = new DateTime(DateVaction.Year, DateVaction.Month, DateVaction.Day, Less.End.Hour, Less.End.Minute, Less.End.Second);


            //var FutureLess = context.Lessons.Where(p => p.Instructor_Id == Less.Instructor_Id && p.Start == Start).FirstOrDefault();

            //int NewLessonId = 0;
            //if (FutureLess == null)
            //{
            //    Lesson NewLesson = new Lesson();
            //    NewLesson.Id = 0;
            //    NewLesson.Start = Start;
            //    NewLesson.End = End;
            //    NewLesson.Instructor_Id = Less.Instructor_Id;
            //    NewLesson.Details = Less.Details;
            //    context.Lessons.Add(NewLesson);
            //    context.SaveChanges();
            //    NewLessonId = NewLesson.Id;
            //}
            //else
            //{
            //    NewLessonId = FutureLess.Id;


            //}

            //HorseVaccinationLists hv = new HorseVaccinationLists();
            //hv.HorseId = horseId;
            //hv.IsDo = false;
            //hv.Cost = HorseVaccinationList.Cost;
            //hv.LessonId = NewLessonId;
            //hv.Vaccination = Vaccination;

            //context.HorseVaccinationLists.Add(hv);



        }

        private static string GetHebrewVac(string vaccination)
        {
            if (vaccination == "flu") return "שפעת";
            if (vaccination == "nile") return "קדחת הנילוס";
            if (vaccination == "tetanus") return "טטנוס";
            if (vaccination == "rabies") return "כלבת";
            if (vaccination == "herpes") return "הרפס";
            else return "תילוע";
        }

        public static List<HorsePirzulLists> GetSetPirzulHorse(string type, int LessonId, List<HorsePirzulLists> HorsePirzulLists = null)
        {
            using (var Context = new Context())
            {
                var CurrentHorsefarmId = UsersService.GetCurrentUser().Farm_Id;
                var CurrentFarm = Context.Farms.Where(x => x.Id == CurrentHorsefarmId).FirstOrDefault();
                int? MefarzelLessonId = null;

                string GroupName = "";

                if (HorsePirzulLists == null)
                {



                    SqlParameter TypePara = new SqlParameter("Type", 1);
                    SqlParameter LessonIdPara = new SqlParameter("LessonId", LessonId);
                    var query = Context.Database.SqlQuery<HorsePirzulLists>
                    ("GetHorseListForDashboard @Type,@LessonId", TypePara, LessonIdPara);
                    var Objects = query.ToList();


                    //var ReturnData = Context.HorsePirzulLists.Where(u => u.LessonId == LessonId || u.MefarzelLessonId == LessonId).ToList();
                    //foreach (var item in ReturnData)
                    //{

                    //    if (item.ShoeingId != null)
                    //    {




                    //    }

                    //}

                    return Objects;



                }
                else
                {

                    Lesson l = Context.Lessons.Where(x => x.Id == LessonId).FirstOrDefault();

                    //List<HorsePirzulLists> DoList = new List<HorsePirzulLists>();
                    //List<HorsePirzulLists> UndoDoList = new List<HorsePirzulLists>();


                    foreach (HorsePirzulLists item in HorsePirzulLists)
                    {
                        Horse f = Context.Horses.Where(x => x.Id == item.HorseId).FirstOrDefault();
                        if (!string.IsNullOrEmpty(item.GroupName)) GroupName = item.GroupName;

                        MefarzelLessonId = item.MefarzelLessonId;

                        if (item.Id == 0)
                        {

                            Context.HorsePirzulLists.Add(item);

                        }
                        else
                        {
                            Context.Entry(item).State = System.Data.Entity.EntityState.Modified;

                        }


                        // אם סומן שהוא עשה את זה
                        if (item.IsDo && !item.PrevIsDo)
                        {





                            HorseShoeings NewShoeings = new HorseShoeings();

                            NewShoeings.HorseId = item.HorseId;
                            NewShoeings.Id = 0;
                            NewShoeings.ShoerName = (UsersService.GetCurrentUser().Role == "shoeing") ? (UsersService.GetCurrentUser().FirstName + " " + UsersService.GetCurrentUser().LastName) : "";
                            NewShoeings.Date = l.Start;//DateTime.Now;
                            NewShoeings.Cost = item.Cost;
                            NewShoeings.Discount = 0;

                            string name = " פירזול ";
                            int? ExpensesId = AddToExpensesTable(item.Cost, 0, item.HorseId, f.Name, name, DateTime.Now);
                            NewShoeings.ExpensesId = ExpensesId;

                            NewShoeings.HavaExpensesId = AddToExpensesFarmTable(item.Cost, 0, item.HorseId, f.Name, name, DateTime.Now);
                            Context.HorseShoeings.Add(NewShoeings);
                            Context.SaveChanges();

                            item.ShoeingId = NewShoeings.Id;

                            Context.Entry(item).State = System.Data.Entity.EntityState.Modified;


                            CreatePirzulNotifacions(Context, item.HorseId, l.Start, MefarzelLessonId, GroupName, CurrentFarm, f, false);


                        }

                        // אם ביטל את זה
                        if (!item.IsDo && item.PrevIsDo)
                        {

                            // Lesson l = Context.Lessons.Where(x => x.Id == LessonId).FirstOrDefault();
                            //  Horse f = Context.Horses.Where(x => x.Id == item.HorseId).FirstOrDefault();

                            DeleteAllShoeing(Context, item.ShoeingId);

                            CreatePirzulNotifacions(Context, item.HorseId, l.Start, MefarzelLessonId, GroupName, CurrentFarm, f, true);


                        }


                    }




                    // CreateFutureLessons(HorsePirzulLists, Context, Less.Details, CurrentFarm);


                    List<HorsePirzulLists> DeletedHorsePirzulLists = new List<HorsePirzulLists>();
                    try
                    {


                        var result = Context.HorsePirzulLists.Where(p => p.LessonId == LessonId).ToList();
                        IEnumerable<HorsePirzulLists> differenceQuery = result.Except(HorsePirzulLists);
                        foreach (HorsePirzulLists item in differenceQuery)
                        {
                            MefarzelLessonId = item.MefarzelLessonId;
                            Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                            DeleteAllShoeing(Context, item.ShoeingId);
                            var f = Context.Horses.Find(item.HorseId);
                            CreatePirzulNotifacions(Context, item.HorseId, l.Start, MefarzelLessonId, GroupName, CurrentFarm, f, true);
                            DeletedHorsePirzulLists.Add(item);

                        }




                    }
                    catch (Exception ex)
                    {


                    }

                    Context.SaveChanges();

                    CreateFutureLessonsNewNew(HorsePirzulLists, DeletedHorsePirzulLists, Context, CurrentFarm);

                    // מציאת השיעור
                    var Less = Context.Lessons.Where(p => p.Id == LessonId).FirstOrDefault();
                    if (HorsePirzulLists.Count > 0)
                    {
                        int HorsesCount = 30 + HorsePirzulLists.Count * 15;
                        Less.End = Less.Start.AddMinutes(HorsesCount);
                        if (Less.End.Date > Less.Start.Date)
                        {
                            Less.End = new DateTime(Less.Start.Year, Less.Start.Month, Less.Start.Day, 23, 59, 59);

                        }

                        Less.Details = "פירזול " + HorsePirzulLists[0].GroupName + "</br>" + GetHorseList(HorsePirzulLists, Context);
                        Context.Entry(Less).State = System.Data.Entity.EntityState.Modified;
                    }




                    var LessMefarzel = Context.Lessons.Where(p => p.Id == MefarzelLessonId).FirstOrDefault();

                    var HorsePirzulListsAfterChange = Context.HorsePirzulLists.Where(u => u.LessonId == LessonId || u.MefarzelLessonId == LessonId).ToList();

                    if (HorsePirzulListsAfterChange.Count == 0)
                    {

                        Context.Lessons.Remove(Less);
                        if (LessMefarzel != null) Context.Lessons.Remove(LessMefarzel);
                        Context.SaveChanges();
                        return HorsePirzulListsAfterChange;
                    }

                    //**********************************************

                    // מפרזל לא ייכנס לכאן
                    if (Less != null && UsersService.GetCurrentUser().Role != "shoeing")
                    {

                        // קיים מפרזל ששייך 
                        // כשייכנס המפרזל יהיה כאן נל כי אין הוא מצרף ולא מרפים ממנו
                        var MefarzelFarm = Context.HorseVetrinars.Where(p => p.FarmIdAdd == CurrentHorsefarmId && p.UserId == null && p.Role == "shoeing").FirstOrDefault();
                        if (MefarzelFarm != null)
                        {

                            var MefarzelUser = Context.Users.Where(p => p.Farm_Id == MefarzelFarm.FarmId && p.IsMazkirut == 1).FirstOrDefault();
                            if (MefarzelUser != null)
                            {
                                if (MefarzelLessonId != null)
                                {
                                    Context.Lessons.Remove(LessMefarzel);

                                }


                                Lesson NewLesson = new Lesson();
                                NewLesson.Id = 0;
                                NewLesson.Start = Less.Start;
                                NewLesson.End = Less.End;
                                NewLesson.Instructor_Id = MefarzelUser.Id;
                                NewLesson.Details = "פירזול " + GroupName + " - " + CurrentFarm.Name;
                                Context.Lessons.Add(NewLesson);
                                Context.SaveChanges();

                                foreach (var HorsePirzul in HorsePirzulListsAfterChange)
                                {
                                    HorsePirzul.MefarzelLessonId = NewLesson.Id;
                                    Context.Entry(HorsePirzul).State = System.Data.Entity.EntityState.Modified;
                                }




                            }


                        }

                    }
                    Context.SaveChanges();
                    return HorsePirzulListsAfterChange;
                }

            }
        }


        public static List<HorseVaccinationLists> GetSetVaccinationHorse(string type, int LessonId, List<HorseVaccinationLists> HorseVaccinationLists = null)
        {
            using (var Context = new Context())
            {
                var CurrentHorsefarmId = UsersService.GetCurrentUser().Farm_Id;
                var CurrentFarm = Context.Farms.Where(x => x.Id == CurrentHorsefarmId).FirstOrDefault();


                if (HorseVaccinationLists == null)
                {
                    //  return Context.HorseVaccinationLists.Where(u => u.LessonId == LessonId).ToList();


                    SqlParameter TypePara = new SqlParameter("Type", 2);
                    SqlParameter LessonIdPara = new SqlParameter("LessonId", LessonId);
                    var query = Context.Database.SqlQuery<HorseVaccinationLists>
                    ("GetHorseListForDashboard @Type,@LessonId", TypePara, LessonIdPara);
                    var Objects = query.ToList();


                    return Objects;
                }
                else
                {

                    Lesson l = Context.Lessons.Where(x => x.Id == LessonId).FirstOrDefault();

                    string CurrentVact = "";


                    foreach (HorseVaccinationLists item in HorseVaccinationLists)
                    {
                        Horse f = Context.Horses.Where(x => x.Id == item.HorseId).FirstOrDefault();

                        CurrentVact = GetHebrewVac(item.Vaccination);

                        if (item.Id == 0)
                        {

                            Context.HorseVaccinationLists.Add(item);

                        }
                        else
                        {
                            Context.Entry(item).State = System.Data.Entity.EntityState.Modified;

                        }


                        // אם סומן שהוא עשה את זה
                        if (item.IsDo && !item.PrevIsDo)
                        {





                            HorseVaccinations NewVaccinations = new HorseVaccinations();

                            NewVaccinations.HorseId = item.HorseId;
                            NewVaccinations.Id = 0;
                            NewVaccinations.Type = item.Vaccination;
                            NewVaccinations.Date = l.Start;//DateTime.Now;
                            NewVaccinations.Cost = item.Cost;
                            NewVaccinations.Discount = 0;

                            string name = " חיסון " + GetHebrewVac(item.Vaccination);
                            int? ExpensesId = AddToExpensesTable(item.Cost, 0, item.HorseId, f.Name, name, DateTime.Now);
                            NewVaccinations.ExpensesId = ExpensesId;

                            NewVaccinations.HavaExpensesId = AddToExpensesFarmTable(item.Cost, 0, item.HorseId, f.Name, name, DateTime.Now);
                            Context.HorseVaccinations.Add(NewVaccinations);
                            Context.SaveChanges();

                            item.VaccinationId = NewVaccinations.Id;

                            Context.Entry(item).State = System.Data.Entity.EntityState.Modified;


                            CreateVaccinationsNotifacions(Context, item.HorseId, LessonId, item.Vaccination, CurrentFarm, item, false);


                        }

                        // אם ביטל את זה
                        if (!item.IsDo && item.PrevIsDo)
                        {



                            DeleteAllVaccinations(Context, item.VaccinationId);

                            CreateVaccinationsNotifacions(Context, item.HorseId, LessonId, item.Vaccination, CurrentFarm, item, true);


                        }


                    }




                    // CreateFutureLessons(HorsePirzulLists, Context, Less.Details, CurrentFarm);


                    List<HorseVaccinationLists> DeletedHorseVaccinationLists = new List<HorseVaccinationLists>();
                    try
                    {


                        var result = Context.HorseVaccinationLists.Where(p => p.LessonId == LessonId).ToList();
                        IEnumerable<HorseVaccinationLists> differenceQuery = result.Except(HorseVaccinationLists);
                        foreach (HorseVaccinationLists item in differenceQuery)
                        {

                            Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;
                            DeleteAllVaccinations(Context, item.VaccinationId);
                            CreateVaccinationsNotifacions(Context, item.HorseId, LessonId, item.Vaccination, CurrentFarm, item, true);
                            DeletedHorseVaccinationLists.Add(item);

                        }




                    }
                    catch (Exception ex)
                    {


                    }

                    Context.SaveChanges();

                    CreateFutureLessonsVaccination(HorseVaccinationLists, DeletedHorseVaccinationLists, Context, CurrentFarm);

                    // מציאת השיעור
                    //  var Less = Context.Lessons.Where(p => p.Id == LessonId).FirstOrDefault();
                    if (HorseVaccinationLists.Count > 0)
                    {
                        //***************************************************************************************
                        // string LessDetails = "פירזול " + HorsePirzulLists[0].GroupName + "</br>" + GetHorseList(HorsePirzulLists.Where(x => x.IsDo).ToList(), context);
                        int HorsesCount = 30 + (HorseVaccinationLists).Count * 15;
                        //***************************************************************************************
                        l.End = l.Start.AddMinutes(HorsesCount);

                        if (l.End.Date > l.Start.Date)
                        {
                            l.End = new DateTime(l.Start.Year, l.Start.Month, l.Start.Day, 23, 59, 59);

                        }


                        l.Details = " חיסוני סוסים - " + CurrentVact + "</br>" + GetHorseListVact(HorseVaccinationLists, Context);
                        Context.Entry(l).State = System.Data.Entity.EntityState.Modified;
                    }




                    var HorseVaccinationListsAfterChange = Context.HorseVaccinationLists.Where(u => u.LessonId == LessonId).ToList();

                    if (HorseVaccinationListsAfterChange.Count == 0)
                    {

                        Context.Lessons.Remove(l);

                        Context.SaveChanges();
                        return HorseVaccinationListsAfterChange;
                    }

                    //**********************************************


                    Context.SaveChanges();
                    return HorseVaccinationListsAfterChange;
                }

            }
        }

        private static void CreateFutureLessonsVaccination(List<HorseVaccinationLists> HorseVaccinationLists, List<HorseVaccinationLists> DeletedHorseVaccinationLists, Context context, Farm currentFarm)
        {

            //delete


            foreach (var item in HorseVaccinationLists)
            {
                var NextHorseVaccinationLists = context.HorseVaccinationLists.Where(x => x.LessonId == item.NextLessonId && x.HorseId == item.HorseId).FirstOrDefault();
                if (NextHorseVaccinationLists != null)
                {
                    context.HorseVaccinationLists.Remove(NextHorseVaccinationLists);

                    var Lesson = context.Lessons.Where(x => x.Id == NextHorseVaccinationLists.LessonId).FirstOrDefault();

                    if (Lesson != null) context.Lessons.Remove(Lesson);
                }

                item.NextLessonId = null;
                context.Entry(item).State = System.Data.Entity.EntityState.Modified;
            }



            var NextHorseVaccinationListsDel = DeletedHorseVaccinationLists.Where(x => x.NextLessonId != null).FirstOrDefault();
            if (NextHorseVaccinationListsDel != null)
            {

                var Lesson = context.Lessons.Where(x => x.Id == NextHorseVaccinationListsDel.NextLessonId).FirstOrDefault();
                if (Lesson != null)
                {

                    context.Lessons.Remove(Lesson);
                    // context.SaveChanges();
                }
            }


            //create new


            if (HorseVaccinationLists.Count == 0 || !HorseVaccinationLists.Any(x => x.IsDo)) return;

            string Vaccination = HorseVaccinationLists[0].Vaccination;

            string LessDetails = " חיסוני סוסים - " + GetHebrewVac(Vaccination) + "</br>" + GetHorseListVact(HorseVaccinationLists.Where(x => x.IsDo).ToList(), context);


            int LessonId = HorseVaccinationLists[0].LessonId;

            int HorseId = HorseVaccinationLists[0].HorseId;
            Horse h = context.Horses.Where(p => p.Id == HorseId).FirstOrDefault();


            var Less = context.Lessons.Where(p => p.Id == LessonId).FirstOrDefault();


            //חיסון אחרון
            var LastVaccination = context.HorseVaccinations.Where(x => x.HorseId == h.Id && x.Type == Vaccination).ToList();

            int HorseAge = new DateTime((Less.Start - h.BirthDate.Value).Ticks).Year;

            DateTime DateVaction = new DateTime();

            if (LastVaccination.Count == 0)
            {
                if (Vaccination == "flu" || Vaccination == "nile") DateVaction = Less.Start.AddDays(21);
                if (Vaccination == "tetanus") DateVaction = Less.Start.AddMonths(6);
                if (Vaccination == "herpes") DateVaction = Less.Start.AddMonths(12);
            }
            else
            {
                if (Vaccination == "flu") DateVaction = Less.Start.AddMonths(6);
                if (Vaccination == "tetanus" || Vaccination == "nile" || Vaccination == "rabies" || Vaccination == "herpes") DateVaction = Less.Start.AddMonths(12);


            }

            if (Vaccination == "Deworming")
            {
                if (HorseAge >= 2)
                    DateVaction = Less.Start.AddMonths(6);
                else
                    DateVaction = Less.Start.AddMonths(2);
            }












            int HorsesCount = 30 + (HorseVaccinationLists.Where(x => x.IsDo).ToList()).Count * 15;


            int NewLessonId = 0;


            Lesson NewLesson = new Lesson();
            NewLesson.Id = 0;
            NewLesson.Start = DateVaction;
            NewLesson.End = DateVaction.AddMinutes(HorsesCount);

            if (NewLesson.End.Date > NewLesson.Start.Date)
            {
                NewLesson.End = new DateTime(NewLesson.Start.Year, NewLesson.Start.Month, NewLesson.Start.Day, 23, 59, 59);

            }
            NewLesson.Instructor_Id = Less.Instructor_Id;
            NewLesson.Details = LessDetails;
            context.Lessons.Add(NewLesson);
            context.SaveChanges();

            NewLesson.ParentId = Less.Id;
            NewLessonId = NewLesson.Id;





            foreach (var item in HorseVaccinationLists)
            {
                if (item.IsDo)
                {
                    HorseVaccinationLists hp = new HorseVaccinationLists();
                    hp.LessonId = NewLessonId;
                    hp.IsDo = false;

                    hp.Cost = item.Cost;
                    hp.Vaccination = item.Vaccination;
                    hp.HorseId = item.HorseId;
                    context.HorseVaccinationLists.Add(hp);

                    item.NextLessonId = NewLessonId;
                    context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                }

            }







        }

        private static void DeleteAllVaccinations(Context Context, int? vaccinationId)
        {
            var Vaccination = Context.HorseVaccinations.Where(x => x.Id == vaccinationId).FirstOrDefault();
            if (Vaccination != null)
            {
                if (Vaccination.ExpensesId != null)
                {
                    var Obj = Context.Expenses.Where(x => x.Id == Vaccination.ExpensesId).FirstOrDefault();
                    if (Obj != null) Context.Expenses.Remove(Obj);

                }

                if (Vaccination.HavaExpensesId != null)
                {
                    var Obj = Context.Expenses.Where(x => x.Id == Vaccination.HavaExpensesId).FirstOrDefault();
                    if (Obj != null) Context.Expenses.Remove(Obj);

                }

                Context.HorseVaccinations.Remove(Vaccination);


            }
        }

        private static void DeleteAllShoeing(Context Context, int? ShoeingId)
        {
            var Shoeing = Context.HorseShoeings.Where(x => x.Id == ShoeingId).FirstOrDefault();
            if (Shoeing != null)
            {
                if (Shoeing.ExpensesId != null)
                {
                    var Obj = Context.Expenses.Where(x => x.Id == Shoeing.ExpensesId).FirstOrDefault();
                    if (Obj != null) Context.Expenses.Remove(Obj);

                }

                if (Shoeing.HavaExpensesId != null)
                {
                    var Obj = Context.Expenses.Where(x => x.Id == Shoeing.HavaExpensesId).FirstOrDefault();
                    if (Obj != null) Context.Expenses.Remove(Obj);

                }

                Context.HorseShoeings.Remove(Shoeing);


            }

        }


        private static void CreateFutureLessonsNewNew(List<HorsePirzulLists> HorsePirzulLists, List<HorsePirzulLists> DeletedHorsePirzulLists, Context context, Farm currentFarm)
        {



            DeleteFutureLessons(HorsePirzulLists, DeletedHorsePirzulLists, context, currentFarm);

            CreateFutureLessons(HorsePirzulLists, context, currentFarm);



        }

        private static void DeleteFutureLessons(List<HorsePirzulLists> undoDoList, List<HorsePirzulLists> DeletedHorsePirzulLists, Context context, Farm currentFarm)
        {
            foreach (var item in undoDoList)
            {
                var NextHorsePirzulLists = context.HorsePirzulLists.Where(x => x.LessonId == item.NextLessonId && x.HorseId == item.HorseId).FirstOrDefault();
                if (NextHorsePirzulLists != null)
                {
                    context.HorsePirzulLists.Remove(NextHorsePirzulLists);

                    var Lesson = context.Lessons.Where(x => x.Id == NextHorsePirzulLists.LessonId).FirstOrDefault();

                    if (Lesson != null) context.Lessons.Remove(Lesson);
                }

                item.NextLessonId = null;
                context.Entry(item).State = System.Data.Entity.EntityState.Modified;
            }



            var NextHorsePirzulListsDel = DeletedHorsePirzulLists.Where(x => x.NextLessonId != null).FirstOrDefault();
            if (NextHorsePirzulListsDel != null)
            {

                var Lesson = context.Lessons.Where(x => x.Id == NextHorsePirzulListsDel.NextLessonId).FirstOrDefault();
                if (Lesson != null)
                {

                    context.Lessons.Remove(Lesson);
                    // context.SaveChanges();
                }
            }


        }

        private static void CreateFutureLessonsNew(List<HorsePirzulLists> HorsePirzulLists, List<HorsePirzulLists> HorsePirzulListsFromSql, Context context, string details, Farm currentFarm)
        {


            foreach (var item in HorsePirzulLists)
            {
                if (item.IsDo && !item.PrevIsDo)
                {


                }


            }

        }

        private static void CreateFutureLessons(List<HorsePirzulLists> HorsePirzulLists, Context context, Farm currentFarm)
        {

            if (HorsePirzulLists.Count == 0 || !HorsePirzulLists.Any(x => x.IsDo)) return;
            //int HorsePirzulListsCount = HorsePirzulLists.Count;
            //var ExistNextLesson = HorsePirzulLists.Where(x => x.NextLessonId != null).FirstOrDefault();
            //var AllDoList = HorsePirzulLists.Where(x => x.IsDo && !x.PrevIsDo).FirstOrDefault();

            //// אם לא הוגדר עבורו שיעור הבא
            //if (HorsePirzulListsCount>0 && AllDoList != null && ExistNextLesson==null)
            //{



            int LessonId = HorsePirzulLists[0].LessonId;
            int? MefarzelLessonId = HorsePirzulLists[0].MefarzelLessonId;
            int HorseId = HorsePirzulLists[0].HorseId;

            Horse h = context.Horses.Where(p => p.Id == HorseId).FirstOrDefault();
            var Less = context.Lessons.Where(p => p.Id == LessonId).FirstOrDefault();
            var LessMefarzel = context.Lessons.Where(p => p.Id == MefarzelLessonId).FirstOrDefault();

            //***************************************************************************************
            string LessDetails = "פירזול " + HorsePirzulLists[0].GroupName + "</br>" + GetHorseList(HorsePirzulLists.Where(x => x.IsDo).ToList(), context);
            int HorsesCount = 30 + (HorsePirzulLists.Where(x => x.IsDo).ToList()).Count * 15;
            //***************************************************************************************



            int NewLessonId = 0;
            int? NewMefarzelLessonId = null;

            Lesson NewLesson = new Lesson();
            NewLesson.Id = 0;
            NewLesson.Start = Less.Start.AddDays(7 * ((h.ShoeingTimeZone != null) ? (int)h.ShoeingTimeZone : 7));
            NewLesson.End = Less.Start.AddMinutes(HorsesCount).AddDays(7 * ((h.ShoeingTimeZone != null) ? (int)h.ShoeingTimeZone : 7));
            if (NewLesson.End.Date > NewLesson.Start.Date)
            {
                NewLesson.End = new DateTime(NewLesson.Start.Year, NewLesson.Start.Month, NewLesson.Start.Day, 23, 59, 59);

            }



            NewLesson.Instructor_Id = Less.Instructor_Id;
            NewLesson.Details = LessDetails;
            context.Lessons.Add(NewLesson);
            context.SaveChanges();
            NewLesson.ParentId = Less.Id;
            NewLessonId = NewLesson.Id;


            if (MefarzelLessonId != null)
            {

                Lesson NewLessonMefarzel = new Lesson();
                NewLessonMefarzel.Id = 0;
                NewLessonMefarzel.Start = LessMefarzel.Start.AddDays(7 * ((h.ShoeingTimeZone != null) ? (int)h.ShoeingTimeZone : 7));
                NewLessonMefarzel.End = LessMefarzel.Start.AddMinutes(HorsesCount).AddDays(7 * ((h.ShoeingTimeZone != null) ? (int)h.ShoeingTimeZone : 7));

                if (NewLessonMefarzel.End.Date > NewLessonMefarzel.Start.Date)
                {
                    NewLessonMefarzel.End = new DateTime(NewLessonMefarzel.Start.Year, NewLessonMefarzel.Start.Month, NewLessonMefarzel.Start.Day, 23, 59, 59);

                }

                NewLessonMefarzel.Instructor_Id = LessMefarzel.Instructor_Id;
                NewLessonMefarzel.Details = LessDetails;
                context.Lessons.Add(NewLessonMefarzel);
                context.SaveChanges();
                NewLessonMefarzel.ParentId = LessMefarzel.Id;
                NewMefarzelLessonId = NewLessonMefarzel.Id;


            }


            foreach (var item in HorsePirzulLists)
            {
                if (item.IsDo)
                {
                    HorsePirzulLists hp = new HorsePirzulLists();
                    hp.LessonId = NewLessonId;
                    hp.IsDo = false;
                    hp.MefarzelLessonId = NewMefarzelLessonId;
                    hp.Cost = item.Cost;
                    hp.GroupName = item.GroupName;
                    hp.HorseId = item.HorseId;
                    context.HorsePirzulLists.Add(hp);

                    item.NextLessonId = NewLessonId;
                    context.Entry(item).State = System.Data.Entity.EntityState.Modified;
                }

            }







            //   }






            //int CounterToDelete = 0;
            //var NextLesson = new Lesson();
            //foreach (var item in HorsePirzulLists)
            //{
            //    if (!item.IsDo && item.PrevIsDo)
            //    {
            //        CounterToDelete++;
            //        if (item.NextLessonId != null)
            //        {
            //            NextLesson = context.Lessons.Where(x=>x.Id== item.NextLessonId).FirstOrDefault();
            //            var HorsePirzulListNext = context.HorsePirzulLists.Where(x=>x.LessonId== item.NextLessonId && x.HorseId==item.HorseId).FirstOrDefault();
            //            context.HorsePirzulLists.Remove(HorsePirzulListNext);

            //        }
            //        item.NextLessonId = null;
            //        context.Entry(item).State = System.Data.Entity.EntityState.Modified;
            //    }

            //}


            //if(CounterToDelete== HorsePirzulLists.Count)
            //{
            //    context.Lessons.Remove(NextLesson);
            //}


        }

        private static string GetHorseList(List<HorsePirzulLists> HorsePirzulLists, Context Context)
        {
            var res = new List<string>();

            var HorsesIds = HorsePirzulLists.Select(x => x.HorseId);

            var AllHorses = Context.Horses.Where(x => HorsesIds.Contains(x.Id)).Select(m => m.Name).ToList();

            // res.AddRange(AllHorses);

            string combindedString = "";

            for (int i = 0; i < AllHorses.Count; i++)
            {
                combindedString += "<b>" + (i + 1).ToString() + ") " + AllHorses[i] + "</b></br>";
            }


            // string combindedString = string.Join("</br>", AllHorses);

            return combindedString;
        }

        private static string GetHorseListVact(List<HorseVaccinationLists> HorseVaccinationLists, Context Context)
        {
            var res = new List<string>();

            var HorsesIds = HorseVaccinationLists.Select(x => x.HorseId);

            var AllHorses = Context.Horses.Where(x => HorsesIds.Contains(x.Id)).Select(m => m.Name).ToList();

            // res.AddRange(AllHorses);


            string combindedString = "";

            for (int i = 0; i < AllHorses.Count; i++)
            {
                combindedString += "<b>" + (i + 1).ToString() + ") " + AllHorses[i] + "</b></br>";
            }


            // string combindedString = string.Join("</br>", AllHorses);

            return combindedString;
        }

        private static void CreatePirzulNotifacions(Context context, int horseId, DateTime date, int? mefarzelLessonId, string GroupName, Farm CurrentFarm, Horse h, bool IsDelete)
        {

            var dateFuture = date.AddDays(7 * ((h.ShoeingTimeZone != null) ? (int)h.ShoeingTimeZone : 7));
            if (IsDelete)
            {
                var Notification = context.Notifications.Where(x => x.EntityId == horseId && x.Date == dateFuture && x.EntityType == "horse" && x.Group == "shoeing").FirstOrDefault();
                if (Notification != null) context.Notifications.Remove(Notification);

            }
            else
            {


                Notification Pirzul = new Notification();

                Pirzul.Date = dateFuture;
                Pirzul.EntityType = "horse";
                Pirzul.EntityId = horseId;
                Pirzul.FarmId = h.Farm_Id;
                Pirzul.Group = "shoeing";
                Pirzul.Text = "נדרש פרזול עבור סוס:" + h.Name;

                context.Notifications.Add(Pirzul);

            }







        }



        private static List<Horse> FilterDeleted(List<Horse> Horses, bool IncludeDeleted)
        {
            if (IncludeDeleted)
            {
                return Horses;
            }

            return Horses.Where(u => !u.Deleted).ToList();
        }

        public static Horse GetHorse(int Id)
        {

            using (var Context = new Context())
            {
                SqlParameter TypePara = new SqlParameter("Type", 7);
                SqlParameter HorseIdPara = new SqlParameter("HorseId", Id);
                var query = Context.Database.SqlQuery<Horse>
                ("GetHorseObject  @Type,@HorseId", TypePara, HorseIdPara);
                var Objects = query.ToList();
                return Objects[0];

            }


            //using (var Context = new Context())
            //    return Context.Horses.SingleOrDefault(u => u.Id == Id && !u.Deleted);
        }

        public static List<HorseFiles> GetHorseFiles(int Id)
        {
            using (var Context = new Context())
                return Context.HorseFiles.Where(u => u.HorseId == Id).ToList();
        }

        public static List<HorseHozeFiles> GetHorseHozeFiles(int Id)
        {
            using (var Context = new Context())
                return Context.HorseHozeFiles.Where(u => u.HorseId == Id).ToList();
        }
        public static List<HorsePundekautFiles> GetHorsePundekautFiles(int Id)
        {
            using (var Context = new Context())
                return Context.HorsePundekautFiles.Where(u => u.HorseId == Id).ToList();
        }


        public static List<HorseTreatments> GetHorseTreatments(int Id)
        {
            using (var Context = new Context())
            {
                SqlParameter TypePara = new SqlParameter("Type", 1);
                SqlParameter HorseIdPara = new SqlParameter("HorseId", Id);
                var query = Context.Database.SqlQuery<HorseTreatments>
                ("GetHorseObject  @Type,@HorseId", TypePara, HorseIdPara);
                var Objects = query.ToList();
                return Objects;

            }

        }

        public static List<HorseVaccinations> GetHorseVaccinations(int Id)
        {
            using (var Context = new Context())
            {
                SqlParameter TypePara = new SqlParameter("Type", 2);
                SqlParameter HorseIdPara = new SqlParameter("HorseId", Id);
                var query = Context.Database.SqlQuery<HorseVaccinations>
                ("GetHorseObject  @Type,@HorseId", TypePara, HorseIdPara);
                var Objects = query.ToList();
                return Objects;

            }


            //using (var Context = new Context())
            //    return Context.HorseVaccinations.Where(u => u.HorseId == Id).ToList();
        }

        public static List<HorseShoeings> GetHorseShoeings(int Id)
        {
            using (var Context = new Context())
            {
                SqlParameter TypePara = new SqlParameter("Type", 3);
                SqlParameter HorseIdPara = new SqlParameter("HorseId", Id);
                var query = Context.Database.SqlQuery<HorseShoeings>
                ("GetHorseObject  @Type,@HorseId", TypePara, HorseIdPara);
                var Objects = query.ToList();
                return Objects;

            }
            //using (var Context = new Context())
            //    return Context.HorseShoeings.Where(u => u.HorseId == Id).ToList();
        }


        public static List<HorseHozims> GetHorseHozims(int Id)
        {
            using (var Context = new Context())
            {
                SqlParameter TypePara = new SqlParameter("Type", 12);
                SqlParameter HorseIdPara = new SqlParameter("HorseId", Id);
                var query = Context.Database.SqlQuery<HorseHozims>
                ("GetHorseObject  @Type,@HorseId", TypePara, HorseIdPara);
                var Objects = query.ToList();
                return Objects;

            }

        }



        public static List<HorseTilufings> GetHorseTilufings(int Id)
        {
            using (var Context = new Context())
            {
                SqlParameter TypePara = new SqlParameter("Type", 4);
                SqlParameter HorseIdPara = new SqlParameter("HorseId", Id);
                var query = Context.Database.SqlQuery<HorseTilufings>
                ("GetHorseObject  @Type,@HorseId", TypePara, HorseIdPara);
                var Objects = query.ToList();
                return Objects;

            }

        }
        public static List<HorsePregnancies> GetHorsePregnancies(int Id)
        {


            using (var Context = new Context())
            {
                SqlParameter TypePara = new SqlParameter("Type",8);
                SqlParameter HorseIdPara = new SqlParameter("HorseId", Id);
                var query = Context.Database.SqlQuery<HorsePregnancies>
                ("GetHorseObject  @Type,@HorseId", TypePara, HorseIdPara);
                var Objects = query.ToList();
                return Objects;

            }

            //using (var Context = new Context())
            //    return Context.HorsePregnancies.Where(u => u.HorseId == Id).ToList();
        }

        public static List<HorsesMultipleFiles> GetHorsesMultipleFiles(int Id)
        {
            using (var Context = new Context())
                return Context.HorsesMultipleFiles.Where(u => u.HorseId == Id).ToList();
        }




        public static List<HorsePregnanciesStates> GetHorsePregnanciesStates(int Id)
        {

            using (var Context = new Context())
            {
                SqlParameter TypePara = new SqlParameter("Type", 5);
                SqlParameter HorseIdPara = new SqlParameter("HorseId", Id);
                var query = Context.Database.SqlQuery<HorsePregnanciesStates>
                ("GetHorseObject  @Type,@HorseId", TypePara, HorseIdPara);
                var Objects = query.ToList();
                return Objects;

            }


            //using (var Context = new Context())
            //    return Context.HorsePregnanciesStates.Where(u => u.HorseId == Id).ToList();
        }
        public static List<HorseInseminationsResult> GetHorseInseminations(int Id)
        {
            using (var Context = new Context())
            {

                SqlParameter HorseIdPara = new SqlParameter("HorseId", Id);

                var query = Context.Database.SqlQuery<HorseInseminationsResult>
                ("GetHorseInseminations @HorseId", HorseIdPara);



                var Inseminations = query.ToList();

                return Inseminations;


            }
            // return Context.HorseInseminations.Where(u => u.HorseId == Id).ToList();
        }

        public static HorsePregnancies InsertNewPregnancie(bool isBuild, HorsePregnancies hp)
        {
            using (var Context = new Context())
            {
                var CurrentHorsefarmId = UsersService.GetCurrentUser().Farm_Id;
                


                Context.HorsePregnancies.Add(hp);
                Context.SaveChanges();

                if (isBuild)
                {
                    var HorsePregnanciesStatesList = Context.HorsePregnanciesStates.Where(x=>x.HorseId== hp.MotherId).ToList();

                    HorsePregnanciesStates hh = new HorsePregnanciesStates();
                    hh.HorseId = hp.HorseId;
                    hh.HorsePregnanciesId = hp.Id;
                    hh.Date = HorsePregnanciesStatesList[0].Date;
                    hh.StateId = "implantationfrom";
                    hh.name = "הזרעה אם מקור";

                    Context.HorsePregnanciesStates.Add(hh);


                    hh = new HorsePregnanciesStates();
                    hh.HorseId = hp.HorseId;
                    hh.HorsePregnanciesId = hp.Id;
                    hh.Date = hp.Date;
                    hh.StateId = "implantation";
                    hh.name = "השתלה";

                    Context.HorsePregnanciesStates.Add(hh);


                   
                    
                    
                    Context.SaveChanges();

                }



                return hp;
            }
        }



        public static Horse UpdateHorse(Horse Horse)
        {
            using (var Context = new Context())
            {
                var CurrentHorsefarmId = UsersService.GetCurrentUser().Farm_Id;

                if (Horse.Id == 0)
                {
                    Horse.Farm_Id = CurrentHorsefarmId != 0 ? CurrentHorsefarmId : Horse.Farm_Id;
                    Context.Horses.Add(Horse);
                }

                else
                {
                    // כאשר לא פעיל תמחק את הסוס מהתלמידים
                    if (Horse.Active == "notActive")
                    {
                        var uhs = Context.UserHorses.Where(y => y.HorseId == Horse.Id).ToList();
                        uhs.ForEach(a =>
                        {
                            Context.Entry(a).State = System.Data.Entity.EntityState.Deleted;
                        });


                    }
                    Context.Entry(Horse).State = System.Data.Entity.EntityState.Modified;
                }


                Context.SaveChanges();
                return Horse;
            }
        }

        public static int CheckIfHorseWork(int? id, string start, string end)
        {
            using (var Context = new Context())
            {
                try
                {

                    DateTime dtStart = Convert.ToDateTime(start);
                    DateTime dtSEnd = Convert.ToDateTime(end);

                    var isExist = (from l in Context.Lessons
                                   join s in Context.StudentLessons
                                   on l.Id equals s.Lesson_Id
                                   where s.HorseId == id &&
                                   ((l.Start >= dtStart && l.Start < dtSEnd) || (dtStart >= l.Start && dtStart < l.End))
                                   select new
                                   {
                                       ID = s.HorseId

                                   }).ToList();


                    return isExist.Count();


                }
                catch (Exception ex)
                {


                }


            }

            return 0;
        }
        public static void DeleteHorse(int Id)
        {
            using (var Context = new Context())
            {
                var Horse = Context.Horses.SingleOrDefault(u => u.Id == Id);
                var HorseNotifications = Context.Notifications.Where(n => n.EntityType == "horse" && n.EntityId == Horse.Id);
                if (Horse != null)
                {
                    Horse.Deleted = true;
                    Context.Notifications.RemoveRange(HorseNotifications);
                }
                Context.SaveChanges();
            }
        }
    }
}


//using (var Context = new Context())
//{
//    var CurrentHorsefarmId = UsersService.GetCurrentUser().Farm_Id;
//    var CurrentFarm = Context.Farms.Where(x => x.Id == CurrentHorsefarmId).FirstOrDefault();


//    if (HorseVaccinationLists == null)
//    {
//        return Context.HorseVaccinationLists.Where(u => u.LessonId == LessonId).ToList();
//    }
//    else
//    {
//        string CurrentVact = "";

//        foreach (HorseVaccinationLists item in HorseVaccinationLists)
//        {


//            if (item.Id == 0)
//            {

//                Context.HorseVaccinationLists.Add(item);

//            }
//            else
//            {
//                Context.Entry(item).State = System.Data.Entity.EntityState.Modified;



//                //// אם סומן שהוא עשה את זה

//                //}

//            }

//            CurrentVact = GetHebrewVac(item.Vaccination);
//            if (item.IsDo && !item.PrevIsDo)
//            {

//                Horse f = Context.Horses.Where(x => x.Id == item.HorseId).FirstOrDefault();
//                HorseVaccinations NewVaccinations = new HorseVaccinations();

//                NewVaccinations.HorseId = item.HorseId;
//                NewVaccinations.Id = 0;

//                NewVaccinations.Date = DateTime.Now;
//                NewVaccinations.Cost = item.Cost;
//                NewVaccinations.Discount = 0;
//                NewVaccinations.Type = item.Vaccination;

//                string name = " חיסון " + GetHebrewVac(item.Vaccination);// item.Vaccination;
//                int? ExpensesId = AddToExpensesTable(item.Cost, 0, item.HorseId, f.Name, name, DateTime.Now);
//                NewVaccinations.ExpensesId = ExpensesId;

//                NewVaccinations.HavaExpensesId = AddToExpensesFarmTable(item.Cost, 0, item.HorseId, f.Name, name, DateTime.Now);
//                Context.HorseVaccinations.Add(NewVaccinations);

//                Context.SaveChanges();

//                item.VaccinationId = NewVaccinations.Id;

//                Context.Entry(item).State = System.Data.Entity.EntityState.Modified;

//                CreateVaccinationsNotifacions(Context, item.HorseId, LessonId, item.Vaccination, CurrentFarm, item);

//            }


//            if (!item.IsDo && item.PrevIsDo)
//            {



//                var Vaccinations = Context.HorseVaccinations.Where(x => x.Id == item.VaccinationId).FirstOrDefault();
//                if (Vaccinations != null)
//                {
//                    if (Vaccinations.ExpensesId != null)
//                    {
//                        var Obj = Context.Expenses.Where(x => x.Id == Vaccinations.ExpensesId).FirstOrDefault();
//                        if (Obj != null) Context.Expenses.Remove(Obj);

//                    }

//                    if (Vaccinations.HavaExpensesId != null)
//                    {
//                        var Obj = Context.Expenses.Where(x => x.Id == Vaccinations.HavaExpensesId).FirstOrDefault();
//                        if (Obj != null) Context.Expenses.Remove(Obj);

//                    }

//                }

//            }





//        }

//        // CreateFutureLessons(HorsePirzulLists, Context, GroupName, CurrentFarm);





//        try
//        {


//            var result = Context.HorseVaccinationLists.Where(p => p.LessonId == LessonId).ToList();


//            IEnumerable<HorseVaccinationLists> differenceQuery = result.Except(HorseVaccinationLists);

//            foreach (HorseVaccinationLists item in differenceQuery)
//            {

//                Context.Entry(item).State = System.Data.Entity.EntityState.Deleted;

//            }








//        }
//        catch (Exception ex)
//        {


//        }

//        Context.SaveChanges();
//        // מציאת השיעור


//        var Less = Context.Lessons.Where(p => p.Id == LessonId).FirstOrDefault();
//        var HorseVaccinationListsAfterChange = Context.HorseVaccinationLists.Where(u => u.LessonId == LessonId).ToList();

//        if (HorseVaccinationListsAfterChange.Count == 0)
//        {
//            Context.Lessons.Remove(Less);
//            Context.SaveChanges();
//            return HorseVaccinationListsAfterChange;
//        }

//        if (Less != null)
//        {
//            Less.Details = " חיסוני סוסים - " + CurrentVact + "</br>" + GetHorseListVact(HorseVaccinationLists, Context);
//            Context.Entry(Less).State = System.Data.Entity.EntityState.Modified;
//        }


//        Context.SaveChanges();


//        return HorseVaccinationListsAfterChange;
//    }

//}