using FarmsApi.DataModels;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FarmsApi.Services
{
    [RoutePrefix("lessons")]
    public class LessonsController : ApiController
    {
        [Authorize]
        [Route("getLessons/{studentId?}")]
        [HttpGet]
        public IHttpActionResult GetLessons(int? studentId = null, string startDate = null, string endDate = null, bool isFromCompletion = false)
        {
            CommonTasks.DoCommonTasks();

            
            return Ok(LessonsService.GetLessons(studentId, startDate, endDate, isFromCompletion));
        }

        [Authorize]
        [Route("updateStudentLessonsStatuses")]
        [HttpPost]
        public IHttpActionResult UpdateStudentLessonsStatuses(JArray Statuses)
        {
            LessonsService.UpdateStudentLessonsStatuses(Statuses);
            return Ok();
        }

        [Authorize]
        [Route("updateLesson/{changeChildren}/{lessonsQty}")]
        [HttpPost]
        public IHttpActionResult UpdateLesson(JObject lesson, bool changeChildren,int? lessonsQty)
        {
            return Ok(LessonsService.UpdateLesson(lesson, changeChildren, lessonsQty));
        }


        [Route("deleteLesson/{lessonId}/{deleteChildren}")]
        [HttpGet]
        public IHttpActionResult DeleteLesson(int lessonId, bool deleteChildren)
        {
            LessonsService.DeleteLesson(lessonId, deleteChildren);
            return Ok();
        }
    }
}
