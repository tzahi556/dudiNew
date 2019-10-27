using FarmsApi.DataModels;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Core;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

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

            //IQueryable<Lesson> Lessons = Context.Lessons;

            //var q = from lesson in Lessons
            //        join studentin in Context.Users on lesson.Instructor_Id equals studentin.Id into joinedInstructor
            //        from studentin in joinedInstructor.DefaultIfEmpty()
            //        join studentLesson in Context.StudentLessons on lesson.Id equals studentLesson.Lesson_Id into joinedStudentLessons
            //        from studentLesson in joinedStudentLessons.DefaultIfEmpty()
            //        join student in Context.Users on studentLesson.User_Id equals student.Id into joinedStudents
            //        from student in joinedStudents.DefaultIfEmpty()

            //        where
            //            // filter student
            //            (studentLesson.User_Id == StudentId || StudentId == null) &&
            //            // filter instructor צחי הוריד פילטור 
            //            // (lesson.Instructor_Id == CurrentUser.Id || (CurrentUser.Role != "profAdmin" && CurrentUser.Role != "instructor")) &&

            //            (studentin.Farm_Id == CurrentUser.Farm_Id || CurrentUser.Farm_Id == 0) &&
            //            // (resources==null || resources.Contains(lesson.Instructor_Id.ToString())) &&
            //            // filter by date
            //            (StudentId != null || lesson.Start >= StartDate && lesson.End <= EndDate) &&
            //            (
            //              ((CurrentUser.Role == "profAdmin" || CurrentUser.Role == "instructor") && studentLesson.Status != "completionReq")
            //               ||
            //              (CurrentUser.Role != "profAdmin" && CurrentUser.Role != "instructor")

            //            )

            //        select new
            //        {

            //            id = lesson.Id,
            //            prevId = lesson.ParentId,
            //            start = lesson.Start,
            //            end = lesson.End,
            //            details = lesson.Details,
            //            editable = true,
            //            resourceId = lesson.Instructor_Id,
            //            student = studentLesson != null ? (int?)studentLesson.User_Id : null,
            //            status = studentLesson != null ? studentLesson.Status : null,
            //            statusDetails = studentLesson != null ? studentLesson.Details : null,
            //            isComplete = studentLesson != null ? studentLesson.IsComplete : 0,
            //            lessprice = studentLesson.Price,
            //            //studentName = student.FirstName + " " + student.LastName + ((IsPrice) ? "<a  style='color:" + ((student.Id < 0) ? "red" : "blue") + ";font-weight:bold;padding-right:2px;padding-left:2px;'>(<span id=dvPaid_" + studentLesson.User_Id.ToString() + ">" + -348 + "</span>)</a>" : "")

            //            studentName = student.FirstName + " " + student.LastName + ((IsPrice) ? "<a style='color:" + ((student.Id < 0) ? "red" : "blue") + ";font-weight:bold'> &#x200E;(<span id=dvPaid_" + studentLesson.User_Id.ToString() + ">" + -300 + "</span>)&#x200E; </a> " : "")

            //        };




            //q = q.Distinct().OrderBy(l => l.start);
            //var lessons = q.ToList();
            //int lastId = 0;
            //foreach (var Lesson in lessons)
            //{
            //    try
            //    {
            //        if (Lesson.id != lastId)
            //        {
            //            var students = lessons.Where(l => l.id == Lesson.id && l.student != null).Select(l => new { StudentId = l.student, Status = l.status, StudentName = l.studentName, Details = l.statusDetails, IsComplete = l.isComplete }).Distinct().ToArray();
            //            var studentsArray = students.Select(s => s.StudentName).ToArray();
            //            ReturnLessons.Add(JObject.FromObject(new
            //            {
            //                id = Lesson.id,
            //                prevId = Lesson.prevId,
            //                start = Lesson.start,
            //                end = Lesson.end,
            //                editable = true,
            //                resourceId = Lesson.resourceId,
            //                lessprice = Lesson.lessprice,
            //                details = Lesson.details,
            //                students = students.Select(s => s.StudentId).ToArray(),
            //                statuses = students.Select(s => new { StudentId = s.StudentId, Status = s.Status, Details = s.Details, IsComplete = s.IsComplete }).ToArray(),
            //                title = (studentsArray.Length > 0 ? string.Join(",", studentsArray) : "") + (!string.IsNullOrEmpty(Lesson.details) ? (studentsArray.Length > 0 ? ". " : "") + Lesson.details : "")
            //            }));
            //        }
            //        lastId = Lesson.id;
            //    }
            //    catch (Exception)
            //    {

            //    }
            //}

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


            var lessons = query.ToList();
            int lastId = 0;
            foreach (var Lesson in lessons)
            {
                try
                {
                    if (Lesson.Id != lastId)
                    {
                        var students = lessons.Where(l => l.Id == Lesson.Id && l.User_Id != null).Select(l => new { StudentId = l.User_Id, Status = l.Status, StudentName = l.StudentName, Details = l.StatusDetails, IsComplete = l.IsComplete, HorseId = l.HorseId }).Distinct().ToArray();
                        var studentsArray = students.Select(s => s.StudentName).ToArray();
                        ReturnLessons.Add(JObject.FromObject(new
                        {
                            id = Lesson.Id,
                            prevId = Lesson.ParentId,
                            start = Lesson.Start,
                            end = Lesson.End,
                            editable = true,
                            resourceId = Lesson.Instructor_Id,
                            lessprice = Lesson.Price,
                            lessonpaytype = Lesson.LessonPayType,
                            details = Lesson.Details,
                            students = students.Select(s => s.StudentId).ToArray(),
                            statuses = students.Select(s => new { StudentId = s.StudentId, Status = s.Status, Details = s.Details, IsComplete = s.IsComplete, HorseId = s.HorseId }).ToArray(),
                            title = (studentsArray.Length > 0 ? string.Join(",", studentsArray) : "") + (!string.IsNullOrEmpty(Lesson.Details) ? (studentsArray.Length > 0 ? ". " : "") + Lesson.Details : "")
                        }));
                    }
                    lastId = Lesson.Id;
                }
                catch (Exception)
                {

                }
            }





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
                            where (st.Status = 'completionReq')
                            Group by st.User_Id
                            ) t1

                            left join (
                            Select st.User_Id as Id,Count(Status) as CounterStatus from StudentLessons st 
                            where (st.Status = 'completion')
                            Group by st.User_Id
                            )t2	 on t2.Id=t1.Id
                            )t3	
                            inner join Users u on t3.Id = u.Id
                            inner join ( Select *,ROW_NUMBER() OVER(Partition by User_Id ORDER BY Lesson_Id desc) as RowNum from StudentLessons where Status = 'completionReq') t4 on t4.User_Id=t3.Id and t4.RowNum = 1
                            inner join Lessons l on l.Id = t4.Lesson_Id
                            inner join Users ui on ui.Id = l.Instructor_Id

                            where t3.completionReq > 0 and (u.Farm_Id=" + CurrentUser.Farm_Id + " Or 0=" + CurrentUser.Farm_Id + ")";


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
                            }
                            Context.Entry(StudentLesson).State = System.Data.Entity.EntityState.Modified;
                        }
                    }
                    Context.SaveChanges();
                }
            }







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
                    ChildLesson.Start = ParentLesson.Start.AddDays(7);
                    ChildLesson.End = ParentLesson.End.AddDays(7);

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
                }
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
            Context.StudentLessons.RemoveRange(Context.StudentLessons.Where(sl => sl.Lesson_Id == LessonId));
            if (Lesson["students"] != null)
            {
                var StudentIds = Lesson["students"].Values<int>().ToList();
                foreach (var StudentId in StudentIds)
                {
                    var StatusData = GetStatusDataFromJson(Lesson, StudentId);
                    // int isCompleteFromClient = (StatusData[2] != 0) ? 1 : 0;

                    if (StatusData[0] == "completionReq" && (StatusData[2] == "0"))
                    {
                        StatusData[2] = "1";
                    }

                    if (StatusData[0] == "completionReq" && (StatusData[2] == "3" || StatusData[2] == "4" || StatusData[2] == "6"))
                    {
                        //StatusData[0] = "completion";
                        StatusData[2] = "1";

                        var conn = Context.Database.Connection;
                        var connectionState = conn.State;
                        if (connectionState != ConnectionState.Open) conn.Open();
                        using (var cmd = conn.CreateCommand())
                        {


                            cmd.CommandText = "   UPDATE StudentLessons SET IsComplete = 5 "
                                              + "  WHERE Lesson_Id = (SELECT top 1 Lesson_Id FROM StudentLessons WHERE Lesson_Id < " + LessonId + "  and User_Id = " + StudentId
                                              + "  and Status = 'completionReq' order by Lesson_Id desc) and User_Id = " + StudentId;



                            cmd.ExecuteNonQuery();

                        }

                        conn.Close();

                    }


                    //if (StatusData[0] == "completionReq" && StatusData[2] == "1")
                    //{
                    //    StatusData[2] = "1";
                    //}



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
                                              + "  and Status = 'completionReq' and IsComplete = 1 order by Lesson_Id desc) and User_Id = " + StudentId;



                            cmd.ExecuteNonQuery();

                        }

                        conn.Close();


                    }

                    //if ((StatusData[0] == "notAttended" || StatusData[0] == null || StatusData[0] == "completion" ) && (StatusData[2] == "3" || StatusData[2] == "4"))
                    //{
                    //    StatusData[0] = "completion";
                    //    StatusData[2] = "3";

                    //}

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

                    if ((StatusData[0] != "completion") && (StatusData[0] != "completionReq"))
                    {
                        StatusData[2] = "0";

                    }

                    Context.StudentLessons.Add(new StudentLessons() { Lesson_Id = LessonId, User_Id = StudentId, Status = StatusData[0], Details = StatusData[1], IsComplete = Int32.Parse((StatusData[2] == null) ? "0" : StatusData[2]), HorseId = Int32.Parse((StatusData[3] == null) ? "0" : StatusData[3]) });

                    //try
                    //{
                    //}
                    //catch (Exception ex)
                    //{

                    //}
                }
                Context.SaveChanges();
            }
        }

        private static string[] GetStatusDataFromJson(JObject Lesson, int StudentId)
        {
            if (Lesson["statuses"] != null)
            {
                var Status = Lesson["statuses"].SingleOrDefault(s => s["StudentId"].Value<int>() == StudentId);
                if (Status != null)
                {
                    return new string[] { Status["Status"].Value<string>(), Status["Details"] != null ? Status["Details"].Value<string>() : null, Status["IsComplete"] != null ? Status["IsComplete"].Value<string>() : null, Status["HorseId"] != null ? Status["HorseId"].Value<string>() : null };
                }
            }
            return new string[] { null, null, null, null };

        }

        private static void CreateNewLesson(JObject Lesson, DataModels.Context Context)
        {


            var newLesson = new Lesson();
            AssignValuesFromJson(Lesson, Context, newLesson);
            Context.Lessons.Add(newLesson);
            Context.SaveChanges();
            Lesson["id"] = newLesson.Id;
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


                                    cmd.CommandText = "   UPDATE StudentLessons SET IsComplete = 1 "
                                                      + "  WHERE Lesson_Id = (SELECT top 1 Lesson_Id FROM StudentLessons WHERE Lesson_Id < " + LessonId + "  and User_Id = " + StudentId
                                                      + "  and Status = 'completionReq' and IsComplete=2 order by Lesson_Id desc) and User_Id = " + StudentId;



                                    cmd.ExecuteNonQuery();

                                }

                                conn.Close();


                            }
                        }
                        //if (Lesson["students"] != null)
                        //{
                        //    var StudentIds = Lesson["students"].Values<int>().ToList();
                        //    var StatusData = GetStatusDataFromJson(Lesson, StudentId);
                        //    bool isCompleteFromClient = (StatusData[2] == "True") ? true : false;
                        //}
                        Context.StudentLessons.RemoveRange(StudentLessons);

                        // Delete Lesson
                        Context.Lessons.Remove(Lesson);
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







    }
}