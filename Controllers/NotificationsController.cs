using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Web.Http;

namespace FarmsApi.Services
{
    [RoutePrefix("notifications")]
    public class NotificationsController : ApiController
    {
        [Authorize]
        [Route("getNotifications")]
        [HttpGet]
        public IHttpActionResult GetNotifications()
        {
            return Ok(NotificationsService.GetNotifications());
        }


        [Authorize]
        [Route("getMessagesList")]
        [HttpGet]
        public IHttpActionResult GetMessagesList()
        {
            return Ok(NotificationsService.GetMessages());
        }




        [Authorize]
        [Route("createNotification")]
        [HttpPost]
        public IHttpActionResult CreateNotification(JObject notification)
        {
            NotificationsService.CreateNotification(notification);
            return Ok();
        }

        [Authorize]
        [Route("register")]
        [HttpPost]
        public IHttpActionResult Register([FromBody]string token)
        {
            UsersService.RegisterDevice(token);
            return Ok();
        }

        [Authorize]
        [Route("unregister")]
        [HttpPost]
        public IHttpActionResult Unregister([FromBody]string token)
        {
            UsersService.UnregisterDevice(token);
            return Ok();
        }

        [Authorize]
        [Route("updateDetails")]
        [HttpPost]
        public IHttpActionResult UpdateDetails(JObject data)
        {
            NotificationsService.UpdateDetails(data);
            return Ok();
        }

        [Authorize]
        [Route("deleteNotification/{id}")]
        [HttpGet]
        public IHttpActionResult DeleteNotification(int id)
        {
            NotificationsService.DeleteNotification(id);
            return Ok();
        }


        [Authorize]
        [Route("deleteAllNotification")]
        [HttpPost]
        public IHttpActionResult DeleteAllNotification(List<DataModels.Notification> Notifications)
        {
            foreach (var not in Notifications)
            {
                NotificationsService.DeleteNotification(not.Id);
            }

            return Ok(NotificationsService.GetNotifications());
        }

    }
}
