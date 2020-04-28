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
          // if(!isFromCompletion) CommonTasks.DoCommonTasks();

            
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

        [Authorize]
        [Route("updateLessonDetails")]
        [HttpPost]
        public IHttpActionResult UpdateLessonDetails(JObject lesson)
        {
            return Ok(LessonsService.UpdateLessonDetails(lesson));
        }


        [Route("deleteLesson/{lessonId}/{deleteChildren}")]
        [HttpGet]
        public IHttpActionResult DeleteLesson(int lessonId, bool deleteChildren)
        {
            LessonsService.DeleteLesson(lessonId, deleteChildren);
            return Ok();
        }


        [Route("deleteOnlyStudentLesson/{lessonId}/{userId}/{deleteChildren}")]
        [HttpGet]
        public IHttpActionResult DeleteOnlyStudentLesson(int lessonId, int userId, bool deleteChildren)
        {
          
            return Ok(LessonsService.DeleteOnlyStudentLesson(lessonId, userId, deleteChildren));
        }

        [Route("getifLessonsHaveMoreOneRider/{lessonId}")]
        [HttpGet]
        public IHttpActionResult getifLessonsHaveMoreOneRider(int lessonId)
        {
           
            return Ok(LessonsService.GetifLessonsHaveMoreOneRider(lessonId));
        }



       
        [Route("getSetSchedularTask/{lessonId}/{resourceId}/{type}")]
        [HttpPost]
        public IHttpActionResult GetSetSchedularTask(JObject schedular, int lessonId, int resourceId,int type)
        {
            return Ok(LessonsService.GetSetSchedularTask(schedular, lessonId, resourceId,type));
        }




    }
}
