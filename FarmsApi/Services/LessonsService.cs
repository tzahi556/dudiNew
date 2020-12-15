using FarmsApi.DataModels;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
//using Z.EntityFramework.Extensions;

namespace FarmsApi.Services
{
    public class LessonsService
    {
        public static JArray GetLessons(int? StudentId, string startDate = null, string endDate = null, bool IsFromCompletion = false)
        {
            var ReturnLessons = new JArray();


            //    JArray Instructor = JArray.Parse(resources);

            using (var Context = new Context())
            {
                var CurrentUser = UsersService.GetCurrentUser();
                if (!IsFromCompletion)
                    PopulateReturnLessons(ReturnLessons, Context, CurrentUser, StudentId, startDate, endDate, IsFromCompletion);
                else
                    PopulateReturnLessonsToComplete(ReturnLessons, Context, CurrentUser, StudentId, startDate, endDate, IsFromCompletion);
            }
            return ReturnLessons;
        }
        private static void PopulateReturnLessons(JArray ReturnLessons, DataModels.Context Context, User CurrentUser, int? StudentId, string startDate, string endDate, bool IsFromCompletion)
        {
            bool IsPrice = false;
            if (CurrentUser.Role == "sysAdmin" || CurrentUser.Role == "farmAdmin")
            {

                IsPrice = true;
            }

            DateTime StartDate = startDate != null ? DateTime.Parse(startDate) : DateTime.Now.Date;
            DateTime EndDate = endDate != null ? DateTime.Parse(endDate).AddDays(1) : DateTime.Now.Date.AddDays(1);



            SqlParameter StudentIdPara = new SqlParameter("StudentId", (StudentId == null) ? -1 : StudentId);
            SqlParameter Farm_IdPara = new SqlParameter("Farm_Id", CurrentUser.Farm_Id);
            SqlParameter RolePara = new SqlParameter("Role", CurrentUser.Role);
            SqlParameter StartDatePara = new SqlParameter("StartDate", StartDate);
            SqlParameter EndDatePara = new SqlParameter("EndDate", EndDate);
            SqlParameter IsPricePara = new SqlParameter("IsPrice", IsPrice);
            var query = Context.Database.SqlQuery<LessonsResult>
            ("GetStudentsLessonsList @StudentId,@Farm_Id,@Role,@StartDate,@EndDate,@IsPrice",
            StudentIdPara, Farm_IdPara, RolePara, StartDatePara, EndDatePara, IsPricePara);

            //try
            //{
            //    var lessons3 = query.ToList();
            //}
            //catch(Exception ex)
            //{


            //}


            //try
            //{
            var lessons = query.ToList();
            int lastId = 0;
            foreach (var Lesson in lessons)
            {
                try
                {
                    if (Lesson.Id != lastId)
                    {
                        var students = lessons.Where(l => l.Id == Lesson.Id && l.User_Id != null).Select(l => new
                        {
                            StudentId = l.User_Id,
                            Status = l.Status,
                            StudentName = l.StudentName,
                            Details = l.StatusDetails,
                            OfficeDetails = l.OfficeDetails,
                            IsComplete = l.IsComplete,
                            HorseId = l.HorseId,
                            Matarot = l.Matarot,
                            Mahalak = l.Mahalak,
                            HearotStatus = l.HearotStatus,
                            Mashov = l.Mashov,
                            LessPrice = l.Price,
                            HMO=l.HMO
                        }).Distinct().ToArray();
                        var studentsArray = students.Select(s => s.StudentName).ToArray();
                        var horsesArray = lessons.Where(l => l.Id == Lesson.Id && l.User_Id != null && l.HorseName != null).Select(l => new { HorseName = l.HorseName }).ToArray();

                        ReturnLessons.Add(JObject.FromObject(new
                        {
                            id = Lesson.Id,
                            prevId = Lesson.ParentId,
                            start = Lesson.Start,
                            end = Lesson.End,
                            horsenames = horsesArray.Select(s => s.HorseName).ToArray(),
                            editable = true,
                            resourceId = Lesson.Instructor_Id,
                            lessprice = Lesson.Price,
                            lessonpaytype = Lesson.LessonPayType,
                            details = Lesson.Details,
                            students = students.Select(s => s.StudentId).ToArray(),
                            statuses = students.Select(s => new
                            {
                                StudentId = s.StudentId,
                                Status = s.Status,
                                Details = s.Details,
                                IsComplete = s.IsComplete,
                                HorseId = s.HorseId,
                                OfficeDetails = s.OfficeDetails,
                                Matarot = s.Matarot,
                                Mahalak = s.Mahalak,
                                HearotStatus = s.HearotStatus,
                                Mashov = s.Mashov,
                                LessPrice = s.LessPrice,
                                HMO=s.HMO


                            }).ToArray(),
                            title = (studentsArray.Length > 0 ? string.Join("", studentsArray) : "") + (!string.IsNullOrEmpty(Lesson.Details) ? (studentsArray.Length > 0 ? ". " : "") + Lesson.Details : ""),
                            PrevNext = Lesson.PrevNext,
                            IsMazkirut = Lesson.IsMazkirut
                            //Matarot = Lesson.Matarot,
                            //Mahalak = Lesson.Mahalak,
                            //HearotStatus = Lesson.HearotStatus,
                            //Mashov = Lesson.Mashov




                        }));
                    }
                    lastId = Lesson.Id;
                }
                catch (Exception)
                {

                }
            }

            //}
            //catch (Exception ex)
            //{



            //}



        }

        private static void PopulateReturnLessonsToComplete(JArray ReturnLessons, DataModels.Context Context, User CurrentUser, int? StudentId, string startDate, string endDate, bool IsFromCompletion)
        {


            var dt = new DataTable();
            var conn = Context.Database.Connection;
            var connectionState = conn.State;
            if (connectionState != ConnectionState.Open) conn.Open();
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandText = @" 
                            Select t3.*,u.FirstName + ' ' + u.LastName as FullName,ui.FirstName + ' ' + ui.LastName as InstructorName from (

                            Select t1.Id,completionReq = t1.CounterStatus - coalesce(t2.CounterStatus, 0) from (
                            Select st.User_Id as Id,Count(Status) as CounterStatus from StudentLessons st 
                            where (st.Status in('completionReq','completionReqCharge'))
                            Group by st.User_Id
                            ) t1

                            left join (
                            Select st.User_Id as Id,Count(Status) as CounterStatus from StudentLessons st 
                            where (st.Status = 'completion')
                            Group by st.User_Id
                            )t2	 on t2.Id=t1.Id
                            )t3	
                            inner join Users u on t3.Id = u.Id and u.Deleted=0 and u.Active='active' 
                            inner join ( Select *,ROW_NUMBER() OVER(Partition by User_Id ORDER BY Lesson_Id desc) as RowNum from StudentLessons where Status in('completionReq','completionReqCharge')) t4 on t4.User_Id=t3.Id and t4.RowNum = 1
                            inner join Lessons l on l.Id = t4.Lesson_Id
                            inner join Users ui on ui.Id = l.Instructor_Id

                            where    (t3.completionReq > 0) and('" + CurrentUser.Role.ToString() + "'!='instructor' or " + CurrentUser.Id.ToString() + "=l.Instructor_Id ) and (u.Farm_Id=" + CurrentUser.Farm_Id + " Or 0=" + CurrentUser.Farm_Id + ")  order by Instructor_Id";


                using (var reader = cmd.ExecuteReader())
                {
                    dt.Load(reader);
                }
                conn.Close();

                foreach (DataRow row in dt.Rows)
                {
                    ReturnLessons.Add(JObject.FromObject(new
                    {
                        Id = row["Id"],
                        FullName = row["FullName"],
                        completionReq = row["completionReq"],
                        InstructorName = row["InstructorName"]

                    }));

                }

            }





        }

        public static void UpdateStudentLessonsStatuses(JArray Statuses)
        {
            if (Statuses != null)
            {
                using (var Context = new Context())
                {
                    foreach (var Status in Statuses)
                    {
                        var StudentId = Status["studentId"].Value<int>();
                        var LessonId = Status["lessonId"].Value<int>();
                        var StudentLesson = Context.StudentLessons.SingleOrDefault(sl => sl.User_Id == StudentId && sl.Lesson_Id == LessonId);
                        if (StudentLesson != null)
                        {

                            if (Status["Matarot"] != null)
                            {
                                StudentLesson.Matarot = Status["Matarot"].Value<string>();
                            }
                            if (Status["Mahalak"] != null)
                            {
                                StudentLesson.Mahalak = Status["Mahalak"].Value<string>();
                            }
                            if (Status["HearotStatus"] != null)
                            {
                                StudentLesson.HearotStatus = Status["HearotStatus"].Value<string>();
                            }
                            if (Status["Mashov"] != null)
                            {
                                StudentLesson.Mashov = Status["Mashov"].Value<string>();
                            }

                            //***************************************



                            // אם שלחתי לעדכון מחיר שיעור
                            if (Status["lessprice"] != null)
                            {
                                StudentLesson.Price = Status["lessprice"].Value<double>();
                            }

                            // אם שלחתי לעדכון מחיר שיעור
                            if (Status["lessonpaytype"] != null)
                            {
                                StudentLesson.LessonPayType = Status["lessonpaytype"].Value<int>();
                            }


                            if (Status["status"] != null)
                            {

                                StudentLesson.Status = Status["status"].Value<string>();
                                StudentLesson.Details = Status["details"].Value<string>();

                                StudentLesson.IsComplete = Status["isComplete"].Value<int>();


                                InsertIntoLog(LessonId, 2, Context, " עדכון סטטוס מהכרטיס  " + StudentLesson.IsComplete, StudentLesson);
                            }

                            if (Status["officedetails"] != null)
                            {
                                StudentLesson.OfficeDetails = Status["officedetails"].Value<string>();
                            }


                            Context.Entry(StudentLesson).State = System.Data.Entity.EntityState.Modified;


                        }
                    }



                    Context.SaveChanges();
                }
            }







        }
        public static JObject UpdateLessonDetails(JObject Lesson)
        {
            int LessonId = Lesson["id"].Value<int>();
            using (var Context = new Context())
            {
                var newLesson = Context.Lessons.SingleOrDefault(l => l.Id == LessonId);
                newLesson.Details = Lesson["details"] != null ? Lesson["details"].Value<string>() : "";
                Context.Entry(newLesson).State = System.Data.Entity.EntityState.Modified;
                Context.SaveChanges();
            }
            return Lesson;

        }

        public static int GetifLessonsHaveMoreOneRider(int lessonId)
        {
            int res = 0;

            using (var Context = new Context())
            {
                res = Context.StudentLessons.Where(x => x.Lesson_Id == lessonId).Count();
            }

            return res;
        }

        public static JObject UpdateLesson(JObject Lesson, bool changeChildren, int? lessonsQty)
        {
            int LessonId = Lesson["id"].Value<int>();
            int Instructor_Id = 0;
            DateTime Start = DateTime.Now;
            DateTime End = DateTime.Now;
            if (lessonsQty > 0)
            {

                Instructor_Id = Lesson["resourceId"].Value<int>();
                Start = Lesson["start"].Value<DateTime>();
                End = Lesson["end"].Value<DateTime>();

                using (var Context = new Context())
                {

                    var res = Context.Lessons.Where(x => x.Instructor_Id == Instructor_Id && ((Start >= x.Start && Start < x.End)
                    || (Start <= x.Start && End >= x.End) || (End > x.Start && End <= x.End))).FirstOrDefault();

                    if (res != null)
                    {
                        dynamic jsonObject = new JObject();
                        jsonObject.Error = res.Start;
                        return jsonObject;
                    }

                }


            }

            using (var Context = new Context())
            {


                if (IsNewLesson(Lesson))
                    CreateNewLesson(Lesson, Context);
                else
                    UpdateExistingLesson(Lesson, Context);

                ReassignStudentLessons(Lesson, Context);
            }
            if (changeChildren)
            {
                UpdateChildrenLessons(LessonId);
            }
            return Lesson;
        }

        private static void UpdateChildrenLessons(int parentLessonId)
        {
            int? ChildLessonId = null;

            using (var Context = new Context())
            {
                var ParentLesson = Context.Lessons.SingleOrDefault(l => l.Id == parentLessonId);
                var ParentStudents = Context.StudentLessons.Where(l => l.Lesson_Id == ParentLesson.Id).ToList();

                var ChildLesson = Context.Lessons.SingleOrDefault(l => l.ParentId == parentLessonId);
                if (ChildLesson != null)
                {




                    ChildLessonId = ChildLesson.Id;
                    ChildLesson.Instructor_Id = ParentLesson.Instructor_Id;
                    ChildLesson.Start = ParentLesson.Start.AddDays(7); //new DateTime(ChildLesson.Start.Year, ChildLesson.Start.Month, ChildLesson.Start.Day, ParentLesson.Start.Hour, ParentLesson.Start.Minute, 0);
                    //ParentLesson.Start.AddDays(7); צחי הוריד ושם את זה
                    ChildLesson.End = ParentLesson.End.AddDays(7);//new DateTime(ChildLesson.End.Year, ChildLesson.End.Month, ChildLesson.End.Day, ParentLesson.End.Hour, ParentLesson.End.Minute, 0);//.AddDays(7);

                    ////add students that doesn't exists
                    //var ChildStudents = Context.StudentLessons.Where(l => l.Lesson_Id == ChildLesson.Id).ToList();
                    //foreach (var ParentStudent in ParentStudents)
                    //{
                    //    var FoundStudent = ChildStudents.SingleOrDefault(cs => cs.User_Id == ParentStudent.User_Id);
                    //    if (FoundStudent == null)
                    //    {
                    //        Context.StudentLessons.Add(new StudentLessons() { Lesson_Id = ChildLesson.Id, User_Id = ParentStudent.User_Id, Status = null });
                    //    }
                    //}
                    ////remove students that doesn't exists in parent and has no status
                    //ChildStudents = Context.StudentLessons.Where(l => l.Lesson_Id == ChildLesson.Id).ToList();
                    //foreach (var ChildStudent in ChildStudents)
                    //{
                    //    if (String.IsNullOrEmpty(ChildStudent.Status))
                    //    {
                    //        var FoundStudent = ParentStudents.SingleOrDefault(ps => ps.User_Id == ChildStudent.User_Id);
                    //        if (FoundStudent == null)
                    //        {
                    //            Context.StudentLessons.Remove(ChildStudent);
                    //        }
                    //    }

                    //}
                    foreach (var sl in ParentStudents)
                    {
                        InsertIntoLog(ChildLesson.Id, 2, Context, "עדכון שעורים נלווים", sl);
                    }

                }

                //צחי

                Context.SaveChanges();
            }

            if (ChildLessonId.HasValue)
            {
                UpdateChildrenLessons(ChildLessonId.Value);
            }
        }

        private static void UpdateExistingLesson(JObject Lesson, DataModels.Context Context)
        {

            int LessonId = Lesson["id"].Value<int>();
            var newLesson = Context.Lessons.SingleOrDefault(l => l.Id == LessonId);
            AssignValuesFromJson(Lesson, Context, newLesson);
            Context.Entry(newLesson).State = System.Data.Entity.EntityState.Modified;
            Context.SaveChanges();
        }

        private static void ReassignStudentLessons(JObject Lesson, DataModels.Context Context)
        {


            int LessonId = Lesson["id"].Value<int>();

            int onlyMultiple = 0;
            if (Lesson["onlyMultiple"] != null)
                onlyMultiple = Lesson["onlyMultiple"].Value<int>();


            var TempStudentLessonsList = Context.StudentLessons.Where(sl => sl.Lesson_Id == LessonId).ToList();



            var CurrentUserRole = UsersService.GetCurrentUser().Role;

            if (CurrentUserRole == "instructor")
            {

                Context.StudentLessons.RemoveRange(Context.StudentLessons.Where(sl => sl.Lesson_Id == LessonId && sl.Status != "completionReq" && sl.Status != "completionReqCharge"));
            }
            else
            {
                Context.StudentLessons.RemoveRange(Context.StudentLessons.Where(sl => sl.Lesson_Id == LessonId));
            }


            if (Lesson["students"] != null)
            {
                var StudentIds = Lesson["students"].Values<int>().ToList();
                foreach (var StudentId in StudentIds)
                {
                    var StatusData = GetStatusDataFromJson(Lesson, StudentId);

                    string Matarot = "", Mahalak = "", HearotStatus = "", Mashov = "";

                    var TempStudentLessons = TempStudentLessonsList.Where(x => x.User_Id == StudentId).FirstOrDefault();

                    if (TempStudentLessons != null)
                    {
                        Matarot = TempStudentLessons.Matarot;
                        Mahalak = TempStudentLessons.Mahalak;
                        HearotStatus = TempStudentLessons.HearotStatus;
                        Mashov = TempStudentLessons.Mashov;


                    }



                    if ((StatusData[0] == "completionReq" || StatusData[0] == "completionReqCharge") && (StatusData[2] == "0" || StatusData[2] == null))
                    {

                        StatusData[2] = "1";
                    }




                    if (StatusData[0] == "completion" && StatusData[2] == "2")
                    {
                        StatusData[0] = "completion";
                        StatusData[2] = "5";

                        var conn = Context.Database.Connection;
                        var connectionState = conn.State;
                        if (connectionState != ConnectionState.Open) conn.Open();
                        using (var cmd = conn.CreateCommand())
                        {


                            cmd.CommandText = "   UPDATE StudentLessons SET IsComplete = 2 "
                                              + "  WHERE Lesson_Id = (SELECT top 1 Lesson_Id FROM StudentLessons WHERE Lesson_Id < " + LessonId + "  and User_Id = " + StudentId
                                              + "  and Status in('completionReq','completionReqCharge') and IsComplete = 1 order by Lesson_Id desc) and User_Id = " + StudentId;



                            cmd.ExecuteNonQuery();

                        }

                        conn.Close();


                    }


                    if ((StatusData[0] == "" || StatusData[0] == null || StatusData[0] == "completion") && (StatusData[2] == "3" || StatusData[2] == "4" || StatusData[2] == "5" || StatusData[2] == "6"))
                    {
                        StatusData[0] = "completion";
                        StatusData[2] = "5";

                    }


                    if ((StatusData[0] == "notAttended") && (StatusData[2] == "3" || StatusData[2] == "4" || StatusData[2] == "5" || StatusData[2] == "6"))
                    {
                        StatusData[0] = "completion";
                        StatusData[2] = "3";

                    }

                    if ((StatusData[0] == "attended") && (StatusData[2] == "3" || StatusData[2] == "4" || StatusData[2] == "5" || StatusData[2] == "6"))
                    {
                        StatusData[0] = "completion";
                        StatusData[2] = "4";
                    }

                    if ((StatusData[0] == "notAttendedCharge") && (StatusData[2] == "3" || StatusData[2] == "4" || StatusData[2] == "5" || StatusData[2] == "6"))
                    {
                        StatusData[0] = "completion";
                        StatusData[2] = "6";
                    }

                    if ((StatusData[0] != "completion") && (StatusData[0] != "completionReq") && (StatusData[0] != "completionReqCharge"))
                    {
                        StatusData[2] = "0";

                    }

                    StudentLessons sl = new StudentLessons()
                    {
                        Lesson_Id = LessonId,
                        User_Id = StudentId,
                        Status = StatusData[0],
                        Details = StatusData[1],
                        IsComplete = Int32.Parse((StatusData[2] == null) ? "0" : StatusData[2]),
                        HorseId = Int32.Parse((StatusData[3] == null) ? "0" : StatusData[3]),
                        OfficeDetails = StatusData[4],
                        Matarot = Matarot,
                        Mahalak = Mahalak,
                        HearotStatus = HearotStatus,
                        Mashov = Mashov


                    };
                    Context.StudentLessons.Add(sl);
                    InsertIntoLog(LessonId, 2, Context, " עדכון סטטוס  " + StatusData[2], sl);


                }


                Context.SaveChanges();

                // if (StudentIds.Count() > 1)

                if (onlyMultiple == 1) AddOrRemvoveFromGroup(Context, StudentIds, LessonId);

            }
        }

        private static void AddOrRemvoveFromGroup(Context context, List<int> studentIds, int lessonId)
        {
            // אםקיים שיעור נלווה - הבא
            var l = context.Lessons.Where(x => x.ParentId == lessonId).FirstOrDefault();
            if (l != null)
            {
                // כל התלמידים של השיעור
                var sl = context.StudentLessons.Where(x => x.Lesson_Id == l.Id).ToList();

                //if(sl.Count()!= studentIds.Count())
                //{
                // קיים במערכת ולא 
                foreach (StudentLessons item in sl)
                {
                    int studentId = item.User_Id;

                    bool exists = studentIds.Contains(studentId);

                    if (!exists)
                    {
                        InsertIntoLog(item.Lesson_Id, 4, context, "הורדת תלמיד מקבוצה", item);

                        context.StudentLessons.Remove(item);
                    }

                }

                // איד חדש שלא קיים במערכת
                foreach (int itemStudId in studentIds)
                {
                    var studentInSystem = context.StudentLessons.Where(x => x.Lesson_Id == l.Id && x.User_Id == itemStudId).FirstOrDefault();
                    if (studentInSystem == null)
                    {

                        var slin = new StudentLessons() { Lesson_Id = l.Id, User_Id = itemStudId, Status = "", Details = "", IsComplete = 0, HorseId = null, OfficeDetails = "" };
                        context.StudentLessons.Add(slin);
                        InsertIntoLog(l.Id, 3, context, "הוספת תלמיד לקבוצה", slin);
                    }

                }




                AddOrRemvoveFromGroup(context, studentIds, l.Id);
            }


            context.SaveChanges();
            // }


        }

        private static string[] GetStatusDataFromJson(JObject Lesson, int StudentId)
        {
            if (Lesson["statuses"] != null)
            {
                var Status = Lesson["statuses"].SingleOrDefault(s => s["StudentId"].Value<int>() == StudentId);
                if (Status != null)
                {
                    return new string[] { Status["Status"].Value<string>(), Status["Details"] != null ? Status["Details"].Value<string>() : null, Status["IsComplete"] != null ? Status["IsComplete"].Value<string>() : null, Status["HorseId"] != null ? Status["HorseId"].Value<string>() : null, Status["HorseId"] != null ? Status["OfficeDetails"].Value<string>() : null };
                }
            }
            return new string[] { null, null, null, null, null };

        }

        private static void CreateNewLesson(JObject Lesson, DataModels.Context Context)
        {


            var newLesson = new Lesson();
            AssignValuesFromJson(Lesson, Context, newLesson);
            Context.Lessons.Add(newLesson);
            Context.SaveChanges();
            Lesson["id"] = newLesson.Id;
            InsertIntoLog(newLesson.Id, 1, Context, "שיעור חדש", null);
            Context.SaveChanges();




        }

        private static void InsertIntoLog(int LessonId, int Type, Context context, string Details, StudentLessons sl = null)
        {
            //var Lesson = context.Lessons.Where(x => x.Id == LessonId).FirstOrDefault();

            //LogsLessons lg = new LogsLessons();
            //lg.Type = Type;
            //lg.TimeStamp = DateTime.Now;
            //lg.LessonDate = Lesson.Start;
            //lg.LessonId = LessonId;
            //lg.Instructor_Id = Lesson.Instructor_Id;
            //lg.Details = Details;
            //if (sl != null)
            //{
            //    lg.StudentId = sl.User_Id;
            //    lg.Status = sl.Status;
            //}

            //lg.UserId = UsersService.GetCurrentUser().Id;

            //context.LogsLessons.Add(lg);

        }

        private static bool IsNewLesson(JObject Lesson)
        {
            return Lesson["id"].Value<int>() <= 0;
        }

        private static void AssignValuesFromJson(JObject Lesson, DataModels.Context Context, DataModels.Lesson newLesson)
        {

            newLesson.ParentId = Lesson["prevId"] != null ? Lesson["prevId"].Value<int>() : 0;
            newLesson.Start = Lesson["start"].Value<DateTime>();
            newLesson.End = Lesson["end"].Value<DateTime>();
            newLesson.Instructor_Id = Lesson["resourceId"] != null ? Lesson["resourceId"].Value<int>() : 0;
            newLesson.Details = Lesson["details"] != null ? Lesson["details"].Value<string>() : "";

            //var oldDetails = newLesson.Details;

            //if (Lesson["details"] != null)
            //{
            //    string DetailsFromUser = Lesson["details"].Value<string>();
            //    if (oldDetails == null || oldDetails == "")
            //    {  
            //         //oldDetails
            //         newLesson.Details = " דוד: " + DetailsFromUser;
            //    }
            //    else
            //    {
            //        //var oldNewDetails = DetailsFromUser.Replace(oldDetails.Trim(), "");
            //        var newDetails = DetailsFromUser.Replace(oldDetails.Trim(), "");
            //        newLesson.Details = newDetails;

            //    }
            //}
            //else
            //{
            //    newLesson.Details = "";

            //}

        }

        internal static void DeleteLesson(int LessonId, bool DeleteChildren)
        {

            try
            {
                List<Lesson> ChildLessons = null;
                using (var Context = new Context())
                {
                    ChildLessons = Context.Lessons.Where(l => l.ParentId == LessonId).ToList();

                    var Lesson = Context.Lessons.SingleOrDefault(l => l.Id == LessonId);
                    if (Lesson != null)
                    {
                        // Delete Student Lesson Relations
                        var StudentLessons = Context.StudentLessons.Where(sl => sl.Lesson_Id == Lesson.Id);


                        if (StudentLessons.Count() > 0)
                        {
                            var IsComplete = StudentLessons.FirstOrDefault().IsComplete;
                            var StudentId = StudentLessons.FirstOrDefault().User_Id;
                            if (IsComplete == 3 || IsComplete == 4 || IsComplete == 5)
                            {
                                var conn = Context.Database.Connection;
                                var connectionState = conn.State;
                                if (connectionState != ConnectionState.Open) conn.Open();
                                using (var cmd = conn.CreateCommand())
                                {


                                    cmd.CommandText = " UPDATE StudentLessons SET IsComplete = 1 "
                                                      + "  WHERE Lesson_Id = (SELECT top 1 Lesson_Id FROM StudentLessons WHERE Lesson_Id < " + LessonId + "  and User_Id = " + StudentId
                                                      + "  and Status in('completionReq','completionReqCharge') and IsComplete=2 order by Lesson_Id desc) and User_Id = " + StudentId;



                                    cmd.ExecuteNonQuery();

                                }

                                conn.Close();


                            }
                        }

                        Context.StudentLessons.RemoveRange(StudentLessons);


                        // Delete Lesson
                        Context.Lessons.Remove(Lesson);

                        InsertIntoLog(Lesson.Id, 5, Context, "מחיקת שיעור", null);
                        Context.SaveChanges();
                    }
                }




                // Delete Children Lessons
                if (DeleteChildren)
                {
                    if (ChildLessons.Count() > 0)
                    {
                        foreach (var ChildLesson in ChildLessons)
                        {
                            DeleteLesson(ChildLesson.Id, DeleteChildren);
                        }
                    }
                }


            }
            catch (Exception ex)
            {


            }

        }


        public static JArray DeleteOnlyStudentLesson(int LessonId, int UserId, bool DeleteChildren)
        {

            try
            {
                List<Lesson> ChildLessons = null;
                using (var Context = new Context())
                {

                    ChildLessons = Context.Lessons.Where(l => l.ParentId == LessonId).ToList();

                    var Lesson = Context.Lessons.SingleOrDefault(l => l.Id == LessonId);
                    if (Lesson != null)
                    {
                        var StudentLessonsDelete = Context.StudentLessons.Where(sl => sl.Lesson_Id == Lesson.Id && sl.User_Id == UserId);

                        if (StudentLessonsDelete.FirstOrDefault().Status == "" || StudentLessonsDelete.FirstOrDefault().Status == null)
                        {

                            Context.StudentLessons.RemoveRange(StudentLessonsDelete);
                            var StudentLessons = Context.StudentLessons.Where(sl => sl.Lesson_Id == Lesson.Id).ToList();
                            if (StudentLessons.Count == 1)
                                Context.Lessons.Remove(Lesson);

                            Context.SaveChanges();
                        }


                    }
                }




                // Delete Children Lessons
                if (DeleteChildren)
                {
                    if (ChildLessons.Count() > 0)
                    {
                        foreach (var ChildLesson in ChildLessons)
                        {
                            DeleteOnlyStudentLesson(ChildLesson.Id, UserId, DeleteChildren);
                        }
                    }
                }


            }
            catch (Exception ex)
            {


            }


            return GetLessons(UserId);

        }

        public static string ReopenLessonsByInstructorMazkirut(SchedularTasks Schedular, Lesson CurrentLesson, int resourceId, Context Context)
        {
            // Context.Configuration.AutoDetectChangesEnabled = false;
            DateTime CurrentDate = CurrentLesson.Start;//new DateTime(CurrentDate.Year, CurrentDate.Month, CurrentDate.Day, 07, 00, 0);// DateTime.Now;
            int ParentId = 0;
            DateTime? LastDay = new DateTime(CurrentDate.Year, 12, 31, 23, 59, 59);

            if (Schedular.EndDate != null) LastDay = Schedular.EndDate;
            if (Schedular.Days > 0) LastDay = CurrentDate.AddDays(Schedular.Days - 1);


            string html = @"<div style='border:solid 1px gray;border-radius:5px;padding:2px;margin-bottom:2px;background:white'>
                                      
                                         <div style ='font-weight:bold;'><input type='checkbox' @simbol title='עדיין לא בוצע' />&nbsp;" + Schedular.Title + @"</div></div>";


            // Context.Configuration.AutoDetectChangesEnabled = false;

            List<SchedularTasks> stList = new List<SchedularTasks>();
            List<Lesson> lList = new List<Lesson>();
            //CurrentLesson.Details = html;
            //Context.Entry(CurrentLesson).State = System.Data.Entity.EntityState.Modified;


            while (CurrentDate.Date <= LastDay.Value.Date)
            {

                var StartDate = new DateTime(CurrentDate.Year, CurrentDate.Month, CurrentDate.Day, CurrentLesson.Start.Hour, CurrentLesson.Start.Minute, 0);
                var EndDate = new DateTime(CurrentDate.Year, CurrentDate.Month, CurrentDate.Day, CurrentLesson.End.Hour, CurrentLesson.End.Minute, 0);


                // var res = Context.Lessons.Where(x => x.Instructor_Id == resourceId && ((StartDate >= x.Start && StartDate < x.End)
                //|| (StartDate <= x.Start && EndDate >= x.End) || (EndDate > x.Start && EndDate <= x.End))).FirstOrDefault();

                // if (res != null)
                // {
                //     return res.Start.ToString("dd/MM/yyyy HH:mm");


                // }



                //if(CurrentLesson.Start== CurrentDate)
                //{



                //}


                Lesson less = new Lesson();
                less.Instructor_Id = resourceId;
                less.Start = StartDate;
                less.End = EndDate;
                less.Details = html;
                less.ParentId = ParentId;

                lList.Add(less);

                //Context.Lessons.Add(less);
                //  Context.SaveChanges();
                //   ParentId = less.Id;

                if (Schedular.EveryDay)
                    CurrentDate = CurrentDate.AddDays(1);
                else if (Schedular.EveryWeek)
                    CurrentDate = CurrentDate.AddDays(7);
                else if (Schedular.EveryMonth)
                    CurrentDate = CurrentDate.AddMonths(1);
                else if (Schedular.Days > 0)
                    CurrentDate = CurrentDate.AddDays(1);
                else
                    CurrentDate = ((DateTime)LastDay).AddDays(1);

                //SchedularTasks st = new SchedularTasks();
                //st.LessonId = less.Id;
                //st.ResourceId = resourceId;
                //st.Title = Schedular.Title;
                //st.Desc = Schedular.Desc;
                //st.Days = Schedular.Days;
                //st.EveryDay = Schedular.EveryDay;
                //st.EveryWeek = Schedular.EveryWeek;
                //st.EveryMonth = Schedular.EveryMonth;
                //st.EndDate = Schedular.EndDate;
                //st.IsExe = false;

                //stList.Add(st);
                //  Context.SchedularTasks.Add(st);
                //  Context.SaveChanges();

            }





            // EntityFrameworkManager.DefaultEntityFrameworkPropagationValue = false;
            Context.Lessons.AddRange(lList);
            // Context.SchedularTasks.AddRange(stList);

            // Context.BulkSaveChanges(false);
            Context.SaveChanges();
            int startHour = CurrentLesson.Start.Hour;
            int startMinutes = CurrentLesson.Start.Minute;
            // int resourceId = CurrentLesson.Instructor_Id;

            //  var LessonsList = Context.Lessons.Where(u => u.Instructor_Id == resourceId && u.Start >= CurrentLesson.Start && u.Start.Hour == startHour && u.Start.Minute == startMinutes).ToList();
            foreach (var item in lList)
            {
                SchedularTasks st = new SchedularTasks();
                st.LessonId = item.Id;
                st.ResourceId = resourceId;
                st.Title = Schedular.Title;
                st.Desc = Schedular.Desc;
                st.Days = Schedular.Days;
                st.EveryDay = Schedular.EveryDay;
                st.EveryWeek = Schedular.EveryWeek;
                st.EveryMonth = Schedular.EveryMonth;
                st.EndDate = Schedular.EndDate;
                st.IsExe = false;

                stList.Add(st);
            }


            Context.SchedularTasks.AddRange(stList);

            //  Context.BulkSaveChanges(false);
            Context.SaveChanges();


            return "";
        }


        public static List<SchedularTasks> GetSetSchedularTask(SchedularTasks Schedular, int lessonId, int resourceId, int type)
        {
            using (var Context = new Context())
            {

                if (type == 1)
                {


                    Lesson CurrentLesson = Context.Lessons.Where(u => u.Id == lessonId).FirstOrDefault();
                    DeleteAll(Schedular, true, Context, lessonId, CurrentLesson);

                    var res = ReopenLessonsByInstructorMazkirut(Schedular, CurrentLesson, resourceId, Context);

                    if (!string.IsNullOrEmpty(res))
                    {

                        List<SchedularTasks> ERROR = new List<SchedularTasks>();

                        SchedularTasks eR = new SchedularTasks();

                        eR.Id = -1;
                        eR.Title = res;
                        ERROR.Add(eR);

                        return ERROR;


                    }

                }




                if (type == 2)
                {
                    Lesson CurrentLesson = Context.Lessons.Where(u => u.Id == lessonId).FirstOrDefault();
                    DeleteAll(Schedular, Schedular.AffectChildren, Context, lessonId, CurrentLesson);

                }


                var SchedularTaskListRes = Context.SchedularTasks.Where(u => u.LessonId == lessonId && u.ResourceId == resourceId).ToList();

                return SchedularTaskListRes;


            }
        }

        public static void DeleteAll(SchedularTasks schedularTaskList, bool affectChildren, Context Context, int lessonId, Lesson CurrentLesson)
        {

            if (affectChildren)
            {

                int startHour = CurrentLesson.Start.Hour;
                int startMinutes = CurrentLesson.Start.Minute;
                int resourceId = CurrentLesson.Instructor_Id;

                var CurrentSchedularTasks = Context.SchedularTasks.Where(u => u.ResourceId == resourceId && u.Id >= schedularTaskList.Id && u.Title == schedularTaskList.Title && u.Desc == schedularTaskList.Desc).ToList();
                Context.SchedularTasks.RemoveRange(CurrentSchedularTasks);

                var LessonsList = Context.Lessons.Where(u => u.Instructor_Id == resourceId && u.Start >= CurrentLesson.Start && u.Start.Hour == startHour && u.Start.Minute == startMinutes).ToList();
                Context.Lessons.RemoveRange(LessonsList);

                //EntityFrameworkManager.DefaultEntityFrameworkPropagationValue = false;
            }
            else
            {
                Context.Lessons.Remove(CurrentLesson);


                if (schedularTaskList.Id != 0)
                {
                    var schedular = Context.SchedularTasks.Where(x => x.Id == schedularTaskList.Id).FirstOrDefault();
                    Context.SchedularTasks.Remove(schedular);
                }
            }


            //   Context.BulkSaveChanges();

            Context.SaveChanges();

            //  
            //var CurrentSchedularTasks = Context.SchedularTasks.Where(u => u.LessonId == lessonId).FirstOrDefault();

            //if (CurrentSchedularTasks != null) Context.SchedularTasks.Remove(CurrentSchedularTasks);


            //Lesson CurrentLesson = Context.Lessons.Where(u => u.Id == lessonId).FirstOrDefault();

            //Lesson ParentLesson = Context.Lessons.Where(u => u.ParentId == lessonId).FirstOrDefault();

            //if (CurrentLesson != null) Context.Lessons.Remove(CurrentLesson);

            //if (affectChildren && ParentLesson != null)
            //{
            //    DeleteAll(schedularTaskList, affectChildren, Context, ParentLesson.Id);

            //}

            //EntityFrameworkManager.DefaultEntityFrameworkPropagationValue = false;
            //Context.BulkSaveChanges();
            //  Context.SaveChanges();

            //if (schedularTaskList != null)
            //{

            //    //var lessonId = schedularTaskList.LessonId;
            //    var resourceId = schedularTaskList.ResourceId;
            //    var Title = schedularTaskList.Title;
            //    var Desc = schedularTaskList.Desc;
            //    var EveryDay = schedularTaskList.EveryDay;
            //    var EveryWeek = schedularTaskList.EveryWeek;
            //    var EveryMonth = schedularTaskList.EveryMonth;
            //    var EndDate = schedularTaskList.EndDate;



            //    List<Lesson> LessonsAll = new List<Lesson>();
            //    var LessonsAllGen = Context.Lessons.Where(x => x.Instructor_Id == resourceId && x.Id >= lessonId && (EndDate == null || (EndDate != null && x.Start < EndDate))).ToList();

            //    if (EveryDay && affectChildren)
            //    {
            //        LessonsAll = LessonsAllGen;
            //    }
            //    else if (EveryWeek && affectChildren)
            //    {
            //        foreach (Lesson item in LessonsAllGen)
            //        {

            //            if (item.Start.DayOfWeek == CurrentLesson.Start.DayOfWeek)
            //                LessonsAll.Add(item);

            //        }

            //    }
            //    else if (EveryMonth && affectChildren)
            //    {

            //        foreach (Lesson item in LessonsAllGen)
            //        {

            //            if (item.Start.Day == CurrentLesson.Start.Day)
            //                LessonsAll.Add(item);

            //        }

            //    }
            //    else
            //    {
            //        LessonsAll.Add(CurrentLesson);

            //    }


            //    //string html = @"<div style = 'border:solid 1px gray;border-radius:5px;padding:2px;margin-bottom:2px;background:white'>
            //    //                             <div style ='font-weight:bold;text-decoration:underline'>" + Title + @"</div>
            //    //                             <div>" + Desc + @" </div>
            //    //                         </div>";



            //    //string html = @"<div style='border:solid 1px gray;border-radius:5px;padding:2px;margin-bottom:2px;background:white'>
            //    //                             <div style ='font-weight:bold;text-decoration:underline'>" + Title + @"</div>
            //    //                             <div>" + Desc + @"</div>
            //    //                         </div>";

            //    //string html2 = @"<div style='border:solid 1px gray;border-radius:5px;padding:2px;margin-bottom:2px;background:white'>
            //    //                             <div style ='font-weight:bold;text-decoration:underline'>" + Title + @"<div style ='float:left'><img  src='../../../../images/approve-icon.png'/></div></div>
            //    //                             <div>" + Desc + @"</div>
            //    //                         </div>";



            //    foreach (var item in LessonsAll)
            //    {
            //        var CurrentSchedularTasks = Context.SchedularTasks.Where(u => u.LessonId == item.Id && u.ResourceId == resourceId && u.Title == Title && u.Desc == Desc).FirstOrDefault();
            //        if (CurrentSchedularTasks != null) Context.SchedularTasks.Remove(CurrentSchedularTasks);

            //        Context.Lessons.Remove(item);

            //    }
            //}
            //else { Context.Lessons.Remove(CurrentLesson); }




        }

        public static MonthlyReports GetSetMonthlyReports(int id, string date, string text,int type)
        {
            var Res = new MonthlyReports();
            if (text == "null") text = "";
            DateTime FirstDate = date != null ? DateTime.Parse(date) : DateTime.Now.Date;
            using (var Context = new Context())
            {
                Res = Context.MonthlyReports.Where(x => x.UserId == id && x.Date == FirstDate).FirstOrDefault();
                if (type==1)
                {


                    return Res;

                }
                else
                {

                    if (Res == null)
                    {

                        Res = new MonthlyReports();
                        Res.UserId = id;
                        Res.Date = FirstDate;
                        Res.Summery = text;

                        Context.MonthlyReports.Add(Res);

                    }
                    else
                    {

                        Res.Date = FirstDate;
                        Res.Summery = text;

                        Context.Entry(Res).State = System.Data.Entity.EntityState.Modified;

                    }


                    Context.SaveChanges();


                }

            }

            return Res;
        }


    }
}