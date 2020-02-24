using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Caching;
using System.Web.Security;
using System.Web.SessionState;
using FarmsApi.Services;

namespace FarmsApi
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
            StartMailChecker();
        }
        public static void StartMailChecker()
        {
            HttpRuntime.Cache.Add(
                // String that represents the name of the cache item,
                // could be any string
                "ScheduledTask",
                // Something to store in the cache
                "1",
                // No cache dependencies
                null,
                // Will not use absolute cache expiration
                Cache.NoAbsoluteExpiration,
                // Cache will expire after one hour
                // You can change this time interval according 
                // to your requriements
                TimeSpan.FromMinutes(1),
                // Cache will not be removed before expired
                CacheItemPriority.NotRemovable,
                // SetTimer function will be called when cache expire
                SetTimer);
        }

        private static void SetTimer(string key, object value, CacheItemRemovedReason reason)
        {
            try
            {
                DateTime moment = DateTime.Now;
                int day = moment.Day;

                int hour = moment.Hour;
                if (day == 1 && hour == 8)
                    CommonTasks.AddExpenseToHorseLanders();
               // if (hour == 8)
                    CommonTasks.InsertChecksToMas();
            }
            catch
            {


            }
            finally
            {
                StartMailChecker();
            }
        }
        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}