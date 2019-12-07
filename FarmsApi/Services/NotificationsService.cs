using FarmsApi.DataModels;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;

namespace FarmsApi.Services
{
    public class NotificationsService
    {
        public static void CreateNotification(JObject notification)
        {
            try
            {
                using (var Context = new Context())
                {
                    var entityType = notification["entityType"].Value<string>();
                    var entityId = notification["entityId"].Value<int>();
                    var farmId = notification["farmId"].Value<int>();
                    var text = notification["text"].Value<string>();
                    var group = notification["group"].Value<string>();
                    var deletable = notification["deletable"] != null ? notification["deletable"].Value<bool>() : false;
                    var date = notification["date"].Type != JTokenType.Null ? notification["date"].Value<DateTime>() : DateTime.Now;

                    var newNotification = new Notification()
                    {
                        EntityType = entityType,
                        EntityId = entityId,
                        Group = group,
                        Text = text,
                        Date = date,
                        FarmId = farmId,
                        Deletable = deletable
                    };

                    var oldNotification = Context.Notifications.SingleOrDefault(n => n.EntityType == entityType && n.EntityId == entityId && n.Group == group);
                    var oldNotificationExists = oldNotification != null;
                    var newNotificationNotEqualToOld = oldNotificationExists && (oldNotification.Text != newNotification.Text || oldNotification.Date != newNotification.Date);
                    //var newNotificationNotEqualToOld = oldNotificationExists && ((newNotification.Group != "balance" && oldNotification.Text != newNotification.Text) || (newNotification.Group != "balance" && oldNotification.Date != newNotification.Date));
                    var newNotificationIsEmpty = newNotification.Text == null;

                    // Should remove outdated notification when
                    if (oldNotificationExists && (newNotificationIsEmpty || newNotificationNotEqualToOld))
                        Context.Notifications.Remove(oldNotification);

                    // Should add notification when
                    if ((!newNotificationIsEmpty && oldNotificationExists && newNotificationNotEqualToOld) || (!newNotificationIsEmpty && !oldNotificationExists))
                    {
                        try { if (newNotification.Group == "balance") newNotification.Date = oldNotification.Date; }
                        catch (Exception) { }
                        Context.Notifications.Add(newNotification);
                        SendNotificationToInstructor(Context, newNotification);
                    }
                    Context.SaveChanges();
                    CleanNotifications();
                }

            }
            catch (DbUpdateConcurrencyException)
            {
                CreateNotification(notification);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static void SendNotificationToInstructor(Context Context, Notification newNotification)
        {
            if (newNotification.EntityType == "lessons")
            {
                var UserId = UsersService.GetUser(newNotification.EntityId).Id;
                foreach (var Device in Context.UserDevices.Where(ud => ud.User_Id == UserId))
                {
                    SendNotification(Device.DeviceToken, newNotification.Text);
                }
            }
        }

        private static void SendNotification(string token, string text)
        {
            try
            {
                var applicationID = ConfigurationManager.AppSettings["GoogleAppId"].ToString();
                var senderId = ConfigurationManager.AppSettings["SenderId"].ToString();
                string deviceId = token;
                WebRequest tRequest = WebRequest.Create("https://fcm.googleapis.com/fcm/send");
                tRequest.Method = "post";
                tRequest.ContentType = "application/json";
                var data = new
                {
                    to = deviceId,
                    notification = new
                    {
                        body = text,
                        title = "מערכת ניהול חוות",
                        click_action = "https://www.giddyup.co.il"
                    }
                };

                var serializer = new JavaScriptSerializer();
                var json = serializer.Serialize(data);
                Byte[] byteArray = Encoding.UTF8.GetBytes(json);
                tRequest.Headers.Add(string.Format("Authorization: key={0}", applicationID));
                tRequest.Headers.Add(string.Format("Sender: id={0}", senderId));
                tRequest.ContentLength = byteArray.Length;

                using (Stream dataStream = tRequest.GetRequestStream())
                {
                    dataStream.Write(byteArray, 0, byteArray.Length);

                    using (WebResponse tResponse = tRequest.GetResponse())
                    {
                        using (Stream dataStreamResponse = tResponse.GetResponseStream())
                        {
                            using (StreamReader tReader = new StreamReader(dataStreamResponse))
                            {
                                String sResponseFromServer = tReader.ReadToEnd();
                                String r = sResponseFromServer;
                            }
                        }
                    }
                }
            }

            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static void UpdateDetails(JObject data)
        {
            try
            {
                using (var Context = new Context())
                {
                    var id = data["id"].Value<int>();
                    var details = data["details"].Value<string>();

                    var notification = Context.Notifications.SingleOrDefault(n => n.Id == id);
                    if (notification != null)
                    {
                        notification.Details = details;
                    }
                    Context.SaveChanges();
                }

            }
            catch (DbUpdateConcurrencyException)
            {
                UpdateDetails(data);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static void CleanNotifications()
        {
            using (var Context = new Context())
            {
                var notifications = Context.Notifications.Where(n => n.Text == null);
                Context.Notifications.RemoveRange(notifications);
                Context.SaveChanges();
            }
        }

        public static void DeleteNotification(int id)
        {
            using (var Context = new Context())
            {
                var Notification = Context.Notifications.SingleOrDefault(n => n.Id == id);  //צחי הוריד && n.Deletable);
                if (Notification != null)
                {
                    Notification.Deletable = true;
                    // Context.Notifications.Remove(Notification);
                    Context.SaveChanges();
                }
            }
        }

        public static List<Notification> GetNotifications()
        {
            using (var Context = new Context())
            {
                var currentUser = UsersService.GetCurrentUser();
                var untilDate = DateTime.Now.AddDays(7);
                var notifications = Context.Notifications.Where(n => n.Date < untilDate && n.FarmId == currentUser.Farm_Id && !n.Deletable).ToList();
                notifications = notifications.ToList().Where(n =>
                {
                    if (n.EntityType == "lessons" && n.EntityId == currentUser.Id)
                    {
                        return true;
                    }
                    else if (n.EntityType == "horse" && "farmAdmin,profAdmin,stableman,worker".Contains(currentUser.Role))
                    {
                        return true;
                    }
                    else if (n.EntityType == "student" && "farmAdmin".Contains(currentUser.Role))
                    {
                        return true;
                    }

                    return false;
                }).ToList();
                return notifications;
            }
        }

        public static List<Messages> GetMessages()
        {
            using (var Context = new Context())
            {

                var messagesList = Context.Messages.ToList();

                return messagesList;
            }
        }
    }
}